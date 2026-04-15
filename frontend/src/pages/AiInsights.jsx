import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Cpu, Brain, Zap, Target, MoreHorizontal, History } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const initialSuspiciousUsers = [
  { id: 'usr-921', score: 88, reason: 'Volumetric Anomaly', confidence: 0.94, time: '2h ago' },
  { id: 'usr-002', score: 42, reason: 'Unusual IP Diversity', confidence: 0.76, time: '5h ago' },
  { id: 'usr-441', score: 95, reason: 'Brute Force Attempt', confidence: 0.99, time: '12m ago' },
];

export default function AiInsights() {
  const [flaggedUsers, setFlaggedUsers] = useState(initialSuspiciousUsers);

  const handleClearQueue = () => {
    setFlaggedUsers([]);
    alert('AI Flagged Queue cleared successfully.');
  };

  const handleLockdown = () => {
    alert('EMERGENCY LOCKDOWN INITIATED. All active tokens for usr-441 have been revoked. Firewall rules updated.');
  };

  const handleExport = () => {
    alert('AI Analysis report exported to system logs.');
  };

  return (
    <div className="flex bg-obsidian-void min-h-screen">
      <Sidebar />
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 ml-64 p-8"
      >
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl tracking-tight mb-1">AI Cognitive Insights</h1>
            <p className="text-sm text-white/40">Isolation Forest ML analysis on system data streams.</p>
          </div>
          
          <div className="flex items-center gap-6 px-6 py-4 glass-card bg-cyber-purple/5 border-cyber-purple/20">
             <div className="flex items-center gap-3">
                <Brain className="text-cyber-purple" size={24} />
                <div>
                   <span className="block text-[10px] font-bold text-cyber-purple opacity-50">MODEL STATUS</span>
                   <span className="text-xs font-bold font-grotesk tracking-widest text-white">READY & LEARNING</span>
                </div>
             </div>
             <div className="h-8 w-[1px] bg-white/10" />
             <div>
                <span className="block text-[10px] font-bold text-white/20">CONFIDENCE</span>
                <span className="text-xs font-bold text-cyber-cyan">99.98%</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
           {/* Detailed Profile View (Hero) */}
           <div className="col-span-12 lg:col-span-7 solid-card p-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="relative">
                 <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 88} 
                            strokeDashoffset={2 * Math.PI * 88 * (1 - 0.95)}
                            className="text-cyber-red" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold tracking-tighter">95</span>
                    <span className="text-[10px] text-cyber-red font-bold">RISK SCORE</span>
                 </div>
              </div>

              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-4">
                    <Target className="text-cyber-red" size={18} />
                    <span className="text-sm font-bold text-white/40 font-mono tracking-tighter uppercase">High Confidence Match</span>
                 </div>
                 <h2 className="text-4xl font-grotesk font-bold mb-4 tracking-tight">Identity: usr-441</h2>
                 <p className="text-sm text-white/50 mb-8 leading-relaxed">
                    AI detected a high-frequency authentication attempt from 14 distinct geo-locations within 5 minutes. Pattern matches documented Credential Stuffing footprints.
                 </p>
                 <div className="flex gap-4">
                    <button 
                      onClick={handleLockdown}
                      className="flex-1 py-3 rounded-xl bg-cyber-red text-obsidian-void font-bold text-sm hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(255,113,108,0.2)]"
                    >
                      Emergency Lockdown
                    </button>
                    <button 
                      onClick={handleExport}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 font-bold text-sm hover:bg-white/5 transition-all text-center"
                    >
                      Export Analysis
                    </button>
                 </div>
              </div>
           </div>

           {/* Small Stats */}
           <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1 solid-card p-6 flex items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan"><Zap size={24} /></div>
                 <div>
                    <span className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Anomalies Detected / 24h</span>
                    <span className="text-2xl font-bold">142</span>
                 </div>
              </div>
              <div className="flex-1 solid-card p-6 flex items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-cyber-purple/10 flex items-center justify-center text-cyber-purple"><Cpu size={24} /></div>
                 <div>
                    <span className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Model Retraining Age</span>
                    <span className="text-2xl font-bold">4.2 hours</span>
                 </div>
              </div>
              <div className="flex-1 glass-card p-6 flex items-center justify-between border-cyber-cyan/10">
                 <div className="flex items-center gap-4 text-cyber-cyan">
                    <History size={20} />
                    <span className="text-sm font-bold opacity-80 uppercase tracking-tight">AI Training Log</span>
                 </div>
                 <MoreHorizontal size={20} className="text-white/20" />
              </div>
           </div>

           {/* Timeline and List */}
           <div className="col-span-12 lg:col-span-8 solid-card p-8">
              <h2 className="text-xl mb-8">Suspicious Activity Timeline</h2>
              <div className="space-y-6">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-6 items-start relative pb-6 border-b border-white/[0.03] last:border-none">
                       <div className="mt-1 w-2 h-2 rounded-full bg-cyber-purple shadow-[0_0_8px_rgba(213,117,255,0.5)]" />
                       <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                             <h4 className="text-sm font-bold">Model Identification: Cluster #{100+i}</h4>
                             <span className="text-[10px] text-white/20 font-mono">14:52:10 UTC</span>
                          </div>
                          <p className="text-xs text-white/40">Recurrent volumetric fluctuations in endpoint /api/v1/data detected. Anomaly score: 0.82</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="col-span-12 lg:col-span-4 glass-card p-8 overflow-hidden">
               <h2 className="text-xl mb-8">AI Flagged Queue</h2>
               <div className="space-y-4">
                  <AnimatePresence>
                    {flaggedUsers.map((user) => (
                      <motion.div 
                        key={user.id} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group"
                      >
                         <div className="flex justify-between items-center mb-3">
                            <span className="font-mono text-xs font-bold text-cyber-cyan">{user.id}</span>
                            <span className={clsx(
                               "text-[10px] font-bold px-2 py-0.5 rounded-full",
                               user.score > 80 ? "bg-cyber-red/10 text-cyber-red border border-cyber-red/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            )}>Risk: {user.score}%</span>
                         </div>
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] text-white/30 uppercase font-bold tracking-tight">{user.reason}</span>
                            <span className="text-[10px] text-white/20 font-bold uppercase">{user.time}</span>
                         </div>
                      </motion.div>
                    ))}
                    {flaggedUsers.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-white/20 font-bold uppercase text-[10px] tracking-widest border border-dashed border-white/5 rounded-xl"
                      >
                        Queue is Empty
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <button 
                onClick={handleClearQueue}
                className="w-full mt-6 py-3 rounded-xl border border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
              >
                Clear Queue
              </button>
           </div>
        </div>
      </motion.main>
    </div>
  );
}
