# Aazmaish API Server

This is a Node.js API server for the Aazmaish virtual outfit try-on application using Google Gemini AI.

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
   cd api_server
   npm install
   ```

2. **Configure Environment**
   - Copy `.env` file and update with your settings:
   ```bash
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   API_PASSWORD=your_secure_password_here
   ```

3. **Start Server**
   ```bash
   # Production
   npm start
   
   # Development (with auto-restart)
   npm run dev
   ```

## API Endpoints

### Health Check
```
GET /health
```

### Outfit Try-On Analysis
```
POST /api/outfit-tryon
Headers: x-api-password: your_password
Body: {
  "personImageBase64": "base64_string",
  "outfitImageBase64": "base64_string"
}
```

### Image Generation (Mock)
```
POST /api/generate-outfit-image  
Headers: x-api-password: your_password
Body: {
  "personImageBase64": "base64_string",
  "outfitImageBase64": "base64_string",
  "description": "optional description"
}
```

## Security

- Password protection on all AI endpoints
- Request size limits (50MB)
- File upload size limits (10MB)
- Helmet security headers
- CORS enabled

## Usage from Flutter App

The Flutter app will make HTTP requests to this API server with the required password header.

## Notes

- Current Gemini model provides analysis, not image generation
- For actual image generation, consider integrating:
  - Stable Diffusion API
  - DALL-E API  
  - Midjourney API
  - Or similar image generation services

## Development

Server runs on `http://localhost:3000` by default.

Check logs for detailed request/response information.
