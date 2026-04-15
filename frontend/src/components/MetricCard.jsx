import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function MetricCard({ label, value, trend, status, variant = 'secondary', icon }) {
  return (
    <div className={cn(
      "p-6 relative group transition-all duration-500",
      variant === 'primary' && "bg-obsidian-surface border border-white/[0.08] shadow-[0_0_40px_rgba(143,245,255,0.03)]",
      variant === 'secondary' && "bg-obsidian-card/50 border border-white/[0.05]",
      variant === 'glass' && "glass-card",
      "hover:border-white/20 hover:-translate-y-1"
    )}>
      <div className="flex justify-between items-start mb-4">
        <span className="metric-label">{label}</span>
        {icon && <div className="text-white/20 group-hover:text-cyber-cyan transition-colors">{icon}</div>}
      </div>
      
      <div className="flex items-end gap-3">
        <h3 className="metric-value">{value}</h3>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-[10px] font-bold mb-1.5 px-2 py-0.5 rounded-full border",
            trend >= 0 ? "text-cyber-mint bg-cyber-mint/5 border-cyber-mint/20" : "text-cyber-red bg-cyber-red/5 border-cyber-red/20"
          )}>
            {trend >= 0 ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
         <span className="text-[10px] text-white/20 font-medium tracking-tight">ANALYSIS STATUS</span>
         <div className={cn(
           "h-1 px-3 rounded-full",
           status === 'safe' ? "bg-cyber-mint/20" : status === 'warning' ? "bg-yellow-500/20" : "bg-cyber-red/20"
         )} />
      </div>
    </div>
  );
}
