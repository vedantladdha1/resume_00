import express from "express";
import multer from "multer";
import cors from "cors"; // Allow requests from the frontend
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI (Gemini API)
const genAI = new GoogleGenerativeAI("AIzaSyD7eSbqn9kpwlZKUuwf9N5bg_LnQgIeA8Q");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Set up file upload using multer (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize express
const app = express();
app.use(cors()); // Enable CORS for frontend communication

// Endpoint to accept text input, process it with Gemini API, and respond
const generateContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    // Read PDF file buffer as UTF-8 text
    const textBuffer = req.file.buffer.toString("utf-8"); // Convert buffer to UTF-8 string

    // Send extracted text to Gemini API
    const prompt = `Convert the text to HTML code :\n${textBuffer}`;
    const result = await model.generateContent(prompt);

    // Get the generated response from the Gemini API
    const response = result.response;
    const generatedText = response.text;

    // Send the generated text back to the frontend, ensuring UTF-8 encoding
    res.json({ originalText: textBuffer, aiResponse: generatedText });
  } catch (err) {
    console.error(err);
    res.status(500).send("Unexpected Error!!!");
  }
};

// Route to upload the text file
app.post("/test", upload.single("file"), generateContent);

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
