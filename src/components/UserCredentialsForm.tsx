// User credentials form - stores in browser localStorage
import React, { useState, useEffect } from 'react';

export const UserCredentialsForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    openclaw: { endpoint: '', token: '' },
    openai: { apiKey: '', model: 'gpt-3.5-turbo' },
    telegram: { botToken: '', chatId: '' },
    discord: { botToken: '', channelId: '' }
  });

  // Load saved credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem('voice-agent-credentials');
    if (saved) {
      setCredentials(JSON.parse(saved));
    }
  }, []);

  // Save credentials whenever they change
  const saveCredentials = () => {
    localStorage.setItem('voice-agent-credentials', JSON.stringify(credentials));
    alert('Credentials saved locally in your browser!');
  };

  const updateCredential = (service: string, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="credentials-form">
      <h2>🔐 Your Service Credentials</h2>
      <p className="security-note">
        🔒 All credentials are stored locally in your browser and never sent to our servers.
      </p>

      {/* OpenClaw Section */}
      <div className="service-section">
        <h3>🦞 OpenClaw</h3>
        <div className="field-group">
          <label>Endpoint URL:</label>
          <input
            type="url"
            placeholder="http://127.0.0.1:18789"
            value={credentials.openclaw.endpoint}
            onChange={(e) => updateCredential('openclaw', 'endpoint', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Auth Token:</label>
          <input
            type="password"
            placeholder="Your OpenClaw token"
            value={credentials.openclaw.token}
            onChange={(e) => updateCredential('openclaw', 'token', e.target.value)}
          />
        </div>
      </div>

      {/* OpenAI Section */}
      <div className="service-section">
        <h3>🤖 OpenAI</h3>
        <div className="field-group">
          <label>API Key:</label>
          <input
            type="password"
            placeholder="sk-..."
            value={credentials.openai.apiKey}
            onChange={(e) => updateCredential('openai', 'apiKey', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Model:</label>
          <select
            value={credentials.openai.model}
            onChange={(e) => updateCredential('openai', 'model', e.target.value)}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        </div>
      </div>

      {/* Telegram Section */}
      <div className="service-section">
        <h3>📱 Telegram</h3>
        <div className="field-group">
          <label>Bot Token:</label>
          <input
            type="password"
            placeholder="123456:ABC-DEF..."
            value={credentials.telegram.botToken}
            onChange={(e) => updateCredential('telegram', 'botToken', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Chat ID:</label>
          <input
            placeholder="@your_username or chat_id"
            value={credentials.telegram.chatId}
            onChange={(e) => updateCredential('telegram', 'chatId', e.target.value)}
          />
        </div>
      </div>

      {/* Discord Section */}
      <div className="service-section">
        <h3>🎮 Discord</h3>
        <div className="field-group">
          <label>Bot Token:</label>
          <input
            type="password"
            placeholder="Your Discord bot token"
            value={credentials.discord.botToken}
            onChange={(e) => updateCredential('discord', 'botToken', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Channel ID:</label>
          <input
            placeholder="Your channel ID"
            value={credentials.discord.channelId}
            onChange={(e) => updateCredential('discord', 'channelId', e.target.value)}
          />
        </div>
      </div>

      <button onClick={saveCredentials} className="save-btn">
        💾 Save All Credentials
      </button>

      <div className="help-section">
        <h3>📚 Where to get these credentials:</h3>
        <ul>
          <li><strong>OpenClaw:</strong> Run <code>openclaw config</code> to get your token</li>
          <li><strong>OpenAI:</strong> Get from platform.openai.com/api-keys</li>
          <li><strong>Telegram:</strong> Create bot at @BotFather, get token</li>
          <li><strong>Discord:</strong> Create app at discord.com/developers/applications</li>
        </ul>
      </div>
    </div>
  );
};