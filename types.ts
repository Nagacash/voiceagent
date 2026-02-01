
export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string; // For SMS notifications
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
  notificationPhone?: string; // Agent creator's phone for SMS summaries
  smsEnabled?: boolean; // Whether to send SMS after calls
}

export interface UserSession {
  company: Company;
  token: string;
}
