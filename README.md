# 📄 AI Resume Reviewer

A web app that gives instant, structured resume feedback powered by Google Gemini AI. Upload your resume and get honest, actionable feedback like having a career coach in your corner.

🔗 **Live Demo:** [https://ai-resume-reviewer-a1l7.onrender.com](https://ai-resume-reviewer-a1l7.onrender.com)

---

## ✨ Features

- 📤 **Upload PDF or TXT** resumes via drag & drop or file picker
- 🤖 **AI-powered feedback** using Google Gemini 2.5 Flash
- 📋 **Structured review** covering strengths, weaknesses, missing sections & quick wins
- 🌙 **Dark mode** toggle
- 🎨 **Sandy theme** — clean, soft, and easy on the eyes
- 🔒 **Privacy first** — your file is never stored
- 📱 **Responsive** — works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| AI | Google Gemini 2.5 Flash API |
| PDF Parsing | pdfjs-dist |
| File Upload | Multer |
| Deployment | Render |

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Disha19-09/AI-Resume-Reviewer.git
   cd AI-Resume-Reviewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root folder:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the app**
   ```bash
   node server.js
   ```

5. Open your browser and go to `http://localhost:3000`

---

## 📁 Project Structure

```
AI-Resume-Reviewer/
├── index.html        # Frontend UI
├── style.css         # Styling & theme
├── script.js         # Frontend logic
├── server.js         # Express backend + Gemini API
├── package.json
├── .gitignore
└── .env              # Not committed — add your own
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | My Google Gemini API key |

---

## 📸 Preview

> Upload your resume → Get structured AI feedback in seconds

---

## 🙋‍♀️ Author

**Disha Rathore**
- GitHub: [@Disha19-09](https://github.com/Disha19-09)

---