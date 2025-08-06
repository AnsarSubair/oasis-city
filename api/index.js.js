// server.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// This line loads the GOOGLE_API_KEY from your .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// This line tells the server to show the files in the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Securely get the API key from the environment variables
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
    console.error("CRITICAL ERROR: GOOGLE_API_KEY is not defined in the .env file.");
    process.exit(1);
}

// Endpoint for the AI Q&A
app.post('/generate-answer', async (req, res) => {
    const { question, context } = req.body;

    const prompt = `Based on the following information about 'Oasis City', answer the user's question. If the information is not directly available, state that you don't have enough details.

    Oasis City Information:
    ${context}

    User's Question: "${question}"

    AI Answer:`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await axios.post(geminiUrl, payload);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Gemini API:', error.response ? error.response.data.error.message : error.message);
        res.status(500).json({ error: 'Failed to generate answer from AI.' });
    }
});

// Endpoint for Image Generation
app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;

    // The Imagen API is more complex and usually requires Google Cloud Authentication, not just a simple key.
    // For this reason, this endpoint will return a placeholder image to demonstrate functionality without a complex setup.
    console.warn("Image Generation API call is a demo. Returning a placeholder.");
    res.status(501).json({
        error: "Image generation backend not fully implemented. Requires advanced setup.",
        placeholder: "https://placehold.co/800x600/a78bfa/ffffff?text=AI+Image+Demo"
    });
});

// Export the app for Vercel
module.exports = app;