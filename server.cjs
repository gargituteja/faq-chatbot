const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log("Message received:", message);  // ✅ Debugging

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",  // ✅ Agar gpt-4 ka access nahi hai to "gpt-3.5-turbo" use karo
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;
    console.log("Reply sent:", reply);  // ✅ Debugging
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);  // ✅ Error details dikhao
    res.json({ reply: "Sorry, I'm having trouble answering right now." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend is running at http://localhost:${PORT}`);
});
