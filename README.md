# OpenAI Realtime Voice Service

A reusable package for integrating OpenAI's Realtime Voice API into your applications.

## Installation

```bash
npm install openai-realtime-voice-service
```

## Quick Start

### Option 1: Standalone Service

```javascript
import { RealtimeVoiceService } from 'openai-realtime-voice-service';

const voiceService = new RealtimeVoiceService({
    apiKey: 'your-openai-api-key',
    port: 3000,
    voice: 'alloy',
    enableMemory: true
});

await voiceService.start();
// Service available at http://localhost:3000
```

### Option 2: Embedded in Express App

```javascript
import express from 'express';
import { createRealtimeRouter } from 'openai-realtime-voice-service';

const app = express();
app.use('/voice', createRealtimeRouter({ apiKey: 'your-key' }));
app.listen(4000);
```

### Option 3: Quick Start Function

```javascript
import { startVoiceService } from 'openai-realtime-voice-service';

const service = await startVoiceService({
    port: 3000,
    voice: 'marin'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | `process.env.OPENAI_API_KEY` | OpenAI API key |
| `port` | number | `3000` | Server port |
| `voice` | string | `'marin'` | AI voice (alloy, echo, sage, shimmer, verse, marin) |
| `instructions` | string | Default English instructions | Custom AI instructions |
| `enableMemory` | boolean | `true` | Enable conversation memory |
| `customUI` | string | `null` | Path to custom UI directory |

## API Reference

### RealtimeVoiceService

```javascript
const service = new RealtimeVoiceService(options);
await service.start();        // Start the service
await service.stop();         // Stop the service
service.configure(newOptions); // Update configuration
service.getStatus();          // Get current status
```

## Examples

Run the included examples:

```bash
npm run example    # Basic standalone usage
```

## Features

- ✅ WebRTC-based real-time voice chat
- ✅ OpenAI Realtime API integration
- ✅ Conversation memory (session-based)
- ✅ Multiple voice options
- ✅ English language enforcement
- ✅ Clean minimal UI
- ✅ Embeddable in existing apps
- ✅ Configurable and extensible

## License

MIT
