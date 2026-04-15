import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Shield, AlertTriangle, CheckCircle, Globe, Search, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const initialLogs = [
  { id: 1, type: 'Blocked', ip: '192.168.1.104', location: 'Kiev, UA', reason: 'DDoS Pattern', severity: 'critical', time: 'Just now' },
  { id: 2, type: 'Warning', ip: '45.22.10.1', location: 'San Jose, US', reason: 'High Frequency', severity: 'warning', time: '14m ago' },
  { id: 3, type: 'Pass', ip: '10.0.4.192', location: 'London, UK', reason: 'Token Handshake', severity: 'safe', time: '22m ago' },
  { id: 4, type: 'Blocked', ip: '210.4.5.1', location: 'Unknown', reason: 'SQL Injection', severity: 'critical', time: '41m ago' },
];

export default function Security() {
  const [logs, setLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [firewallActive, setFirewallActive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleFirewall = () => {
    const newState = !firewallActive;
    setFirewallActive(newState);
    alert(`Firewall ${newState ? 'ENABLED' : 'DISABLED'}. Security protocols updated.`);
  };

  const refreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate new log
      const newLog = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'Pass' : 'Warning',
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: 'Global Edge',
        reason: 'Packet Analysis',
        severity: Math.random() > 0.5 ? 'safe' : 'warning',
        time: 'Just now'
      };
      setLogs(prev => [newLog, ...prev.slice(0, 3)]);
      setIsRefreshing(false);
    }, 800);
  };

  const filteredLogs = logs.filter(log => 
    log.ip.includes(searchTerm) || 
    log.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-obsidian-void min-h-screen">
      <Sidebar />
      
      <motion.main 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-64 p-8"
      >
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl tracking-tight mb-1">Threat Intelligence</h1>
            <p className="text-sm text-white/40">Real-time edge security and packet analysis.</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white/30 text-sm focus-within:text-white transition-colors">
               <Search size={16} />
               <input 
                type="text" 
                placeholder="Search IP or Payload..." 
                className="bg-transparent border-none outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             </div>
             <button 
                onClick={toggleFirewall}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs transition-all shadow-lg",
                  firewallActive 
                    ? "border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan shadow-cyber-cyan/5" 
                    : "border-cyber-red/20 bg-cyber-red/5 text-cyber-red shadow-cyber-red/5"
                )}
              >
               <Shield size={14} className={firewallActive ? "animate-pulse" : ""} />
               {firewallActive ? 'Firewall Active' : 'Firewall Bypassed'}
             </button>
          </div>
        </header>

        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 solid-card p-8 h-[400px] relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Globe size={600} className="absolute -bottom-20 -right-20 text-cyber-cyan" />
             </div>
             <div className="z-10 text-center">
                <div className={clsx(
                  "w-20 h-20 rounded-full border flex items-center justify-center mb-6 mx-auto",
                  firewallActive ? "bg-cyber-cyan/10 border-cyber-cyan/30 animate-pulse-subtle" : "bg-cyber-red/10 border-cyber-red/30"
                )}>
                   <Shield size={32} className={firewallActive ? "text-cyber-cyan" : "text-cyber-red"} />
                </div>
                <h2 className="text-2xl mb-2 font-grotesk font-bold">
                  {firewallActive ? 'Encrypted Perimeter Active' : 'Security Layer Compromised'}
                </h2>
                <p className="text-sm text-white/40 max-w-md mx-auto">
                  {firewallActive 
                    ? "Global traffic is being routed through our AI-Scrubbing layer. No active breaches detected."
                    : "Firewall is currently disabled. System is vulnerable to external handshake attempts."}
                </p>
             </div>

             {firewallActive && (
               <>
                 <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-cyber-red shadow-[0_0_10px_#ff716c] animate-ping" />
                 <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_10px_#8ff5ff] animate-ping" />
               </>
             )}
          </div>

          <div className="col-span-12 solid-card p-0 overflow-hidden">
             <div className="p-8 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
                <h2 className="text-xl">Edge Security Log</h2>
                <div className="flex gap-4 items-center">
                   <button 
                    onClick={refreshLogs}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                   >
                     <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                     <span className="text-[10px] font-bold uppercase tracking-tighter">Manual Sync</span>
                   </button>
                   <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full border border-cyber-mint/20 text-cyber-mint text-[10px] font-bold uppercase tracking-tighter">Live Traffic</span>
                      <span className="px-3 py-1 rounded-full border border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-tighter">Connected</span>
                   </div>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left font-inter">
                  <thead>
                    <tr className="text-white/20 text-[10px] uppercase font-bold tracking-widest border-b border-white/[0.05] bg-white/[0.01]">
                      <th className="py-4 px-8">Severity</th>
                      <th className="py-4 px-8">Identity / IP</th>
                      <th className="py-4 px-8">Handshake Location</th>
                      <th className="py-4 px-8">Trigger Reason</th>
                      <th className="py-4 px-8 text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <AnimatePresence mode="popLayout">
                      {filteredLogs.map((log) => (
                        <motion.tr 
                          key={log.id} 
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          layout
                          className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-6 px-8">
                             <div className={clsx(
                               "flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter w-fit",
                               log.severity === 'critical' && "text-cyber-red bg-cyber-red/5 border-cyber-red/20 outline outline-2 outline-cyber-red/10",
                               log.severity === 'warning' && "text-yellow-500 bg-yellow-500/5 border-yellow-500/20",
                               log.severity === 'safe' && "text-cyber-mint bg-cyber-mint/5 border-cyber-mint/20"
                             )}>
                                {log.severity === 'critical' ? <AlertTriangle size={10} /> : log.severity === 'warning' ? <Shield size={10} /> : <CheckCircle size={10} />}
                                {log.type}
                             </div>
                          </td>
                          <td className="py-6 px-8 flex flex-col">
                             <span className="font-mono font-bold group-hover:text-cyber-cyan transition-colors">{log.ip}</span>
                             <span className="text-[10px] text-white/20">{log.id.toString().slice(-4)}-IDENTIFIER</span>
                          </td>
                          <td className="py-6 px-8 text-white/40">{log.location}</td>
                          <td className="py-6 px-8 font-medium">{log.reason}</td>
                          <td className="py-6 px-8 text-right text-white/20 font-mono text-xs">{log.time}</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
             </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
