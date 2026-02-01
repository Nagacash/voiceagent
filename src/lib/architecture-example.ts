// YOUR SERVER - Never sees user tokens
export class YourVoiceServer {
  // ONLY handles voice processing, NO external APIs
  async processVoice(audio: ArrayBuffer): Promise<string> {
    // Your voice-to-text (you control this)
    return this.transcribe(audio); 
  }
  
  async synthesizeVoice(text: string): Promise<ArrayBuffer> {
    // Your text-to-speech (you control this)  
    return this.synthesize(text);
  }
}

// USER'S BROWSER - Handles all external integrations
export class UserVoiceAgent {
  constructor(
    private voiceServer: YourVoiceServer,
    private userCredentials: UserIntegrations // Stored in localStorage
  ) {}

  async processVoiceCommand(audio: ArrayBuffer): Promise<void> {
    // 1. Send to YOUR server for voice processing ONLY
    const transcription = await this.voiceServer.processVoice(audio);
    
    // 2. User's browser calls external services directly
    let response: string;
    
    if (this.userCredentials.openai) {
      // User's browser → OpenAI (bypasses your server completely)
      response = await this.callOpenAI(transcription);
    } else if (this.userCredentials.openclaw) {
      // User's browser → User's OpenClaw instance
      response = await this.callOpenClaw(transcription);
    }
    
    // 3. Send response back to YOUR server for voice synthesis
    const audioResponse = await this.voiceServer.synthesizeVoice(response);
    
    // 4. Play audio in user's browser
    this.playAudio(audioResponse);
  }
  
  // All these methods run in USER'S browser with their tokens
  private async callOpenAI(text: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.userCredentials.openai.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  private async callOpenClaw(text: string) {
    const { endpoint, token } = this.userCredentials.openclaw;
    const response = await fetch(`${endpoint}/api/agent/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });
    const data = await response.json();
    return data.response;
  }
}