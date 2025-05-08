import { Router, Request, Response } from "express";
import { drive_v3, google } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Extend the Request interface to include the 'files' property (for express-fileupload)
declare global {
  namespace Express {
    interface Request {
      files?: any; // Or a more specific type if you use express-fileupload's types
    }
  }
}

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

if (process.env.REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });
} else {
  console.warn("REFRESH_TOKEN is not set. Google Drive API calls may fail.");
}

const drive = google.drive({ version: "v3", auth: oauth2Client });
const app = Router();

// Interface for the response of GET /
interface ApiFileResponse {
  name: string;
  url: string | null;
}

// Interface for file objects stored in the global 'storedFiles' array
interface StoredDriveFile {
  id: string;
  name: string;
  mimeType?: string | null;
  webContentLink?: string | null;
  webViewLink?: string | null;
  exportLinks?: Record<string, string> | null;
}

let storedFiles: StoredDriveFile[] = []; // Global array to store file details

// Helper function to determine the best download link
function getBestDownloadLink(file: StoredDriveFile): string | null {
  if (file.webContentLink) {
    return file.webContentLink; // For direct download of non-Google Workspace files
  }
  if (file.exportLinks) {
    // Prefer PDF or common office formats, then any other export link
    return (
      file.exportLinks["application/pdf"] ||
      file.exportLinks[
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ] || // DOCX
      file.exportLinks[
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ] || // XLSX
      file.exportLinks[
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ] || // PPTX
      Object.values(file.exportLinks)[0] || // Fallback to the first available export link
      file.webViewLink || // Fallback to view link if all else fails
      null
    );
  }
  return file.webViewLink || null; // Fallback to view link if no other options
}

async function fetchFilesFromDrive(): Promise<StoredDriveFile[]> {
  if (!process.env.FOLDER_ID) {
    throw new Error("FOLDER_ID environment variable is not set.");
  }
  if (!process.env.REFRESH_TOKEN) { // Add an early check here too
      throw new Error("REFRESH_TOKEN is not configured. Cannot authenticate with Google Drive.");
  }
  try {
    const res = await drive.files.list({
      q: `'${process.env.FOLDER_ID}' in parents and trashed = false`,
      fields:
        "nextPageToken, files(id, name, mimeType, webContentLink, webViewLink, exportLinks)",
      pageSize: 1000,
      orderBy: "name",
    });

    const files = res.data.files;
    if (files && files.length) {
      return files.map((file) => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType,
        webContentLink: file.webContentLink,
        webViewLink: file.webViewLink,
        exportLinks: file.exportLinks as Record<string, string> | null,
      }));
    }
    return [];
  } catch (error: any) {
    console.error("Error fetching files from Google Drive:", error);
    if (error.message && error.message.includes("invalid_grant")) {
      // More specific message for this common issue
      throw new Error(
        "Google Drive API authentication failed: invalid_grant. This usually means the REFRESH_TOKEN has expired or been revoked. Please obtain a new refresh token and update your environment variables."
      );
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error(
        "Google Drive API authentication/authorization error. Check credentials (CLIENT_ID, CLIENT_SECRET), ensure the API is enabled, and the service account/OAuth user has permissions for the folder."
      );
    }
    throw error; // Re-throw other errors
  }
}

