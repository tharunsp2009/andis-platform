import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Activity, Cpu, Network, Zap, Shield, AlertTriangle, Terminal, CalendarRange, Play, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { ThreatAlert, AIAnalysis, Metrics, TimelineEvent } from '../types';

interface ThreatInvestigationViewProps {
  history: Metrics[];
  alerts: ThreatAlert[];
  aiAnalyses: AIAnalysis[];
  timeline: TimelineEvent[];
}

export default function ThreatInvestigationView({
  history,
  alerts,
  aiAnalyses,
  timeline
}: ThreatInvestigationViewProps) {
  const [activeTab, setActiveTab] = useState<'ledger' | 'ai_analysis' | 'visual_charts' | 'timeline'>('ledger');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll timeline console
  useEffect(() => {
    if (activeTab === 'timeline' && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [timeline, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header with inline tab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wider uppercase">
            Threat Investigation Hub
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
            Deep analysis, logs diagnostics, and machine learning autopsies
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 p-1 rounded-xl gap-0.5">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'ledger' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anomalies Ledger
          </button>
          <button
            onClick={() => setActiveTab('ai_analysis')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'ai_analysis' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('visual_charts')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'visual_charts' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Telemetry Charts
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Incident Timeline Log
          </button>
        </div>
      </div>

      {/* Selective tab content rendering to optimize SOC rendering speed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.12 }}
        >
          {/* TAB 1: THREAT DETECTION LEDGER */}
          {activeTab === 'ledger' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/10 p-2 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Threat Detection Anomalies Ledger</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Live system anomalies & historical alert vectors</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-1 font-mono text-xs">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex justify-between items-start py-3.5 border-b border-slate-900 leading-relaxed text-slate-300 hover:bg-slate-900/10 px-2 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping mr-1" />
                        <span className="text-red-400 font-bold">{alert.message}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-4 font-mono">{alert.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center opacity-30 italic">
                    <Shield className="w-10 h-10 mb-2 opacity-50 text-indigo-400" />
                    <p>No threat anomalies captured in the database journal.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AI DIAGNOSTICS & AUTOPSY */}
          {activeTab === 'ai_analysis' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2 border border-amber-500/20 rounded-lg">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">AI Automated Baseline Diagnostics</h3>
                    <p className="text-[10px] text-slate-500 font-mono">AI-Engine real-time deep incident pathology summaries</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {aiAnalyses.length > 0 ? (
                  aiAnalyses.map((analysis) => (
                    <div key={analysis.id} className="bg-slate-900/35 border border-slate-800/80 p-5 rounded-xl relative leading-relaxed flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <span className="text-[9px] font-mono font-black uppercase text-red-400 tracking-wider bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                            {analysis.attackType}
                          </span>
                          <span className={`px-2 py-0.5 text-[8px] font-mono font-black rounded uppercase border tracking-wider ${
                            analysis.severity === 'Critical' || analysis.severity === 'High'
                              ? 'bg-red-500/10 border-red-500/20 text-red-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}>
                            {analysis.severity} Priority
                          </span>
                        </div>
                        <h4 className="font-display text-xs font-bold text-white mt-1.5 uppercase">Target Host: {analysis.targetDevice}</h4>
                        <p className="text-[11px] text-slate-300 leading-normal mt-2 font-sans mb-4">{analysis.explanation}</p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-900/80 text-[10px] font-mono text-emerald-400">
                        <span className="text-slate-500 font-bold uppercase block text-[8px] tracking-wider mb-1">SUGGESTED DEPLOY REMEDIATE</span>
                        <span className="font-bold">{analysis.recommendedAction}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 h-44 flex flex-col items-center justify-center text-center opacity-30 italic font-mono text-xs text-slate-400/80">
                    <Zap className="w-10 h-10 mb-2 opacity-50 text-amber-400" />
                    <p>Waiting for network anomalies to parse dynamic AI diagnostics...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL TELEMETRY ANALYTICS SUITE */}
          {activeTab === 'visual_charts' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-6">
                <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">Visual Telemetry Analytics Charts</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Telemetry Buffer: Historical live update iterations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* CPU Chart */}
                <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">System Core Workload %</span>
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="h-[200px] w-full mt-2 select-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.4} />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#cbd5e1', fontSize: '10px', fontFamily: 'monospace' }}
                          itemStyle={{ color: '#cbd5e1' }}
                          labelFormatter={() => 'Update Time'}
                        />
                        <Area type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Network Connections Chart */}
                <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Total Socket Threads</span>
                    <Network className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="h-[200px] w-full mt-2 select-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.4} />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis domain={[0, 'auto']} hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#cbd5e1', fontSize: '10px', fontFamily: 'monospace' }}
                          itemStyle={{ color: '#cbd5e1' }}
                          labelFormatter={() => 'Update Time'}
                        />
                        <Line type="monotone" dataKey="connections" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Process Count Chart */}
                <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Process Spikes Chart</span>
                    <Activity className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="h-[200px] w-full mt-2 select-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.4} />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis domain={[0, 'auto']} hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#cbd5e1', fontSize: '10px', fontFamily: 'monospace' }}
                          itemStyle={{ color: '#cbd5e1' }}
                          labelFormatter={() => 'Update Time'}
                        />
                        <Line type="stepAfter" dataKey="processes" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REAL-TIME INCIDENT CONSOLE / TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-[520px]">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Live Incident Timeline Console</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Stream daemon: andis_telemetry_journal.log</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded text-[9px] text-indigo-400 font-mono font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping mr-1" />
                  UPLINK ONLINE
                </div>
              </div>

              {/* Live Terminal Log Screen */}
              <div className="flex-1 bg-slate-900/50 border border-slate-900/80 rounded-xl p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-2 select-text selection:bg-indigo-500 selection:text-white">
                <div className="text-slate-500 text-[10px] italic mb-2 border-b border-slate-800 pb-2">
                  [ANDIS FORENSIC LOG MONITOR MATRIX ACTIVATED • BUFFER SECURED]
                </div>
                
                {timeline.slice().reverse().map((event, idx) => {
                  let tagColor = 'text-cyan-400';
                  let tagBg = 'bg-cyan-500/10 border-cyan-500/20';
                  let prefix = '[INFO]';

                  if (event.type === 'danger') {
                    tagColor = 'text-red-400';
                    tagBg = 'bg-red-500/15 border-red-500/25';
                    prefix = '[CRIT_BREACH]';
                  } else if (event.type === 'warning') {
                    tagColor = 'text-amber-400';
                    tagBg = 'bg-amber-500/10 border-amber-500/20';
                    prefix = '[ANOMALY_WARN]';
                  } else if (event.type === 'defense') {
                    tagColor = 'text-emerald-400';
                    tagBg = 'bg-emerald-500/15 border-emerald-500/25';
                    prefix = '[IPS_DEFENSE]';
                  }

                  return (
                    <div key={event.id || idx} className="flex items-start gap-2.5 leading-relaxed py-0.5 group">
                      <span className="text-slate-600 select-none text-[10px] pt-0.5 shrink-0">{event.timestamp}</span>
                      <span className={`px-1.5 py-0.2 rounded border text-[8px] font-black uppercase tracking-widest ${tagBg} ${tagColor} shrink-0`}>
                        {prefix}
                      </span>
                      <span className="text-slate-300 group-hover:text-white transition-colors">{event.description}</span>
                    </div>
                  );
                })}
                <div ref={consoleEndRef} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
