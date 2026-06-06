import React, { useState } from 'react';
import { Cpu, Network, Monitor, Laptop, Zap, AlertTriangle, RefreshCw, Eye, Power, Activity, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, Metrics } from '../types';

interface DevicesViewProps {
  devices: Device[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  isSimulationMode: boolean;
  toggleSimulationMode: () => void;
  scanningDevices: Set<string>;
  handleScanDevice: (id: string) => void;
  handleIsolateDevice: (id: string) => void;
  handleRestartMonitoring: (id: string) => void;
  handleRemoveDevice: (id: string) => void;
  metrics: Metrics | null;
  showToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  onAddDevice?: (name: string) => Promise<boolean>;
  license?: any;
}

export default function DevicesView({
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  isSimulationMode,
  toggleSimulationMode,
  scanningDevices,
  handleScanDevice,
  handleIsolateDevice,
  handleRestartMonitoring,
  metrics,
  showToast,
  onAddDevice,
  license = { tier: 'Developer', max_devices: 5 }
}: DevicesViewProps) {
  const [activeTab, setActiveTab] = useState<'registry' | 'monitoring' | 'controls'>('registry');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);

  const selectedDevice = devices.find(d => d.deviceId === selectedDeviceId) || devices[0];

  const handleEnrollNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;
    if (!onAddDevice) return;
    setIsEnrolling(true);
    try {
      const success = await onAddDevice(newDeviceName.trim());
      if (success) {
        setNewDeviceName('');
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Devices Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wider uppercase">
            Devices Protected Terminal
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
            Endpoint monitors & hardware diagnostics hub
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'registry' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registry Feed
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'monitoring' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Telemetry Monitoring
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
              activeTab === 'controls' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Device Control Panel
          </button>
        </div>
      </div>

      {/* Render selected tabs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* TAB 1: DEVICE REGISTRY */}
          {activeTab === 'registry' && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5 mb-6">
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">Device Directory & Simulation Registry</h3>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Toggle live simulation mode and manage connected client machine network isolation rules.</p>
                </div>

                {/* Simulation Mode Switch */}
                <div className="flex items-center bg-slate-900 p-1 border border-slate-800 rounded-lg">
                  <button 
                    onClick={() => isSimulationMode && toggleSimulationMode()}
                    className={`px-3 py-1 text-[9px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
                      !isSimulationMode ? 'bg-indigo-600 text-white rounded' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Personal Endpoint
                  </button>
                  <button 
                    onClick={() => !isSimulationMode && toggleSimulationMode()}
                    className={`px-3 py-1 text-[9px] font-mono font-black uppercase tracking-tight transition-all cursor-pointer ${
                      isSimulationMode ? 'bg-indigo-600 text-white rounded' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Enterprise Simulation
                  </button>
                </div>
              </div>

              {/* Grid registry of devices */}
              <div className={`grid grid-cols-1 ${isSimulationMode ? 'md:grid-cols-3' : 'md:grid-cols-1 max-w-xl'} gap-5`}>
                {devices.map((device) => {
                  const isSelected = selectedDeviceId === device.deviceId;
                  return (
                    <div 
                      key={device.deviceId}
                      onClick={() => setSelectedDeviceId(device.deviceId)}
                      className={`group cursor-pointer border rounded-2xl p-5 transition-all relative overflow-hidden bg-slate-900/20 hover:bg-slate-900/45 ${
                        isSelected 
                          ? 'border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-slate-900/60' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5 flex-wrap">
                            {device.deviceName}
                            {isSimulationMode && (
                              <span className="text-[7.5px] font-mono px-1 py-0.1 border border-amber-500/20 bg-amber-500/5 text-amber-500/80 rounded font-black tracking-tighter">
                                SIMULATED
                              </span>
                            )}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-400 uppercase">{device.deviceId}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[8px] font-mono font-black rounded uppercase tracking-wider border ${
                          device.status === 'SAFE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          device.status === 'SUSPICIOUS' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          device.status === 'ISOLATED' ? 'bg-slate-800 border-slate-700 text-slate-400' :
                          'bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse'
                        }`}>
                          {device.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                          <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-slate-500 font-bold uppercase">
                            <span>CPU</span>
                            <Cpu className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-200">{device.telemetryData.cpu}%</span>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                          <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-slate-500 font-bold uppercase">
                            <span>Packets</span>
                            <Network className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-200">{device.telemetryData.packetsPerSecond || 50} p/s</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-800 pt-3.5">
                        <span className="text-[9px] font-mono text-slate-500">PULSE STATUS: ACTIVE</span>
                        <div className="flex gap-1.5">
                          {device.threatLevel === 'HIGH' && <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                          {device.threatLevel === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Dashed layout card for new device enrollment (Device limit demonstration) */}
                <form 
                  onSubmit={handleEnrollNode}
                  className="group border border-dashed border-slate-800 rounded-2xl p-5 flex flex-col justify-between bg-slate-950/30 hover:border-slate-700 transition-all min-h-[180px]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-display text-sm font-bold text-slate-300 uppercase tracking-tight">
                          Enroll Hardware Node
                        </h4>
                        <p className="text-[9px] text-slate-500 font-sans mt-0.5">
                          Provision and link a virtual endpoint client instance to this SaaS organization.
                        </p>
                      </div>
                      <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider font-mono">
                        Tier Limit: {license?.max_devices && license.max_devices > 1000 ? 'Unlimited' : `${devices.length}/${license?.max_devices || 5}`}
                      </span>
                    </div>

                    <div className="mt-3 font-mono text-[9.5px]">
                      <input 
                        type="text" 
                        placeholder="Node Name (e.g. Workstation-05)" 
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-850 p-2.5 text-slate-200 mt-1 pointer-events-auto rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500"
                        disabled={isEnrolling}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isEnrolling || !newDeviceName.trim()}
                    className="w-full mt-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-indigo-500 py-2 text-[9.5px] font-mono font-black uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isEnrolling ? 'Validating Limit...' : 'Enroll Active Node'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: TELEMETRY & ENDPOINT MONITORING */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              {selectedDevice ? (
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 mb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                        <Laptop className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                          REAL-TIME ENDPOINT AUDIT: <span className="text-indigo-400">{selectedDevice.deviceName}</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono uppercase">Machine Id: {selectedDevice.deviceId} • Last seen telemetry metrics</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-mono rounded font-extrabold uppercase border ${
                      selectedDevice.status === 'SAFE' ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' :
                      selectedDevice.status === 'SUSPICIOUS' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                      selectedDevice.status === 'ISOLATED' ? 'bg-slate-800 border-slate-700 text-slate-400' :
                      'bg-red-500/15 border-red-500/25 text-red-400 animate-pulse'
                    }`}>
                      {selectedDevice.status} Mode Status
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* CPU Gauges */}
                    <div className="bg-slate-900/45 border border-slate-800/60 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-slate-500 font-mono">CPU Core Load</span>
                        <Cpu className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className={`text-3xl font-mono font-black ${selectedDevice.telemetryData.cpu > 70 ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
                        {selectedDevice.telemetryData.cpu}%
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            selectedDevice.telemetryData.cpu > 70 ? 'bg-red-500' : 'bg-indigo-500'
                          }`} 
                          style={{ width: `${selectedDevice.telemetryData.cpu}%` }} 
                        />
                      </div>
                    </div>

                    {/* MEM Gauges */}
                    <div className="bg-slate-900/45 border border-slate-800/60 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-slate-500 font-mono">Memory Allocation</span>
                        <Monitor className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="text-3xl font-mono font-black text-slate-100">
                        {selectedDevice.telemetryData.memory}%
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                          style={{ width: `${selectedDevice.telemetryData.memory}%` }} 
                        />
                      </div>
                    </div>

                    {/* Processes */}
                    <div className="bg-slate-900/45 border border-slate-800/60 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-slate-500 font-mono">Runtime Processes</span>
                        <Activity className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="text-3xl font-mono font-black text-slate-100">
                        {selectedDevice.telemetryData.processes}
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium mt-2 uppercase font-mono">Daemons monitored active</p>
                    </div>

                    {/* Packets */}
                    <div className="bg-slate-900/45 border border-slate-800/60 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-slate-500 font-mono">Telemetry Packet Rate</span>
                        <Network className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="text-3xl font-mono font-black text-emerald-400">
                        {selectedDevice.telemetryData.packetsPerSecond || 50} p/s
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium mt-2 uppercase font-mono">Encrypted pipeline stream</p>
                    </div>
                  </div>

                  {/* Extended Telemetry Specs */}
                  <div className="mt-6 bg-slate-900/20 border border-slate-800/85 p-5 rounded-xl">
                    <h4 className="text-slate-400 text-xs font-mono uppercase font-black tracking-wider mb-4">Extended System Specs & Ports</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase">Top Active Protocol</div>
                        <div className="text-slate-200 mt-1">{selectedDevice.telemetryData.topProtocol || 'HTTP/2'}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase">Proxy Connection Rate</div>
                        <div className="text-slate-200 mt-1">{selectedDevice.telemetryData.connectionsPerSecond || 5} connections/s</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase">Total Connected Threads</div>
                        <div className="text-slate-200 mt-1">{selectedDevice.telemetryData.connections || 12} active sockets</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase">Primary Threat Level</div>
                        <div className={`mt-1 font-bold ${selectedDevice.threatLevel === 'HIGH' ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                          {selectedDevice.threatLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 p-8 text-center text-slate-500 font-mono text-xs rounded-2xl">
                  Please enroll a hardware client and select it to stream direct endpoint diagnostics.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADVANCED DEVICE CONTROL CENTER */}
          {activeTab === 'controls' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="border-b border-slate-800/80 pb-4 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/10 p-2 border border-indigo-500/20 rounded-lg">
                    <Settings2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">Tactical Device Controls & Isolation</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Control mechanisms for connected system interfaces</p>
                  </div>
                </div>
              </div>

              {selectedDevice ? (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-900/35 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight font-display">{selectedDevice.deviceName} Controls</h4>
                      <p className="text-xs text-slate-400 font-sans mt-1">Host Id: {selectedDevice.deviceId} is currently flagged as {selectedDevice.status}.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-mono font-bold uppercase tracking-wide">
                      <button 
                        onClick={() => handleScanDevice(selectedDevice.deviceId)}
                        disabled={scanningDevices.has(selectedDevice.deviceId) || selectedDevice.status === 'ISOLATED'}
                        className="flex items-center gap-1.5 py-2 px-4 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white hover:bg-indigo-500/10 rounded-lg transition-all disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${scanningDevices.has(selectedDevice.deviceId) ? 'animate-spin text-indigo-400' : ''}`} />
                        <span>{scanningDevices.has(selectedDevice.deviceId) ? 'Scanning Agent...' : 'Force Target Scan'}</span>
                      </button>
                      
                      <button 
                        onClick={() => selectedDevice.status === 'ISOLATED' ? handleRestartMonitoring(selectedDevice.deviceId) : handleIsolateDevice(selectedDevice.deviceId)}
                        className={`flex items-center gap-1.5 py-2 px-4 border rounded-lg transition-all cursor-pointer ${
                          selectedDevice.status === 'ISOLATED'
                            ? 'border-emerald-600 hover:border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
                            : 'border-red-900 hover:border-red-500 text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{selectedDevice.status === 'ISOLATED' ? 'Restore System Uplink' : 'Isolate Network Port'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900/20 border border-slate-800 p-5 rounded-xl">
                      <h5 className="text-[10px] font-mono uppercase font-black text-slate-400 mb-3 block">Sub-System Overrides</h5>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-sans">Automatic Mitigation Isolation</span>
                          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">ENABLED</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-sans">Telemetry Refresh Rate</span>
                          <span className="font-mono text-slate-300 font-bold">2.5s / loop</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-sans">Virtual Kernel Sandboxing</span>
                          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">ACTIVE</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/20 border border-slate-800 p-5 rounded-xl">
                      <h5 className="text-[10px] font-mono uppercase font-black text-slate-400 mb-2 block">CISO Quick-Action Remediations</h5>
                      <span className="text-[10px] text-slate-500 font-sans block mb-3 leading-normal">
                        Use the remediation buttons below to inject simulated control files or block rogue command binaries on the active agent.
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => showToast ? showToast(`Injecting telemetry control file patch into ${selectedDevice.deviceName}`, 'info') : console.log(`Push Hotfix for ${selectedDevice.deviceName}`)}
                          className="flex-1 py-2 border border-slate-800 hover:border-indigo-500 text-[10px] font-mono font-black text-indigo-400 rounded-lg hover:bg-slate-900 uppercase transition-all tracking-wider cursor-pointer"
                        >
                          Push Hotfix Patch
                        </button>
                        <button 
                          onClick={() => showToast ? showToast(`Flushing firewall tables on ${selectedDevice.deviceName}`, 'success') : console.log(`Flush IPTables on ${selectedDevice.deviceName}`)}
                          className="flex-1 py-2 border border-slate-800 hover:border-indigo-500 text-[10px] font-mono font-black text-indigo-400 rounded-lg hover:bg-slate-900 uppercase transition-all tracking-wider cursor-pointer"
                        >
                          Flush IPTables
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">
                  Please select an active device monitor from the registry.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
