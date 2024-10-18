import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { NextFunction, Request, Response } from 'express';

const folderPath = './uploads';
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.ico'];

function countImagesInFolder(folderPath: string): number {
  try {
    const files = fs.readdirSync(folderPath);
    let imageCount = 0;

    files.forEach((file) => {
      const extension = path.extname(file).toLowerCase();
      if (imageExtensions.includes(extension)) {
        imageCount++;
      }
    });
    return imageCount;
  } catch (err) {
    console.error('Error reading folder:', err);
    return 0;
  }
}

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${countImagesInFolder(folderPath) + 1}${extension}`);
  }
});

export const upload = multer({ storage }).single('file');

export const fileToBase64 = (filename: string): string => {
  const filePath = path.join(folderPath, filename);
  const fileData = fs.readFileSync(filePath);
  const mimeType = `image/${path.extname(filename).slice(1)}`;
  return `data:${mimeType};base64,${fileData.toString('base64')}`;
};

export const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const base64 = fileToBase64(req.file.filename);

    return res.json({
      filename: req.file.filename,
      base64
    });
  });
};
