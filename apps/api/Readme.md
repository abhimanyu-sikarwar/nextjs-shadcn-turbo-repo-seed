# TTS API Usage Examples

## Project Structure
```
tts-api-service/
├── src/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── fileHelpers.ts
│   ├── services/
│   │   ├── dataService.ts
│   │   └── ttsService.ts
│   ├── api/
│   │   ├── routes.ts
│   │   └── server.ts
│   └── main.ts
├── files/
│   ├── voices.json
│   └── vibes.json
├── downloads/
├── package.json
├── tsconfig.json
└── README.md
```

## Running the Application

### 1. CLI Mode (Original functionality)
```bash
# Development
npm run dev:cli

# Production
npm run build
npm run start:cli
```

### 2. API Server Mode
```bash
# Development
npm run dev:server

# Production
npm run build
npm run start:server

# Custom port
npm run dev:server -- --port=4000
```

## API Endpoints

### 1. Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 2. Get Available Voices
```bash
GET /api/tts/voices
```

**Response:**
```json
{
  "success": true,
  "voices": [
    "ALLoy",
    "Ash",
    "Ballad",
    "Coral",
    "Echo",
    "Fable",
    "0nyx",
    "Nova",
    "Sage",
    "Shimmer",
    "Verse"
  ]
}
```

### 3. Get Available Vibes
```bash
GET /api/tts/vibes
```

**Response:**
```json
{
  "success": true,
  "vibes": [
    "Angry",
    "Anxious",
    "Blissful",
    "Calm",
    "Storyteller",
    "Romantic",
    "Energetic",
    "..."
  ]
}
```

### 4. Generate Speech
```bash
POST /api/tts/generate
```

**Request Body:**
```json
{
  "text": "Hello, this is a test message for text-to-speech conversion.",
  "voice": "Ash",
  "vibe": "Storyteller"
}
```

**Success Response:**
```json
{
  "success": true,
  "filename": "output_20240120_103000.wav",
  "filepath": "./downloads/output_20240120_103000.wav",
  "message": "Audio saved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid voice: InvalidVoice. Available voices: ALLoy, Ash, Ballad, ..."
}
```

### 5. List Audio Files
```bash
GET /api/tts/files
```

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "filename": "output_20240120_103000.wav",
      "size": 524288,
      "created": "2024-01-20T10:30:00.000Z",
      "modified": "2024-01-20T10:30:00.000Z"
    },
    {
      "filename": "output_20240120_102500.wav",
      "size": 384256,
      "created": "2024-01-20T10:25:00.000Z",
      "modified": "2024-01-20T10:25:00.000Z"
    }
  ]
}
```

### 6. Download Audio File
```bash
GET /api/tts/download/:filename
```

**Description:** Downloads the specified audio file as an attachment.

**Example:** `GET /api/tts/download/output_20240120_103000.wav`

**Response:** Binary audio data with appropriate headers for download

### 7. Stream Audio File
```bash
GET /api/tts/stream/:filename
```

**Description:** Streams the audio file for direct playback in browser. Supports range requests for seeking.

**Example:** `GET /api/tts/stream/output_20240120_103000.wav`

**Response:** Binary audio data with streaming headers

### 8. Delete Audio File
```bash
DELETE /api/tts/files/:filename
```

**Description:** Deletes the specified audio file from the server.

**Example:** `DELETE /api/tts/files/output_20240120_103000.wav`

**Success Response:**
```json
{
  "success": true,
  "message": "File output_20240120_103000.wav deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "File not found"
}
```

## cURL Examples

### Get available voices:
```bash
curl -X GET http://localhost:3000/api/tts/voices
```

### Get available vibes:
```bash
curl -X GET http://localhost:3000/api/tts/vibes
```

### Generate speech:
```bash
curl -X POST http://localhost:3000/api/tts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Good evening, Delhi dreamers. This is RJ Rohan.",
    "voice": "Ash",
    "vibe": "Storyteller"
  }'
```

## JavaScript/TypeScript Client Example

```typescript
class TTSClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async getVoices(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/tts/voices`);
    const data = await response.json();
    return data.voices;
  }

  async getVibes(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/tts/vibes`);
    const data = await response.json();
    return data.vibes;
  }

  async generateSpeech(text: string, voice: string, vibe: string) {
    const response = await fetch(`${this.baseUrl}/api/tts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice, vibe }),
    });
    return await response.json();
  }
}

// Usage
const client = new TTSClient();

// Get available options
const voices = await client.getVoices();
const vibes = await client.getVibes();

// Generate speech
const result = await client.generateSpeech(
  "Hello world!", 
  "Ash", 
  "Storyteller"
);

if (result.success) {
  console.log(`Audio saved to: ${result.filepath}`);
} else {
  console.error(`Error: ${result.error}`);
}
```

## Environment Variables

Create a `.env` file for configuration:

```env
PORT=3000
FILES_PATH=./files
DOWNLOADS_PATH=./downloads
API_URL=https://www.openai.fm/api/generate
```

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid input parameters
- **404 Not Found**: Route not found
- **500 Internal Server Error**: Server-side errors

All error responses follow this format:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```