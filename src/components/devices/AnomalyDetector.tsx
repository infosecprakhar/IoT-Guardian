"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Search, ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useAppContext } from '@/contexts/AppContext';
import type { Device, BehaviorBaseline as BaselineType, Anomaly as AnomalyType } from '@/lib/types';
import type { DetectAnomaliesOutput } from '@/ai/flows/detect-anomalies';
import { Badge } from '@/components/ui/badge';

interface AnomalyDetectorProps {
  device: Device;
  baseline: BaselineType | undefined;
}

export function AnomalyDetector({ device, baseline }: AnomalyDetectorProps) {
  const [currentTrafficData, setCurrentTrafficData] = useState('');
  const [detectionResult, setDetectionResult] = useState<DetectAnomaliesOutput | null>(null);
  const { detectDeviceAnomalies, isLoading, error: contextError, getAnomaliesByDeviceId } = useAppContext();
  const [localError, setLocalError] = useState<string | null>(null);

  const recentAnomalies = getAnomaliesByDeviceId(device.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  const handleDetectAnomalies = async () => {
    if (!currentTrafficData.trim()) {
      setLocalError("Current network traffic data cannot be empty.");
      return;
    }
    if (!baseline) {
      setLocalError("A behavior baseline must be generated before detecting anomalies.");
      return;
    }
    setLocalError(null);
    const result = await detectDeviceAnomalies(device.id, currentTrafficData);
    if (result) {
      setDetectionResult(result);
    } else {
       setLocalError("Failed to detect anomalies. Check console for details or try again.");
    }
  };

  const displayResult = detectionResult;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Anomaly Detection
        </CardTitle>
        <CardDescription>
          Analyze current network traffic against the established baseline to detect suspicious behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!baseline && (
          <div className="p-3 rounded-md bg-yellow-500/10 text-yellow-700 border border-yellow-500/30 flex items-start gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>A behavior baseline is required for anomaly detection. Please generate one first.</span>
          </div>
        )}
        <div>
          <Label htmlFor={`currentTrafficData-${device.id}`}>Current Network Traffic Data</Label>
          <Textarea
            id={`currentTrafficData-${device.id}`}
            placeholder="Paste or describe current network traffic data observed from the device."
            value={currentTrafficData}
            onChange={(e) => setCurrentTrafficData(e.target.value)}
            rows={5}
            className="mt-1"
            disabled={!baseline}
          />
        </div>

        {(localError || contextError) && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 flex items-start gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{localError || contextError}</span>
          </div>
        )}

        {displayResult && (
          <Card className={`mt-4 ${displayResult.isAnomalous ? 'border-accent shadow-accent/30 shadow-lg animate-accent-pulse' : 'border-green-500'}`}>
            <CardHeader className={`pb-2 ${displayResult.isAnomalous ? 'bg-accent/10' : 'bg-green-500/10'}`}>
              <CardTitle className="flex items-center gap-2 text-lg">
                {displayResult.isAnomalous ? <ShieldAlert className="h-6 w-6 text-accent" /> : <ShieldCheck className="h-6 w-6 text-green-500" />}
                Detection Result: {displayResult.isAnomalous ? "Anomaly Detected" : "No Anomaly Detected"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div>
                <p className="font-medium text-sm">Description:</p>
                <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{displayResult.anomalyDescription}</p>
              </div>
              <div>
                <p className="font-medium text-sm">Confidence Score:</p>
                <Badge variant={displayResult.isAnomalous ? "destructive" : "default"} className={!displayResult.isAnomalous ? "bg-green-600 hover:bg-green-700" : ""}>
                  {(displayResult.confidenceScore * 100).toFixed(0)}%
                </Badge>
              </div>
              {displayResult.isAnomalous && (
                 <div>
                  <p className="font-medium text-sm">Suggested Actions:</p>
                  <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{displayResult.suggestedActions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {!displayResult && recentAnomalies.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-md">Recent Detections:</h4>
            <ul className="space-y-2">
              {recentAnomalies.map(anomaly => (
                <li key={anomaly.id} className={`p-3 rounded-md border ${anomaly.isAnomalous ? 'border-accent/50 bg-accent/5' : 'border-green-500/50 bg-green-500/5'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold ${anomaly.isAnomalous ? 'text-accent' : 'text-green-600'}`}>
                      {anomaly.isAnomalous ? 'Anomaly' : 'Normal'} - Confidence: {(anomaly.confidenceScore * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(anomaly.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate" title={anomaly.anomalyDescription}>{anomaly.anomalyDescription}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={handleDetectAnomalies} disabled={isLoading || !baseline || !currentTrafficData.trim()}>
          {isLoading && <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-primary-foreground rounded-full"></span>}
          {isLoading ? 'Detecting...' : 'Detect Anomalies'}
        </Button>
      </CardFooter>
    </Card>
  );
}
