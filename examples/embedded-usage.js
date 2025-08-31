// examples/embedded-usage.js - How to embed in existing Express app
import express from 'express';
import { createRealtimeRouter } from '../index.js';

async function embeddedExample() {
    console.log('🚀 Embedding voice service in existing Express app...');
    
    const app = express();
    
    // Your existing routes
    app.get('/api/health', (req, res) => {
        res.json({ status: 'healthy' });
    });
    
    // Add voice chat as a sub-route
    app.use('/voice', createRealtimeRouter({
        voice: 'marin',
        instructions: 'You are a helpful assistant embedded in a larger application.'
    }));
    
    // Serve static files for voice UI
    app.use('/voice-ui', express.static('../public'));
    
    app.listen(4000, () => {
        console.log('✅ App with embedded voice service running on http://localhost:4000');
        console.log('🎤 Voice chat available at: http://localhost:4000/voice-ui');
    });
}

embeddedExample();
