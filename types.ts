
export interface Company {
  id: string;
  name: string;
  email: string;
  apiKey: string;
}

export interface ConnectedSource {
  id: string;
  type: 'google-drive' | 'notion' | 'slack' | 'web';
  name: string;
  lastSynced: string;
}

export interface VoiceAgent {
  id: string;
  companyId: string;
  name: string;
  systemPrompt: string;
  knowledgeBase?: string;
  connectedSources?: ConnectedSource[];
  voiceName: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
  status: 'active' | 'draft';
  createdAt: string;
}

export interface UserSession {
  company: Company;
  token: string;
}
