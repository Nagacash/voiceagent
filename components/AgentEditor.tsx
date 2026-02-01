
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  Save, 
  Info, 
  Sparkles, 
  Volume2, 
  UserCircle, 
  BookOpen, 
  FileText,
  Database,
  Link,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceAgent, ConnectedSource } from '../types';
import { VoiceService } from '../services/gemini';

interface AgentEditorProps {
  initialData?: VoiceAgent;
  onSave: (agent: Partial<VoiceAgent>) => void;
  onCancel: () => void;
}

// Mock Data for MCP Simulations
const MOCK_DRIVE_FILES = [
  { id: '1', name: 'Product_Specs_2025.pdf', content: 'Our 2025 product line includes high-efficiency heat pumps and solar-integrated HVAC systems.' },
  { id: '2', name: 'Customer_Support_FAQ.docx', content: 'Q: What is the return policy? A: 30 days for unopened items. Q: Do you ship internationally? A: Yes, to over 50 countries.' }
];

const MOCK_NOTION_PAGES = [
  { id: 'n1', name: 'Company Handbook', content: 'Founded in 2022, VoxSaaS aims to democratize voice AI. Our core values are transparency and speed.' },
  { id: 'n2', name: 'Technical Roadmap', content: 'Q3 Goal: Multi-lingual voice support. Q4 Goal: Sentiment-aware speech synthesis.' }
];

