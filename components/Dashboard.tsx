
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
  Cloud
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

  return (
    <div className="flex min-h-screen bg-black text-white font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 fixed h-full bg-black z-20">
        <div className="flex items-center gap-2 mb-10 group cursor-pointer">
          <div className="w-8 h-8 bg-lime-400 rounded flex items-center justify-center transition-transform group-hover:rotate-12">
            <Mic2 className="text-black w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tighter">VoxSaaS</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => { setActiveTab('overview'); setIsCreating(false); setEditingAgent(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-semibold transition-all ${activeTab === 'overview' ? 'bg-white/5 text-lime-400 shadow-[0_0_20px_rgba(255,255,255,0.02)]' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-semibold transition-all ${activeTab === 'integrations' ? 'bg-white/5 text-lime-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Puzzle className="w-5 h-5" /> Integrations
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-xl font-heading font-semibold transition-colors">
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
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-heading font-bold transition-all"
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
                className="px-6 py-3 bg-lime-400 text-black rounded-xl font-heading font-bold flex items-center gap-2 hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/20 active:scale-95"
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
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-heading font-bold flex items-center gap-2 border border-white/5"
                  >
                    <Plus className="w-5 h-5" /> Start Building
                  </button>
                </div>
              ) : (
                agents.map(agent => (
                  <motion.div 
                    layout
                    key={agent.id} 
                    className="glass p-8 rounded-[2rem] border border-white/5 hover:border-lime-400/20 transition-all flex flex-col group relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-lime-400/5"
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
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Agent"
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
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-heading font-bold transition-all border border-white/5"
                        >
                          {copiedId === agent.id ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Code2 className="w-3.5 h-3.5 text-gray-400" />}
                          {copiedId === agent.id ? 'Copied!' : 'Embed'}
                        </button>
                        <button 
                          onClick={() => setEditingAgent(agent)}
                          className="flex items-center gap-1 px-4 py-2 bg-lime-400 text-black rounded-xl text-xs font-heading font-bold hover:bg-lime-300 transition-all shadow-md shadow-lime-400/10"
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-heading font-bold mb-2">Connectors</h1>
            <p className="text-gray-400 mb-10 font-body">Sync data from external platforms to your agents.</p>
            
            <div className="space-y-6">
              <div className="glass p-10 rounded-[2.5rem] border border-lime-400/20 bg-lime-400/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Globe className="w-32 h-32" />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-lime-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-lime-400/30">
                      <Globe className="text-black w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-heading font-bold">Web Script Widget</h3>
                      <p className="text-gray-400 font-body">A high-performance floating button for any website.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  {agents.length > 0 ? (
                    agents.map(agent => (
                      <div key={agent.id} className="p-8 bg-black/60 rounded-[2rem] border border-white/10 group hover:border-lime-400/30 transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-heading font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)] animate-pulse"></span>
                            {agent.name}
                          </h4>
                          <button 
                            onClick={() => copyEmbedCode(agent.id)}
                            className="text-[10px] font-heading font-bold text-lime-400 uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all"
                          >
                            {copiedId === agent.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedId === agent.id ? 'Copied to Clipboard' : 'Copy Embed Code'}
                          </button>
                        </div>
                        <div className="relative group/code">
                          <div className="font-mono text-xs text-lime-400/70 bg-black/80 p-6 rounded-2xl border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                            {`<script src="https://voxsaas.ai/widget.js?key=${session.company.apiKey}&agent=${agent.id}"></script>`}
                          </div>
                          <button 
                            onClick={() => copyEmbedCode(agent.id)}
                            className="absolute right-4 top-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white opacity-0 group-hover/code:opacity-100 transition-all duration-200 border border-white/10"
                            title="Copy to clipboard"
                          >
                            {copiedId === agent.id ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-gray-500 border border-dashed border-white/10 rounded-3xl">
                      No active agents found.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-[2.5rem] opacity-40 border border-white/5 grayscale pointer-events-none transition-all group overflow-hidden relative">
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                       <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">Mobile SDK</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed font-body">Embed native voice interfaces directly into iOS and Android apps with 0ms latency.</p>
                  <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-heading font-bold tracking-widest text-gray-400 uppercase border border-white/5">Development Phase</span>
                </div>
                
                <div className="glass p-10 rounded-[2.5rem] border border-white/5 opacity-40 grayscale pointer-events-none transition-all group overflow-hidden relative">
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                       <Database className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">MCP API Hub</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed font-body">Connect to any Model Context Protocol server to extend your agent's knowledge in real-time.</p>
                  <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-heading font-bold tracking-widest text-gray-400 uppercase border border-white/5">Alpha Testing</span>
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
              className="relative w-full max-w-md glass rounded-[2.5rem] p-10 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-8 mx-auto shadow-inner">
                <AlertTriangle className="text-red-500 w-10 h-10" />
              </div>
              <h3 className="text-3xl font-heading font-bold text-center mb-3">Terminate Agent?</h3>
              <p className="text-gray-400 text-center mb-10 font-body leading-relaxed">
                You are about to delete <span className="text-white font-bold">"{agents.find(a => a.id === deleteCandidateId)?.name}"</span>. 
                All connected MCP sources and widget integrations will be permanently severed.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteCandidateId(null)}
                  className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl font-heading font-bold transition-all border border-white/5 text-sm"
                >
                  Keep Agent
                </button>
                <button 
                  onClick={confirmDeleteAgent}
                  className="flex-1 py-4 px-6 bg-red-500 hover:bg-red-600 rounded-2xl font-heading font-bold transition-all text-white shadow-lg shadow-red-500/20 text-sm active:scale-95"
                >
                  Delete Permanently
                </button>
              </div>
              <button 
                onClick={() => setDeleteCandidateId(null)}
                className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-colors"
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
