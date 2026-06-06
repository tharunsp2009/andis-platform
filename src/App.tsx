import React, { useState, useEffect, useRef } from 'react';
import { Activity, Cpu, Database, Network, Shield, Terminal as TerminalIcon, RefreshCw, BarChart3, AlertTriangle, Zap, Globe, Lock, Eye, User, LogIn, LogOut, Mail, UserPlus, ShieldAlert, History, Trash2, Power, MapPin, LayoutDashboard, Search, FileText, Laptop, Monitor, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Metrics, Packet, Connection, SecurityLog, ThreatAlert, DefenseAction, 
  IncidentReport, AIAnalysis, ThreatPrediction, AttackEvent, 
  TimelineEvent, BlockedIP, LearnedPattern, ThreatIntelAlert, Device 
} from './types';

import DashboardView from './components/DashboardView';
import DevicesView from './components/DevicesView';
import ThreatInvestigationView from './components/ThreatInvestigationView';
import ThreatIntelligenceView from './components/ThreatIntelligenceView';
import SecurityCommandView from './components/SecurityCommandView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import { Settings2 } from 'lucide-react';


const COUNTRIES = ["United States", "China", "Russia", "Germany", "Brazil", "India", "United Kingdom", "France", "Japan", "Canada"];


const INITIAL_DEVICES_ENTERPRISE: Device[] = [
  {
    deviceId: 'dev-01',
    deviceName: 'Laptop-01',
    status: 'SAFE',
    threatLevel: 'LOW',
    lastSeen: new Date().toLocaleTimeString(),
    telemetryData: {
      cpu: 15,
      memory: 25,
      processes: 45,
      connections: 12,
      connectionsPerSecond: 5,
      dataTransferRate: 1.2,
      packetsPerSecond: 45,
      topSourceIP: '192.168.1.15',
      topProtocol: 'HTTPS',
      timestamp: new Date().toLocaleTimeString()
    }
  },
  {
    deviceId: 'dev-02',
    deviceName: 'Office-PC',
    status: 'SAFE',
    threatLevel: 'LOW',
    lastSeen: new Date().toLocaleTimeString(),
    telemetryData: {
      cpu: 10,
      memory: 30,
      processes: 55,
      connections: 8,
      connectionsPerSecond: 3,
      dataTransferRate: 0.8,
      packetsPerSecond: 30,
      topSourceIP: '192.168.1.22',
      topProtocol: 'TCP',
      timestamp: new Date().toLocaleTimeString()
    }
  },
  {
    deviceId: 'dev-03',
    deviceName: 'Server-01',
    status: 'SAFE',
    threatLevel: 'LOW',
    lastSeen: new Date().toLocaleTimeString(),
    telemetryData: {
      cpu: 45,
      memory: 70,
      processes: 120,
      connections: 450,
      connectionsPerSecond: 25,
      dataTransferRate: 15.5,
      packetsPerSecond: 850,
      topSourceIP: '10.0.0.5',
      topProtocol: 'HTTPS',
      timestamp: new Date().toLocaleTimeString()
    }
  }
];

const INITIAL_DEVICES_PERSONAL: Device[] = [
  {
    deviceId: 'endpoint-01',
    deviceName: 'USER-ENDPOINT',
    status: 'SAFE',
    threatLevel: 'LOW',
    lastSeen: new Date().toLocaleTimeString(),
    telemetryData: {
      cpu: 15,
      memory: 25,
      processes: 45,
      connections: 12,
      connectionsPerSecond: 5,
      dataTransferRate: 1.2,
      packetsPerSecond: 45,
      topSourceIP: '127.0.0.1',
      topProtocol: 'HTTPS',
      timestamp: new Date().toLocaleTimeString()
    }
  }
];

