// server.js - Simple server runner (for backwards compatibility)
import { RealtimeVoiceService } from './index.js';

async function startServer() {
    const service = new RealtimeVoiceService({
        port: process.env.PORT || 3000,
        voice: process.env.VOICE || 'marin',
        enableMemory: process.env.ENABLE_MEMORY !== 'false'
    });
    
    await service.start();
}

startServer().catch(console.error);
