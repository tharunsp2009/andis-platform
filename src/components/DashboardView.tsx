import React from 'react';
import { Shield, Zap, Monitor, Activity, AlertCircle, ArrowUpRight, Search, ShieldAlert, Cpu, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Device, TimelineEvent } from '../types';

interface DashboardViewProps {
  isSecure: boolean;
  securityStats: {
    totalThreats: number;
    activeThreats: number;
    ddosAttacks: number;
    malwareAttacks: number;
    cryptoMiningAttacks: number;
    defensesTriggered: number;
    totalDevices: number;
  };
  devices: Device[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskColor: string;
  alerts: { id: string; timestamp: string; message: string; }[];
  timeline: TimelineEvent[];
  setActiveTab: (tab: 'dashboard' | 'devices' | 'investigation' | 'intelligence' | 'command' | 'reports' | 'settings') => void;
  riskScore: number;
}

export default function DashboardView({
  isSecure,
  securityStats,
  devices,
  riskLevel,
  riskColor,
  alerts,
  setActiveTab,
  riskScore
}: DashboardViewProps) {
  const latestAlert = alerts.length > 0 ? alerts[0].message : 'No critical alerts detected in the current queue.';

  // Map calculated score to readable Security Status (Phase 4 Audited Rules)
  let securityStatusStr = 'SAFE';
  let statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  let statusBadge = 'bg-emerald-500';

  const calculatedScore = riskScore;

  if (calculatedScore >= 75 || securityStats.activeThreats >= 5) {
    securityStatusStr = 'CRITICAL';
    statusColor = 'text-rose-500 border-rose-500/20 bg-rose-500/5';
    statusBadge = 'bg-rose-500 animate-pulse';
  } else if (calculatedScore >= 50) {
    securityStatusStr = 'HIGH RISK';
    statusColor = 'text-red-400 border-red-500/20 bg-red-500/5';
    statusBadge = 'bg-red-500';
  } else if (calculatedScore >= 25) {
    securityStatusStr = 'MEDIUM RISK';
    statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    statusBadge = 'bg-amber-500';
  } else if (calculatedScore > 12) {
    securityStatusStr = 'LOW RISK';
    statusColor = 'text-yellow-400/90 border-yellow-500/20 bg-yellow-500/5';
    statusBadge = 'bg-yellow-450';
  } else {
    securityStatusStr = 'SAFE';
    statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    statusBadge = 'bg-emerald-500';
  }

  return (
    <div className="space-y-6 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      {/* Platform Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wider uppercase">
            Security Overview
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
            ANDIS SYSTEM ARCHITECTURE • LIVE CONTROL BASELINE
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${statusBadge}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusBadge.split(' ')[0]}`} />
          </span>
          <span className="font-bold tracking-wider uppercase">System Feed Operational</span>
        </div>
      </div>

      {/* Grid of exactly 5 cards - Above the Fold */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Card 1: Security Status */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between h-[140px] relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full filter blur-xl opacity-5 bg-indigo-500" />
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Security Status</span>
            <Shield className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </div>
          <div>
            <div className={`text-2xl font-display font-black tracking-tight ${statusColor.split(' ')[0]} transition-all`}>
              {securityStatusStr}
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase mt-1">Mitigation baselines active</p>
          </div>
        </div>

        {/* Card 2: Active Threats */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between h-[140px] relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full filter blur-xl opacity-5 bg-red-500" />
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Active Threats</span>
            <Zap className="w-4 h-4 text-slate-600 group-hover:text-red-500 transition-colors" />
          </div>
          <div>
            <div className={`text-4xl font-display font-black tracking-tight ${securityStats.activeThreats > 0 ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              {securityStats.activeThreats}
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase mt-1">IPS filter intercepting</p>
          </div>
        </div>

        {/* Card 3: Protected Devices */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between h-[140px] relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full filter blur-xl opacity-5 bg-cyan-500" />
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Protected Devices</span>
            <Monitor className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div>
            <div className="text-4xl font-display font-black text-slate-100 tracking-tight">
              {devices.length}
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase mt-1">Bound to live sockets</p>
          </div>
        </div>

        {/* Card 4: Global Risk Score */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between h-[140px] relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full filter blur-xl opacity-5 bg-amber-500" />
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Global Risk Score</span>
            <Activity className="w-4 h-4 text-slate-600 group-hover:text-amber-500 transition-colors" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-4xl font-display font-black tracking-tight ${
                riskLevel === 'LOW' ? 'text-emerald-400' : riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {calculatedScore}
              </span>
              <span className="text-slate-500 font-mono text-sm uppercase">/ 100</span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase mt-1">Live heuristic rating</p>
          </div>
        </div>

        {/* Card 5: Latest Critical Alert */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between h-[140px] relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full filter blur-xl opacity-5 bg-indigo-500" />
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Latest Critical Alert</span>
            <AlertCircle className="w-4 h-4 text-red-500 group-hover:animate-bounce transition-colors" />
          </div>
          <div>
            <div className="text-[10px] text-slate-300 font-mono line-clamp-2 leading-relaxed uppercase hover:text-white transition-colors">
              {latestAlert}
            </div>
            <p className="text-[8px] text-red-400 font-mono font-bold uppercase mt-1">ALERT DETECTED QUEUE</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel - Below Cards */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <h3 className="text-xs font-mono uppercase font-black text-slate-500 tracking-wider mb-5 pb-3 border-b border-slate-900">
          Quick Actions & Terminal Navigation Route
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quick Action: Investigate Threat */}
          <button
            id="qa_investigate_threat"
            onClick={() => setActiveTab('investigation')}
            className="group flex flex-col items-start text-left bg-slate-900/30 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500 p-5 rounded-xl transition-all cursor-pointer h-full relative"
          >
            <div className="flex justify-between w-full items-center mb-3">
              <div className="bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-600/20 transition-all">
                <Search className="w-5 h-5 text-indigo-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h4 className="text-sm font-display font-bold text-white uppercase group-hover:text-indigo-300 transition-colors">
              Investigate Threat
            </h4>
            <p className="text-[11px] text-slate-500 font-sans mt-2 leading-relaxed">
              Analyze incoming network payloads, view threat logs, and trigger automated deep forensic autopsies.
            </p>
          </button>

          {/* Quick Action: Scan Devices */}
          <button
            id="qa_scan_devices"
            onClick={() => setActiveTab('devices')}
            className="group flex flex-col items-start text-left bg-slate-900/30 hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500 p-5 rounded-xl transition-all cursor-pointer h-full relative"
          >
            <div className="flex justify-between w-full items-center mb-3">
              <div className="bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-600/20 transition-all">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h4 className="text-sm font-display font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
              Scan Devices
            </h4>
            <p className="text-[11px] text-slate-500 font-sans mt-2 leading-relaxed">
              Execute endpoint vulnerability scanning audits and manage connected client machine network isolation rules.
            </p>
          </button>

          {/* Quick Action: Activate Defense Mode */}
          <button
            id="qa_defense_mode"
            onClick={() => setActiveTab('command')}
            className="group flex flex-col items-start text-left bg-slate-900/30 hover:bg-emerald-600/10 border border-slate-800 hover:border-emerald-500 p-5 rounded-xl transition-all cursor-pointer h-full relative"
          >
            <div className="flex justify-between w-full items-center mb-3">
              <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-600/20 transition-all">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="text-sm font-display font-bold text-white uppercase group-hover:text-emerald-300 transition-colors">
              Activate Defense Mode
            </h4>
            <p className="text-[11px] text-slate-500 font-sans mt-2 leading-relaxed">
              Deploy intrusion shields immediately and manage high-priority network lockdown command overrides.
            </p>
          </button>

          {/* Quick Action: View Reports */}
          <button
            id="qa_view_reports"
            onClick={() => setActiveTab('reports')}
            className="group flex flex-col items-start text-left bg-slate-900/30 hover:bg-amber-600/10 border border-slate-800 hover:border-amber-500 p-5 rounded-xl transition-all cursor-pointer h-full relative"
          >
            <div className="flex justify-between w-full items-center mb-3">
              <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 group-hover:bg-amber-600/20 transition-all">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
            </div>
            <h4 className="text-sm font-display font-bold text-white uppercase group-hover:text-amber-300 transition-colors">
              View Reports
            </h4>
            <p className="text-[11px] text-slate-500 font-sans mt-2 leading-relaxed">
              Read formal AI-generated diagnostics, download cyber vulnerability audits, and generate technical summaries.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