// Route to list files with names and direct download/view URLs
app.get("/", async (req: Request, res: Response) => {
  try {
    const fetchedFiles = await fetchFilesFromDrive();
    
    const result: ApiFileResponse[] = fetchedFiles.map((file) => ({
      name: file.name,
      url: getBestDownloadLink(file),
    }));

    res.status(200).json({
      success: true,
      files: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Failed to list files: ${err.message}`,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Route to list file names and populate the global 'storedFiles' array
app.get("/files", async (req: Request, res: Response) => {
  try {
    storedFiles = await fetchFilesFromDrive(); // Update global store
    const fileNames = storedFiles.map((file) => file.name);

    console.log("Fetched and stored files:", storedFiles.map(f => f.name)); // Log names for debugging

    res.status(200).json({ success: true, files: fileNames });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Failed to get file names: ${err.message}`,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Test route to check the content of the global 'storedFiles'
app.get("/test", async (req: Request, res: Response) => {
  console.log("Current storedFiles (names):", storedFiles.map(f => f.name));
  res.status(200).json({ 
    success: true, 
    count: storedFiles.length, 
    files: storedFiles.map(f => ({id: f.id, name: f.name})) // Send subset for brevity
  });
});

// Route to get a download/view URL for a file by its index in 'storedFiles'
app.get("/download/:id", async (req: Request, res: Response) => {
  const fileIndex = parseInt(req.params.id, 10);

  if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= storedFiles.length) {
    // Attempt to refresh storedFiles if index is out of bounds and it's empty
    if (storedFiles.length === 0) {
        try {
            console.log("/download/:id trying to refresh storedFiles as it was empty.");
            storedFiles = await fetchFilesFromDrive();
            if (fileIndex < 0 || fileIndex >= storedFiles.length) {
                res.status(400).json({ success: false, error: "Invalid file ID (index) even after refresh." });
                return;
            }
        } catch (err: any) {
            res.status(500).json({ success: false, error: `Failed to refresh files for download: ${err.message}` });
            return;
        }
    } else {
        res.status(400).json({ success: false, error: "Invalid file ID (index)." });
        return;
    }
  }

  try {
    const file = storedFiles[fileIndex];
    if (!file) {
      // This case should ideally be caught by the index check above, but as a safeguard:
      res.status(404).json({ success: false, error: "File not found at the given index." });
      return;
    }
    
    const downloadUrl = getBestDownloadLink(file);

    if (!downloadUrl) {
      res.status(404).json({
        success: false,
        error: `No suitable download or view link found for file: ${file.name}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      name: file.name,
      url: downloadUrl,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Error getting download link: ${err.message}`,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Route to upload a file
app.post("/upload", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(400).json({ success: false, message: "No file provided" });
    return;
  }

  // The google-auth-library should handle token refresh automatically.
  // Explicitly refreshing might be redundant but can be a safeguard.
  // try {
  //   const { credentials } = await oauth2Client.refreshAccessToken();
  //   console.log('Access token refreshed. New expiry:', credentials.expiry_date);
  //   oauth2Client.setCredentials(credentials); // Update client with new token
  // } catch (refreshError: any) {
  //   console.error('Could not refresh access token:', refreshError.message);
  //   return res.status(500).json({ success: false, error: 'Failed to refresh Google API token.' });
  // }

  const fileVariable = req.files.file as any; // Assuming express-fileupload structure
  const tempDir = path.join(__dirname, "temp_upload");
  // Use originalname if available (common with multer), fallback to name
  const fileName = fileVariable.name || fileVariable.originalname || "untitled";
  const tempFilePath = path.join(tempDir, fileName);

  console.log("Uploading file:", fileName);
  console.log("Mimetype:", fileVariable.mimetype);
  console.log("Target Folder ID:", process.env.FOLDER_ID);

  if (!process.env.FOLDER_ID) {
    res.status(500).json({ success: false, message: "Target FOLDER_ID is not configured on the server." });
    return;
  }

  try {
    fs.mkdirSync(tempDir, { recursive: true });
    // If fileVariable.data is a buffer, write it directly.
    // If fileVariable is a path (e.g., from formidable), this part needs adjustment.
    // Assuming express-fileupload which puts file data in .data and has .mv() method.
    if (typeof fileVariable.mv === 'function') {
        await fileVariable.mv(tempFilePath); // Use .mv() if available (safer)
    } else if (fileVariable.data) {
        fs.writeFileSync(tempFilePath, fileVariable.data);
    } else {
        throw new Error("Uploaded file data is not available in expected format.");
    }
    
    const fileMetadata = {
      name: fileName,
      parents: [process.env.FOLDER_ID],
    };

    const media = {
      mimeType: fileVariable.mimetype,
      body: fs.createReadStream(tempFilePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, webViewLink, webContentLink, mimeType", // Added mimeType
    } as drive_v3.Params$Resource$Files$Create); // Cast for type safety

    console.log("File uploaded successfully to folder:", response.data.name);
    console.log("ID:", response.data.id);
    console.log("View Link:", response.data.webViewLink);
    console.log("MIME Type:", response.data.mimeType);

    // Clean up temp file
    fs.unlinkSync(tempFilePath);
    // fs.rmdirSync(tempDir, { recursive: true }); // Be cautious with recursive rmdir

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileId: response.data.id,
      name: response.data.name,
      viewLink: response.data.webViewLink,
      mimeType: response.data.mimeType,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath); // Ensure cleanup on error
    }
    res.status(500).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

export default app;