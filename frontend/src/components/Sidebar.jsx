import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart3, ShieldCheck, Cpu, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Home, label: 'Dashboard', to: '/' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
  { icon: ShieldCheck, label: 'Security', to: '/security' },
  { icon: Cpu, label: 'AI Insights', to: '/ai' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 h-screen border-r border-white/[0.05] bg-obsidian-void/50 backdrop-blur-xl flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center">
          <ShieldCheck className="text-obsidian-void w-6 h-6" />
        </div>
        <span className="font-grotesk font-bold text-xl tracking-tight">VIVA<span className="text-cyber-cyan">.</span>SEC</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "nav-link",
              isActive && "active"
            )}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/[0.05]">
        <button 
          onClick={handleLogout}
          className="nav-link w-full text-cyber-red/60 hover:text-cyber-red hover:bg-cyber-red/5"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">System Logout</span>
        </button>
      </div>
    </aside>
  );
}
