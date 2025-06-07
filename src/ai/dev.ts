// src/ai/dev.ts
import { config } from 'dotenv';
config(); // Load environment variables from .env file

// Import flows to be discoverable by the Genkit developer UI
import '@/ai/flows/moderate-forum-content.ts';

// This is a simple way to export flows for the dev server.
// You could also export them directly from their respective files.
// Mock dev module to prevent import errors
export default {
  '/flows': {},
};
