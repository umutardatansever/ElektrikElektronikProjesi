"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color: "cyan" | "blue" | "indigo" | "emerald" | "rose";
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, subtext, icon: Icon, color }) => {
  const colorMap = {
    cyan: {
      border: "hover:border-cyan-500/30 border-slate-800/40",
      glow: "bg-cyan-500/5",
      icon: "text-cyan-400 bg-cyan-950/30 border-cyan-900/30 shadow-[0_0_8px_rgba(34,211,238,0.2)]",
    },
    blue: {
      border: "hover:border-blue-500/30 border-slate-800/40",
      glow: "bg-blue-500/5",
      icon: "text-blue-400 bg-blue-950/30 border-blue-900/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]",
    },
    indigo: {
      border: "hover:border-indigo-500/30 border-slate-800/40",
      glow: "bg-indigo-500/5",
      icon: "text-indigo-400 bg-indigo-950/30 border-indigo-900/30 shadow-[0_0_8px_rgba(99,102,241,0.2)]",
    },
    emerald: {
      border: "hover:border-emerald-500/30 border-slate-800/40",
      glow: "bg-emerald-500/5",
      icon: "text-emerald-400 bg-emerald-950/30 border-emerald-900/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    },
    rose: {
      border: "hover:border-rose-500/30 border-slate-800/40",
      glow: "bg-rose-500/5",
      icon: "text-rose-400 bg-rose-950/30 border-rose-900/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]",
    },
  };

  const scheme = colorMap[color];

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl glass-card p-5 border transition-all duration-300 ${scheme.border}`}
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {/* Background Aura Glow */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl ${scheme.glow} pointer-events-none`} />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-slate-400 text-[9px] uppercase font-bold tracking-[0.15em]">{title}</span>
          <div className="text-2xl font-black text-white font-mono tracking-tight">{value}</div>
          <p className="text-[10px] text-slate-500 font-semibold">{subtext}</p>
        </div>
        <div className={`p-2.5 rounded-xl border ${scheme.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Cyber line detail */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800/50 to-transparent" />
    </motion.div>
  );
};
