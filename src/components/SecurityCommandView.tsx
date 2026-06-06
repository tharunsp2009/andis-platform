import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, Shield, Trash2, Power, History, Globe, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, AttackEvent, DefenseAction } from '../types';

interface SecurityCommandViewProps {
  devices: Device[];
  securityStats: {
    totalThreats: number;
    activeThreats: number;
    ddosAttacks: number;
    malwareAttacks: number;
    cryptoMiningAttacks: number;
    defensesTriggered: number;
    totalDevices: number;
  };
  activeAttack: string | null;
  threatLevel: { level: string; color: string; bg: string; border: string; };
  isDefenseModeActive: boolean;
  attackEvents: AttackEvent[];
  defenseHistory: DefenseAction[];
  handleScanAllDevices: () => void;
  handleActivateDefenseMode: () => void;
  handleResetThreatLogs: () => void;
  handleEmergencyLockdown: () => void;
}

export default function SecurityCommandView({
  devices,
  securityStats,
  activeAttack,
  threatLevel,
  isDefenseModeActive,
  attackEvents,
  defenseHistory,
  handleScanAllDevices,
  handleActivateDefenseMode,
  handleResetThreatLogs,
  handleEmergencyLockdown
}: SecurityCommandViewProps) {
  const [activeTab, setActiveTab] = useState<'console' | 'attacks' | 'history'>('console');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wider uppercase">
            Security Command Terminal
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
            IPS active firewalls, emergency lockdowns, and override overrides
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'console' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Command Overrides
          </button>
          <button
            onClick={() => setActiveTab('attacks')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'attacks' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Attack Sequence Matrix ({attackEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mitigation Audit Logs
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.12 }}
          className="space-y-6"
        >
          {/* TAB 1: COMMAND OVERRIDES CONSOLE */}
          {activeTab === 'console' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-6">
                <div className="bg-red-500/10 p-2 border border-red-500/20 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Tactical Override Dispatch</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Deploy defensive countermeasures instantly</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mode Status Dashboard */}
                <div className="bg-slate-900/15 border border-slate-800/80 p-5 rounded-xl space-y-4">
                  <h4 className="text-[10px] font-mono uppercase font-black text-slate-400">Command Baseline Diagnostics</h4>
                  <div className="space-y-3 font-mono text-xs text-slate-300">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
                      <span>Uplink State</span>
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded border uppercase ${
                        activeAttack ? 'bg-red-500/15 border-red-500/25 text-red-400 animate-pulse' :
                        threatLevel.level === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                      }`}>
                        {activeAttack ? 'Under Active Attack' : threatLevel.level === 'MEDIUM' ? 'Warning Alert' : 'Operational/Protected'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
                      <span>Online Secure Agents</span>
                      <span className="font-bold text-white">{devices.filter(d => d.status !== 'ISOLATED').length} online host sensors</span>
                    </div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
                      <span>Capture Anomalies</span>
                      <span className="font-bold text-red-400">{securityStats.totalThreats} anomalies captured</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>IPS Mitigation Triggers</span>
                      <span className="font-bold text-emerald-400">{securityStats.defensesTriggered} defenses deployed</span>
                    </div>
                  </div>
                </div>

                {/* Micro tactical control triggers */}
                <div className="bg-slate-900/15 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase font-black text-slate-400 mb-2">Manual Mitigation Dispatch</h4>
                    <span className="text-[10px] text-slate-500 font-sans block leading-normal mb-4">
                      Direct host triggers let operators bypass automated routines to execute scanning commands, activate full block lists, or run total lockdowns.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono font-bold uppercase tracking-wider">
                    <button 
                      onClick={handleScanAllDevices}
                      className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-800 hover:border-indigo-500 text-slate-200 hover:text-white hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Scan All Assets</span>
                    </button>
                    
                    <button 
                      onClick={handleActivateDefenseMode}
                      className={`flex items-center justify-center gap-1.5 py-2.5 border rounded-lg transition-all cursor-pointer ${
                        isDefenseModeActive 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold' 
                          : 'border-slate-800 hover:border-emerald-500 text-slate-200 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isDefenseModeActive ? 'IPS Active' : 'Enable IPS'}</span>
                    </button>

                    <button 
                      onClick={handleResetThreatLogs}
                      className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clear Core Logs</span>
                    </button>

                    <button 
                      onClick={handleEmergencyLockdown}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-red-950/20 text-red-400 hover:text-white hover:bg-red-600 border border-red-900/60 hover:border-red-500 rounded-lg transition-all font-black cursor-pointer shadow-md"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>Lockdown Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATTACK MATRIX SEQUENCE */}
          {activeTab === 'attacks' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/10 p-2 border border-red-500/20 rounded-lg">
                    <History className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Attack Matrix Sequence</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Live ingress network attack tracking metrics</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attackEvents.length > 0 ? (
                  attackEvents.map((event) => (
                    <div key={event.id} className="bg-slate-900/15 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="font-black uppercase text-red-404">{event.type} Threat Campaign</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-slate-950 ${
                          event.severity === 'High' ? 'bg-red-400' :
                          event.severity === 'Medium' ? 'bg-amber-400' : 'bg-blue-400 text-white'
                        }`}>
                          {event.severity}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 font-display">Target Client Agent: {event.target}</h4>
                      <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono pt-1.5 border-t border-slate-900">
                        <span>{event.timestamp}</span>
                        <span className="flex items-center gap-1 font-semibold uppercase text-slate-300">
                          <Globe className="w-2.5 h-2.5 text-slate-500" />
                          {event.originCountry}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 h-44 flex flex-col items-center justify-center text-center opacity-30 italic font-mono text-xs text-slate-400">
                    <ShieldCheck className="w-8 h-8 mb-1.5 text-emerald-400" />
                    <p>Inbound firewall buffers clean. No entries recorded.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATED DEFENSE OVERRIDE INDEX */}
          {activeTab === 'history' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2 border border-emerald-500/20 rounded-lg">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">IPS Autonomic Defensive History</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Automated conditions triggered and action outcomes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-w-4xl font-mono text-xs">
                {defenseHistory.length > 0 ? (
                  defenseHistory.map((defense) => (
                    <div key={defense.id} className="bg-slate-900/15 p-4 rounded-xl border border-slate-800 space-y-1.5 border-l-4 border-l-emerald-500 hover:border-slate-700 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black tracking-tight uppercase">
                            IPS MITIGATION SECURED
                          </span>
                          <span className="font-extrabold text-slate-200 uppercase text-[11px]">{defense.action}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">Override Condition: {defense.condition}</p>
                      </div>
                      <span className="text-[9px] text-slate-500 shrink-0">{defense.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center opacity-30 italic text-xs text-slate-400">
                    <HeartPulse className="w-8 h-8 mb-2 animate-pulse text-emerald-500" />
                    <p>No autonomic mitigation overrides deployed in the current session queue.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
