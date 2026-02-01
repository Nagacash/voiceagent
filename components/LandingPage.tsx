
import React from 'react';
import { Mic, Zap, Shield, Globe, ArrowRight, Play, Check, Star, MessageSquare, Clock, Users } from 'lucide-react';
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-white/5 border border-white/10 m-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
            <Mic className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">VoxSaaS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors cursor-pointer min-h-[44px] flex items-center focus:ring-2 focus:ring-lime-400 focus:outline-none rounded-md px-2">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors cursor-pointer min-h-[44px] flex items-center focus:ring-2 focus:ring-lime-400 focus:outline-none rounded-md px-2">Pricing</a>
          <a href="#" className="hover:text-white transition-colors cursor-pointer min-h-[44px] flex items-center focus:ring-2 focus:ring-lime-400 focus:outline-none rounded-md px-2">API Docs</a>
        </div>
        <div>
          {isLoggedIn ? (
            <button 
              onClick={onDashboard}
              className="px-6 py-2.5 min-h-[44px] bg-lime-400 text-black rounded-full font-semibold hover:bg-lime-300 transition-all flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={onStart}
              className="px-6 py-2.5 min-h-[44px] bg-lime-400 text-black rounded-full font-semibold hover:bg-lime-300 transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/5 text-lime-400 text-xs font-bold uppercase tracking-widest mb-8 motion-reduce:transition-none"
        >
          <Zap className="w-3 h-3" /> Powered by Gemini 2.5 Flash
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] motion-reduce:transition-none"
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
          className="text-gray-400 text-xl max-w-2xl mb-12 motion-reduce:transition-none"
        >
          Build production-ready AI voice agents in minutes. Deploy real-time customer support, voice search, and interactive interfaces anywhere.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 motion-reduce:transition-none"
        >
          <button 
            onClick={onStart}
            className="px-8 py-4 min-h-[44px] bg-lime-400 text-black rounded-2xl font-bold text-lg hover:scale-105 motion-reduce:hover:scale-100 transition-transform glow-primary flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
          >
            Get Started Now <ArrowRight />
          </button>
          <button 
            aria-label="Watch demo video"
            className="px-8 py-4 min-h-[44px] backdrop-blur-md bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
          >
            <Play className="fill-white" /> See how it works
          </button>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-24 w-full aspect-video rounded-3xl border border-white/10 backdrop-blur-md bg-white/5 overflow-hidden shadow-2xl relative motion-reduce:transition-none"
        >
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
           <img 
            src="https://picsum.photos/seed/voxsaas/1200/800" 
            alt="Dashboard Preview" 
            className="w-full h-full object-cover opacity-50"
           />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-lime-400/20 border border-lime-400 flex items-center justify-center backdrop-blur-md animate-pulse motion-reduce:animate-none">
                <Mic className="text-lime-400 w-10 h-10" />
              </div>
           </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Zero Latency", desc: "Native audio processing ensures responses feel natural and human-like." },
          { icon: Shield, title: "Enterprise Ready", desc: "Secure multi-tenant architecture with API key management and analytics." },
          { icon: Globe, title: "Embed Anywhere", desc: "One line of code to deploy your voice agent to any website or app." }
        ].map((f, i) => (
          <div key={i} className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/5 hover:border-lime-400/20 transition-all group">
            <f.icon className="w-12 h-12 text-lime-400 mb-6 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/5 text-lime-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Simple Pricing
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Start Free, Scale as You Grow
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Pay only for what you use. No hidden fees, no surprises.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 flex flex-col"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Perfect for testing and small projects</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "30 voice minutes/month",
                "1 voice agent",
                "Basic analytics",
                "Community support",
                "Web widget embed"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="w-5 h-5 text-lime-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={onStart}
              className="w-full py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none"
            >
              Get Started Free
            </button>
          </motion.div>

          {/* Pro Plan - Most Popular */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-gradient-to-b from-lime-400/10 to-transparent border-2 border-lime-400/50 flex flex-col relative"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-lime-400 text-black text-xs font-bold rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" /> MOST POPULAR
              </span>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-gray-400 text-sm mb-6">For growing businesses</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "600 voice minutes/month",
                "5 voice agents",
                "Advanced analytics",
                "Priority email support",
                "SMS notifications (50/mo)",
                "5 custom voice personas",
                "API access"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="w-5 h-5 text-lime-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={onStart}
              className="w-full py-4 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none glow-primary"
            >
              Start 14-Day Trial
            </button>
          </motion.div>

          {/* Business Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 flex flex-col"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <p className="text-gray-400 text-sm mb-6">For teams and high volume</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$299</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "3,000 voice minutes/month",
                "Unlimited agents",
                "Real-time analytics dashboard",
                "Dedicated account manager",
                "Webhook integrations",
                "Knowledge base sync (Notion, Drive)",
                "Custom branding & white-label",
                "99.9% uptime SLA"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="w-5 h-5 text-lime-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={onStart}
              className="w-full py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all cursor-pointer focus:ring-2 focus:ring-lime-400 focus:outline-none"
            >
              Contact Sales
            </button>
          </motion.div>
        </div>

        {/* Usage-based pricing note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">Need more minutes? Add-on packs available:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              <Clock className="w-4 h-4 inline mr-2 text-lime-400" />
              +100 mins: $19
            </span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              <Clock className="w-4 h-4 inline mr-2 text-lime-400" />
              +500 mins: $79
            </span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              <MessageSquare className="w-4 h-4 inline mr-2 text-lime-400" />
              SMS pack (100): $15
            </span>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-lime-400" />
              <span className="text-2xl font-bold text-white">2,400+</span>
              <span className="text-sm">Active Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-lime-400" />
              <span className="text-2xl font-bold text-white">1.2M</span>
              <span className="text-sm">Minutes Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-lime-400" />
              <span className="text-2xl font-bold text-white">4.9/5</span>
              <span className="text-sm">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2024 VoxSaaS AI. Built with Gemini 2.5.</p>
      </footer>
    </div>
  );
};
