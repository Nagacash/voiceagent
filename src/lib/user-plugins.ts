// User Plugin System - Each user brings their own integrations
interface UserPlugin {
  name: string;
  type: 'messaging' | 'ai' | 'automation';
  credentials: Record<string, string>; // User's tokens
  handler: (message: string, context: any) => Promise<any>;
}

// Your voice agent core
export class VoiceAgentCore {
  private plugins = new Map<string, UserPlugin>();
  
  // Users register their plugins with their own tokens
  registerPlugin(plugin: UserPlugin) {
    this.plugins.set(plugin.name, plugin);
  }
  
  // Route through user's chosen services
  async processMessage(message: string, userId: string) {
    const userPlugins = Array.from(this.plugins.values())
      .filter(p => this.userHasAccess(p, userId));
    
    // Process using user's own services/tokens
    for (const plugin of userPlugins) {
      if (plugin.type === 'messaging') {
        return await plugin.handler(message, { userId });
      }
    }
  }

  private userHasAccess(plugin: UserPlugin, userId: string): boolean {
    // Implement your permission logic here
    return true; // Simplified for example
  }
}

// Example user plugin implementation
export class TelegramPlugin {
  constructor(private botToken: string) {}
  
  async sendMessage(chatId: string, text: string) {
    // Uses user's bot token, not yours
    return fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: 'POST',
      body: JSON.stringify({ chat_id: chatId, text })
    });
  }
}

// Example OpenClaw integration plugin
export class OpenClawPlugin {
  constructor(private endpoint: string, private token: string) {}
  
  async connectToServices() {
    // Connect to user's OpenClaw instance with their token
    return fetch(`${this.endpoint}/api/channels/status`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
  }
}