import db from "../../db";
import { Router, Request, Response } from "express";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import dotenv from "dotenv";
dotenv.config();
chromium.setGraphicsMode = false;

const app = Router();

interface File {
  name: string;
  url: string;
}
let files : string[] = [];

app.get("/", async (req: Request, res: Response) => {
  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
  
    // Array to store all file data
    const filesData: File[] = [];
    
    // Listen for download requests
    page.on('request', (request) => {
      if (request.url().includes('export=download') || 
          request.url().includes('uc?id=') ||
          request.url().includes('confirm=')) {
        // We'll associate URLs with files later
        filesData.push({ name: '', url: request.url() });
        request.abort(); // Prevent actual download
      } else {
        request.continue();
      }
    });    
    
    await page.goto(
      "https://drive.google.com/drive/folders/1eekEms2ZXPxfNuIulTRHd9lHk9tgqFIg",
      { waitUntil: 'networkidle2' }
    );
    
    // Wait for both selectors to be available
    await page.waitForSelector(".KL4NAf");
    await page.waitForSelector(".akerZd");
    
    // Get all file names
    const fileNames = await page.$$eval(".KL4NAf", elements => 
      elements.map(el => el.textContent?.trim() || '')
    );

    // Get all clickable elements
    const fileElements = await page.$$('.akerZd');
  
    // Click each element and capture download URLs
    for (let i = 0; i < fileElements.length; i++) {
      try {
        
        // Click the element (opens download dialog)
        await fileElements[i].click();
        
        // Wait for the request to trigger
        await new Promise(r => setTimeout(r, 2000));

        // Close any dialog that might have opened
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 500));
      } catch (error) {
        res.status(500).json({
            success: false,
            error: `Error processing file ${i + 1}: ${error}`
        })
        return;
      }
    }
    
    await browser.close();

    // Pair file names with their download URLs
    const result = fileNames.map((name, index) => ({
      name,
      url: filesData[index]?.url || ''
    }));

    res.status(200).json({ 
      success: true, 
      files: result 
    });
    return;
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

app.get("/files", async (req: Request, res: Response) => {
  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(
        "https://drive.google.com/drive/folders/1eekEms2ZXPxfNuIulTRHd9lHk9tgqFIg",
        { waitUntil: 'networkidle2' }
      );
      
      // Wait for both selectors to be available
      await page.waitForSelector(".KL4NAf");

    const fileNames = await page.$$eval(".KL4NAf", elements => 
        elements.map(el => el.textContent?.trim() || '')
      );

      res.status(200).json({success: true, files : fileNames})

      
      files = fileNames;
      console.log(files)
  }
  catch (err: any) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
})

app.get("/test", async (req: Request, res : Response) => {
    console.log(files)
    res.status(200).json({success: true})
} )

export default app;