export const AgentEditor: React.FC<AgentEditorProps> = ({ initialData, onSave, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [prompt, setPrompt] = useState(initialData?.systemPrompt || '');
  const [knowledge, setKnowledge] = useState(initialData?.knowledgeBase || '');
  const [voice, setVoice] = useState<VoiceAgent['voiceName']>(initialData?.voiceName || 'Zephyr');
  const [connectedSources, setConnectedSources] = useState<ConnectedSource[]>(initialData?.connectedSources || []);
  const [isTesting, setIsTesting] = useState(false);
  const [isImporting, setIsImporting] = useState<'drive' | 'notion' | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [voiceService] = useState(() => new VoiceService());

  const voices: VoiceAgent['voiceName'][] = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];

  const toggleTest = async () => {
    if (isTesting) {
      await voiceService.stopSession();
      setIsTesting(false);
    } else {
      setIsTesting(true);
      try {
        const fullInstruction = `
          ${prompt}
          
          USE THE FOLLOWING KNOWLEDGE BASE TO ANSWER QUESTIONS:
          ${knowledge}
          
          Strictly follow the persona and use the knowledge provided.
        `;
        await voiceService.startSession({
          systemInstruction: fullInstruction || "You are a helpful assistant.",
          voiceName: voice
        }, () => {
          // Model interrupted
        });
      } catch (err) {
        console.error(err);
        setIsTesting(false);
        alert('Failed to start voice session. Check your API key.');
      }
    }
  };

  const handleImport = (type: 'drive' | 'notion', sourceName: string, content: string) => {
    setSyncingId(sourceName);
    setTimeout(() => {
      const newSource: ConnectedSource = {
        id: Math.random().toString(36).substr(2, 9),
        type: type === 'drive' ? 'google-drive' : 'notion',
        name: sourceName,
        lastSynced: new Date().toISOString()
      };
      
      setConnectedSources([...connectedSources, newSource]);
      setKnowledge(prev => (prev ? prev + '\n\n' + content : content));
      setSyncingId(null);
      setIsImporting(null);
    }, 1500);
  };

  const removeSource = (id: string) => {
    setConnectedSources(connectedSources.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 font-body">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-heading font-semibold">Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onSave({ name, systemPrompt: prompt, knowledgeBase: knowledge, voiceName: voice, connectedSources })}
            className="px-6 py-3 bg-lime-400 text-black rounded-xl font-heading font-bold flex items-center gap-2 shadow-lg shadow-lime-400/20 hover:bg-lime-300 transition-all"
          >
            <Save className="w-5 h-5" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-8 space-y-8">
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <Info className="text-lime-400 w-5 h-5" /> Agent Identity
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Agent Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-lime-400 outline-none font-body transition-all"
                  placeholder="e.g. Support Specialist"
                />
              </div>
            </div>
          </section>

          <section className="glass rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-lime-400 w-5 h-5" /> Persona & System Prompt
            </h3>
            <div>
              <label className="text-sm font-medium text-gray-400 block mb-2 font-heading uppercase tracking-widest text-[10px] font-bold">System Instructions</label>
              <textarea 
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-lime-400 outline-none resize-none text-sm leading-relaxed font-body"
                placeholder="Act as a friendly concierge..."
              />
            </div>
          </section>

          <section className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                <BookOpen className="text-lime-400 w-5 h-5" /> Knowledge Base
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-lime-400/10 text-lime-400 px-2 py-1 rounded-md font-bold font-heading uppercase tracking-tighter border border-lime-400/20">Active Intelligence</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={() => setIsImporting('drive')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm font-bold transition-all group"
                >
                  <Cloud className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  Connect Google Drive
                </button>
                <button 
                  onClick={() => setIsImporting('notion')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm font-bold transition-all group"
                >
                  <Database className="w-4 h-4 text-gray-100 group-hover:scale-110 transition-transform" />
                  Connect Notion
                </button>
              </div>

              {connectedSources.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {connectedSources.map(source => (
                    <div key={source.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${source.type === 'google-drive' ? 'bg-blue-400/10' : 'bg-gray-400/10'}`}>
                          {source.type === 'google-drive' ? <Cloud className="w-3 h-3 text-blue-400" /> : <Database className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold truncate max-w-[120px]">{source.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-heading">Synced {new Date(source.lastSynced).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeSource(source.id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2 font-heading uppercase tracking-widest text-[10px] font-bold">Raw Knowledge Context</label>
                <div className="relative">
                  <textarea 
                    rows={8}
                    value={knowledge}
                    onChange={(e) => setKnowledge(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-lime-400 outline-none resize-none text-sm font-mono leading-relaxed"
                    placeholder="Product details, pricing, FAQs..."
                  />
                  <div className="absolute top-3 right-3 opacity-20 pointer-events-none">
                    <FileText className="w-8 h-8 text-lime-400" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Voice & Testing */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass rounded-3xl p-8 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <Volume2 className="text-lime-400 w-5 h-5" /> Voice Palette
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {voices.map(v => (
                <button 
                  key={v}
                  onClick={() => setVoice(v)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    voice === v 
                    ? 'bg-lime-400/10 border-lime-400 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.1)]' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-5 h-5" />
                    <span className="font-heading font-semibold">{v}</span>
                  </div>
                  {voice === v && (
                    <motion.div 
                      layoutId="active-voice"
                      className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" 
                    />
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-8 border border-lime-400/30 bg-lime-400/5 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-heading font-bold mb-2">Live Lab</h3>
              <p className="text-sm text-lime-400/60 mb-6 leading-relaxed">Instantly verify your knowledge sources and agent persona.</p>
              
              <button 
                onClick={toggleTest}
                className={`w-full py-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                  isTesting 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 scale-95 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                  : 'bg-lime-400 text-black shadow-xl shadow-lime-400/10 hover:scale-[1.02]'
                }`}
              >
                <div className={`p-4 rounded-full transition-all ${isTesting ? 'bg-red-500 text-white animate-pulse' : 'bg-black/10'}`}>
                  <Mic className="w-8 h-8" />
                </div>
                <span className="font-heading font-bold">{isTesting ? 'STOP SESSION' : 'START TALKING'}</span>
              </button>
            </div>
            
            {isTesting && (
               <div className="absolute bottom-0 left-0 right-0 h-1.5 flex items-end">
                 {[...Array(30)].map((_, i) => (
                   <motion.div 
                    key={i} 
                    animate={{ height: [`${Math.random() * 40 + 10}%`, `${Math.random() * 90 + 10}%`, `${Math.random() * 40 + 10}%`] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                    className="flex-1 bg-lime-400/40 mx-[1px]"
                   />
                 ))}
               </div>
            )}
          </section>
        </div>
      </div>

      {/* MCP Simulation Modals */}
      <AnimatePresence>
        {isImporting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setIsImporting(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isImporting === 'drive' ? 'bg-blue-400' : 'bg-white'}`}>
                  {isImporting === 'drive' ? <Cloud className="text-white w-8 h-8" /> : <Database className="text-black w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold">Connect {isImporting === 'drive' ? 'Google Drive' : 'Notion'}</h3>
                  <p className="text-gray-400 text-sm">Select files to inject into your agent's memory.</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {(isImporting === 'drive' ? MOCK_DRIVE_FILES : MOCK_NOTION_PAGES).map(file => (
                  <button 
                    key={file.id}
                    disabled={!!syncingId}
                    onClick={() => handleImport(isImporting, file.name, file.content)}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-gray-500 group-hover:text-lime-400 transition-colors" />
                      <span className="font-semibold text-sm">{file.name}</span>
                    </div>
                    {syncingId === file.name ? (
                      <RefreshCw className="w-4 h-4 text-lime-400 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-500 group-hover:text-lime-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => setIsImporting(null)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
