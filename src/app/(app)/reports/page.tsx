
"use client";
import { useAppContext } from "@/contexts/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ClientFormattedDate } from "@/components/ClientFormattedDate";

export default function ReportsPage() {
  const { anomalies, devices } = useAppContext();

  const sortedAnomalies = [...anomalies].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      <PageHeader
        title="Security Reports"
        description="Review all detected anomalies and security events."
      />
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Log</CardTitle>
          <CardDescription>
            Detailed list of all flagged activities, sorted by most recent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedAnomalies.length === 0 ? (
             <div className="text-center py-10">
              <Image src="https://placehold.co/200x150.png" alt="No reports" width={200} height={150} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="document list clean"/>
              <p className="text-muted-foreground">No security reports or anomalies found yet. Your network appears clear!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAnomalies.map((anomaly) => {
                const device = devices.find(d => d.id === anomaly.deviceId);
                return (
                  <Card key={anomaly.id} className={`${anomaly.isAnomalous ? 'border-accent hover:shadow-accent/20' : 'border-green-500 hover:shadow-green-500/20'} hover:shadow-md transition-shadow`}>
                    <CardHeader className={`pb-3 ${anomaly.isAnomalous ? 'bg-accent/5' : 'bg-green-500/5'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {anomaly.isAnomalous ? <ShieldAlert className="h-5 w-5 text-accent" /> : <CheckCircle2 className="h-5 w-5 text-green-600" />}
                            {device ? device.name : anomaly.deviceId}
                          </CardTitle>
                          <CardDescription className="text-xs">
                             <ClientFormattedDate dateString={anomaly.timestamp} />
                          </CardDescription>
                        </div>
                        <Badge variant={anomaly.isAnomalous ? "destructive" : "default"} className={!anomaly.isAnomalous ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                          {anomaly.isAnomalous ? "Anomaly" : "Normal"} ({(anomaly.confidenceScore * 100).toFixed(0)}%)
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-1">
                      <p className="text-sm font-medium">Details:</p>
                      <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{anomaly.anomalyDescription}</p>
                      {anomaly.isAnomalous && anomaly.suggestedActions && (
                        <>
                          <p className="text-sm font-medium pt-1">Suggested Actions:</p>
                          <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{anomaly.suggestedActions}</p>
                        </>
                      )}
                    </CardContent>
                    <CardFooter>
                       <Button variant="outline" size="sm" asChild>
                         <Link href={`/devices/${anomaly.deviceId}`}>View Device</Link>
                       </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
