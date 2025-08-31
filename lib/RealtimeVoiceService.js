// RealtimeVoiceService.js - Main service class for OpenAI Realtime Voice Chat
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import realtimeRouter from './routes/realtime.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RealtimeVoiceService {
    constructor(options = {}) {
        this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
        this.port = options.port || 3000;
        this.voice = options.voice || 'marin';
        this.instructions = options.instructions || 'You are an AI assistant. Always respond in English only. Be conversational and helpful.';
        this.enableMemory = options.enableMemory !== false; // Default to true
        this.customUI = options.customUI || null;
        this.onConnect = options.onConnect || (() => {});
        this.onDisconnect = options.onDisconnect || (() => {});
        
        this.app = null;
        this.server = null;
        this.isRunning = false;
    }

    // Initialize and start the service
    async start() {
        if (this.isRunning) {
            console.log('⚠️ Service already running');
            return;
        }

        // Load environment variables
        dotenv.config();

        // Create Express app
        this.app = express();
        
        // Middleware
        this.app.use(express.json());
        
        // Serve static files (UI)
        if (this.customUI) {
            this.app.use(express.static(this.customUI));
        } else {
            this.app.use(express.static(path.join(__dirname, '../public')));
        }

        // Set up routes with service configuration
        this.app.use('/api/realtime', this.createRealtimeRouter());

        // Serve main page
        this.app.get('/', (req, res) => {
            const htmlPath = this.customUI 
                ? path.join(this.customUI, 'index.html')
                : path.join(__dirname, '../public/index.html');
            res.sendFile(htmlPath);
        });

        // Start server
        this.server = this.app.listen(this.port, () => {
            console.log(`🚀 OpenAI Realtime Voice Service running on http://localhost:${this.port}`);
            console.log('🎤 Clean implementation with WebRTC + VAD');
            console.log('🔑 API Key:', this.apiKey ? 'Loaded ✅' : 'Missing ❌');
            console.log(`🎵 Voice: ${this.voice}`);
            console.log(`🧠 Memory: ${this.enableMemory ? 'Enabled' : 'Disabled'}`);
        });

        this.isRunning = true;
        return this;
    }

    // Stop the service
    async stop() {
        if (!this.isRunning) {
            console.log('⚠️ Service not running');
            return;
        }

        return new Promise((resolve) => {
            this.server.close(() => {
                console.log('🛑 OpenAI Realtime Voice Service stopped');
                this.isRunning = false;
                resolve();
            });
        });
    }

    // Get service status
    getStatus() {
        return {
            isRunning: this.isRunning,
            port: this.port,
            voice: this.voice,
            memoryEnabled: this.enableMemory,
            url: this.isRunning ? `http://localhost:${this.port}` : null
        };
    }

    // Update configuration
    configure(options = {}) {
        if (options.voice) this.voice = options.voice;
        if (options.instructions) this.instructions = options.instructions;
        if (options.enableMemory !== undefined) this.enableMemory = options.enableMemory;
        
        console.log('⚙️ Configuration updated:', {
            voice: this.voice,
            memory: this.enableMemory
        });
    }

    // Create the realtime router with service configuration
    createRealtimeRouter() {
        const router = express.Router();
        const serviceConfig = {
            voice: this.voice,
            instructions: this.instructions,
            apiKey: this.apiKey
        };

        router.post("/session", async (req, res) => {
            try {
                const { sdpOffer, model = "gpt-4o-realtime-preview", voice, instructions } = req.body || {};
                
                if (!serviceConfig.apiKey) return res.status(500).send("Missing OPENAI_API_KEY");
                if (!sdpOffer || !sdpOffer.startsWith("v=0")) return res.status(400).send("Bad SDP offer");

                const sessionVoice = voice || serviceConfig.voice;
                const sessionInstructions = serviceConfig.instructions;
                
                console.log(`🎵 Setting up session with voice: ${sessionVoice} (English)`);
                console.log(`📝 Instructions: ${sessionInstructions.substring(0, 50)}...`);
                
                const url = `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}&voice=${encodeURIComponent(sessionVoice)}&instructions=${encodeURIComponent(sessionInstructions)}`;
                const r = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${serviceConfig.apiKey}`,
                        "Content-Type": "application/sdp",
                        "OpenAI-Beta": "realtime=v1"
                    },
                    body: sdpOffer
                });

                const sdpAnswer = await r.text();
                if (!r.ok || !/^v=0/m.test(sdpAnswer)) {
                    console.error("Realtime SDP error:", r.status, sdpAnswer.slice(0, 200));
                    return res.status(r.status || 502).send(sdpAnswer || "No SDP answer");
                }
                res.type("application/sdp").send(sdpAnswer);
            } catch (e) {
                console.error(e);
                res.status(500).send("SDP exchange failed");
            }
        });

        return router;
    }
}

export default RealtimeVoiceService;
