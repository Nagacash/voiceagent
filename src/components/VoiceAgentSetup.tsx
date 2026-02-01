// React component for users to configure their own integrations
import React, { useState } from 'react';
import { VoiceAgent, UserIntegrations } from '../lib/voice-agent';

export const VoiceAgentSetup: React.FC = () => {
  const [integrations, setIntegrations] = useState<UserIntegrations>({});
  const [voiceAgent, setVoiceAgent] = useState<VoiceAgent | null>(null);

  const handleConfigUpdate = (service: keyof UserIntegrations, config: any) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: config
    }));
  };

  const initializeAgent = () => {
    const agent = new VoiceAgent(integrations);
    setVoiceAgent(agent);
  };

  return (
    <div className="voice-agent-setup">
      <h2>Configure Your Voice Agent</h2>
      
      {/* OpenClaw Configuration */}
      <div className="config-section">
        <h3>OpenClaw Instance</h3>
        <input
          placeholder="OpenClaw Endpoint"
          onChange={(e) => handleConfigUpdate('openclaw', { 
            ...integrations.openclaw, 
            endpoint: e.target.value 
          })}
        />
        <input
          type="password"
          placeholder="OpenClaw Token"
          onChange={(e) => handleConfigUpdate('openclaw', { 
            ...integrations.openclaw, 
            token: e.target.value 
          })}
        />
      </div>

      {/* OpenAI Configuration */}
      <div className="config-section">
        <h3>OpenAI</h3>
        <input
          type="password"
          placeholder="OpenAI API Key"
          onChange={(e) => handleConfigUpdate('openai', { 
            apiKey: e.target.value 
          })}
        />
      </div>

      {/* Telegram Configuration */}
      <div className="config-section">
        <h3>Telegram Bot</h3>
        <input
          type="password"
          placeholder="Bot Token"
          onChange={(e) => handleConfigUpdate('telegram', { 
            ...integrations.telegram, 
            botToken: e.target.value 
          })}
        />
      </div>

      <button onClick={initializeAgent}>
        Initialize Voice Agent
      </button>

      {voiceAgent && (
        <div className="agent-ready">
          <p>✅ Voice Agent ready with your integrations!</p>
          <p>Your API keys are stored locally and never sent to our servers.</p>
        </div>
      )}
    </div>
  );
};