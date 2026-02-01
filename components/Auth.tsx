
import React, { useState } from 'react';
import { Mic, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { UserSession, Company } from '../types';

interface AuthProps {
  onAuthSuccess: (session: UserSession) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    const company: Company = {
      id: Math.random().toString(36).substr(2, 9),
      name: mode === 'register' ? name : 'Acme Corp',
      email,
      apiKey: 'vox_' + Math.random().toString(36).substr(2, 16),
    };

    onAuthSuccess({
      company,
      token: 'mock-jwt-token-' + Date.now(),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md">
        <button 
          onClick={onBack}
          aria-label="Go back to home page"
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group cursor-pointer min-h-[44px] focus:ring-2 focus:ring-lime-400 focus:outline-none rounded-lg px-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic className="text-black w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-gray-400">Start building your voice agent empire today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="company-name" className="text-sm font-medium text-gray-400">Company Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  id="company-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-lime-400 focus:outline-none transition-all"
                  placeholder="Acme Inc"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-lime-400 focus:outline-none transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-lime-400 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 min-h-[44px] bg-lime-400 text-black rounded-xl font-bold hover:bg-lime-300 transition-colors mt-4 cursor-pointer focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="ml-2 text-lime-400 font-semibold hover:underline hover:text-lime-300 transition-colors cursor-pointer min-h-[44px] px-1 focus:ring-2 focus:ring-lime-400 focus:outline-none rounded"
          >
            {mode === 'login' ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};
