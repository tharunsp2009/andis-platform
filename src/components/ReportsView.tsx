import React, { useState } from 'react';
import { Terminal as TerminalIcon, FileText, Download, ShieldCheck, HelpCircle, HardDriveDownload, Sparkles, BarChart3, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IncidentReport } from '../types';

interface ReportsViewProps {
  incidentReports: IncidentReport[];
  showToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
}

export default function ReportsView({ incidentReports, showToast }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState<'forensics' | 'compliance' | 'executive' | 'exports'>('forensics');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wider uppercase">
            Reports & Audits Ledger
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
            AI-generated forensic dossiers, executive summaries, and export profiles
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('forensics')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'forensics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forensic Autopsies ({incidentReports.length})
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'compliance' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compliance Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'executive' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Executive Summaries
          </button>
          <button
            onClick={() => setActiveTab('exports')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'exports' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SOC Export Center
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
          {/* TAB 1: forensic autopsies */}
          {activeTab === 'forensics' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                    <TerminalIcon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">AI INCIDENT FORENSIC REPORT LEDGER</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Official forensic autopsies & autonomic mitigations</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {incidentReports.length > 0 ? (
                  incidentReports.map((report) => (
                    <div 
                      key={report.id}
                      className="bg-slate-900/15 border border-slate-800 p-5 rounded-2xl relative overflow-hidden font-mono text-xs shadow-sm hover:border-slate-700 transition-all leading-relaxed"
                    >
                      <div className="absolute right-0 top-0 w-32 h-32 rounded-full filter blur-2xl opacity-5 bg-indigo-500" />
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800/80 pb-3 mb-4">
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">AUTOPSY REF: #{report.id}</h4>
                          <span className="text-[9px] text-slate-500 font-mono uppercase">GENERATED AT {report.timestamp}</span>
                        </div>

                        <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase border tracking-wider shrink-0 ${
                          report.severity === 'Critical' || report.severity === 'High'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {report.severity} PRIORITY THREAT
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-300">
                        <div className="space-y-3 font-sans text-xs">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">AFFECTED MACHINE NAME / ID</span>
                            <span className="text-slate-100 font-bold uppercase block">{report.device}</span>
                          </div>

                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">AI INFRASTRUCTURE PATHOLOGY ANALYSIS</span>
                            <p className="text-slate-300 leading-normal">{report.explanation}</p>
                          </div>
                        </div>

                        <div className="space-y-4 font-sans text-xs flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">SUGGESTED OVERRIDE REMEDIATION</span>
                            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900/80 font-mono text-[11px] text-emerald-400 font-bold leading-normal">
                              {report.recommendedAction}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 font-mono text-[9px] font-black uppercase tracking-wider pt-2">
                            <button 
                              onClick={() => showToast ? showToast(`Exporting decrypted payload ticket for index #${report.id}`, 'success') : console.log(`Export ticket for #${report.id}`)}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-800 hover:border-indigo-500 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Export Cryptographic Ticket</span>
                            </button>
                            <button 
                              onClick={() => showToast ? showToast(`Triggering telemetry compliance patch to ${report.device}`, 'info') : console.log(`Deploy patch to ${report.device}`)}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-950/20 hover:bg-emerald-600 border border-emerald-900/60 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Deploy Live Hotfix</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-44 bg-slate-900/15 border border-slate-900 rounded-xl flex flex-col items-center justify-center text-center opacity-30 italic font-mono text-xs">
                    <FileText className="w-10 h-10 mb-2 opacity-50 text-indigo-400" />
                    <p>No critical incidents detected requiring forensic autopsy reports.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMPLIANCE BENCHMARKS */}
          {activeTab === 'compliance' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-6">
                <div className="bg-cyan-500/10 p-2 border border-cyan-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">Cybersecurity SOC Compliance Benchmarks</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">BENCHMARKED BASELINE RATIO ALIGNMENT</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-slate-900/35 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold uppercase">
                    <span>NIST Cybersecurity Alignment</span>
                    <span className="text-emerald-400">92% Met</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    NIST CSF compliance standards met for Host Access auditing, asset registries, anomaly detection loops, and incident logging mechanisms.
                  </p>
                </div>

                <div className="bg-slate-900/35 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold uppercase">
                    <span>SOC2 Type II Controls</span>
                    <span className="text-emerald-400">96% Audited</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    Real-time host monitoring, cryptographic administrative credential barriers, and automated incident recovery checklists are SOC2 verified.
                  </p>
                </div>

                <div className="bg-slate-900/35 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold uppercase">
                    <span>ISO/IEC 27001 ISMS</span>
                    <span className="text-amber-400">85% Aligned</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    Requires periodic penetration checks and security baseline calibrations to align and register compliance certificates for corporate assets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTIVE Summaries */}
          {activeTab === 'executive' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-6">
                <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">C-Suite Executive Overview & Summarizations</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">AI-curated business risk landscape translations</p>
                </div>
              </div>

              <div className="space-y-5 max-w-4xl text-xs font-sans text-slate-300">
                <div className="p-4 bg-slate-900/35 border border-slate-800 rounded-xl space-y-2.5">
                  <h4 className="text-white font-bold font-display uppercase tracking-wider text-xs">Operator Security Landscape Summary (Current Period)</h4>
                  <p className="leading-relaxed text-slate-300 font-sans">
                    During the monitored cycle, the ANDIS infrastructure handled all incoming connection layers successfully. Autonomic incident mitigation protocols neutralized any ddos, malware infection pathways, or server mining injections within an average window of 1.4 seconds. System integrity ratios remain high at 100%, with zero downtime anomalies.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-xl">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">Defense Intercept ratio</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">100% Intercept</div>
                  </div>
                  <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-xl">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">Host Mitigate Window</div>
                    <div className="text-xl font-black text-slate-100 font-mono">1.33 seconds</div>
                  </div>
                  <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-xl">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">Corporate SLA Uptime</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">99.998% Uptime</div>
                  </div>
                  <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-xl">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">Heuristic Baseline Confidence</div>
                    <div className="text-xl font-black text-slate-100 font-mono">98.5% score</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOC EXPORT CENTER */}
          {activeTab === 'exports' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-6">
                <div className="bg-emerald-500/10 p-2 border border-emerald-500/20 rounded-lg">
                  <HardDriveDownload className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">Cybersecurity Log Export Center</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">CERTIFIED DATA ARCHIVE EXPORTER</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
                <div className="p-5 bg-slate-900/35 border border-slate-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display mb-1.5 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      Export Telemetry Socket Metrics
                    </h4>
                    <span className="text-[10px] text-slate-400 font-sans block leading-normal mb-4">
                      Extract structured JSON metrics representing CPU peaks, system runtimes, thread loops, packet ratios, and network bandwidth data.
                    </span>
                  </div>
                  <button 
                    onClick={() => showToast ? showToast('Generating certified telemetry JSON report package...', 'success') : console.log('Export telemetry JSON')}
                    className="w-full py-2 bg-slate-900 border border-slate-800 text-xs text-indigo-400 hover:text-white hover:border-indigo-500 font-mono font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    Generate JSON Payload Package
                  </button>
                </div>

                <div className="p-5 bg-slate-900/35 border border-slate-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display mb-1.5 flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-amber-400" />
                      Export Inbound Threat Matrix Logs
                    </h4>
                    <span className="text-[10px] text-slate-400 font-sans block leading-normal mb-4">
                      Download complete CSV structures of anomalies caught by IPS baseline filters, containing timestamps, local socket bindings, and foreign threat origin countries.
                    </span>
                  </div>
                  <button 
                    onClick={() => showToast ? showToast('Compiling standard CSV alert audit tables...', 'success') : console.log('Compile CSV Matrix')}
                    className="w-full py-2 bg-slate-900 border border-slate-800 text-xs text-indigo-400 hover:text-white hover:border-indigo-500 font-mono font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    Compile CSV Matrix
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
