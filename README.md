# Synthetic Medical Data Generator for Mirth Connect

This project generates synthetic medical prescriptions tailored for integration testing with Mirth Connect. It leverages the ultra-fast **Groq API** (powered by LLaMA 3.3) to batch-generate realistic medical data in JSON format.

## Overview

This tool was specifically designed to bypass common API rate limits and "limit: 0" quota issues by:
1.  **Using Groq API:** Utilizing Groq's generous free tier for developers instead of Google Gemini.
2.  **Batch Prompting:** Generating multiple prescriptions in a single API request (a minified JSON array) to drastically reduce the number of outbound network calls.

## Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**  
   This project uses `groq-sdk` instead of Google's GenAI package.
   ```bash
   npm install
   ```

2. **Configure your API Key:**  
   Create a `.env` file in the root directory (or use `.env.local` if preferred). Obtain a free API key from the [Groq Console](https://console.groq.com/keys) and add it:
   ```env
   GROQ_API_KEY=your_actual_groq_key_here
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```
   The development server will usually start on `http://localhost:3000` or `http://localhost:3001`.

## How it Works

The core logic resides in `services/geminiService.ts` (kept under this name for legacy compatibility). It passes a robust prompt to the `llama-3.3-70b-versatile` model ensuring strictly formatted, error-preventing JSON output that is immediately ready to be parsed by a Mirth Connect Rhino JavaScript transformer.
