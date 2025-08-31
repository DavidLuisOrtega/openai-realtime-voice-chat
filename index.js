// index.js - Main package entry point
export { default as RealtimeVoiceService } from './lib/RealtimeVoiceService.js';

// Export individual components for flexibility
export { default as createRealtimeRouter } from './lib/routes/realtime.js';

// Convenience function to start service quickly
export async function startVoiceService(options = {}) {
    const { default: RealtimeVoiceService } = await import('./lib/RealtimeVoiceService.js');
    const service = new RealtimeVoiceService(options);
    await service.start();
    return service;
}

// Export client-side utilities
export const VoiceClient = {
    // Client-side JavaScript class for embedding in other apps
    create: (options = {}) => {
        return `
        class EmbeddedVoiceChat {
            constructor(config) {
                this.serverUrl = config.serverUrl || 'http://localhost:3000';
                this.onConnect = config.onConnect || (() => {});
                this.onDisconnect = config.onDisconnect || (() => {});
                this.pc = null;
                this.audioEl = null;
                this.isConnected = false;
                this.currentVoice = config.voice || 'marin';
            }
            
            async connect() {
                // WebRTC connection logic here
                // Returns promise that resolves when connected
            }
            
            disconnect() {
                // Cleanup logic
            }
        }
        `;
    }
};
