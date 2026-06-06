import React, { useState, useEffect } from 'react';
import { Globe, BookOpen, Clock, Zap, ShieldCheck, Activity, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreatIntelAlert, ThreatPrediction } from '../types';

interface ThreatIntelligenceViewProps {
  threatIntelAlerts: ThreatIntelAlert[];
  predictions: ThreatPrediction[];
}

export default function ThreatIntelligenceView({
  threatIntelAlerts,
  predictions
}: ThreatIntelligenceViewProps) {
  const [pulseIndex, setPulseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'map' | 'bulletins' | 'predictions'>('map');

  // Animate connection lines on the map
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wider uppercase">
            Global Threat Intel
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
            Intercepted malware networks, vulnerability pools, and forecasts
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'map' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vector Map Radar
          </button>
          <button
            onClick={() => setActiveTab('bulletins')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'bulletins' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Campaign Feed
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'predictions' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Probability AI Models
          </button>
        </div>
      </div>

      {/* Selective tab load contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.12 }}
          className="space-y-6"
        >
          {/* TAB 1: RADAR VECTOR MAP */}
          {activeTab === 'map' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 border border-blue-500/20 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '40s' }} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">GLOBAL OBSERVATIONAL CYBER VECTOR MAP</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">REAL-TIME VISUALIZATION OF COORDINATED INGRESS ANOMALIES</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-blue-500/5 px-2.5 py-1 rounded border border-blue-500/10 text-[9px] text-blue-400 font-semibold font-mono tracking-wider uppercase">
                  VECTOR RADAR ATTACHED
                </div>
              </div>

              {/* Map Grid Container with pulsing nodes */}
              <div className="relative w-full h-[320px] bg-slate-900/15 border border-slate-900 rounded-xl overflow-hidden flex items-center justify-center select-none shadow-inner">
                {/* Cyber matrix background lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
                
                <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Beijing to US Link */}
                  <path d="M 640 110 Q 420 70 200 130" stroke="#f87171" strokeWidth="1.5" strokeDasharray="5,5" fill="none" opacity={pulseIndex === 1 ? 0.9 : 0.3} className="transition-opacity duration-500" />
                  <circle cx="200" cy="130" r="4" fill="#ef4444" className="animate-ping" />
                  
                  {/* Moscow to US Link */}
                  <path d="M 520 80 Q 360 40 200 130" stroke="#f87171" strokeWidth="1.5" strokeDasharray="5,5" fill="none" opacity={pulseIndex === 2 ? 0.9 : 0.3} className="transition-opacity duration-500" />
                  <circle cx="520" cy="80" r="4" fill="#ef4444" className="animate-ping" />

                  {/* Berlin to New York Link */}
                  <path d="M 440 95 Q 320 80 200 130" stroke="#f87171" strokeWidth="1.5" strokeDasharray="5,5" fill="none" opacity={pulseIndex === 3 ? 0.9 : 0.3} className="transition-opacity duration-500" />
                  <circle cx="440" cy="95" r="4" fill="#ef4444" />

                  {/* Bangalore to server Link */}
                  <path d="M 590 160 Q 400 140 200 130" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,5" fill="none" opacity={pulseIndex === 4 ? 0.9 : 0.3} className="transition-opacity duration-500" />
                  <circle cx="590" cy="160" r="4" fill="#fbbf24" />
                </svg>

                {/* Floating Neon Node Labels */}
                <div className="absolute top-[130px] left-[15%] md:left-[20%] text-center">
                  <span className="relative flex h-2 w-2 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-bounce"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <div className="mt-1 text-[8px] font-mono text-cyan-400 font-bold bg-slate-950/80 px-1 py-0.5 rounded border border-cyan-500/20 uppercase">US_BOUND_GATEWAY</div>
                </div>

                <div className="absolute top-[80px] right-[40%] text-center">
                  <span className="relative flex h-2 w-2 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <div className="mt-1 text-[8px] font-mono text-red-400 font-bold bg-slate-950/80 px-1 py-0.5 rounded border border-red-500/20 uppercase">MOSCOW_SERVER_C2</div>
                </div>

                <div className="absolute top-[110px] right-[25%] text-center">
                  <span className="relative flex h-2 w-2 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <div className="mt-1 text-[8px] font-mono text-red-400 font-bold bg-slate-950/80 px-1 py-0.5 rounded border border-red-500/20 uppercase">BEIJING_BOTNOD_Z</div>
                </div>

                <div className="absolute top-[160px] right-[30%] text-center">
                  <span className="relative flex h-2 w-2 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <div className="mt-1 text-[8px] font-mono text-amber-400 font-bold bg-slate-950/80 px-1 py-0.5 rounded border border-amber-500/20 uppercase">MUMBAI_BOT_P</div>
                </div>

                {/* Interactive Legends Panel overlay */}
                <div className="absolute bottom-3 left-4 p-3 bg-slate-950/90 rounded-lg border border-slate-800/80 text-[9px] font-mono text-slate-400 space-y-1 backdrop-blur-sm shadow-md">
                  <div className="text-white font-bold uppercase tracking-wider mb-1">Observation Nodes</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Target Bound Endpoint (Safe)</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical Command Anomaly</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Suspicious Scan Vector</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPAIGN BULLETIN FEED */}
          {activeTab === 'bulletins' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 border border-blue-500/20 rounded-lg">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Global Threat Intelligence Bulletins</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Real-world campaigns, vulnerability updates, and threat match feeds</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {threatIntelAlerts.length > 0 ? (
                  threatIntelAlerts.map((bulletin) => (
                    <motion.div 
                      key={bulletin.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900/35 border-l-2 border-blue-500 p-5 rounded-r-xl relative hover:bg-slate-900/60 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <h4 className="text-xs font-bold text-slate-100 uppercase leading-snug font-display">{bulletin.title}</h4>
                          <span className={`px-2 py-0.5 text-[8px] font-mono font-black uppercase text-white rounded shrink-0 ${
                            bulletin.severity === 'Critical' ? 'bg-red-500' :
                            bulletin.severity === 'High' ? 'bg-amber-500 text-slate-950' : 'bg-blue-500'
                          }`}>
                            {bulletin.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans mb-4">{bulletin.description}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-blue-400 border-t border-slate-950 pt-2.5">
                        <div className="flex items-center gap-1.5 text-blue-300">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Remediation Strategy: {bulletin.recommendedAction}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 h-44 flex flex-col items-center justify-center text-center opacity-30 italic font-mono text-xs text-slate-400">
                    <Clock className="w-10 h-10 mb-2 animate-spin text-blue-400" style={{ animationDuration: '4s' }} />
                    <p>Establishing encrypted payload tunnels to international Intel systems...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROBABILITY FORECAST MODELS */}
          {activeTab === 'predictions' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2 border border-amber-500/20 rounded-lg">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Cyber Vector Probabilities Neural Pool</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Probabilistic estimated forecasting of vulnerability pools</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-w-3xl">
                <div className="p-4 rounded-xl bg-slate-900/35 border border-slate-800/60 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                    <span className="font-bold">Neural Intel Pipeline Active</span>
                    <span className="text-emerald-400 font-bold block">MODEL_AI_FORECAST_SYS</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    The predictive calculation model utilizes telemetry matrix records and active socket loops to forecast vector risks, neutralizing advanced attacks before they manifest.
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase font-black text-slate-500 tracking-wider">Estimated threat probability indicators</span>
                  
                  {predictions.map((pred) => (
                    <div key={pred.id} className="p-4 bg-slate-900/20 border border-slate-800 rounded-xl space-y-2.5 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 uppercase font-display">{pred.type} vector probability</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Estimated vector key: #{pred.id}</p>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-400">{pred.probability}% risk</span>
                      </div>

                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pred.probability}%` }} />
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans italic">
                        Reason: {pred.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
