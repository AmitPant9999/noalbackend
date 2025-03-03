require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("Available Models:");
    models.models.forEach((model) => {
      console.log(`- ${model.name}: ${model.description}`);
    });
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
