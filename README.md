
# Aazmaish API Server

This is a modular Node.js API server for the Aazmaish virtual outfit try-on application using Google Gemini AI.

## Features

- 🔐 Password-protected API endpoints
- 🤖 Google Gemini AI integration
- 📸 Image processing for outfit try-on
- 🛡️ Security middleware (Helmet, CORS)
- 📊 Error handling and logging
- 🚀 RESTful API design


## Setup

1. **Install Dependencies**
  ```bash
  npm install
  ```

2. **Configure Environment**
  - Create a `.env` file in the project root (do NOT commit this file):
  ```env
  PORT=3000
  GEMINI_API_KEY=your_gemini_api_key_here
  API_PASSWORD=your_secure_password_here
  ```

3. **Start Server**
  ```bash
  # Production
  npm start

  # Development (with auto-restart, if you use nodemon)
  npm run dev
  ```

**Note:** `.env` is in `.gitignore` and will not be tracked by git.


## Project Structure

```
middleware/         # Custom Express middleware (e.g., upload, password validation)
routes/             # API route handlers (e.g., /api/outfit-tryon)
utils/              # Utility functions (e.g., Gemini AI integration)
server.js           # Main entry point
package.json        # Project metadata and scripts
.env                # Environment variables (not committed)
```

## API Endpoints


### Outfit Try-On
```
POST /api/outfit-tryon
Headers: x-api-password: your_password
Form-Data:
  personImage: (image file)
  outfitImage: (image file)
```


## Security & Best Practices

- Password protection on all AI endpoints
- Request size limits (50MB)
- File upload size limits (10MB)
- Helmet security headers
- CORS enabled
- `.env` and sensitive files are git-ignored


## Usage from Client Apps

Clients (e.g., Flutter, web, Postman) should send requests to the API with the required password header and image files as form-data.


## Notes

- The Gemini model may provide analysis or image output depending on your API key and model access.
- For advanced image generation, consider integrating:
  - Stable Diffusion API
  - DALL-E API
  - Midjourney API
  - Or similar services


## Development

- Server runs on `http://localhost:3000` by default (configurable via `.env`).
- Check logs for detailed request/response information.
- For deployment, set environment variables in your cloud platform dashboard (never commit secrets).
