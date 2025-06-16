import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

app.post("/api/gemini", async (req, res) => {
  try {
    const { message } = req.body;

    // Custom instructions injected before the user's message
    const instruction = `
You are an AI assistant. Follow these strict rules:
1. Always provide short and highly relevant answers.
2. Ensure maximum accuracy in your responses.
3. If the user asks for code, provide only Java code, no explanations unless explicitly requested.
4. If asked for a definition, give only a concise and direct definition without examples or extra details.
`;

    const fullPrompt = `${instruction}\n\nUser: ${message}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
    res.json({ reply });

  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate response from Gemini." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
