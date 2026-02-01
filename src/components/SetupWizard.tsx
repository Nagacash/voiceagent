// Step-by-step wizard for non-technical users
import React, { useState } from 'react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'password' | 'url' | 'select';
    placeholder?: string;
    options?: string[];
    help?: string;
  }>;
}

const setupSteps: SetupStep[] = [
  {
    id: 'openclaw',
    title: '🦞 OpenClaw Setup',
    description: 'Connect your OpenClaw instance for advanced automation',
    fields: [
      {
        name: 'endpoint',
        label: 'OpenClaw URL',
        type: 'url',
        placeholder: 'http://127.0.0.1:18789',
        help: 'Usually http://127.0.0.1:18789 if running locally'
      },
      {
        name: 'token',
        label: 'Auth Token',
        type: 'password',
        placeholder: 'Your OpenClaw token',
        help: 'Run "openclaw config" to get your token'
      }
    ]
  },
  {
    id: 'ai',
    title: '🤖 AI Provider',
    description: 'Choose your preferred AI service',
    fields: [
      {
        name: 'provider',
        label: 'AI Service',
        type: 'select',
        options: ['OpenAI', 'Claude', 'Local Model', 'OpenClaw']
      },
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'Your API key',
        help: 'Get this from your AI provider\'s dashboard'
      }
    ]
  },
  {
    id: 'messaging',
    title: '📱 Messaging Apps',
    description: 'Connect messaging services (optional)',
    fields: [
      {
        name: 'telegram',
        label: 'Telegram Bot Token',
        type: 'password',
        placeholder: '123456:ABC-DEF...',
        help: 'Create a bot at @BotFather on Telegram'
      },
      {
        name: 'discord',
        label: 'Discord Bot Token',
        type: 'password',
        placeholder: 'Your Discord bot token',
        help: 'Create an app at discord.com/developers'
      }
    ]
  }
];

export const SetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userConfig, setUserConfig] = useState<Record<string, any>>({});

  const nextStep = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateConfig = (field: string, value: string) => {
    setUserConfig(prev => ({
      ...prev,
      [setupSteps[currentStep].id]: {
        ...prev[setupSteps[currentStep].id],
        [field]: value
      }
    }));
  };

  const completeSetup = () => {
    // Save to localStorage
    localStorage.setItem('voice-agent-config', JSON.stringify(userConfig));
    alert('✅ Setup complete! Your credentials are saved locally.');
  };

  const step = setupSteps[currentStep];

  return (
    <div className="setup-wizard">
      <div className="progress-bar">
        {setupSteps.map((_, index) => (
          <div
            key={index}
            className={`progress-step ${index <= currentStep ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="setup-content">
        <h2>{step.title}</h2>
        <p>{step.description}</p>

        <div className="form-fields">
          {step.fields.map((field) => (
            <div key={field.name} className="field-group">
              <label>{field.label}</label>
              {field.type === 'select' ? (
                <select
                  onChange={(e) => updateConfig(field.name, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Choose...</option>
                  {field.options?.map(option => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={(e) => updateConfig(field.name, e.target.value)}
                />
              )}
              {field.help && <small className="help-text">{field.help}</small>}
            </div>
          ))}
        </div>

        <div className="wizard-buttons">
          <button onClick={prevStep} disabled={currentStep === 0}>
            ← Back
          </button>
          
          {currentStep === setupSteps.length - 1 ? (
            <button onClick={completeSetup} className="complete-btn">
              ✅ Complete Setup
            </button>
          ) : (
            <button onClick={nextStep}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};