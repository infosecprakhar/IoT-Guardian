"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, CheckCircle, AlertTriangle } from "lucide-react";
import { useAppContext } from '@/contexts/AppContext';
import type { Device, BehaviorBaseline as BaselineType } from '@/lib/types';
import type { GenerateBehaviorBaselineOutput } from '@/ai/flows/generate-behavior-baseline';

interface BaselineGeneratorProps {
  device: Device;
  existingBaseline: BaselineType | undefined;
}

export function BaselineGenerator({ device, existingBaseline }: BaselineGeneratorProps) {
  const [trafficData, setTrafficData] = useState(device.deviceTrafficData || '');
  const [generatedBaseline, setGeneratedBaseline] = useState<GenerateBehaviorBaselineOutput | null>(null);
  const { generateNewBaseline, isLoading, error: contextError } = useAppContext();
  const [localError, setLocalError] = useState<string | null>(null);

  const displayBaseline = generatedBaseline || (existingBaseline ? {
    baselineDescription: existingBaseline.baselineDescription,
    typicalCommunicationPatterns: existingBaseline.typicalCommunicationPatterns,
    expectedDataVolume: existingBaseline.expectedDataVolume,
  } : null);
  
  const displayGeneratedAt = existingBaseline?.generatedAt;

  const handleGenerateBaseline = async () => {
    if (!trafficData.trim()) {
      setLocalError("Device traffic data cannot be empty.");
      return;
    }
    setLocalError(null);
    const result = await generateNewBaseline(device.id, trafficData, device.type);
    if (result) {
      setGeneratedBaseline(result);
    } else {
      setLocalError("Failed to generate baseline. Check console for details or try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Behavior Baseline
        </CardTitle>
        <CardDescription>
          Analyze network traffic to establish a normal behavior baseline for this device.
          {displayGeneratedAt && (
            <span className="block text-xs mt-1">
              Current baseline generated on: {new Date(displayGeneratedAt).toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`trafficData-${device.id}`}>Device Network Traffic Data</Label>
          <Textarea
            id={`trafficData-${device.id}`}
            placeholder="Paste or describe observed network traffic data. E.g., 'Regular pings to 1.2.3.4, occasional data bursts to cloud.example.com. Average packet size 500 bytes, interval 1 min.'"
            value={trafficData}
            onChange={(e) => setTrafficData(e.target.value)}
            rows={5}
            className="mt-1"
          />
        </div>
        
        {(localError || contextError) && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 flex items-start gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{localError || contextError}</span>
          </div>
        )}

        {displayBaseline && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-md">Current Baseline Details:</h4>
            <div>
              <p className="font-medium text-sm">Description:</p>
              <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{displayBaseline.baselineDescription}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Typical Communication Patterns:</p>
              <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{displayBaseline.typicalCommunicationPatterns}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Expected Data Volume:</p>
              <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{displayBaseline.expectedDataVolume}</p>
            </div>
          </div>
        )}
        {!displayBaseline && !isLoading && !localError && !contextError && (
          <p className="text-sm text-muted-foreground italic">No baseline has been generated for this device yet, or the previous generation failed.</p>
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateBaseline} disabled={isLoading || !trafficData.trim()}>
          {isLoading && <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-primary-foreground rounded-full"></span>}
          {isLoading ? 'Generating...' : (existingBaseline || generatedBaseline ? 'Re-generate Baseline' : 'Generate Baseline')}
        </Button>
      </CardFooter>
    </Card>
  );
}
