import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts';
import { Users, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const trafficData = [
  { name: 'Mon', requests: 4000, errors: 240 },
  { name: 'Tue', requests: 3000, errors: 139 },
  { name: 'Wed', requests: 2000, errors: 980 },
  { name: 'Thu', requests: 2780, errors: 390 },
  { name: 'Fri', requests: 1890, errors: 480 },
  { name: 'Sat', requests: 2390, errors: 380 },
  { name: 'Sun', requests: 3490, errors: 430 },
];

const errorDist = [
  { name: '401 Unauthorized', count: 400, color: '#8ff5ff' },
  { name: '403 Forbidden', count: 300, color: '#d575ff' },
  { name: '404 Not Found', count: 200, color: '#aeffd4' },
  { name: '500 System Error', count: 100, color: '#ff716c' },
];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Label,Value\n" + 
      trafficData.map(d => `${d.name},${d.requests}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "infrastructure_report.csv");
    document.body.appendChild(link);
    link.click();
    alert('Report generation successful. Download initiated.');
  };

  return (
    <div className="flex bg-obsidian-void min-h-screen">
      <Sidebar />
      
      <motion.main 
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 ml-64 p-8"
      >
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl tracking-tight mb-1">Advanced Analytics</h1>
            <p className="text-sm text-white/40">Deep dive into API consumption and performance patterns.</p>
          </div>

          <div className="flex gap-3">
            <select className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2 text-xs font-semibold text-white/60 focus:outline-none focus:border-cyber-cyan/30">
              <option className="bg-obsidian-card">Last 24 Hours</option>
              <option className="bg-obsidian-card">Last 7 Days</option>
              <option className="bg-obsidian-card">Last 30 Days</option>
            </select>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan text-obsidian-void text-xs font-bold rounded-xl hover:scale-105 transition-transform"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </header>

        <section className="grid grid-cols-12 gap-8">
          {/* Traffic Trends Over Time */}
          <div className="col-span-12 lg:col-span-8 solid-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl">Infrastructure Velocity</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-cyan" /><span className="text-[10px] text-white/40 font-bold">REQUESTS</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-purple" /><span className="text-[10px] text-white/40 font-bold">ERRORS</span></div>
              </div>
            </div>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8ff5ff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8ff5ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#131313', border: 'none', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="requests" stroke="#8ff5ff" fill="url(#cyanGradient)" strokeWidth={3} />
                  <Area type="monotone" dataKey="errors" stroke="#d575ff" fill="none" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Error Distribution Bar Chart */}
          <div className="col-span-12 lg:col-span-4 solid-card p-8">
            <h2 className="text-xl mb-8">Anomaly Breakdown</h2>
            <div className="h-[250px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorDist} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} width={100} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#131313', border: 'none' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                    {errorDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
               {errorDist.map((err) => (
                 <div key={err.name} className="flex justify-between items-center text-xs">
                   <span className="text-white/40">{err.name}</span>
                   <span className="font-bold">{err.count} incidents</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Top Consumers Table */}
          <div className="col-span-12 solid-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl">Top API Consumers</h2>
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Real-time Ranking</span>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="text-white/20 text-[10px] uppercase font-bold tracking-widest border-b border-white/[0.05]">
                  <th className="pb-4 px-4">User Identity</th>
                  <th className="pb-4 px-4">Requests</th>
                  <th className="pb-4 px-4">Cache Hit Rate</th>
                  <th className="pb-4 px-4 text-right">Resource Usage</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { id: 'usr-8892', req: '4.2M', cache: '98.2%', usage: 45 },
                  { id: 'usr-1928', req: '3.1M', cache: '74.5%', usage: 92 },
                  { id: 'usr-3301', req: '2.8M', cache: '89.1%', usage: 12 },
                  { id: 'usr-7721', req: '1.2M', cache: '62.0%', usage: 60 }
                ].map((user) => (
                  <tr key={user.id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                    <td className="py-5 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gradient-to-tr from-white/5 to-white/10 border border-white/5 flex items-center justify-center">
                        <Users size={14} className="text-white/40" />
                      </div>
                      <span className="font-mono text-cyber-cyan">{user.id}</span>
                    </td>
                    <td className="py-5 px-4 font-bold">{user.req}</td>
                    <td className="py-5 px-4 text-white/40">{user.cache}</td>
                    <td className="py-5 px-4 text-right">
                       <div className="flex items-center gap-3 justify-end">
                         <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-cyber-mint" style={{ width: `${user.usage}%` }} />
                         </div>
                         <span className="text-[10px] font-bold text-white/40">{user.usage}%</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