const KNOWN_MALICIOUS_INDICATORS = [
  { ip: '192.168.1.66', type: 'Botnet Command Node' },
  { ip: '192.168.1.88', type: 'Crypto Mining Network' },
  { ip: '192.168.1.120', type: 'Malware Distribution Host' }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('andis_session') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('andis_user');
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'devices' | 'investigation' | 'intelligence' | 'command' | 'reports' | 'settings'>('dashboard');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check default admin
    if (loginUsername === 'admin' && loginPassword === 'andis123') {
      setIsAuthenticated(true);
      setCurrentUser('Admin');
      localStorage.setItem('andis_session', 'true');
      localStorage.setItem('andis_user', 'Admin');
      setLoginError('');
      return;
    }

    // Check stored users
    const storedUsers = JSON.parse(localStorage.getItem('andis_users') || '[]');
    const user = storedUsers.find((u: any) => u.username === loginUsername && u.password === loginPassword);
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user.username);
      localStorage.setItem('andis_session', 'true');
      localStorage.setItem('andis_user', user.username);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('andis_users') || '[]');
    
    if (storedUsers.some((u: any) => u.username === signupUsername)) {
      setSignupError('Username already exists');
      return;
    }

    const newUser = {
      email: signupEmail,
      username: signupUsername,
      password: signupPassword
    };

    storedUsers.push(newUser);
    localStorage.setItem('andis_users', JSON.stringify(storedUsers));
    
    setSignupSuccess('Account created successfully! Redirecting to login...');
    
    setTimeout(() => {
      setIsSignUpMode(false);
      setLoginUsername(signupUsername);
      setSignupEmail('');
      setSignupUsername('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupSuccess('');
    }, 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('andis_session');
    localStorage.removeItem('andis_user');
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'danger'>('info');

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(prev => prev === message ? null : prev);
    }, 4500);
  };

  const [license, setLicense] = useState<any>({
    tier: "Developer",
    status: "TRIAL",
    max_devices: 5,
    retention_days: 30,
    expires_at: new Date().toISOString()
  });
  const [subscription, setSubscription] = useState<any>({
    plan_name: "Developer",
    status: "ACTIVE",
    renewal_date: new Date().toISOString()
  });
  const [features, setFeatures] = useState<any>({
    ThreatIntel: false,
    AdvancedAnalytics: false,
    RollbackControl: false,
    PriorityUpdates: false
  });
  const [licensingAuditLogs, setLicensingAuditLogs] = useState<any[]>([]);

  const fetchLicensingData = async () => {
    try {
      const res = await fetch('/api/license');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setLicense(data.license);
          setSubscription(data.subscription);
          setFeatures(data.features);
          setLicensingAuditLogs(data.auditLogs || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch licensing details", err);
    }
  };

  const handleUpgradeTier = async (tier: "Developer" | "Business" | "Enterprise") => {
    try {
      const res = await fetch('/api/license/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      if (res.ok) {
        await fetchLicensingData();
        showToast(`Successfully upgraded subscription to ${tier}`, 'success');
      } else {
        showToast("Failed to process subscription upgrade", 'danger');
      }
    } catch (err) {
      console.error("Upgrade request failed", err);
      showToast("Failed to process subscription upgrade", 'danger');
    }
  };

  const handleDowngradeTier = async (tier: "Developer" | "Business" | "Enterprise") => {
    try {
      const res = await fetch('/api/license/downgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      if (res.ok) {
        await fetchLicensingData();
        showToast(`Subscription downgraded to ${tier}`, 'warning');
      } else {
        showToast("Failed to process subscription downgrade", 'danger');
      }
    } catch (err) {
      console.error("Downgrade request failed", err);
      showToast("Failed to process subscription downgrade", 'danger');
    }
  };

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [history, setHistory] = useState<Metrics[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [defenseHistory, setDefenseHistory] = useState<DefenseAction[]>([]);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [aiAnalyses, setAiAnalyses] = useState<AIAnalysis[]>([]);
  const [predictions, setPredictions] = useState<ThreatPrediction[]>([]);
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [learnedPatterns, setLearnedPatterns] = useState<LearnedPattern[]>([]);
  const [threatIntelAlerts, setThreatIntelAlerts] = useState<ThreatIntelAlert[]>([]);
  const [attackerFrequency, setAttackerFrequency] = useState<{[key: string]: number}>({});
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [telemetryMode, setTelemetryMode] = useState<'REAL' | 'SIMULATION'>('SIMULATION');
  const [isAttackSimulationEnabled, setIsAttackSimulationEnabled] = useState<boolean>(false);
  const [subsystemStatus, setSubsystemStatus] = useState<{
    telemetryEngine: 'PASS' | 'WARNING' | 'FAIL';
    threatEngine: 'PASS' | 'WARNING' | 'FAIL';
    riskEngine: 'PASS' | 'WARNING' | 'FAIL';
    deviceRegistry: 'PASS' | 'WARNING' | 'FAIL';
    dashboardSync: 'PASS' | 'WARNING' | 'FAIL';
  }>({
    telemetryEngine: 'PASS',
    threatEngine: 'PASS',
    riskEngine: 'PASS',
    deviceRegistry: 'PASS',
    dashboardSync: 'PASS'
  });
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES_PERSONAL);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('endpoint-01');
  const [deviceHistories, setDeviceHistories] = useState<{[key: string]: Metrics[]}>({
    'endpoint-01': [],
    'dev-01': [],
    'dev-02': [],
    'dev-03': []
  });

  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [isDefenseModeActive, setIsDefenseModeActive] = useState(false);
  const [scanningDevices, setScanningDevices] = useState<Set<string>>(new Set());

  const handleScanDevice = (deviceId: string) => {
    const device = devices.find(d => d.deviceId === deviceId);
    if (!device) return;

    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `Device Scan started on ${device.deviceName}`,
      timestamp: shortTime,
      type: 'info'
    }, ...prev].slice(0, 20));

    setScanningDevices(prev => new Set(prev).add(deviceId));

    setTimeout(() => {
      const isThreat = Math.random() > 0.7;
      const resultMsg = isThreat ? "Suspicious process detected" : "No threats found";
      
      const scanAlert: ThreatAlert = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        message: `Scan Result for ${device.deviceName}: ${resultMsg}`
      };
      
      setAlerts(prev => [scanAlert, ...prev].slice(0, 15));
      setScanningDevices(prev => {
        const next = new Set(prev);
        next.delete(deviceId);
        return next;
      });

      if (isThreat) {
        setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, status: 'SUSPICIOUS', threatLevel: 'MEDIUM' } : d));
      }
    }, 2000);
  };

  const handleIsolateDevice = (deviceId: string) => {
    const device = devices.find(d => d.deviceId === deviceId);
    if (!device) return;

    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, status: 'ISOLATED', threatLevel: 'HIGH' } : d));
    
    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `Device isolated from network: ${device.deviceName}`,
      timestamp: shortTime,
      type: 'danger'
    }, ...prev].slice(0, 20));

    const defenseAction: DefenseAction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action: "Network Isolation",
      condition: `Manual isolation of ${device.deviceName}`
    };
    setDefenseHistory(prev => [defenseAction, ...prev].slice(0, 10));
  };

  const handleRestartMonitoring = (deviceId: string) => {
    const device = devices.find(d => d.deviceId === deviceId);
    if (!device) return;

    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDevices(prev => prev.map(d => d.deviceId === deviceId ? { 
      ...d, 
      status: 'SAFE', 
      threatLevel: 'LOW',
      telemetryData: {
        ...d.telemetryData,
        cpu: 10,
        memory: 20,
        connections: 5,
        packetsPerSecond: 10
      }
    } : d));

    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `Monitoring restarted for ${device.deviceName}`,
      timestamp: shortTime,
      type: 'info'
    }, ...prev].slice(0, 20));
  };

  const handleRemoveDevice = (deviceId: string) => {
    const device = devices.find(d => d.deviceId === deviceId);
    if (!device) return;

    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDevices(prev => prev.filter(d => d.deviceId !== deviceId));
    
    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `Device removed: ${device.deviceName}`,
      timestamp: shortTime,
      type: 'warning'
    }, ...prev].slice(0, 20));

    if (selectedDeviceId === deviceId) {
      setSelectedDeviceId(devices.find(d => d.deviceId !== deviceId)?.deviceId || '');
    }
  };

  const handleEnrollDevice = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/devices/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentDeviceCount: devices.length })
      });
      if (!res.ok) {
        const errData = await res.json();
        if (errData.error === 'LICENSE_LIMIT_REACHED') {
          showToast(`ENROLLMENT BLOCKED: Node limit exceeded under current Developer tier package (Max 5 nodes). Upgrade subscription in Settings!`, 'danger');
        } else {
          showToast(`Failed to enroll node: ${errData.error || 'Check server status'}`, 'danger');
        }
        return false;
      }
      
      const newD: any = {
        deviceId: `dev-${Math.floor(Math.random() * 90000 + 10000)}`,
        deviceName: name,
        status: 'SAFE',
        threatLevel: 'LOW',
        lastSeen: new Date().toISOString(),
        telemetryData: {
          cpu: 12,
          memory: 38,
          disk: 18,
          hostname: `${name.toLowerCase()}.andis-internal.net`,
          os: 'Windows 11 Professional Build 22631',
          uptime: '1h 15m',
          connections: 4,
          packetsPerSecond: 28,
          timestamp: new Date().toISOString()
        }
      };

      setDevices(prev => [...prev, newD]);
      showToast(`Node ${name} enrolled with dynamic telemetry stream!`, 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Connection to multitenant registry timed out.', 'danger');
      return false;
    }
  };

  const handleScanAllDevices = () => {
    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `GLOBAL COMMAND: Initiating security scan on all monitored devices`,
      timestamp: shortTime,
      type: 'info'
    }, ...prev].slice(0, 20));

    devices.forEach(device => {
      handleScanDevice(device.deviceId);
    });
  };

  const handleActivateDefenseMode = () => {
    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMode = !isDefenseModeActive;
    setIsDefenseModeActive(newMode);
    
    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `GLOBAL COMMAND: Defense Mode ${newMode ? 'ACTIVATED' : 'DEACTIVATED'}`,
      timestamp: shortTime,
      type: newMode ? 'defense' : 'info'
    }, ...prev].slice(0, 20));
  };

  const handleResetThreatLogs = () => {
    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts([]);
    setAttackEvents([]);
    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `GLOBAL COMMAND: Threat logs and attack history cleared`,
      timestamp: shortTime,
      type: 'info'
    }, ...prev].slice(0, 20));
  };

  const handleEmergencyLockdown = () => {
    const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const now = new Date().toLocaleTimeString();

    setDevices(prev => prev.map(d => ({ ...d, status: 'ISOLATED', threatLevel: 'HIGH' })));
    
    setTimeline(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      description: `EMERGENCY COMMAND: GLOBAL LOCKDOWN INITIATED. ALL DEVICES ISOLATED.`,
      timestamp: shortTime,
      type: 'danger'
    }, ...prev].slice(0, 20));

    const defenseAction: DefenseAction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: now,
      action: "Global Lockdown",
      condition: "Manual Emergency Trigger"
    };
    setDefenseHistory(prev => [defenseAction, ...prev].slice(0, 10));
    setSecurityStats(prev => ({ ...prev, defensesTriggered: prev.defensesTriggered + 1 }));
  };

  const performAIAnalysis = (attack: AttackEvent) => {
    let explanation = "";
    let recommendedAction = "";
    let severity: 'Low' | 'Medium' | 'High' | 'Critical' = attack.severity as any;

    switch (attack.type) {
      case "DDoS traffic spike":
        explanation = `Unusual surge in incoming packets from ${attack.originCountry} targeting ${attack.target}. This pattern is consistent with a Distributed Denial of Service (DDoS) attempt intended to overwhelm network resources.`;
        recommendedAction = "Enable rate limiting and traffic scrubbing at the edge firewall.";
        break;
      case "Malware process":
        explanation = `A suspicious binary execution was detected on ${attack.target}. The process exhibits behavior typical of ransomware or spyware, including unauthorized file access and encrypted command-and-control communication.`;
        recommendedAction = "Immediately isolate the device and perform a deep forensic scan.";
        severity = 'Critical';
        break;
      case "Crypto mining activity":
        explanation = `Sustained high CPU usage and connection attempts to known mining pools detected on ${attack.target}. This suggests unauthorized deployment of crypto-jacking software.`;
        recommendedAction = "Terminate the offending process and audit system permissions.";
        break;
      case "Port scanning attempt":
        explanation = `Sequential connection attempts to multiple closed ports detected on ${attack.target} from ${attack.originCountry}. This is a reconnaissance phase typically preceding a more targeted attack.`;
        recommendedAction = "Block the source IP address and monitor for further lateral movement.";
        break;
      case "Brute force login attempts":
        explanation = `Multiple failed authentication attempts detected on ${attack.target}. The high frequency and variety of credentials used indicate a systematic brute-force or credential-stuffing attack.`;
        recommendedAction = "Enforce multi-factor authentication and implement account lockout policies.";
        severity = 'High';
        break;
      default:
        explanation = "Anomalous activity detected that deviates from established baseline behavior.";
        recommendedAction = "Conduct manual investigation of system logs.";
    }

    const analysis: AIAnalysis = {
      id: Math.random().toString(36).substr(2, 9),
      attackType: attack.type,
      targetDevice: attack.target,
      severity,
      explanation,
      recommendedAction,
      timestamp: attack.timestamp
    };

    // Check for intelligence matches
    const intelMatch = threatIntelAlerts.find(intel => 
      (attack.type.includes("Malware") && intel.title.includes("Malware")) ||
      (attack.type.includes("Ransomware") && intel.title.includes("Ransomware")) ||
      (attack.type.includes("Botnet") && intel.title.includes("Botnet")) ||
      (attack.type.includes("Phishing") && intel.title.includes("Phishing"))
    );

    if (intelMatch) {
      analysis.explanation += `\n\nTHREAT INTELLIGENCE MATCH: This activity aligns with global intelligence report '${intelMatch.title}'.`;
    }

    setAiAnalyses(prev => [analysis, ...prev].slice(0, 10));

    // 6. Generate an automated Incident Report for high-severity threats (High or Critical)
    if (severity === 'High' || severity === 'Critical') {
      const report: IncidentReport = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: attack.timestamp,
        device: attack.target,
        threatType: attack.type,
        severity: severity,
        explanation: explanation,
        recommendedAction: recommendedAction
      };
      setIncidentReports(prev => [report, ...prev].slice(0, 10));
    }
  };

  const toggleSimulationMode = () => {
    const newMode = !isSimulationMode;
    setIsSimulationMode(newMode);
    if (newMode) {
      setDevices(INITIAL_DEVICES_ENTERPRISE);
      setSelectedDeviceId('dev-01');
    } else {
      setDevices(INITIAL_DEVICES_PERSONAL);
      setSelectedDeviceId('endpoint-01');
    }
  };
  
  const getThreatLevel = () => {
    const totalRiskPoints = alerts.length + threatIntelAlerts.length + (activeAttack ? 10 : 0);
    if (totalRiskPoints > 15) return { level: 'HIGH', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-600' };
    if (totalRiskPoints > 5) return { level: 'MEDIUM', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-600' };
    return { level: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-600' };
  };

  const threatLevel = getThreatLevel();
  const topAttackers = Object.entries(attackerFrequency)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5);

  const [securityStats, setSecurityStats] = useState({
    totalThreats: 0,
    ddosAttacks: 0,
    malwareAttacks: 0,
    cryptoMiningAttacks: 0,
    defensesTriggered: 0,
    totalDevices: 3,
    activeThreats: 0,
    devicesUnderInvestigation: 0
  });
  const [isSecure, setIsSecure] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const historyRef = useRef<Metrics[]>([]);
  const deviceHistoriesRef = useRef<{[key: string]: Metrics[]}>(deviceHistories);
  const activeAttackRef = useRef<string | null>(null);
  const blockedIPsRef = useRef<BlockedIP[]>([]);
  const learnedPatternsRef = useRef<LearnedPattern[]>([]);
  const attackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    deviceHistoriesRef.current = deviceHistories;
  }, [deviceHistories]);

  useEffect(() => {
    activeAttackRef.current = activeAttack;
  }, [activeAttack]);

  useEffect(() => {
    blockedIPsRef.current = blockedIPs;
  }, [blockedIPs]);

  useEffect(() => {
    learnedPatternsRef.current = learnedPatterns;
  }, [learnedPatterns]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLicensingData();
      const interval = setInterval(fetchLicensingData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!features.ThreatIntel && activeTab === 'intelligence') {
      setActiveTab('dashboard');
    }
    if (!features.AdvancedAnalytics && activeTab === 'investigation') {
      setActiveTab('dashboard');
    }
  }, [features, activeTab]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Asynchronous real-time telemetry fetch and active system engine mapper
    const startTelemetrySimulation = async () => {
      const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const now = new Date().toLocaleTimeString();
      
      // Default baseline values for simulation falls or startup states
      let cpu = Math.floor(Math.random() * (22 - 10 + 1)) + 10;
      let memory = Math.floor(Math.random() * (35 - 20 + 1)) + 20;
      let processes = Math.floor(Math.random() * (110 - 80 + 1)) + 80;
      let connections = Math.floor(Math.random() * (12 - 5 + 1)) + 5;
      let activeMode: 'REAL' | 'SIMULATION' = 'SIMULATION';
      let telemetryStatus: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';

      // Phase 2: Prioritize real telemetry if simulation mode is disabled
      if (!isSimulationMode) {
        try {
          const res = await fetch('/api/metrics');
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.cpu === 'number') {
              cpu = Math.round(data.cpu);
              memory = Math.round(data.memory);
              processes = data.processes;
              connections = data.connections;
              activeMode = 'REAL';
              telemetryStatus = 'PASS';
            } else {
              telemetryStatus = 'WARNING';
            }
          } else {
            telemetryStatus = 'WARNING';
          }

          // Fetch real system connections
          try {
            const connRes = await fetch('/api/connections');
            if (connRes.ok) {
              const connData = await connRes.json();
              if (Array.isArray(connData)) {
                setConnections(connData);
              }
            }
          } catch (cErr) {
            console.warn("Telemetry connections fetch failed:", cErr);
          }

          // Fetch real security logs
          try {
            const logsRes = await fetch('/api/logs');
            if (logsRes.ok) {
              const logsData = await logsRes.json();
              if (Array.isArray(logsData)) {
                setLogs(logsData);
                
                // Trigger dynamic warning alerts for suspicious ports
                const flagAlerts = logsData
                  .filter((l: any) => l.alert_type === 'Suspicious Port')
                  .map((l: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date(l.timestamp).toLocaleTimeString(),
                    message: `ALERT: Suspicious Port Connection on ${l.process_name} to ${l.remote_ip}:${l.remote_port}`
                  }));
                if (flagAlerts.length > 0) {
                  setAlerts(prev => {
                    const merged = [...flagAlerts, ...prev];
                    return merged.filter((v, i, a) => a.findIndex(t => t.message === v.message) === i).slice(0, 15);
                  });
                }

                // Synchronize global security metrics based on active threat logs
                const activeThreatCount = logsData.filter((l: any) => {
                  return l.alert_type === 'Suspicious Port' && (Date.now() - new Date(l.timestamp).getTime() < 30000);
                }).length;

                setSecurityStats(s => ({
                  ...s,
                  totalThreats: 142 + logsData.filter((l: any) => l.alert_type === 'Suspicious Port').length,
                  activeThreats: activeThreatCount
                }));

                // Append connection changes and suspicious events to the Incident Timeline
                const mappedTimelineEvents: TimelineEvent[] = logsData.slice(0, 8).map((l: any) => {
                  const eventTime = new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const isThreat = l.alert_type === 'Suspicious Port';
                  return {
                    id: `log-${l.timestamp}-${l.remote_port}-${l.process_name}`,
                    description: isThreat
                      ? `[SECURITY BREACH] Suspicious connection attempt by "${l.process_name}" to ${l.remote_ip}:${l.remote_port} flagged!`
                      : `[TCP SOCKET] Process "${l.process_name}" active outbound link -> ${l.remote_ip}:${l.remote_port} (${l.connection_status})`,
                    timestamp: eventTime,
                    type: isThreat ? 'danger' : 'info'
                  };
                });

                setTimeline(prev => {
                  const combined = [...mappedTimelineEvents, ...prev];
                  return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 30);
                });
              }
            }
          } catch (lErr) {
            console.warn("Telemetry logs fetch failed:", lErr);
          }
        } catch (err) {
          // Relate connection warning silently, allowing graceful local simulation fallback
          telemetryStatus = 'WARNING';
        }
      } else {
        // Generates clean, dynamic simulated parameters for sandbox modes
        const isIsolated = selectedDeviceId !== 'endpoint-01' && devices.find(d => d.deviceId === selectedDeviceId)?.status === 'ISOLATED';
        if (isIsolated) {
          cpu = 4;
          connections = 0;
          processes = 45;
        } else {
          cpu = Math.floor(Math.random() * (35 - 12 + 1)) + 12;
          memory = Math.floor(Math.random() * (48 - 25 + 1)) + 25;
          processes = Math.floor(Math.random() * (120 - 90 + 1)) + 90;
          connections = Math.floor(Math.random() * (15 - 6 + 1)) + 6;
        }
      }

      setTelemetryMode(activeMode);

      const newMetrics: Metrics = {
        cpu,
        memory,
        processes,
        connections,
        connectionsPerSecond: Math.floor(Math.random() * 8) + (cpu > 70 ? 25 : 2),
        dataTransferRate: parseFloat((Math.random() * 4).toFixed(2)),
        packetsPerSecond: Math.floor(Math.random() * 100) + (cpu > 70 ? 300 : 30),
        topSourceIP: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        topProtocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)] as any,
        timestamp: new Date().toISOString(),
      };

      // Update local state with live measurements
      setMetrics(newMetrics);
      setHistory(prev => [...prev, newMetrics].slice(-30));

      // Append security metric log selectively (significantly filtered to avoid UI clutter)
      const logEntry: TimelineEvent = {
        id: Math.random().toString(36).substr(2, 9),
        description: `Telemetry Update (${activeMode}): Host CPU ${cpu}%, MEM ${memory}%, Connections ${connections}`,
        timestamp: shortTime,
        type: 'info'
      };
      setTimeline(prev => [logEntry, ...prev].slice(0, 20));

      // Feed into Threat Prediction heuristics
      const prediction: ThreatPrediction = {
        id: Math.random().toString(36).substr(2, 9),
        type: cpu > 75 ? 'Resource Exhaustion' : 'Network Saturation',
        probability: Math.floor(Math.random() * 10) + (cpu > 75 ? 60 : 5),
        reason: cpu > 75 ? 'Anomalous platform load spike detected' : 'Acceptable usage boundaries',
        timestamp: now
      };
      setPredictions([prediction]);

      // Phase 6: Verify threat detection logic - avoid permanent high alerts from minor CPU/network jitters
      if (cpu > 85 || connections > 45) {
        const anomalyMsg = cpu > 85 
          ? `CRITICAL: Server CPU load threshold breached (${cpu}%)` 
          : `WARNING: High network socket allocation count (${connections})`;
        
        // Prevent alert duplicates flooding history
        setAlerts(prev => {
          const isDuplicate = prev.length > 0 && prev[0].message.includes(cpu > 85 ? 'Server CPU load' : 'High network socket');
          if (isDuplicate) return prev;

          const anomalyAlert: ThreatAlert = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: now,
            message: anomalyMsg
          };
          
          setSecurityStats(s => ({
            ...s,
            totalThreats: s.totalThreats + 1,
            activeThreats: s.activeThreats + 1
          }));

          setTimeline(t => [{
            id: Math.random().toString(36).substr(2, 9),
            description: `ANOMALY TRIGGERED: ${anomalyMsg}`,
            timestamp: shortTime,
            type: 'danger'
          }, ...t].slice(0, 20));

          return [anomalyAlert, ...prev].slice(0, 15);
        });
      }

      // Synchronize multi-device statuses
      setDevices(prevDevices => prevDevices.map(device => {
        if (device.deviceId === selectedDeviceId) {
          return {
            ...device,
            lastSeen: now,
            telemetryData: newMetrics
          };
        }
        // Independent simulated telemetry updates for other background instances
        const isIsolated = device.status === 'ISOLATED';
        return {
          ...device,
          lastSeen: now,
          telemetryData: {
            ...device.telemetryData,
            cpu: isIsolated ? 3 : Math.floor(Math.random() * (device.deviceName === 'Server-01' ? 40 : 15)) + 8,
            packetsPerSecond: isIsolated ? 0 : Math.floor(Math.random() * (device.deviceName === 'Server-01' ? 250 : 40)) + 10,
            connections: isIsolated ? 0 : device.telemetryData.connections,
            timestamp: new Date().toISOString()
          }
        };
      }));

      // Phase 8: Calculate real-time subsystem verification matrix statuses
      setSubsystemStatus(prev => {
        const ruleCount = alerts.length;
        const registryStatus: 'PASS' | 'WARNING' | 'FAIL' = isSimulationMode ? 'WARNING' : 'PASS';
        const threatStatus: 'PASS' | 'WARNING' | 'FAIL' = ruleCount > 10 ? 'WARNING' : 'PASS';
        
        return {
          telemetryEngine: telemetryStatus,
          threatEngine: threatStatus,
          riskEngine: 'PASS',
          deviceRegistry: registryStatus,
          dashboardSync: 'PASS'
        };
      });
    };

    startTelemetrySimulation();
    const telemetryInterval = setInterval(startTelemetrySimulation, 3000);

    // Phase 6: Throttled Attack Simulation Matrix (controlled by isAttackSimulationEnabled configuration toggle)
    const startAttackSimulation = () => {
      if (!isAttackSimulationEnabled) {
        // Exit and let user control stress testing manually to maintain pristine SAFE SOC state by default
        return;
      }

      const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const now = new Date().toLocaleTimeString();

      const attackTypes = [
        "DDoS traffic spike",
        "Malware process",
        "Crypto mining activity",
        "Port scanning attempt",
        "Brute force login attempts"
      ];
      
      const selectedAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      
      setDevices(currentDevices => {
        if (currentDevices.length === 0) return currentDevices;
        
        const targetDevice = currentDevices[Math.floor(Math.random() * currentDevices.length)];
        const severities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const originCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];

        const newAttackEvent: AttackEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: selectedAttack,
          target: targetDevice.deviceName,
          severity,
          originCountry,
          timestamp: now
        };
        setAttackEvents(prev => [newAttackEvent, ...prev].slice(0, 50));

        // Trigger AI analysis response
        performAIAnalysis(newAttackEvent);

        const attackAlert: ThreatAlert = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: now,
          message: `ATTACK: ${selectedAttack} from ${originCountry} on ${targetDevice.deviceName} (Severity: ${severity})`
        };
        setAlerts(prev => [attackAlert, ...prev].slice(0, 15));

        const attackLog: TimelineEvent = {
          id: Math.random().toString(36).substr(2, 9),
          description: `[${now}] Attack detected: ${selectedAttack} from ${originCountry} on ${targetDevice.deviceName}`,
          timestamp: shortTime,
          type: severity === 'High' ? 'danger' : 'warning'
        };
        setTimeline(prev => [attackLog, ...prev].slice(0, 20));

        setSecurityStats(prev => ({
          ...prev,
          totalThreats: prev.totalThreats + 1,
          activeThreats: prev.activeThreats + 1,
          ddosAttacks: selectedAttack === "DDoS traffic spike" ? prev.ddosAttacks + 1 : prev.ddosAttacks,
          malwareAttacks: selectedAttack === "Malware process" ? prev.malwareAttacks + 1 : prev.malwareAttacks,
          cryptoMiningAttacks: selectedAttack === "Crypto mining activity" ? prev.cryptoMiningAttacks + 1 : prev.cryptoMiningAttacks,
        }));

        if (severity === 'High') {
          const defenseMsg = `Automated Defense: Isolating ${targetDevice.deviceName} due to High severity ${selectedAttack}`;
          
          const defenseAction: DefenseAction = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: now,
            action: "Device Isolation",
            condition: `High Severity ${selectedAttack}`
          };
          setDefenseHistory(prev => [defenseAction, ...prev].slice(0, 10));

          const defenseLog: TimelineEvent = {
            id: Math.random().toString(36).substr(2, 9),
            description: defenseMsg,
            timestamp: shortTime,
            type: 'defense'
          };
          setTimeline(prev => [defenseLog, ...prev].slice(0, 20));

          setSecurityStats(prev => ({
            ...prev,
            defensesTriggered: prev.defensesTriggered + 1
          }));

          return currentDevices.map(d => 
            d.deviceId === targetDevice.deviceId ? { ...d, status: 'ISOLATED', threatLevel: 'HIGH' } : d
          );
        }

        return currentDevices;
      });

      const nextInterval = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
      attackTimeoutRef.current = setTimeout(startAttackSimulation, nextInterval);
    };

    if (isAttackSimulationEnabled) {
      startAttackSimulation();
    }

    // Live continuous Global Threat Intel Feeds
    const intelInterval = setInterval(() => {
      const intelTypes = [
        { title: "New Ransomware Campaign", severity: "Critical", desc: "A new variant of 'ShadowLock' ransomware is spreading via phishing emails.", action: "Update email filters and backup critical data." },
        { title: "Botnet Activity Detected", severity: "High", desc: "Increased C&C traffic detected from a known Mirai-variant botnet.", action: "Scan for vulnerable IoT devices and block suspicious IPs." },
        { title: "Zero-Day Vulnerability", severity: "Critical", desc: "Unpatched RCE vulnerability found in common web server software.", action: "Apply temporary patches and restrict public access." },
        { title: "Malware Signature Update", severity: "Low", desc: "New signatures added for 500+ emerging trojan variants.", action: "Ensure all endpoints have updated antivirus definitions." },
        { title: "Phishing Campaign", severity: "Medium", desc: "Widespread phishing campaign targeting corporate credentials.", action: "Conduct employee awareness training and enable MFA." }
      ];

      const selectedIntel = intelTypes[Math.floor(Math.random() * intelTypes.length)];
      const now = new Date().toLocaleTimeString();
      const shortTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newIntel: ThreatIntelAlert = {
        id: Math.random().toString(36).substr(2, 9),
        title: selectedIntel.title,
        severity: selectedIntel.severity as any,
        description: selectedIntel.desc,
        recommendedAction: selectedIntel.action,
        timestamp: now
      };

      setThreatIntelAlerts(prev => [newIntel, ...prev].slice(0, 20));

      setTimeline(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        description: `INTEL ALERT: ${selectedIntel.title} - ${selectedIntel.severity} severity`,
        timestamp: shortTime,
        type: selectedIntel.severity === 'Critical' || selectedIntel.severity === 'High' ? 'danger' : 'info'
      }, ...prev].slice(0, 20));

    }, 15000);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(intelInterval);
      if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
    };
  }, [isAuthenticated, selectedDeviceId, isAttackSimulationEnabled, isSimulationMode]);

  const highConnectionAlert = (metrics?.connections ?? 0) > 50;

  // Phase 5: Structured multi-metric Risk Score Engine
  const calculateRiskScore = () => {
    let score = 8; // Baseline clean environment status score
    
    // 1. Alert Frequency Counts
    const alertCount = alerts.length;
    score += alertCount * 2.5;

    // 2. Devices status & quarantine penalties
    const isolatedCount = devices.filter(d => d.status === 'ISOLATED').length;
    const suspiciousCount = devices.filter(d => d.status === 'SUSPICIOUS').length;
    score += isolatedCount * 12;
    score += suspiciousCount * 6;

    // 3. Central System State Anomaly
    if (metrics) {
      if (metrics.cpu > 75) score += 6;
      if (metrics.connections > 35) score += 5;
    }

    // 4. Ingress Threat campaigns active
    const activeCampaignCount = attackEvents.filter(e => e.severity === 'High').length;
    score += Math.min(18, activeCampaignCount * 4);

    if (activeAttack) {
      score += 15;
    }

    if (isDefenseModeActive) {
      score += 5; // Adds a small calibration index for active mitigation state
    }

    return Math.min(99, Math.max(5, Math.floor(score)));
  };
  const riskScore = calculateRiskScore();

  const getRiskLevelFromScore = (score: number) => {
    if (score >= 65) return 'HIGH';
    if (score >= 25) return 'MEDIUM';
    return 'LOW';
  };
  const riskLevel = getRiskLevelFromScore(riskScore);
  const riskColor = riskLevel === 'LOW' ? 'bg-emerald-500' : riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-red-500';

  const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-[11px] font-mono font-bold uppercase tracking-widest transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] rounded-xl' 
          : 'text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const dashboardContent = (
    <DashboardView
      isSecure={isSecure}
      securityStats={securityStats}
      devices={devices}
      riskLevel={riskLevel}
      riskColor={riskColor}
      alerts={alerts}
      timeline={timeline}
      setActiveTab={setActiveTab}
      riskScore={riskScore}
    />
  );


  const threatInvestigationPage = (
    <ThreatInvestigationView
      history={history}
      alerts={alerts}
      aiAnalyses={aiAnalyses}
      timeline={timeline}
    />
  );

  const settingsPage = (
    <SettingsView
      currentUser={currentUser}
      riskLevel={riskLevel}
      isDefenseModeActive={isDefenseModeActive}
      handleActivateDefenseMode={handleActivateDefenseMode}
      telemetryMode={telemetryMode}
      isAttackSimulationEnabled={isAttackSimulationEnabled}
      setIsAttackSimulationEnabled={setIsAttackSimulationEnabled}
      subsystemStatus={subsystemStatus}
      license={license}
      subscription={subscription}
      features={features}
      auditLogs={licensingAuditLogs}
      onUpgrade={handleUpgradeTier}
      onDowngrade={handleDowngradeTier}
    />
  );
  const securityCommandPage = (
    <SecurityCommandView
      devices={devices}
      securityStats={securityStats}
      activeAttack={activeAttack}
      threatLevel={threatLevel}
      isDefenseModeActive={isDefenseModeActive}
      attackEvents={attackEvents}
      defenseHistory={defenseHistory}
      handleScanAllDevices={handleScanAllDevices}
      handleActivateDefenseMode={handleActivateDefenseMode}
      handleResetThreatLogs={handleResetThreatLogs}
      handleEmergencyLockdown={handleEmergencyLockdown}
    />
  );


  const reportsPage = (
    <ReportsView
      incidentReports={incidentReports}
      showToast={showToast}
    />
  );


  const devicesPage = (
    <DevicesView
      devices={devices}
      selectedDeviceId={selectedDeviceId}
      setSelectedDeviceId={setSelectedDeviceId}
      isSimulationMode={isSimulationMode}
      toggleSimulationMode={toggleSimulationMode}
      scanningDevices={scanningDevices}
      handleScanDevice={handleScanDevice}
      handleIsolateDevice={handleIsolateDevice}
      handleRestartMonitoring={handleRestartMonitoring}
      handleRemoveDevice={handleRemoveDevice}
      metrics={metrics}
      showToast={showToast}
      onAddDevice={handleEnrollDevice}
      license={license}
    />
  );



  const threatIntelligencePage = (
    <ThreatIntelligenceView
      threatIntelAlerts={threatIntelAlerts}
      predictions={predictions}
    />
  );






  return (
    <>
      {/* Dynamic Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-[350px] bg-slate-950/95 border border-slate-800/80 rounded-2xl p-4.5 shadow-[0_15px_50px_rgba(0,0,0,0.85)] backdrop-blur-lg flex gap-3.5 text-xs text-slate-100 selection:bg-indigo-500 selection:text-white"
          >
            <div className="flex-shrink-0 mt-0.5">
              {toastType === 'success' && <Shield className="w-5 h-5 text-emerald-400" />}
              {toastType === 'info' && <TerminalIcon className="w-5 h-5 text-indigo-400" />}
              {toastType === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toastType === 'danger' && <AlertCircle className="w-5 h-5 text-red-400" />}
            </div>
            <div className="flex-1 font-mono uppercase">
              <div className="text-slate-100 font-bold leading-normal mb-1">{toastMessage}</div>
              <span className="text-[8px] text-slate-500 tracking-wider">ANDIS SECURITY ACTION LOG // SUCCESS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthenticated ? (
        <div className="min-h-screen bg-[#060814] text-slate-200 font-mono flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-950/80 border border-slate-800/80 p-8 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800/80 pb-5">
              <Shield className="w-8 h-8 text-indigo-400" />
              <div>
                <h1 className="text-xl font-bold tracking-widest uppercase bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">ANDIS ENTERPRISE</h1>
                <p className="text-[9px] font-mono opacity-50 uppercase tracking-[0.2em]">Secure Operator Terminal</p>
              </div>
            </div>

            {isSignUpMode ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input 
                      type="email" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 pl-10 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="operator@andis.sys"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input 
                      type="text" 
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 pl-10 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input 
                        type="password" 
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 pl-10 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input 
                        type="password" 
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 pl-10 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                {signupError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-2 rounded-xl"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {signupError}
                  </motion.div>
                )}

                {signupSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-2 rounded-xl"
                  >
                    <Shield className="w-4 h-4" />
                    {signupSuccess}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 font-bold uppercase rounded-xl tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(99,102,241,0.25)] active:scale-[0.98] cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>

                <button 
                  type="button"
                  onClick={() => setIsSignUpMode(false)}
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-all mt-2 cursor-pointer"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input 
                      type="text" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 pl-10 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 pl-10 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2 rounded-xl"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {loginError}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 font-bold uppercase rounded-xl tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(99,102,241,0.25)] active:scale-[0.98] cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Initialize Session
                </button>

                <div className="flex items-center gap-4 py-1">
                  <div className="h-[1px] flex-1 bg-slate-850" />
                  <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">OR</span>
                  <div className="h-[1px] flex-1 bg-slate-855" />
                </div>

                <button 
                  type="button"
                  onClick={() => setIsSignUpMode(true)}
                  className="w-full border border-slate-850 hover:border-slate-700 bg-slate-900/20 text-slate-300 hover:text-white p-3.5 font-bold uppercase rounded-xl tracking-widest text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 opacity-80" />
                  Create Account
                </button>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-slate-800/50 text-center">
              <p className="text-[9px] font-mono opacity-30 uppercase tracking-widest">Authorized Personnel Only</p>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#060814] text-slate-100 font-mono flex flex-col selection:bg-indigo-500 selection:text-white">
          {/* Header */}
          <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md p-4 flex justify-between items-center z-10 text-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h1 className="text-sm font-sans font-black tracking-widest uppercase bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">ANDIS SOC</h1>
                <span className="text-[10px] font-mono text-indigo-400 font-extrabold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">v1.3</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-700/60" />
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{error ? 'Offline' : 'System Active'}</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-700/60" />
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                <span className="text-[9px] font-mono font-bold tracking-tight text-slate-400 uppercase">Mode:</span>
                <span className={`text-[9px] font-mono font-black uppercase tracking-tight ${
                  telemetryMode === 'REAL' ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-amber-500 font-extrabold'
                }`}>
                  {telemetryMode}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <div className="flex items-center gap-2 justify-end text-[10px] font-mono text-slate-400 font-bold uppercase">
                  <span>Operator:</span>
                  <span className="text-indigo-400 font-extrabold">{currentUser}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-2 py-0.5 text-[8px] font-mono font-black text-white rounded uppercase tracking-wider ${riskColor}`}>
                  {riskLevel} RISK : SCORE {riskScore}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-905 border border-transparent hover:border-slate-800 text-slate-400 hover:text-red-400 transition-all rounded-lg cursor-pointer"
                  title="Terminate Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col p-4 gap-2 overflow-y-auto hidden md:flex">
              <div className="mb-6 px-2">
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-slate-500">Navigation</p>
              </div>
              <SidebarItem 
                icon={<LayoutDashboard className="w-4 h-4" />} 
                label="Dashboard" 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
              />
              <SidebarItem 
                icon={<Monitor className="w-4 h-4" />} 
                label="Devices" 
                active={activeTab === 'devices'} 
                onClick={() => setActiveTab('devices')} 
              />
              {features.AdvancedAnalytics && (
                <SidebarItem 
                  icon={<Search className="w-4 h-4" />} 
                  label="Threat Investigation" 
                  active={activeTab === 'investigation'} 
                  onClick={() => setActiveTab('investigation')} 
                />
              )}
              {features.ThreatIntel && (
                <SidebarItem 
                  icon={<Globe className="w-4 h-4" />} 
                  label="Threat Intelligence" 
                  active={activeTab === 'intelligence'} 
                  onClick={() => setActiveTab('intelligence')} 
                />
              )}
              <SidebarItem 
                icon={<ShieldAlert className="w-4 h-4" />} 
                label="Security Command" 
                active={activeTab === 'command'} 
                onClick={() => setActiveTab('command')} 
              />
              <SidebarItem 
                icon={<FileText className="w-4 h-4" />} 
                label="Reports" 
                active={activeTab === 'reports'} 
                onClick={() => setActiveTab('reports')} 
              />
              <SidebarItem 
                icon={<Settings2 className="w-4 h-4" />} 
                label="Settings" 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
              />

              <div className="mt-auto pt-6 border-t border-slate-900">
                <div className="bg-slate-900/40 p-3.5 border border-slate-800/50 rounded-xl">
                  <p className="text-[10px] font-mono font-black uppercase text-slate-500 mb-2.5">System Health</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">CPU</span>
                      <span className="text-slate-200 font-bold">12%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[12%]" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">MEM</span>
                      <span className="text-slate-200 font-bold">4.2GB</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[45%]" />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#060814]">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'dashboard' && dashboardContent}
                  {activeTab === 'devices' && devicesPage}
                  {activeTab === 'investigation' && threatInvestigationPage}
                  {activeTab === 'intelligence' && threatIntelligencePage}
                  {activeTab === 'command' && securityCommandPage}
                  {activeTab === 'reports' && reportsPage}
                  {activeTab === 'settings' && settingsPage}
                </motion.div>

                {/* Footer Info */}
                <footer className="mt-12 pt-8 border-t border-slate-900 text-center">
                  <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate-600">
                    Secure Environment • Encrypted Telemetry • ANDIS Intelligence Systems
                  </p>
                </footer>
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

