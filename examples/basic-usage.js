// examples/basic-usage.js - Basic usage example
import { RealtimeVoiceService } from '../index.js';

async function basicExample() {
    console.log('🚀 Starting OpenAI Realtime Voice Service...');
    
    const voiceService = new RealtimeVoiceService({
        port: 3000,
        voice: 'alloy',
        enableMemory: true,
        onConnect: () => console.log('🎤 User connected!'),
        onDisconnect: () => console.log('🔌 User disconnected!')
    });

    try {
        await voiceService.start();
        console.log('✅ Service started successfully!');
        console.log('🌐 Open http://localhost:3000 in your browser');
        
        // Keep running until interrupted
        process.on('SIGINT', async () => {
            console.log('\n🛑 Shutting down...');
            await voiceService.stop();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Failed to start service:', error);
    }
}

basicExample();
