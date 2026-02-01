// Enhanced Integrations Page - Add user integrations to your existing page
import React, { useState } from 'react';

// Your existing integrations (backend)
const backendIntegrations = [
  {
    id: 'api-key',
    name: 'API Key',
    description: 'Use this key to authenticate API requests',
    key: 'vox_9f0i••••••••••••3hdj',
    type: 'backend'
  },
  {
    id: 'web-widget',
    name: 'Web Widget',
    description: 'Embed a floating voice button on any website',
    type: 'backend'
  },
  {
    id: 'rest-api',
    name: 'REST API',
    description: 'Invoke agents programmatically from any backend',
    type: 'backend'
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Get notified when conversations happen',
    type: 'backend'
  },
  {
    id: 'mobile-sdk',
    name: 'Mobile SDK',
    description: 'Native iOS and Android SDKs',
    status: 'coming-soon',
    type: 'backend'
  },
  {
    id: 'mcp-connectors',
    name: 'MCP Connectors',
    status: 'coming-soon',
    type: 'backend'
  }
];

// User integrations (external services)
const userIntegrations = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Connect your OpenAI account for AI responses',
    icon: '🤖',
    status: 'disconnected',
    type: 'user'
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    description: 'Connect your OpenClaw instance for automation',
    icon: '🦞',
    status: 'disconnected',
    type: 'user'
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    description: 'Connect your Telegram bot for messaging',
    icon: '📱',
    status: 'disconnected',
    type: 'user'
  },
  {
    id: 'discord',
    name: 'Discord Bot',
    description: 'Connect your Discord bot for server integration',
    icon: '🎮',
    status: 'disconnected',
    type: 'user'
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    description: 'Connect your Claude account for AI responses',
    icon: '🧠',
    status: 'disconnected',
    type: 'user'
  }
];

export const IntegrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'platform' | 'external'>('platform');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const renderBackendIntegration = (integration: any) => {
    switch (integration.id) {
      case 'api-key':
        return (
          <div className="integration-content">
            <div className="api-key-display">
              <code>{integration.key}</code>
              <button className="copy-btn">📋 Copy Key</button>
            </div>
          </div>
        );
      
      case 'web-widget':
        return (
          <div className="integration-content">
            <button className="btn-primary">Get Widget Code</button>
          </div>
        );
      
      case 'rest-api':
        return (
          <div className="integration-content">
            <p className="info-text">Select an agent above to see API examples</p>
          </div>
        );
      
      case 'webhooks':
        return (
          <div className="integration-content">
            <div className="webhook-config">
              <input 
                type="url" 
                placeholder="https://your-server.com/webhook" 
                defaultValue="https://your-server.com/webhook"
              />
              <button className="btn-primary">Save Webhook</button>
            </div>
            <p className="help-text">We'll POST conversation data to this URL in real-time</p>
          </div>
        );
      
      default:
        return (
          <div className="integration-content">
            <span className="coming-soon">Coming Soon</span>
          </div>
        );
    }
  };

  const renderUserIntegration = (integration: any) => {
    const configTemplates: Record<string, any> = {
      openai: {
        provider: 'openai',
        apiKey: 'YOUR_OPENAI_API_KEY',
        model: 'gpt-3.5-turbo'
      },
      openclaw: {
        provider: 'openclaw',
        endpoint: 'http://127.0.0.1:18789',
        token: 'YOUR_OPENCLAW_TOKEN'
      },
      telegram: {
        provider: 'telegram',
        botToken: 'YOUR_TELEGRAM_BOT_TOKEN',
        chatId: 'YOUR_CHAT_ID'
      }
    };

    const config = configTemplates[integration.id] || {};
    const configJson = JSON.stringify(config, null, 2);

    return (
      <div className="user-integration-content">
        {integration.status === 'disconnected' ? (
          <>
            <div className="setup-steps">
              <h5>🔑 Setup Steps:</h5>
              <ol>
                <li>Copy the configuration template below</li>
                <li>Replace placeholder values with your actual credentials</li>
                <li>Upload the completed configuration file</li>
              </ol>
            </div>
            
            <div className="config-template">
              <h5>⚙️ Configuration Template:</h5>
              <pre>{configJson}</pre>
            </div>
            
            <div className="config-actions">
              <button 
                onClick={() => navigator.clipboard.writeText(configJson)}
                className="btn-secondary"
              >
                📋 Copy Template
              </button>
              <button 
                onClick={() => {
                  const blob = new Blob([configJson], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${integration.id}-config.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="btn-secondary"
              >
                💾 Download
              </button>
            </div>
            
            <div className="config-upload">
              <h5>📤 Upload Completed Config:</h5>
              <input 
                type="file" 
                accept=".json"
                id={`${integration.id}-upload`}
                style={{ display: 'none' }}
              />
              <label htmlFor={`${integration.id}-upload`} className="upload-btn">
                📁 Choose File
              </label>
            </div>
          </>
        ) : (
          <div className="connected-status">
            <span className="status-indicator connected"></span>
            <p>✅ Connected</p>
            <button className="btn-secondary">Configure</button>
            <button className="btn-danger">Disconnect</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="integrations-page">
      <div className="page-header">
        <h1>Integrations</h1>
        <p>Connect your agents to websites, apps, and external services.</p>
      </div>

      <div className="integration-tabs">
        <button 
          className={`tab ${activeTab === 'platform' ? 'active' : ''}`}
          onClick={() => setActiveTab('platform')}
        >
          🏢 Platform Integrations
        </button>
        <button 
          className={`tab ${activeTab === 'external' ? 'active' : ''}`}
          onClick={() => setActiveTab('external')}
        >
          🔗 My External Services
        </button>
      </div>

      {activeTab === 'platform' && (
        <div className="integrations-grid">
          {backendIntegrations.map(integration => (
            <div key={integration.id} className="integration-card">
              <div className="integration-header">
                <h3>{integration.name}</h3>
                {integration.status === 'coming-soon' && (
                  <span className="badge coming-soon">Coming Soon</span>
                )}
              </div>
              <p className="integration-description">{integration.description}</p>
              {renderBackendIntegration(integration)}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'external' && (
        <div className="external-integrations">
          <div className="security-notice">
            <h3>🔒 Security & Privacy</h3>
            <ul>
              <li>All credentials are stored locally in your browser</li>
              <li>Your API keys never leave your device</li>
              <li>We cannot access or reset your credentials</li>
              <li>Each integration communicates directly with the service</li>
            </ul>
          </div>

          <div className="integrations-grid">
            {userIntegrations.map(integration => (
              <div key={integration.id} className="integration-card user-integration">
                <div className="integration-header">
                  <h3>{integration.icon} {integration.name}</h3>
                  <span className={`status-indicator ${integration.status}`}></span>
                </div>
                <p className="integration-description">{integration.description}</p>
                {selectedIntegration === integration.id ? (
                  renderUserIntegration(integration)
                ) : (
                  <button 
                    onClick={() => setSelectedIntegration(integration.id)}
                    className="btn-primary"
                  >
                    {integration.status === 'disconnected' ? '🔧 Connect' : '⚙️ Manage'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};