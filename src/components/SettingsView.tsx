import React, { useState } from 'react';
import { 
  Settings2, 
  ShieldCheck, 
  Database, 
  Bell, 
  Eye, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  RefreshCw, 
  Server,
  ZapOff,
  CreditCard,
  Award,
  History,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsViewProps {
  currentUser: string | null;
  riskLevel: string;
  isDefenseModeActive: boolean;
  handleActivateDefenseMode: () => void;
  telemetryMode?: 'REAL' | 'SIMULATION';
  isAttackSimulationEnabled?: boolean;
  setIsAttackSimulationEnabled?: (val: boolean) => void;
  subsystemStatus?: {
    telemetryEngine: 'PASS' | 'WARNING' | 'FAIL';
    threatEngine: 'PASS' | 'WARNING' | 'FAIL';
    riskEngine: 'PASS' | 'WARNING' | 'FAIL';
    deviceRegistry: 'PASS' | 'WARNING' | 'FAIL';
    dashboardSync: 'PASS' | 'WARNING' | 'FAIL';
  };
  license?: any;
  subscription?: any;
  features?: {
    ThreatIntel: boolean;
    AdvancedAnalytics: boolean;
    RollbackControl: boolean;
    PriorityUpdates: boolean;
  };
  auditLogs?: any[];
  onUpgrade?: (tier: "Developer" | "Business" | "Enterprise") => Promise<void>;
  onDowngrade?: (tier: "Developer" | "Business" | "Enterprise") => Promise<void>;
}

export default function SettingsView({
  currentUser,
  riskLevel,
  isDefenseModeActive,
  handleActivateDefenseMode,
  telemetryMode = 'SIMULATION',
  isAttackSimulationEnabled = false,
  setIsAttackSimulationEnabled,
  subsystemStatus = {
    telemetryEngine: 'PASS',
    threatEngine: 'PASS',
    riskEngine: 'PASS',
    deviceRegistry: 'PASS',
    dashboardSync: 'PASS'
  },
  license = {
    tier: "Developer",
    status: "TRIAL",
    max_devices: 5,
    retention_days: 30,
    expires_at: new Date().toISOString()
  },
  subscription = {
    plan_name: "Developer",
    status: "ACTIVE",
    renewal_date: new Date().toISOString()
  },
  features = {
    ThreatIntel: false,
    AdvancedAnalytics: false,
    RollbackControl: false,
    PriorityUpdates: false
  },
  auditLogs = [],
  onUpgrade = async () => {},
  onDowngrade = async () => {}
}: SettingsViewProps) {
  const [cpuThreshold, setCpuThreshold] = useState(70);
  const [connThreshold, setConnThreshold] = useState(30);
  const [siemEndpoint, setSiemEndpoint] = useState('https://siem.andis-internal.net/v1/telemetry');
  const [autoIsolation, setAutoIsolation] = useState(true);
  const [sandboxing, setSandboxing] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentTier = license?.tier || "Developer";

  const handlePlanChange = async (tier: "Developer" | "Business" | "Enterprise") => {
    setIsUpdating(true);
    try {
      if (tier === "Enterprise" || (tier === "Business" && currentTier === "Developer")) {
        await onUpgrade(tier);
      } else {
        await onDowngrade(tier);
      }
    } catch (err) {
      console.error("Failed to change plan:", err);
    } finally {
      setTimeout(() => setIsUpdating(false), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wider uppercase">
            Platform Settings & Calibrations
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
            Configure system threat gates, SIEM pipelines, and defensive configurations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Alert Gates */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 border-b border-slate-900 pb-3 mb-5">
            <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Telemetry Heuristic Thresholds</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase">TUNING LEVEL CALIBRATIONS FOR TRIGGERING ANOMALIES</p>
            </div>
          </div>

          <div className="space-y-5 text-xs font-mono">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">CPU Threat Limit Spike</span>
                <span className="text-indigo-400 font-bold">{cpuThreshold}% Workload</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={cpuThreshold} 
                onChange={(e) => setCpuThreshold(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer bg-slate-900 h-1.5 rounded"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Concurrent Socket Limit</span>
                <span className="text-indigo-400 font-bold">{connThreshold} Sockets</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="100" 
                value={connThreshold} 
                onChange={(e) => setConnThreshold(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer bg-slate-900 h-1.5 rounded"
              />
            </div>
          </div>
        </div>

        {/* Card 2: IPS Defensive Safeguards */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 border-b border-slate-900 pb-3 mb-5">
            <div className="bg-emerald-500/10 p-2 border border-emerald-500/20 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Autonomic IPS Safeguards</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase">AUTONOMIC POLICIES FOR INTRUSION REMEDIATION</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans text-slate-300">
            <div className="flex items-center justify-between p-3.5 bg-slate-900/30 rounded-xl border border-slate-900">
              <div>
                <h4 className="font-bold text-white uppercase text-[11px]">Automatic Device Quarantine</h4>
                <p className="text-[10px] text-slate-500 mt-1">Isolate hosts immediately when High/Critical malware patterns are flagged.</p>
              </div>
              <button 
                onClick={() => setAutoIsolation(!autoIsolation)}
                className={`w-12 h-6 rounded-full transition-all flex items-center p-1 cursor-pointer ${
                  autoIsolation ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-900/30 rounded-xl border border-slate-900">
              <div>
                <h4 className="font-bold text-white uppercase text-[11px]">Sandbox Virtual Kernels</h4>
                <p className="text-[10px] text-slate-500 mt-1">Route unverified connection streams through restricted virtual environments.</p>
              </div>
              <button 
                onClick={() => setSandboxing(!sandboxing)}
                className={`w-12 h-6 rounded-full transition-all flex items-center p-1 cursor-pointer ${
                  sandboxing ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </button>
            </div>

            {setIsAttackSimulationEnabled && (
              <div className="flex items-center justify-between p-3.5 bg-slate-900/30 rounded-xl border border-slate-900">
                <div>
                  <h4 className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                    Background Attack Simulation
                    <span className="px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black border border-rose-550/30 bg-rose-500/10 text-rose-400 uppercase tracking-tight">Test Rig</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">Simulate random ingress intrusions dynamically for continuous stress-testing.</p>
                </div>
                <button 
                  onClick={() => setIsAttackSimulationEnabled(!isAttackSimulationEnabled)}
                  className={`w-12 h-6 rounded-full transition-all flex items-center p-1 cursor-pointer ${
                    isAttackSimulationEnabled ? 'bg-rose-600 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: SIEM pipelines */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 border-b border-slate-900 pb-3 mb-5">
            <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Enterprise SIEM Pipelines</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase">CENTRAL DECRYPTION GATE INTEGRATION URLS</p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <span className="text-slate-400">SIEM SECURE LOG ENDPOINT</span>
              <input 
                type="text" 
                value={siemEndpoint}
                onChange={(e) => setSiemEndpoint(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800/80 p-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500 rounded-lg"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-sans leading-normal">
              SIEM transmission pipelines route structured auditing packets in syslog formatting using encrypted TLS 1.3 buffers.
            </p>
          </div>
        </div>

        {/* Card 4: Session credentials */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 border-b border-slate-900 pb-3 mb-5">
            <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">CISO Session Profile</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase">ACTIVE IDENTITY AUDIT CONTROLS</p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
              <span>Primary Username</span>
              <span className="font-bold text-white">{currentUser || 'Operator'}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
              <span>Security Group Role</span>
              <span className="text-indigo-400 font-bold uppercase">CISO_ROOT_ADMIN</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Security Threat Mode</span>
              <span className="text-red-400 font-bold uppercase">{riskLevel} RISK SYSTEM</span>
            </div>
          </div>
        </div>

        {/* Card 5: System Service & Integrity Audit Validator (Phase 8 Dashboard) */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-900 gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                <Terminal className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Subsystem Accuracy Verification Panel</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Phase 8 Security Compliance & Telemetry Audit Diagnostics</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
              <span>Realtime Audit Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Subsystem 1: Telemetry Engine */}
            <div className="bg-slate-900/25 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">Telemetry Engine</span>
                <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black border rounded ${
                  subsystemStatus.telemetryEngine === 'PASS' 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                }`}>
                  {subsystemStatus.telemetryEngine}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white uppercase">Source: {telemetryMode}</p>
                <p className="text-[9px] text-slate-500 leading-normal font-sans">
                  {telemetryMode === 'REAL' 
                    ? 'Connected to Express Node andis-host system hardware APIs.' 
                    : 'Express telemetry offline or client fallback. Operating test sandbox.'}
                </p>
              </div>
            </div>

            {/* Subsystem 2: Threat Engine */}
            <div className="bg-slate-900/25 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">Threat Engine</span>
                <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black border rounded ${
                  subsystemStatus.threatEngine === 'PASS' 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                }`}>
                  {subsystemStatus.threatEngine}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white uppercase">State: AUDITING</p>
                <p className="text-[9px] text-slate-500 leading-normal font-sans">
                  Signature analyzer checking ingress activity log feeds and preventing alert inflation triggers.
                </p>
              </div>
            </div>

            {/* Subsystem 3: Risk Engine */}
            <div className="bg-slate-900/25 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">Risk Engine</span>
                <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black border rounded ${
                  subsystemStatus.riskEngine === 'PASS' 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                }`}>
                  {subsystemStatus.riskEngine}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white uppercase">Metrics: DYNAMIC</p>
                <p className="text-[9px] text-slate-500 leading-normal font-sans">
                  Calculated dynamically from active threats, anomalies, host workloads, and device isolations.
                </p>
              </div>
            </div>

            {/* Subsystem 4: Device Registry */}
            <div className="bg-slate-900/25 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">Registry</span>
                <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black border rounded ${
                  subsystemStatus.deviceRegistry === 'PASS' 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                }`}>
                  {subsystemStatus.deviceRegistry}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white uppercase">ID: {subsystemStatus.deviceRegistry === 'PASS' ? 'AUTHENTIC' : 'SIMULATED'}</p>
                <p className="text-[9px] text-slate-500 leading-normal font-sans">
                  {subsystemStatus.deviceRegistry === 'PASS' 
                    ? 'User endpoint registered with validated physical machine.' 
                    : 'Enterprise dev nodes marked as test-bench simulations.'}
                </p>
              </div>
            </div>

            {/* Subsystem 5: Sync Status */}
            <div className="bg-slate-900/25 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">Dashboard Sync</span>
                <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black border rounded ${
                  subsystemStatus.dashboardSync === 'PASS' 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                }`}>
                  {subsystemStatus.dashboardSync}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white uppercase">Frequency: 3s</p>
                <p className="text-[9px] text-slate-500 leading-normal font-sans">
                  Dashboard lock step synced with central Express state machine polling loops.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Subscription & Security Feature Matrix (Step 39) */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-900 gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">ANDIS Agent Subscriptions & Feature Flag Licensing</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Multi-Tenant Isolation & Continuous Subscription Auditing Engine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase font-bold text-slate-500">License status:</span>
              <span className={`px-2 py-0.5 text-[9px] font-mono font-black border rounded ${
                license.status === 'ACTIVE' || license.status === 'TRIAL' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse'
              }`}>
                {license.status || 'ACTIVE'}
              </span>
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Developer Card */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentTier === 'Developer' 
                ? 'bg-indigo-650/10 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                : 'bg-slate-900/10 border-slate-900 hover:border-slate-800'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-black">Startup Tier</span>
                  <h4 className="font-display text-sm font-bold text-white uppercase">Developer</h4>
                </div>
                {currentTier === 'Developer' && <span className="text-[8.5px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black uppercase">Active</span>}
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-normal mb-4">
                Basic threat diagnostics and log telemetry for minor endpoints sandbox.
              </p>
              <div className="space-y-1 text-[10px] font-mono text-slate-400 mb-6 border-t border-slate-900 pt-3">
                <div className="flex justify-between"><span>Max Device Nodes:</span><span className="text-white font-bold">5 Devices</span></div>
                <div className="flex justify-between"><span>Log Retention:</span><span className="text-white font-bold">30 Days</span></div>
                <div className="flex justify-between"><span>Rollback Controls:</span><span className="text-rose-400">UNAVAILABLE</span></div>
              </div>
              {currentTier !== 'Developer' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handlePlanChange('Developer')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 py-1.5 text-[9px] font-mono font-black uppercase rounded-lg transition-all cursor-pointer"
                >
                  Downgrade Plan
                </button>
              )}
            </div>

            {/* Business Card */}
            <div className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
              currentTier === 'Business' 
                ? 'bg-indigo-650/10 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                : 'bg-slate-900/10 border-slate-900 hover:border-slate-800'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-black">Commercial Tier</span>
                  <h4 className="font-display text-sm font-bold text-white uppercase">Business</h4>
                </div>
                {currentTier === 'Business' && <span className="text-[8.5px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black uppercase">Active</span>}
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-normal mb-4">
                Full telemetry pipeline, active threat research access, and version rollback capability.
              </p>
              <div className="space-y-1 text-[10px] font-mono text-slate-400 mb-6 border-t border-slate-900 pt-3">
                <div className="flex justify-between"><span>Max Device Nodes:</span><span className="text-white font-bold">100 Devices</span></div>
                <div className="flex justify-between"><span>Log Retention:</span><span className="text-white font-bold">180 Days</span></div>
                <div className="flex justify-between"><span>Rollback Controls:</span><span className="text-emerald-400 font-bold">ENABLED</span></div>
              </div>
              {currentTier !== 'Business' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handlePlanChange('Business')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 text-[9px] font-mono font-black uppercase rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  {currentTier === 'Developer' ? 'Upgrade Plan' : 'Downgrade Plan'}
                </button>
              )}
            </div>

            {/* Enterprise Card */}
            <div className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
              currentTier === 'Enterprise' 
                ? 'bg-indigo-650/10 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                : 'bg-slate-900/10 border-slate-900 hover:border-slate-800'
            }`}>
              <div className="absolute top-0 right-0 bg-indigo-600 text-[6.5px] font-mono font-black uppercase tracking-tight px-1.5 py-0.5 rounded-bl">
                CISO Default
              </div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-black">Unlimited Tier</span>
                  <h4 className="font-display text-sm font-bold text-white uppercase">Enterprise</h4>
                </div>
                {currentTier === 'Enterprise' && <span className="text-[8.5px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black uppercase">Active</span>}
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-normal mb-4">
                Advanced analytics, multi-tenant administrative capabilities, and priority delivery updates.
              </p>
              <div className="space-y-1 text-[10px] font-mono text-slate-400 mb-6 border-t border-slate-900 pt-3">
                <div className="flex justify-between"><span>Max Device Nodes:</span><span className="text-white font-bold">Unlimited</span></div>
                <div className="flex justify-between"><span>Log Retention:</span><span className="text-white font-bold">365+ Days</span></div>
                <div className="flex justify-between"><span>Rollback Controls:</span><span className="text-emerald-400 font-bold">FULL ROLLBACK</span></div>
              </div>
              {currentTier !== 'Enterprise' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handlePlanChange('Enterprise')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 text-[9px] font-mono font-black uppercase rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  Upgrade to Enterprise
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Feature Active Flags (Feature Flag Engine Matrix) */}
            <div className="bg-slate-900/15 border border-slate-900 p-4 rounded-xl">
              <h4 className="text-white font-display text-xs font-bold uppercase mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" />
                Licensed Feature Flags Gate
              </h4>
              <p className="text-[9px] text-slate-500 font-sans leading-snug mb-4">
                Features automatically switch status based on your subscription. Changes synchronize down onto all agent background processes.
              </p>
              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex items-center justify-between p-2 bg-slate-900/25 border border-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Advanced Threat Intel feeds (`ThreatIntel`):</span>
                  {features.ThreatIntel ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-400"><Check className="w-3.5 h-3.5" /> ENABLED</span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-slate-500"><X className="w-3.5 h-3.5" /> LOCKED</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/25 border border-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Heuristic AI Analytics (`AdvancedAnalytics`):</span>
                  {features.AdvancedAnalytics ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-400"><Check className="w-3.5 h-3.5" /> ENABLED</span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-slate-500"><X className="w-3.5 h-3.5" /> LOCKED</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/25 border border-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Agent Version Rollback (`RollbackControl`):</span>
                  {features.RollbackControl ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-400"><Check className="w-3.5 h-3.5" /> ENABLED</span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-slate-500"><X className="w-3.5 h-3.5" /> LOCKED</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/25 border border-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Priority Release channel (`PriorityUpdates`):</span>
                  {features.PriorityUpdates ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-400"><Check className="w-3.5 h-3.5" /> ENABLED</span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-slate-500"><X className="w-3.5 h-3.5" /> LOCKED</span>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Auditing Log */}
            <div className="bg-slate-900/15 border border-slate-900 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <h4 className="text-white font-display text-xs font-bold uppercase mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-400" />
                  Subscription Access Audit Records
                </h4>
                <p className="text-[9px] text-slate-500 font-sans leading-snug mb-3">
                  Cryptographically secure log stream of licensing modifications and subscription state updates.
                </p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 max-h-[140px] overflow-y-auto custom-scrollbar font-mono text-[9px] text-slate-400 space-y-1.5">
                {auditLogs.length > 0 ? (
                  [...auditLogs].reverse().map((log: any, index: number) => (
                    <div key={index} className="border-b border-slate-900/60 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex justify-between font-bold text-slate-300">
                        <span>[{log.action}]</span>
                        <span className="text-indigo-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-500 leading-normal mt-0.5">{log.details}</div>
                      <div className="text-[7.5px] uppercase font-black text-emerald-500/80 mt-0.5">status_validation: {log.result}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-6">No audits recorded.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
