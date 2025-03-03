require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const userRouter = require("./userRouter");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    credentials: true,
  })
);

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Content Generation Route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Correct way to call generateContent
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Extract AI-generated text properly
    const responseText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!responseText) {
      return res.status(400).json({ error: "AI response blocked or empty." });
    }

    res.json({ script: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Handle specific AI API errors
    if (error.response && error.response.candidates) {
      return res
        .status(400)
        .json({ error: "AI response was blocked due to content policy." });
    }

    res.status(500).json({ error: "Error generating script" });
  }
});

// User Routes
app.use("/api/users", userRouter);

module.exports = app;
