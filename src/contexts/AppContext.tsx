"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Device, BehaviorBaseline, Anomaly } from '@/lib/types';
import { mockDevices, mockBaselines, mockAnomalies } from '@/lib/placeholder-data';
import { generateBehaviorBaseline } from '@/ai/flows/generate-behavior-baseline';
import type { GenerateBehaviorBaselineOutput } from '@/ai/flows/generate-behavior-baseline';
import { detectAnomalies as detectAnomaliesFlow } from '@/ai/flows/detect-anomalies';
import type { DetectAnomaliesOutput } from '@/ai/flows/detect-anomalies';


interface AppContextType {
  devices: Device[];
  baselines: BehaviorBaseline[];
  anomalies: Anomaly[];
  addDevice: (device: Omit<Device, 'status' | 'lastSeen'>) => void;
  getDeviceById: (id: string) => Device | undefined;
  getBaselineByDeviceId: (deviceId: string) => BehaviorBaseline | undefined;
  getAnomaliesByDeviceId: (deviceId: string) => Anomaly[];
  generateNewBaseline: (deviceId: string, deviceTrafficData: string, deviceType: string) => Promise<GenerateBehaviorBaselineOutput | null>;
  detectDeviceAnomalies: (deviceId: string, networkTrafficData: string) => Promise<DetectAnomaliesOutput | null>;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [baselines, setBaselines] = useState<BehaviorBaseline[]>(mockBaselines);
  const [anomalies, setAnomalies] = useState<Anomaly[]>(mockAnomalies);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDevice = useCallback((newDeviceData: Omit<Device, 'status' | 'lastSeen'>) => {
    const newDevice: Device = {
      ...newDeviceData,
      status: 'unknown',
      lastSeen: new Date().toISOString(),
    };
    setDevices((prevDevices) => [...prevDevices, newDevice]);
  }, []);

  const getDeviceById = useCallback((id: string) => devices.find(d => d.id === id), [devices]);
  const getBaselineByDeviceId = useCallback((deviceId: string) => baselines.find(b => b.deviceId === deviceId), [baselines]);
  const getAnomaliesByDeviceId = useCallback((deviceId: string) => anomalies.filter(a => a.deviceId === deviceId), [anomalies]);

  const generateNewBaseline = async (deviceId: string, deviceTrafficData: string, deviceType: string): Promise<GenerateBehaviorBaselineOutput | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateBehaviorBaseline({ deviceId, deviceTrafficData, deviceType });
      const newBaseline: BehaviorBaseline = {
        deviceId,
        ...result,
        generatedAt: new Date().toISOString(),
      };
      setBaselines(prev => [...prev.filter(b => b.deviceId !== deviceId), newBaseline]);
      // Update device status if it was unknown
      setDevices(prev => prev.map(d => d.id === deviceId && d.status === 'unknown' ? {...d, status: 'online'} : d));
      return result;
    } catch (e) {
      console.error("Error generating baseline:", e);
      setError("Failed to generate behavior baseline.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const detectDeviceAnomalies = async (deviceId: string, networkTrafficData: string): Promise<DetectAnomaliesOutput | null> => {
    setIsLoading(true);
    setError(null);
    const device = getDeviceById(deviceId);
    const baseline = getBaselineByDeviceId(deviceId);

    if (!device || !baseline) {
      setError("Device or baseline not found for anomaly detection.");
      setIsLoading(false);
      return null;
    }

    try {
      const result = await detectAnomaliesFlow({
        deviceFingerprint: device.fingerprint,
        networkTrafficData,
        baselineBehavior: baseline.baselineDescription,
      });
      
      const newAnomaly: Anomaly = {
        id: `anomaly-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        deviceId,
        timestamp: new Date().toISOString(),
        anomalyDescription: result.anomalyDescription,
        isAnomalous: result.isAnomalous,
        confidenceScore: result.confidenceScore,
        suggestedActions: result.suggestedActions,
        originalTrafficData: networkTrafficData,
      };
      setAnomalies(prev => [...prev, newAnomaly]);
      
      if (result.isAnomalous) {
        setDevices(prev => prev.map(d => d.id === deviceId ? {...d, status: 'anomalous'} : d));
      } else if (device.status === 'anomalous') { // If not anomalous and was anomalous, set to online
         setDevices(prev => prev.map(d => d.id === deviceId ? {...d, status: 'online'} : d));
      }

      return result;
    } catch (e) {
      console.error("Error detecting anomalies:", e);
      setError("Failed to detect anomalies.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AppContext.Provider value={{ 
        devices, 
        baselines, 
        anomalies, 
        addDevice, 
        getDeviceById, 
        getBaselineByDeviceId,
        getAnomaliesByDeviceId,
        generateNewBaseline,
        detectDeviceAnomalies,
        isLoading,
        error
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
