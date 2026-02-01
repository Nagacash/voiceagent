// User Integrations Page - Similar to what you showed, but for user's services
import React, { useState, useEffect } from 'react';

interface UserIntegration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastUsed?: string;
  credentials?: any;
}

export const UserIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<UserIntegration[]>([
    {
      id: 'openclaw',
      name: 'OpenClaw',
      status: 'disconnected',
      credentials: { endpoint: '', token: '' }
    },
    {
      id: 'openai',
      name: 'OpenAI',
      status: 'disconnected',
      credentials: { apiKey: '', model: 'gpt-3.5-turbo' }
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      status: 'disconnected',
      credentials: { botToken: '', chatId: '' }
    },
    {
      id: 'discord',
      name: 'Discord Bot',
      status: 'disconnected',
      credentials: { botToken: '', channelId: '' }
    },
    {
      id: 'claude',
      name: 'Claude (Anthropic)',
      status: 'disconnected',
      credentials: { apiKey: '' }
    }
  ]);

  const [showConfig, setShowConfig] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('agents');

  // Load saved integrations on mount
  useEffect(() => {
    const saved = localStorage.getItem('user-integrations');
    if (saved) {
      setIntegrations(JSON.parse(saved));
    }
  }, []);

  const saveIntegrations = (updated: UserIntegration[]) => {
    setIntegrations(updated);
    localStorage.setItem('user-integrations', JSON.stringify(updated));
  };

  const testConnection = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    
    try {
      // Test connection based on service
      if (integrationId === 'openclaw') {
        const response = await fetch(`${integration.credentials.endpoint}/health`);
        integration.status = response.ok ? 'connected' : 'error';
      } else if (integrationId === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${integration.credentials.apiKey}` }
        });
        integration.status = response.ok ? 'connected' : 'error';
      }
      // ... more tests
      
      integration.lastUsed = new Date().toISOString();
    } catch (error) {
      integration.status = 'error';
    }
    
    saveIntegrations([...integrations]);
  };

  const updateCredentials = (integrationId: string, credentials: any) => {
    const updated = integrations.map(i => 
      i.id === integrationId 
        ? { ...i, credentials, status: 'disconnected' }
        : i
    );
    saveIntegrations(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="user-integrations">
      <div className="integrations-header">
        <h1>🔗 My Integrations</h1>
        <p>Connect your external services and AI providers</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          🤖 AI Providers
        </button>
        <button 
          className={`tab ${activeTab === 'messaging' ? 'active' : ''}`}
          onClick={() => setActiveTab('messaging')}
        >
          📱 Messaging
        </button>
        <button 
          className={`tab ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          ⚡ Automation
        </button>
      </div>

      {activeTab === 'agents' && (
        <div className="integrations-grid">
          {integrations.filter(i => ['openai', 'claude', 'openclaw'].includes(i.id)).map(integration => (
            <div key={integration.id} className="integration-card">
              <div className="integration-header">
                <h3>{integration.name}</h3>
                <span className={`status ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
              </div>
              
              {integration.status === 'connected' && integration.lastUsed && (
                <p className="last-used">Last used: {new Date(integration.lastUsed).toLocaleDateString()}</p>
              )}

              {showConfig === integration.id ? (
                <IntegrationConfig 
                  integration={integration}
                  onSave={(creds) => updateCredentials(integration.id, creds)}
                  onCancel={() => setShowConfig(null)}
                />
              ) : (
                <div className="integration-actions">
                  {integration.status === 'connected' ? (
                    <>
                      <button className="btn-primary">Use</button>
                      <button onClick={() => setShowConfig(integration.id)}>Configure</button>
                      <button className="btn-danger">Disconnect</button>
                    </>
                  ) : (
                    <button onClick={() => setShowConfig(integration.id)} className="btn-primary">
                      Connect
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'messaging' && (
        <div className="integrations-grid">
          {integrations.filter(i => ['telegram', 'discord'].includes(i.id)).map(integration => (
            <div key={integration.id} className="integration-card">
              <div className="integration-header">
                <h3>{integration.name}</h3>
                <span className={`status ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
              </div>
              
              <div className="integration-actions">
                {integration.status === 'connected' ? (
                  <>
                    <button className="btn-primary">Send Test Message</button>
                    <button onClick={() => setShowConfig(integration.id)}>Configure</button>
                  </>
                ) : (
                  <button onClick={() => setShowConfig(integration.id)} className="btn-primary">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <div className="security-notice">
        <h3>🔒 Security & Privacy</h3>
        <ul>
          <li>All credentials are stored locally in your browser</li>
          <li>Your API keys never leave your device</li>
          <li>We cannot access or reset your credentials</li>
          <li>Each integration communicates directly with the service</li>
        </ul>
      </div>
    </div>
  );
};

// Configuration component for each integration
const IntegrationConfig: React.FC<{
  integration: UserIntegration;
  onSave: (credentials: any) => void;
  onCancel: () => void;
}> = ({ integration, onSave, onCancel }) => {
  const [credentials, setCredentials] = useState(integration.credentials || {});

  const renderFields = () => {
    switch (integration.id) {
      case 'openclaw':
        return (
          <>
            <input
              placeholder="Endpoint URL"
              value={credentials.endpoint || ''}
              onChange={(e) => setCredentials({ ...credentials, endpoint: e.target.value })}
            />
            <input
              type="password"
              placeholder="Auth Token"
              value={credentials.token || ''}
              onChange={(e) => setCredentials({ ...credentials, token: e.target.value })}
            />
          </>
        );
      case 'openai':
        return (
          <>
            <input
              type="password"
              placeholder="API Key (sk-...)"
              value={credentials.apiKey || ''}
              onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
            />
            <select
              value={credentials.model || 'gpt-3.5-turbo'}
              onChange={(e) => setCredentials({ ...credentials, model: e.target.value })}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </>
        );
      case 'telegram':
        return (
          <>
            <input
              type="password"
              placeholder="Bot Token"
              value={credentials.botToken || ''}
              onChange={(e) => setCredentials({ ...credentials, botToken: e.target.value })}
            />
            <input
              placeholder="Chat ID (@username or number)"
              value={credentials.chatId || ''}
              onChange={(e) => setCredentials({ ...credentials, chatId: e.target.value })}
            />
          </>
        );
      default:
        return (
          <input
            type="password"
            placeholder="API Key"
            value={credentials.apiKey || ''}
            onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
          />
        );
    }
  };

  return (
    <div className="integration-config">
      <div className="config-fields">
        {renderFields()}
      </div>
      <div className="config-actions">
        <button onClick={() => onSave(credentials)}>Save</button>
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
};