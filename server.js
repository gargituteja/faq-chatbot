import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Check if API key is loaded
console.log("API Key loaded:", process.env.OPENAI_API_KEY ? "Yes ✅" : "No ❌");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// OpenAI client setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// /ask endpoint
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  console.log("❓ Question received:", question);

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // ya "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful FAQ chatbot." },
        { role: "user", content: question },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ reply: "Error: Unable to fetch AI response." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend is running at http://localhost:${PORT}`);
});


