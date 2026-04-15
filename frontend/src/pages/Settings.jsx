import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Key, Copy, Check, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateKey = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/keys');
      setApiKey(data.rawKey);
      alert('API Key generated successfully. Please copy it now as it will not be shown again.');
    } catch (err) {
      alert('Failed to generate key: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex bg-obsidian-void min-h-screen text-white/90">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-12">
          <h1 className="text-3xl tracking-tight mb-2">Node Settings</h1>
          <p className="text-sm text-white/40">Manage your API credentials and security configurations.</p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 space-y-8">
            {/* API Key Section */}
            <div className="solid-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
                  <Key className="text-cyber-cyan font-bold" size={20} />
                </div>
                <h2 className="text-xl font-semibold">Infrastructure Access Key</h2>
              </div>

              <p className="text-sm text-white/50 mb-8 leading-relaxed">
                Generate a high-entropy API key to authenticate your services with the platform. 
                Keep this key secure. It provides full access to your node's metrics and settings.
              </p>

              <div className="relative group mb-6">
                <input 
                  type="text" 
                  readOnly 
                  value={apiKey || '••••••••••••••••••••••••••••••••'} 
                  className="w-full bg-obsidian-surface border border-white/5 rounded-xl py-4 pl-4 pr-12 font-mono text-sm text-white/40 group-hover:border-white/10 transition-colors"
                />
                {apiKey && (
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-cyber-cyan transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                )}
              </div>

              <button 
                onClick={generateKey}
                disabled={loading}
                className="w-full h-14 bg-white text-obsidian rounded-xl font-bold tracking-tight hover:bg-cyber-cyan transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin text-obsidian" size={20} /> : (
                  <>
                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Regenerate Edge Key
                  </>
                )}
              </button>
            </div>

            {/* AI Security Level */}
            <div className="solid-card p-8">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20">
                  <Cpu className="text-cyber-purple" size={20} />
                </div>
                <h2 className="text-xl font-semibold">Cognitive Sensitivity</h2>
              </div>
              <p className="text-sm text-white/50 mb-6">Adjust the threshold of the Anomaly Detection model.</p>
              
              <div className="space-y-4">
                {['Aggressive', 'Balanced', 'Permissive'].map((mode) => (
                  <div key={mode} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 cursor-pointer transition-colors">
                    <span className="text-sm font-medium">{mode}</span>
                    <div className={`w-3 h-3 rounded-full ${mode === 'Balanced' ? 'bg-cyber-cyan shadow-[0_0_8px_#8ff5ff]' : 'bg-white/10'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="glass-card p-8 border-cyber-red/10">
               <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-cyber-red" size={20} />
                <h2 className="text-xl font-semibold text-cyber-red">Danger Zone</h2>
              </div>
              <p className="text-sm text-white/40 mb-8 border-l-2 border-cyber-red/30 pl-4 py-1">
                Deactivating your node will immediately revoke all API keys and clear your infrastructure logs. This action is irreversible.
              </p>
              <button className="w-full py-4 rounded-xl border border-cyber-red/50 text-cyber-red text-sm font-bold hover:bg-cyber-red/10 transition-all">
                Deactivate Node Terminal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
