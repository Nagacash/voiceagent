
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Mic2, 
  Settings, 
  LogOut, 
  Plus, 
  Code2, 
  Trash2, 
  ChevronRight,
  Puzzle,
  Copy,
  Check,
  Smartphone,
  Globe,
  AlertTriangle,
  X,
  Link,
  Database,
  Cloud,
  ExternalLink,
  Zap,
  MessageSquare,
  Webhook,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSession, VoiceAgent } from '../types';
import { AgentEditor } from './AgentEditor';

interface DashboardProps {
  session: UserSession;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ session, onLogout }) => {
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'integrations'>('overview');
  const [isCreating, setIsCreating] = useState(false);
  const [editingAgent, setEditingAgent] = useState<VoiceAgent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<{ connected: boolean; sessions: number }>({ connected: false, sessions: 0 });

  // Fetch gateway status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/status');
        const data = await res.json();
        setGatewayStatus({ connected: data.connected, sessions: data.activeSessions || 0 });
      } catch {
        setGatewayStatus({ connected: false, sessions: 0 });
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`agents_${session.company.id}`);
    if (saved) setAgents(JSON.parse(saved));
  }, [session.company.id]);

  const saveAgents = (newAgents: VoiceAgent[]) => {
    localStorage.setItem(`agents_${session.company.id}`, JSON.stringify(newAgents));
    setAgents(newAgents);
  };

  const handleSaveAgent = (agentData: Partial<VoiceAgent>) => {
    if (editingAgent) {
      const updated = agents.map(a => a.id === editingAgent.id ? { ...a, ...agentData } : a);
      saveAgents(updated as VoiceAgent[]);
    } else {
      const newAgent: VoiceAgent = {
        id: Math.random().toString(36).substr(2, 9),
        companyId: session.company.id,
        name: agentData.name || 'Untitled Agent',
        systemPrompt: agentData.systemPrompt || '',
        knowledgeBase: agentData.knowledgeBase || '',
        connectedSources: agentData.connectedSources || [],
        voiceName: agentData.voiceName as any || 'Zephyr',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      saveAgents([...agents, newAgent]);
    }
    setIsCreating(false);
    setEditingAgent(null);
  };

  const confirmDeleteAgent = () => {
    if (deleteCandidateId) {
      saveAgents(agents.filter(a => a.id !== deleteCandidateId));
      setDeleteCandidateId(null);
    }
  };

  const copyEmbedCode = (agentId: string) => {
    const code = `<script src="https://voxsaas.ai/widget.js?key=${session.company.apiKey}&agent=${agentId}"></script>`;
    navigator.clipboard.writeText(code);
    setCopiedId(agentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(session.company.apiKey);
    setCopiedId('apikey');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyWebhookExample = () => {
    const example = `curl -X POST https://api.voxsaas.ai/v1/agents/${selectedAgent}/invoke \\
  -H "Authorization: Bearer ${session.company.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, how can I help?"}'`;
    navigator.clipboard.writeText(example);
    setCopiedId('webhook');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveWebhook = () => {
    if (webhookUrl) {
      setWebhookSaved(true);
      setTimeout(() => setWebhookSaved(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 fixed h-full bg-black z-20">
        <div className="flex items-center gap-2 mb-6 group cursor-pointer">
          <div className="w-8 h-8 bg-lime-400 rounded flex items-center justify-center transition-transform group-hover:rotate-12">
            <Mic2 className="text-black w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tighter">VoxSaaS</span>
        </div>
        
        {/* Gateway Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-6 text-xs font-heading font-bold ${
          gatewayStatus.connected 
            ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20' 
            : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
        }`}>
          <span className={`w-2 h-2 rounded-full ${gatewayStatus.connected ? 'bg-lime-400 animate-pulse' : 'bg-gray-500'}`} />
          {gatewayStatus.connected ? `Live (${gatewayStatus.sessions} sessions)` : 'Gateway Offline'}
        </div>

        <nav className="flex-1 space-y-1" role="navigation" aria-label="Main navigation">
          <button 
            onClick={() => { setActiveTab('overview'); setIsCreating(false); setEditingAgent(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl font-heading font-semibold transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none ${activeTab === 'overview' ? 'bg-white/5 text-lime-400 shadow-[0_0_20px_rgba(255,255,255,0.02)]' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl font-heading font-semibold transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none ${activeTab === 'integrations' ? 'bg-white/5 text-lime-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Puzzle className="w-5 h-5" /> Integrations
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-gray-400 hover:text-white rounded-xl font-heading font-semibold transition-colors cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-emerald-400 flex items-center justify-center text-black font-bold shadow-lg">
              {session.company.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-heading font-bold text-sm truncate">{session.company.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pro Account</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-red-400 hover:bg-red-500/10 rounded-xl font-heading font-bold transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        {isCreating || editingAgent ? (
          <AgentEditor 
            initialData={editingAgent || undefined}
            onSave={handleSaveAgent} 
            onCancel={() => { setIsCreating(false); setEditingAgent(null); }} 
          />
        ) : activeTab === 'overview' ? (
          <>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Voice Agents</h1>
                <p className="text-gray-400 font-body">Manage your intelligent voice fleet and MCP connectors.</p>
              </div>
              <button 
                onClick={() => setIsCreating(true)}
                className="px-6 py-3 min-h-[44px] bg-lime-400 text-black rounded-xl font-heading font-bold flex items-center gap-2 hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/20 active:scale-95 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                <Plus className="w-5 h-5" /> New Agent
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {agents.length === 0 ? (
                <div className="col-span-full py-24 glass rounded-[2.5rem] flex flex-col items-center text-center border-dashed border-2 border-white/10">
                  <div className="w-20 h-20 bg-lime-400/5 rounded-full flex items-center justify-center mb-6 border border-lime-400/20 shadow-[0_0_30px_rgba(163,230,53,0.05)]">
                    <Mic2 className="w-10 h-10 text-lime-400" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-3">Your agents are waiting...</h3>
                  <p className="text-gray-400 max-w-sm mb-8 font-body">Connect Google Drive, Notion, or Slack via MCP to build an agent that knows your business inside out.</p>
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="px-8 py-4 min-h-[44px] bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-heading font-bold flex items-center gap-2 border border-white/5 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none"
                  >
                    <Plus className="w-5 h-5" /> Start Building
                  </button>
                </div>
              ) : (
                agents.map(agent => (
                  <motion.div 
                    layout
                    key={agent.id} 
                    className="glass p-8 rounded-[2rem] border border-white/5 hover:border-lime-400/20 transition-all flex flex-col group relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-lime-400/5 cursor-pointer motion-reduce:transition-none"
                    tabIndex={0}
                    role="article"
                    aria-label={`Voice agent: ${agent.name}`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-lime-400/10 rounded-2xl flex items-center justify-center border border-lime-400/20 group-hover:scale-110 transition-transform duration-300">
                          <Mic2 className="text-lime-400 w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xl mb-1">{agent.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10 font-heading uppercase tracking-widest font-bold">Voice: {agent.voiceName}</span>
                            {(agent.connectedSources?.length || 0) > 0 && (
                              <span className="text-[10px] bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded border border-blue-400/20 font-heading uppercase tracking-widest font-bold flex items-center gap-1">
                                <Database className="w-2 h-2" /> {agent.connectedSources?.length} MCP Sources
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setDeleteCandidateId(agent.id)}
                        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none focus:opacity-100 rounded-lg motion-reduce:transition-none"
                        aria-label={`Delete agent ${agent.name}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-black/60 rounded-2xl p-5 mb-8 border border-white/5 flex-1 shadow-inner">
                       <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed italic font-body">
                        "{agent.systemPrompt || "No prompt configured yet..."}"
                       </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full border-2 border-black bg-lime-400 shadow-sm"></div>
                         <div className="w-6 h-6 rounded-full border-2 border-black bg-emerald-400 shadow-sm"></div>
                         {(agent.connectedSources?.length || 0) > 0 && (
                           // Correctly using the Cloud component after importing it
                           <div className="w-6 h-6 rounded-full border-2 border-black bg-blue-500 shadow-sm flex items-center justify-center">
                             <Cloud className="w-2.5 h-2.5 text-white" />
                           </div>
                         )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => copyEmbedCode(agent.id)}
                          className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-white/5 hover:bg-white/10 rounded-xl text-xs font-heading font-bold transition-all border border-white/5 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none"
                        >
                          {copiedId === agent.id ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Code2 className="w-3.5 h-3.5 text-gray-400" />}
                          {copiedId === agent.id ? 'Copied!' : 'Embed'}
                        </button>
                        <button 
                          onClick={() => setEditingAgent(agent)}
                          className="flex items-center gap-1 px-4 py-2 min-h-[44px] bg-lime-400 text-black rounded-xl text-xs font-heading font-bold hover:bg-lime-300 transition-all shadow-md shadow-lime-400/10 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none motion-reduce:transition-none"
                        >
                          Configure <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Integrations Tab */
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl font-heading font-bold mb-2">Integrations</h1>
                <p className="text-gray-400 font-body">Connect your agents to websites, apps, and external services.</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* API Key Section */}
              <div className="glass p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Key className="text-amber-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold">API Key</h3>
                    <p className="text-sm text-gray-400">Use this key to authenticate API requests</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-black/60 rounded-xl px-4 py-3 font-mono text-sm text-gray-300 border border-white/5">
                    {session.company.apiKey.slice(0, 8)}••••••••••••{session.company.apiKey.slice(-4)}
                  </div>
                  <button
                    onClick={copyApiKey}
                    className="px-5 py-3 min-h-[44px] bg-white/10 hover:bg-white/20 rounded-xl font-heading font-bold text-sm flex items-center gap-2 transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  >
                    {copiedId === 'apikey' ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
                    {copiedId === 'apikey' ? 'Copied!' : 'Copy Key'}
                  </button>
                </div>
              </div>

              {/* Web Widget Section */}
              <div className="glass p-8 rounded-3xl border border-lime-400/20 bg-lime-400/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Globe className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center">
                    <Globe className="text-black w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold">Web Widget</h3>
                    <p className="text-sm text-gray-400">Embed a floating voice button on any website</p>
                  </div>
                </div>

                {agents.length > 0 ? (
                  <div className="space-y-4 relative z-10">
                    <label htmlFor="widget-agent" className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest">Select Agent</label>
                    <select
                      id="widget-agent"
                      value={selectedAgent || ''}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] focus:ring-2 focus:ring-lime-400 focus:outline-none cursor-pointer"
                    >
                      <option value="">Choose an agent...</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                    
                    {selectedAgent && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                      >
                        <div className="relative group/code">
                          <div className="font-mono text-xs text-lime-400/80 bg-black/80 p-5 rounded-xl border border-white/5 overflow-x-auto">
                            {`<script src="https://voxsaas.ai/widget.js?key=${session.company.apiKey}&agent=${selectedAgent}"></script>`}
                          </div>
                          <button
                            onClick={() => copyEmbedCode(selectedAgent)}
                            className="absolute right-3 top-3 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none"
                            aria-label="Copy embed code"
                          >
                            {copiedId === selectedAgent ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Add this script before the closing <code className="text-lime-400/60">&lt;/body&gt;</code> tag</p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-500 mb-4">No agents created yet</p>
                    <button
                      onClick={() => { setActiveTab('overview'); setIsCreating(true); }}
                      className="px-5 py-2.5 min-h-[44px] bg-lime-400 text-black rounded-xl font-heading font-bold text-sm cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none"
                    >
                      Create Your First Agent
                    </button>
                  </div>
                )}
              </div>

              {/* REST API Section */}
              <div className="glass p-8 rounded-3xl border border-blue-400/20 bg-blue-400/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Zap className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Zap className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold">REST API</h3>
                    <p className="text-sm text-gray-400">Invoke agents programmatically from any backend</p>
                  </div>
                </div>

                {selectedAgent ? (
                  <div className="space-y-4 relative z-10">
                    <div className="relative group/code">
                      <pre className="font-mono text-xs text-blue-400/80 bg-black/80 p-5 rounded-xl border border-white/5 overflow-x-auto whitespace-pre">
{`curl -X POST https://api.voxsaas.ai/v1/agents/${selectedAgent}/invoke \\
  -H "Authorization: Bearer ${session.company.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, how can I help?"}'`}
                      </pre>
                      <button
                        onClick={copyWebhookExample}
                        className="absolute right-3 top-3 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none"
                        aria-label="Copy API example"
                      >
                        {copiedId === 'webhook' ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      View full API documentation <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Select an agent above to see API examples</p>
                )}
              </div>

              {/* Webhook Section */}
              <div className="glass p-8 rounded-3xl border border-purple-400/20 bg-purple-400/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Webhook className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Webhook className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold">Webhooks</h3>
                    <p className="text-sm text-gray-400">Get notified when conversations happen</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <label htmlFor="webhook-url" className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest">Webhook URL</label>
                  <div className="flex items-center gap-4">
                    <input
                      id="webhook-url"
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-server.com/webhook"
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                    <button
                      onClick={saveWebhook}
                      disabled={!webhookUrl}
                      className="px-5 py-3 min-h-[44px] bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-heading font-bold text-sm flex items-center gap-2 transition-all cursor-pointer focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    >
                      {webhookSaved ? <Check className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      {webhookSaved ? 'Saved!' : 'Save Webhook'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">We'll POST conversation data to this URL in real-time</p>
                </div>
              </div>

              {/* Coming Soon Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl border border-white/5 opacity-60">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold">Mobile SDK</h3>
                      <span className="text-[10px] font-heading font-bold text-amber-400 uppercase tracking-widest">Coming Soon</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Native iOS and Android SDKs for in-app voice experiences.</p>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 opacity-60">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Database className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold">MCP Connectors</h3>
                      <span className="text-[10px] font-heading font-bold text-amber-400 uppercase tracking-widest">Coming Soon</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Connect to Slack, Discord, and other MCP-compatible platforms.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteCandidateId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setDeleteCandidateId(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md glass rounded-[2.5rem] p-10 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] motion-reduce:transition-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-8 mx-auto shadow-inner">
                <AlertTriangle className="text-red-500 w-10 h-10" />
              </div>
              <h3 id="delete-modal-title" className="text-3xl font-heading font-bold text-center mb-3">Terminate Agent?</h3>
              <p className="text-gray-400 text-center mb-10 font-body leading-relaxed">
                You are about to delete <span className="text-white font-bold">"{agents.find(a => a.id === deleteCandidateId)?.name}"</span>. 
                All connected MCP sources and widget integrations will be permanently severed.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteCandidateId(null)}
                  className="flex-1 py-4 px-6 min-h-[44px] bg-white/5 hover:bg-white/10 rounded-2xl font-heading font-bold transition-all border border-white/5 text-sm cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none"
                >
                  Keep Agent
                </button>
                <button 
                  onClick={confirmDeleteAgent}
                  className="flex-1 py-4 px-6 min-h-[44px] bg-red-500 hover:bg-red-600 rounded-2xl font-heading font-bold transition-all text-white shadow-lg shadow-red-500/20 text-sm active:scale-95 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  Delete Permanently
                </button>
              </div>
              <button 
                onClick={() => setDeleteCandidateId(null)}
                className="absolute top-8 right-8 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none rounded-lg motion-reduce:transition-none"
                aria-label="Close dialog"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
