
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// Removed firebase plugin import
// import {firebase} from '@genkit-ai/firebase'; // Assuming this was for Firebase Functions, not directly used in client logic

// Initialize Genkit with the Google AI plugin.
// The GOOGLE_API_KEY environment variable will be used automatically.
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1beta' }), // Explicitly set apiVersion if needed, or remove for default
    // firebase() // Removed Firebase plugin initialization
  ], // Correctly close the plugins array here
  // model: 'gemini-1.5-flash-latest', // This is now a commented-out top-level property
});
