import express from 'express';
import { GoogleGenerativeAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// AI Chat Proxy Endpoint
app.post('/api/ai/chat', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('AI Proxy Error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// Serve health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', api_configured: !!process.env.GEMINI_API_KEY });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`âœ… AI Proxy Server running on port ${PORT}`);
});
