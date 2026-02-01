
import React from 'react';
import { Mic, Zap, Shield, Globe, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
  onDashboard: () => void;
  isLoggedIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onDashboard, isLoggedIn }) => {
  return (
    <div className="relative overflow-hidden bg-black selection:bg-lime-400 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 glass m-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
            <Mic className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">VoxSaaS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">API Docs</a>
        </div>
        <div>
          {isLoggedIn ? (
            <button 
              onClick={onDashboard}
              className="px-6 py-2.5 bg-lime-400 text-black rounded-full font-semibold hover:bg-lime-300 transition-all flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={onStart}
              className="px-6 py-2.5 bg-lime-400 text-black rounded-full font-semibold hover:bg-lime-300 transition-all"
            >
              Try for Free
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/5 text-lime-400 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Zap className="w-3 h-3" /> Powered by Gemini 2.5 Flash
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
        >
          Your Business, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
            Now with a Voice.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-xl max-w-2xl mb-12"
        >
          Build production-ready AI voice agents in minutes. Deploy real-time customer support, voice search, and interactive interfaces anywhere.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-lime-400 text-black rounded-2xl font-bold text-lg hover:scale-105 transition-transform glow-primary flex items-center gap-2"
          >
            Get Started Now <ArrowRight />
          </button>
          <button className="px-8 py-4 glass text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
            <Play className="fill-white" /> See how it works
          </button>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-24 w-full aspect-video rounded-3xl border border-white/10 glass overflow-hidden shadow-2xl relative"
        >
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
           <img 
            src="https://picsum.photos/seed/voxsaas/1200/800" 
            alt="Dashboard Preview" 
            className="w-full h-full object-cover opacity-50"
           />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-lime-400/20 border border-lime-400 flex items-center justify-center backdrop-blur-md animate-pulse">
                <Mic className="text-lime-400 w-10 h-10" />
              </div>
           </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Zero Latency", desc: "Native audio processing ensures responses feel natural and human-like." },
          { icon: Shield, title: "Enterprise Ready", desc: "Secure multi-tenant architecture with API key management and analytics." },
          { icon: Globe, title: "Embed Anywhere", desc: "One line of code to deploy your voice agent to any website or app." }
        ].map((f, i) => (
          <div key={i} className="p-8 rounded-3xl glass border border-white/5 hover:border-lime-400/20 transition-all group">
            <f.icon className="w-12 h-12 text-lime-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2024 VoxSaaS AI. Built with Gemini 2.5.</p>
      </footer>
    </div>
  );
};
