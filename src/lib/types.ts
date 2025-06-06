export interface Device {
  id: string;
  name: string;
  type: string; // e.g., 'Smart Thermostat', 'Security Camera'
  fingerprint: string; // Unique identifier for fingerprinting
  status: 'online' | 'offline' | 'anomalous' | 'unknown';
  lastSeen: string; // ISO date string
  ipAddress: string;
  macAddress: string;
  deviceTrafficData?: string; // Optional: recent traffic data for quick analysis
}

export interface BehaviorBaseline {
  deviceId: string;
  baselineDescription: string;
  typicalCommunicationPatterns: string;
  expectedDataVolume: string;
  generatedAt: string; // ISO date string
}

export interface Anomaly {
  id: string;
  deviceId: string;
  timestamp: string; // ISO date string
  anomalyDescription: string;
  isAnomalous: boolean;
  confidenceScore: number; // 0-1
  suggestedActions: string;
  originalTrafficData?: string; // The traffic data that triggered this anomaly
}
