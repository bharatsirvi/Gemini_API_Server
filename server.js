
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { getAIInstance } from './utils/ai.js';
import tryonRoute from './routes/tryon.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const API_PASSWORD = process.env.API_PASSWORD;

const ai = getAIInstance(API_KEY);

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Modular route for try-on
app.use('/api', tryonRoute(ai, API_PASSWORD));

// Error handling middleware for multer and other errors
app.use((error, req, res, next) => {
  console.error('🚨 Middleware error:', error);
  // Handle multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large',
      message: 'Image files must be under 10MB',
      timestamp: new Date().toISOString()
    });
  }
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      error: 'Too many files',
      message: 'Only one file allowed per field',
      timestamp: new Date().toISOString()
    });
  }
  // Handle file type validation errors
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
  // Generic error handler
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`,
    available_endpoints: [
      'POST /api/outfit-tryon'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Aazmaish API Server is running on port ${PORT}`);
  console.log(`🔐 API Password: ${API_PASSWORD}`);
  console.log(`🤖 Gemini AI: ${API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
});

export default app;
