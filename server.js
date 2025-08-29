// server.js - Clean OpenAI Realtime API server
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import realtimeRouter from './routes/realtime.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/realtime', realtimeRouter);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 OpenAI Realtime Voice Chat running on http://localhost:${PORT}`);
    console.log('🎤 Clean implementation with WebRTC + VAD');
    console.log('🔑 API Key:', process.env.OPENAI_API_KEY ? 'Loaded ✅' : 'Missing ❌');
});

export default app;