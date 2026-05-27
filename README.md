# Perplexity Clone - AI-Powered Search & Chat Assistant

An end-to-end AI-powered search engine assistant inspired by Perplexity AI, built with React, FastAPI, and Google Generative AI.

## Features

- Conversational Q&A with AI
- Integrated Web Search (via Tavily API)
- Syntax-Highlighted Code Blocks
- Real-time Streaming Responses (SSE)
- Beautiful, user-friendly UI with message history
- Focus Modes (General, Academic, Coding, News, YouTube, Reddit)
- Message history and suggested follow-up questions

## Tech Stack

### Frontend
- Next.js 15 + React 19
- TypeScript
- TailwindCSS
- React Markdown

### Backend
- FastAPI (Python)
- Server-Sent Events (SSE) for streaming responses
- Google Generative AI (Gemini 2.5 Flash)
- Tavily Search API

## Project Structure

```
perplexity-clone/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   └── components/    # React components
│   ├── package.json
│   └── .env.local
│
├── server/                # FastAPI Backend
│   ├── app.py             # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── .env               # Environment variables
│   └── Dockerfile         # Docker configuration
│
├── .gitignore
├── run.bat                # Windows batch runner
├── run.ps1                # PowerShell runner
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Generative AI API key
- Tavily Search API key

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/amber-bagchi/Perplexity_Clone.git
cd Perplexity_Clone
```

#### 2. Setup Backend
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 3. Setup Environment Variables
Create `server/.env`:
```
GOOGLE_API_KEY=your_google_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

Create `client/.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

#### 4. Run Backend
```bash
cd server
python -m uvicorn app:app --reload
```
Backend: http://127.0.0.1:8000

#### 5. Run Frontend
```bash
cd client
npm install
npm run dev
```
Frontend: http://localhost:3000

### Quick Start (Windows)

Run both services simultaneously:
```bash
./run.bat          # For Command Prompt
# or
./run.ps1          # For PowerShell
```

## Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set the root directory to `server/`
6. Add environment variables:
   - `GOOGLE_API_KEY`
   - `TAVILY_API_KEY`
7. Build command: `pip install -r requirements.txt`
8. Start command: `uvicorn app:app --host 0.0.0.0 --port 10000`

### Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set the root directory to `client/`
4. Add environment variables:
   - `NEXT_PUBLIC_BACKEND_URL=your_render_backend_url`
5. Deploy

## Environment Variables

### Backend (server/.env)
- `GOOGLE_API_KEY` - Google Generative AI API key
- `TAVILY_API_KEY` - Tavily Search API key

### Frontend (client/.env.local)
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL (http://localhost:8000 for local, Render URL for production)

## API Endpoints

### POST /chat
Sends a message and streams the AI response with web search integration.

Request:
```json
{
  "message": "What is React?",
  "focus_mode": "General"
}
```

Response: Server-Sent Events stream with AI-generated response and sources.

## License

MIT License

## Author

Amber Bagchi
