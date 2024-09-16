import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import ollama from 'ollama';
import cors from 'cors';
import multer from 'multer'; 
import pdfParse from 'pdf-parse'; 
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL if different
}));
app.use(express.json());

// Configure Multer for file uploads
const upload = multer({
  dest: 'uploads/', // Directory to store uploaded files
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF files only
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed') as any, false);
    }
  },
});

// POST endpoint to handle PDF uploads
app.post('/upload-pdf', upload.single('pdf'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({ reply: 'No file uploaded. Please upload a PDF file.' });
  }

  try {
    const filePath = path.resolve(__dirname, '..', req.file.path);
    const fileBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const data = await pdfParse(fileBuffer);
    const extractedText = data.text;

    // Optionally, you can delete the uploaded file after processing
    fs.unlinkSync(filePath);

    // Summarize the extracted text using Ollama
    const response = await ollama.chat({
      model: 'mailtool', // Ensure 'mailtool' is the correct model for summarization
      messages: [{ role: 'user', content: extractedText }],
    });

    res.send({ reply: response.message.content });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send({ reply: 'An error occurred while processing your PDF.' });
  }
});

// Optional: Adjust the existing /msg endpoint if needed
app.post('/msg', async (req: Request, res: Response) => {
  const { query } = req.body;

  try {
    const response = await ollama.chat({
      model: 'mailtool', // Ensure 'mailtool' is the correct model for summarization
      messages: [{ role: 'user', content: `${query}` }],
    });
    res.send({ reply: response.message.content });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send({ reply: 'An error occurred while processing your request.' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
