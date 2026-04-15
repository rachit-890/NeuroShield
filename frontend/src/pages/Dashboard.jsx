import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import { BarChart3, Users, Activity, AlertCircle, Search, Bell } from 'lucide-react';
import clsx from 'clsx';
import { 
  ResponsiveContainer, AreaChart, Area, Tooltip, Line 
} from 'recharts';

const chartData = [
  { time: '00:00', requests: 4000, errors: 400 },
  { time: '04:00', requests: 3000, errors: 200 },
  { time: '08:00', requests: 8000, errors: 600 },
  { time: '12:00', requests: 12000, errors: 300 },
  { time: '16:00', requests: 9000, errors: 900 },
  { time: '20:00', requests: 11000, errors: 200 },
  { time: '23:59', requests: 15000, errors: 100 },
];

const handshakes = [
  { timestamp: '14:52:10', method: 'POST', endpoint: '/v1/secure/token-exchange', status: 200, latency: '142ms' },
  { timestamp: '14:52:11', method: 'GET', endpoint: '/v1/analytics/summary', status: 200, latency: '85ms' },
  { timestamp: '14:52:12', method: 'POST', endpoint: '/api/auth/login', status: 403, latency: '45ms' },
  { timestamp: '14:52:13', method: 'PUT', endpoint: '/v1/node/settings', status: 201, latency: '210ms' },
  { timestamp: '14:52:14', method: 'GET', endpoint: '/v1/security/logs', status: 500, latency: '1.2s' },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredHandshakes = handshakes.filter(h => 
    h.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.status.toString().includes(searchTerm)
  );

  return (
    <div className="flex bg-obsidian-void min-h-screen text-white/90">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl tracking-tight mb-1">Infrastructure Control</h1>
            <p className="text-sm text-white/40">Real-time API monitoring and security health.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white/30 text-sm focus-within:text-white transition-colors">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-transparent border-none outline-none w-48"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button 
              onClick={() => alert('Infrastructure status: Nominal. No new critical alerts.')}
              className="p-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] text-white/40 hover:text-white transition-all"
            >
              <Bell size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-obsidian-surface border border-white/[0.08]" />
          </div>
        </header>

        {/* Hero Area */}
        <section className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 lg:col-span-6">
            <MetricCard 
              variant="primary"
              label="Total API Throughput" 
              value="12,482,901" 
              trend={12.5}
              status="safe"
              icon={<Activity size={24} />}
            />
          </div>
          <div className="col-span-6 lg:col-span-3">
            <MetricCard 
              label="Active Users" 
              value="45.2k" 
              trend={4.2}
              status="safe"
              icon={<Users size={20} />}
            />
          </div>
          <div className="col-span-6 lg:col-span-3">
            <MetricCard 
              label="Global Error Rate" 
              value="0.02%" 
              trend={-0.4}
              status="warning"
              icon={<AlertCircle size={20} />}
            />
          </div>
        </section>

        {/* Middle Section */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 lg:col-span-8 solid-card p-6 overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg">Network Traffic Analysis</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_#8ff5ff]" />
                    <span className="text-[10px] text-white/40 font-bold uppercase">Requests</span>
                  </div>
                </div>
             </div>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8ff5ff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8ff5ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: '#131313', border: 'none', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="requests" stroke="#8ff5ff" fill="url(#colorReq)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="col-span-12 lg:col-span-4 glass-card p-6">
            <h2 className="text-lg mb-6 flex items-center justify-between">
              Live Anomalies
              <span className="text-[10px] bg-cyber-red/10 text-cyber-red px-2 py-0.5 rounded-full border border-cyber-red/20 font-bold">SECURE</span>
            </h2>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-2 h-12 bg-cyber-red/10 rounded-full overflow-hidden">
                    <div className="w-full h-1/2 bg-cyber-red" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Volumetric Spike: Node-{100+i}</p>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-tight">/api/v1/auth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <section className="solid-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg">Recent Security Handshakes</h2>
            <button 
              onClick={() => navigate('/security')}
              className="text-xs text-cyber-cyan hover:underline underline-offset-4"
            >
              View All Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white/20 text-[10px] uppercase font-bold tracking-widest border-b border-white/[0.05]">
                  <th className="pb-4 px-2">Timestamp</th>
                  <th className="pb-4 px-2">Method</th>
                  <th className="pb-4 px-2">Endpoint</th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredHandshakes.map((h, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]">
                    <td className="py-4 px-2 text-white/40 font-mono">{h.timestamp}</td>
                    <td className="py-4 px-2">
                       <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold">{h.method}</span>
                    </td>
                    <td className="py-4 px-2 font-mono group-hover:text-cyber-cyan transition-colors text-xs">{h.endpoint}</td>
                    <td className="py-4 px-2">
                      <span className={clsx(
                        "inline-block w-2 h-2 rounded-full mr-2",
                        h.status >= 400 ? "bg-cyber-red" : "bg-cyber-mint"
                      )} />
                      {h.status}
                    </td>
                    <td className="py-4 px-2 text-right text-white/40">{h.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
