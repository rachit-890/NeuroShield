import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus, Mail, Lock, Loader2, ArrowRight, Fingerprint } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Identity provisioning failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-void flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,_rgba(213,117,255,0.05)_0%,_transparent_50%)]">
      <div className="w-full max-w-md page-transition">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-cyber-purple/10 rounded-2xl flex items-center justify-center mb-6 border border-cyber-purple/20">
            <Fingerprint className="text-cyber-purple" size={32} />
          </div>
          <h1 className="text-4xl font-grotesk tracking-tight text-white mb-2">Provision Identity</h1>
          <p className="text-white/40">Register a new node in the encrypted API grid.</p>
        </div>

        <div className="glass-card p-8 border-white/5 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-cyber-red/10 border border-cyber-red/20 rounded-xl text-cyber-red text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Universal ID</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyber-purple transition-colors" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-obsidian-surface/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyber-purple/30 focus:bg-white/[0.02] transition-all text-white placeholder:text-white/10"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Communication Endpoint</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyber-purple transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-obsidian-surface/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyber-purple/30 focus:bg-white/[0.02] transition-all text-white placeholder:text-white/10"
                  placeholder="name@nexus.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Access Key</label>
                <div className="relative group">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyber-purple transition-colors" size={14} />
                   <input
                    type="password"
                    required
                    className="w-full bg-obsidian-surface/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-cyber-purple/30 focus:bg-white/[0.02] transition-all text-white placeholder:text-white/10 text-xs"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Verify Key</label>
                 <div className="relative group">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyber-purple transition-colors" size={14} />
                   <input
                    type="password"
                    required
                    className="w-full bg-obsidian-surface/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-cyber-purple/30 focus:bg-white/[0.02] transition-all text-white placeholder:text-white/10 text-xs"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyber-purple text-obsidian h-14 rounded-xl font-bold tracking-tight hover:brightness-110 shadow-[0_0_20px_rgba(213,117,255,0.2)] transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Generate Credentials
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/30">
            Node already exists?{' '}
            <Link to="/login" className="text-cyber-purple hover:underline decoration-cyber-purple/30 underline-offset-4">Handshake</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
