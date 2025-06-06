import type { Device, BehaviorBaseline, Anomaly } from './types';

export const mockDevices: Device[] = [
  {
    id: 'thermostat-001',
    name: 'Living Room Thermostat',
    type: 'Smart Thermostat',
    fingerprint: 'fp-thermo-A1B2C3',
    status: 'online',
    lastSeen: new Date().toISOString(),
    ipAddress: '192.168.1.101',
    macAddress: 'AA:BB:CC:DD:EE:01',
    deviceTrafficData: 'Sample traffic data for thermostat-001: Regular pings to time server, occasional communication with manufacturer cloud API. Average data packet size 1KB, interval 5 minutes.'
  },
  {
    id: 'camera-002',
    name: 'Front Door Camera',
    type: 'Security Camera',
    fingerprint: 'fp-cam-X9Y8Z7',
    status: 'anomalous',
    lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    ipAddress: '192.168.1.102',
    macAddress: 'AA:BB:CC:DD:EE:02',
    deviceTrafficData: 'Sample traffic data for camera-002: Continuous high-bandwidth streaming to an unrecognized IP address (34.56.78.90). Data packets 1MB every 2 seconds.'
  },
  {
    id: 'lights-003',
    name: 'Kitchen Smart Lights',
    type: 'Smart Light Bulb',
    fingerprint: 'fp-light-P4Q5R6',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    ipAddress: '192.168.1.103',
    macAddress: 'AA:BB:CC:DD:EE:03',
  },
];

export const mockBaselines: BehaviorBaseline[] = [
  {
    deviceId: 'thermostat-001',
    baselineDescription: 'Normal behavior includes periodic checks with the manufacturer server and time synchronization. Low data volume, primarily small packets.',
    typicalCommunicationPatterns: 'Communicates with api.smartcompany.com (port 443) and time.google.com (port 123).',
    expectedDataVolume: '10-20 KB per hour.',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export const mockAnomalies: Anomaly[] = [
  {
    id: 'anomaly-001',
    deviceId: 'camera-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 mins ago
    isAnomalous: true,
    anomalyDescription: 'Device is sending unusually large amounts of data to an unrecognized external IP address (34.56.78.90). This could indicate a data exfiltration attempt or malware activity.',
    confidenceScore: 0.92,
    suggestedActions: 'Isolate the device from the network immediately. Check for firmware updates. Investigate the destination IP address.',
    originalTrafficData: 'Continuous high-bandwidth streaming to 34.56.78.90. Data packets 1MB every 2 seconds.'
  },
  {
    id: 'anomaly-002',
    deviceId: 'thermostat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isAnomalous: false, // Example of a non-anomalous check or a resolved one.
    anomalyDescription: 'Brief spike in traffic to known update server, consistent with firmware update check. Resolved.',
    confidenceScore: 0.15,
    suggestedActions: 'No action required, behavior matches known update patterns.',
  }
];
