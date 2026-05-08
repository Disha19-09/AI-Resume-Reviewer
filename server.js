require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .env');
  process.exit(1);
}

async function extractText(file) {
  if (file.mimetype === 'application/pdf') {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(file.buffer) });
    const pdf = await loadingTask.promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text.trim();
  }
  return file.buffer.toString('utf-8').trim();
}

function buildPrompt(resumeText) {
  return `You are a senior career coach and resume specialist. Review the resume below and give honest, constructive feedback in clear markdown.

Structure your response with these sections:
## Overall Impression
A short paragraph on the resume's general quality and first impression.

## Strengths
What the candidate does well — be specific.

## Areas to Improve
Honest weaknesses with actionable suggestions for each.

## Missing or Incomplete Sections
Anything important that's absent or underdeveloped.

## Quick Wins
3–5 concrete changes the candidate can make right now to improve their chances.

Be direct but encouraging. Focus on impact.

---
${resumeText}`;
}

app.post('/review', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ feedback: 'No file received.' });
  }

  let resumeText;
  try {
    resumeText = await extractText(req.file);
  } catch (e) {
    console.error('File read error:', e);
    return res.status(400).json({ feedback: 'Could not read the file. Please try again.' });
  }

  if (!resumeText || resumeText.length < 50) {
    return res.status(400).json({ feedback: 'The file appears to be empty or unreadable.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(resumeText) }] }]
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini HTTP error:', response.status, err);
      return res.status(502).json({ feedback: 'The AI service returned an error. Please try again.' });
    }

    const data = await response.json();
    const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!feedback) {
      console.error('Unexpected Gemini response shape:', JSON.stringify(data));
      return res.status(502).json({ feedback: 'No feedback returned. Please try again.' });
    }

    res.json({ feedback });

  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ feedback: 'Something went wrong with the AI call.' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});