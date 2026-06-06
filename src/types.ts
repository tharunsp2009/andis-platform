export interface Metrics {
  cpu: number;
  memory: number;
  processes: number;
  connections: number;
  connectionsPerSecond: number;
  dataTransferRate: number;
  packetsPerSecond: number;
  topSourceIP: string;
  topProtocol: string;
  timestamp: string;
}

export interface Packet {
  srcIp: string;
  dstIp: string;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS';
  size: number;
}

export interface Connection {
  process: string;
  pid: number;
  local: string;
  remote: string;
  remoteIp: string;
  remotePort: number;
  status: string;
  isExternal: boolean;
  isSuspiciousPort: boolean;
  alert: string | null;
}

export interface SecurityLog {
  timestamp: string;
  process_name: string;
  local_ip: string;
  local_port: number;
  remote_ip: string;
  remote_port: number;
  connection_status: string;
  alert_type: string;
}

export interface ThreatAlert {
  id: string;
  timestamp: string;
  message: string;
}

export interface DefenseAction {
  id: string;
  timestamp: string;
  action: string;
  condition: string;
}

export interface IncidentReport {
  id: string;
  timestamp: string;
  device: string;
  threatType: string;
  severity: string;
  explanation: string;
  recommendedAction: string;
}

export interface AIAnalysis {
  id: string;
  attackType: string;
  targetDevice: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  explanation: string;
  recommendedAction: string;
  timestamp: string;
}

export interface ThreatPrediction {
  id: string;
  type: string;
  probability: number;
  reason: string;
  timestamp: string;
}

export interface AttackEvent {
  id: string;
  type: string;
  target: string;
  severity: 'Low' | 'Medium' | 'High';
  originCountry: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'danger' | 'defense';
}

export interface BlockedIP {
  id: string;
  ip: string;
  attackType: string;
  timestamp: string;
}

export interface LearnedPattern {
  id: string;
  attackType: string;
  detectionMethod: string;
  defenseAction: string;
  occurrenceCount: number;
}

export interface ThreatIntelAlert {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  recommendedAction: string;
  timestamp: string;
}

export interface Device {
  deviceId: string;
  deviceName: string;
  status: 'SAFE' | 'SUSPICIOUS' | 'THREAT' | 'ISOLATED';
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastSeen: string;
  telemetryData: Metrics;
}
