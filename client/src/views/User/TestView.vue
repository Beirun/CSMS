<template>
    
// app.post("/upload", async (req: Request, res: Response) => {
//   const file = req.files.file; // Updated to use express-fileupload
//   // console.log("Body ",req.body);
//   // console.log("File ",file);
//   // Get credentials from environment
//   const email = process.env.GOOGLE_EMAIL;
//   const password = process.env.GOOGLE_PASSWORD;

//   console.log("Email: ", email);
//   console.log("Password: ", password)
//   // console.log(file);
//   // if(true){
//   //   return
//   // }
//   const tempFilePath = path.join(__dirname, 'temp_upload', file.name);

//   console.log("Temp file path: ", tempFilePath);

//   // return;
//   try {
//     // Get file from request (assuming multer middleware)
//     if (!file) {
//      res.status(400).json({ 
//         success: false, 
//         message: "No file provided" 
//       });
//       return;
//     }
    
    
//     if (!email || !password) {
//        res.status(400).json({ 
//         success: false, 
//         message: "Google credentials not configured" 
//       });
//       return;
//     }


//     // Create a temporary file path
    
//     // Ensure directory exists
//     fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
//     console.log("1")
//     // Write buffer to temporary file (needed for Puppeteer upload)
//     fs.writeFileSync(tempFilePath, file.data);
//     console.log("2")
    
//     const browser = await puppeteer.launch({
//       args: chromium.args,
//       defaultViewport: chromium.defaultViewport,
//       executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
//       headless: false, // Need visible for debugging
//     });
    
//     console.log("3")
//     const page = await browser.newPage();
    
//     // Login to Google
//     await page.goto("https://accounts.google.com", { waitUntil: "networkidle2" });
    
//     // Enter email
//     await page.waitForSelector('input[type="email"]', { visible: true });
//     //store body in a txt file
//     // const emailButtonNext2 = await page.$('button:has(span:contains("Next"))');
//     // await page.waitForSelector('.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ', { visible: true });
//     await page.type('input[type="email"]', email as string);
//     console.log("4")
    
//     // const button = await page.$('button:has(span:contains("Next"))');
//     // await page.click('button:has(span:contains("Next"))');
//     // await page.waitForSelector('button >> span:text("Next")', { visible: true });
//     // const fullSelector = '.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.BqKGqe.Jskylb.TrZEUc.lw1w4b';
//     // const emailButtonNext = await page.$(fullSelector);
//     const emailButtonNext = await page.$('.rDisVe');
    
//     // console.log("Email Button Next: ", emailButtonNext2);
//     await emailButtonNext?.click();
//     // await page.click("#identifierNext");
//     // console.log()
//     await new Promise((r) => setTimeout(r, 2000));
//     // await page.waitForNavigation();
//     console.log("5")
//     // await page.waitForTimeout(1000); // Wait for the next page to load
//     // await new Promise((r) => setTimeout(r, 1000)); // Wait for the next page to load
//     // Enter password
//     // await page.waitForSelector('input[type="password"]', { visible: true });
//     // return;
//     // await page.type('input[type="password"]', password as string);
//     // await page.waitForSelector('button >> span:text("Next")', { visible: true });
    
//     const body = await page.$eval("body", el => el.innerHTML);
//     console.log("Body: ", body);
//     fs.writeFileSync("body.txt", body);
    
//     return;
//     const passwordButtonNext = await page.$('#passwordNext');
//     await passwordButtonNext?.click();    
//     console.log("6")
//     await new Promise((r) => setTimeout(r, 2000));
//     // await page.waitForNavigation();
    
//     console.log("7")
//     // Go to Google Drive
//     await page.goto(process.env.GOOGLE_DRIVE_LINK as string, { waitUntil: "networkidle2" });
    
//     // Wait for Drive UI to load
//     await page.waitForSelector(".g3Fmkb", { visible: true, timeout: 10000 });
    
//     console.log("8")
//     // Focus on page body
//     await page.click(".g3Fmkb");
//     console.log("9")

//     await page.waitForSelector(".akerZd");

//     //right click on the page body to open the context menu
//     await page.mouse.click(0, 0, { button: "right" });
//     await new Promise((r) => setTimeout(r, 5000)); // Wait for the context menu to open
//     const pageBody = await page.$eval(".a-w-x", el => el.innerHTML);
//     console.log("Page body: ", pageBody);
//     // Execute keyboard shortcut (Alt+C then U)
//     await page.keyboard.down("Alt");
//     await page.keyboard.press("C");
//     await page.keyboard.up("Alt");
//     // new Promise((r) => setTimeout(r, 500)); // Wait for the menu to open
//     // await page.keyboard.press("U");
    
//     console.log("10")
//     // Handle file chooser
//     const [fileChooser] = await Promise.all([
//       await page.waitForFileChooser(),
//       await page.keyboard.press("U") // Sometimes needs second press
//     ]);
    
//     console.log("11")
//     // Upload the file
//     await fileChooser.accept([tempFilePath]);
    
//     // Wait for upload to complete
//     await page.waitForSelector(".progress-label", { visible: true });
//     await page.waitForFunction(async () => {
//       const progressLabel = await page.$eval(".z-Ea-f-r.d-W-ga div", (el) => el.innerHTML);
//       return progressLabel && progressLabel.includes("100%");
//     }, { timeout: 60000 });
    
//     console.log("13")
//     // Clean up temporary file
//     fs.unlinkSync(tempFilePath);

//     await browser.close();

//     res.status(200).json({ 
//       success: true,
//       message: "File uploaded successfully",
//       fileName: file.name
//     });

//   } catch (err: any) {
//     // Clean up temp file if error occurred
//     if (tempFilePath && fs.existsSync(tempFilePath)) {
//       fs.unlinkSync(tempFilePath);
//     }
    
//     res.status(500).json({ 
//       success: false, 
//       error: err.message,
//       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
//   }
// });


</template>