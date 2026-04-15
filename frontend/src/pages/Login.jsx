import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { username: formData.username }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-void flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,_rgba(143,245,255,0.05)_0%,_transparent_50%)]">
      <div className="w-full max-w-md page-transition">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-cyber-cyan/10 rounded-2xl flex items-center justify-center mb-6 border border-cyber-cyan/20">
            <Shield className="text-cyber-cyan" size={32} />
          </div>
          <h1 className="text-4xl font-grotesk tracking-tight text-white mb-2">Access Portal</h1>
          <p className="text-white/40">Secure administrative gateway for API infrastructure.</p>
        </div>

        <div className="glass-card p-8 border-white/5 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-cyber-red/10 border border-cyber-red/20 rounded-xl text-cyber-red text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyber-cyan transition-colors" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-obsidian-surface/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-cyber-cyan/30 focus:bg-white/[0.02] transition-all text-white placeholder:text-white/10"
                  placeholder="Enter administrator ID"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyber-cyan transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-obsidian-surface/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-cyber-cyan/30 focus:bg-white/[0.02] transition-all text-white placeholder:text-white/10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-obsidian h-14 rounded-xl font-bold tracking-tight hover:bg-cyber-cyan transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Establish Connection
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/30">
            Unregistered node?{' '}
            <Link to="/register" className="text-cyber-cyan hover:underline decoration-cyber-cyan/30 underline-offset-4">Identity Provisioning</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
