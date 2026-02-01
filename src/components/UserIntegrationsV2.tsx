// Updated User Integrations - No direct credential input, only copy/export
import React, { useState } from 'react';

interface UserIntegration {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'needs_setup';
  config: any;
}

export const UserIntegrations: React.FC = () => {
  const [integrations] = useState<UserIntegration[]>([
    {
      id: 'openai',
      name: 'OpenAI',
      status: 'needs_setup',
      config: { apiKey: '', model: 'gpt-3.5-turbo' }
    },
    {
      id: 'openclaw',
      name: 'OpenClaw',
      status: 'needs_setup',
      config: { endpoint: '', token: '' }
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      status: 'needs_setup',
      config: { botToken: '', chatId: '' }
    }
  ]);

  const [showInstructions, setShowInstructions] = useState<string | null>(null);

  // Generate secure config for user to copy
  const generateConfig = (integrationId: string) => {
    const configs: Record<string, any> = {
      openai: {
        provider: 'openai',
        apiKey: 'YOUR_OPENAI_API_KEY',
        model: 'gpt-3.5-turbo',
        baseUrl: 'https://api.openai.com/v1'
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

    return JSON.stringify(configs[integrationId], null, 2);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    // Show toast notification
    alert('Configuration copied to clipboard!');
  };

  const downloadConfig = (integrationId: string) => {
    const config = generateConfig(integrationId);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${integrationId}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="user-integrations">
      <div className="integrations-header">
        <h1>🔗 Integration Setup</h1>
        <p>Configure your external services to work with Voice Agent</p>
      </div>

      <div className="integrations-grid">
        {integrations.map(integration => (
          <div key={integration.id} className="integration-card">
            <div className="integration-header">
              <h3>{integration.name}</h3>
              <span className={`status status-${integration.status}`}>
                {integration.status === 'needs_setup' ? '⚠️ Needs Setup' : 
                 integration.status === 'active' ? '✅ Active' : '❌ Inactive'}
              </span>
            </div>

            {integration.status === 'needs_setup' ? (
              <div className="setup-actions">
                <button 
                  onClick={() => setShowInstructions(integration.id)}
                  className="btn-primary"
                >
                  📋 Setup Instructions
                </button>
              </div>
            ) : (
              <div className="active-actions">
                <button className="btn-primary">🔄 Refresh</button>
                <button>⚙️ Manage</button>
              </div>
            )}

            {showInstructions === integration.id && (
              <IntegrationInstructions
                integration={integration}
                onCopy={() => copyToClipboard(generateConfig(integration.id))}
                onDownload={() => downloadConfig(integration.id)}
                onClose={() => setShowInstructions(null)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="security-info">
        <h3>🔒 How Integration Works</h3>
        <div className="security-flow">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Copy Configuration</strong>
              <p>Get your integration config template</p>
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Add Your Credentials</strong>
              <p>Replace placeholder values with your actual API keys</p>
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Import Config</strong>
              <p>Upload the completed config to activate integration</p>
            </div>
          </div>
        </div>
        <ul className="security-points">
          <li>✅ Your API keys never leave your device</li>
          <li>✅ We never see or store your credentials</li>
          <li>✅ Direct communication with external services</li>
          <li>✅ Zero liability for usage and costs</li>
        </ul>
      </div>
    </div>
  );
};

// Instructions for each integration
const IntegrationInstructions: React.FC<{
  integration: UserIntegration;
  onCopy: () => void;
  onDownload: () => void;
  onClose: () => void;
}> = ({ integration, onCopy, onDownload, onClose }) => {
  const renderInstructions = () => {
    switch (integration.id) {
      case 'openai':
        return {
          steps: [
            'Visit platform.openai.com/api-keys',
            'Create a new API key',
            'Copy the key (starts with sk-)',
            'Replace YOUR_OPENAI_API_KEY in the config'
          ],
          configExample: {
            provider: 'openai',
            apiKey: 'sk-your-actual-api-key-here',
            model: 'gpt-3.5-turbo',
            baseUrl: 'https://api.openai.com/v1'
          }
        };
      case 'openclaw':
        return {
          steps: [
            'Run `openclaw config` in your terminal',
            'Copy the generated token',
            'Replace YOUR_OPENCLAW_TOKEN in the config',
            'Ensure your OpenClaw instance is running'
          ],
          configExample: {
            provider: 'openclaw',
            endpoint: 'http://127.0.0.1:18789',
            token: 'your-actual-openclaw-token-here'
          }
        };
      case 'telegram':
        return {
          steps: [
            'Message @BotFather on Telegram',
            'Type /newbot to create a bot',
            'Copy the bot token provided',
            'Get your chat ID from @userinfobot',
            'Replace both values in the config'
          ],
          configExample: {
            provider: 'telegram',
            botToken: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
            chatId: '@your_username_or_chat_id'
          }
        };
      default:
        return { steps: [], configExample: {} };
    }
  };

  const { steps, configExample } = renderInstructions();

  return (
    <div className="integration-instructions">
      <div className="instructions-header">
        <h4>📋 {integration.name} Setup</h4>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="instructions-content">
        <div className="steps-section">
          <h5>🔑 Get Your Credentials:</h5>
          <ol>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="config-section">
          <h5>⚙️ Configuration Template:</h5>
          <pre className="config-template">
            {JSON.stringify(configExample, null, 2)}
          </pre>
          
          <div className="config-actions">
            <button onClick={onCopy} className="btn-secondary">
              📋 Copy Template
            </button>
            <button onClick={onDownload} className="btn-secondary">
              💾 Download JSON
            </button>
          </div>
        </div>

        <div className="import-section">
          <h5>📤 After adding your credentials:</h5>
          <div className="import-area">
            <input 
              type="file" 
              accept=".json"
              id="config-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="config-upload" className="upload-btn">
              📁 Upload Completed Config
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};