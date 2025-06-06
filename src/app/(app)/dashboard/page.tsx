"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, ListChecks, Router, ShieldAlert, Thermometer, Video } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import type { Device, Anomaly } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import Image from 'next/image';

const DeviceStatusIcon = ({ type, status }: { type: string, status: Device['status'] }) => {
  let IconComponent;
  switch (type.toLowerCase()) {
    case 'smart thermostat': IconComponent = Thermometer; break;
    case 'security camera': IconComponent = Video; break;
    default: IconComponent = Router; break;
  }

  let colorClass = "text-muted-foreground";
  if (status === 'online') colorClass = "text-green-500";
  if (status === 'offline') colorClass = "text-slate-500";
  if (status === 'anomalous') colorClass = "text-orange-500";

  return <IconComponent className={`h-5 w-5 ${colorClass}`} />;
};

export default function DashboardPage() {
  const { devices, anomalies } = useAppContext();

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const anomalousDevices = devices.filter(d => d.status === 'anomalous').length;
  const totalAnomalies = anomalies.filter(a => a.isAnomalous).length;

  const recentAnomalies = anomalies
    .filter(a => a.isAnomalous)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Dashboard" description="Overview of your IoT device security status." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Router className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-muted-foreground">
              {onlineDevices} online, {offlineDevices} offline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalous Devices</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${anomalousDevices > 0 ? 'text-accent' : ''}`}>
              {anomalousDevices}
            </div>
            <p className="text-xs text-muted-foreground">Currently exhibiting suspicious behavior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalAnomalies > 0 ? 'text-accent' : ''}`}>{totalAnomalies}</div>
            <p className="text-xs text-muted-foreground">Total unresolved suspicious activities</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Nominal</div>
            <p className="text-xs text-muted-foreground">All systems operating as expected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Anomalies</CardTitle>
            <CardDescription>Top 5 most recent suspicious activities detected.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnomalies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Image src="https://placehold.co/128x128.png" alt="No Anomalies" width={128} height={128} className="mb-4 rounded-lg opacity-50" data-ai-hint="security shield" />
                <p className="text-muted-foreground">No anomalies detected recently. Your network is secure!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentAnomalies.map((anomaly) => (
                  <li key={anomaly.id} className={`p-3 rounded-md border flex items-start gap-3 ${anomaly.isAnomalous ? 'border-accent bg-accent/10 animate-accent-pulse' : 'border-green-500 bg-green-500/10'}`}>
                    {anomaly.isAnomalous ? <AlertTriangle className="h-5 w-5 text-accent mt-1 flex-shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />}
                    <div>
                      <p className="font-semibold">
                        Device: {devices.find(d => d.id === anomaly.deviceId)?.name || anomaly.deviceId}
                      </p>
                      <p className="text-sm text-muted-foreground truncate" title={anomaly.anomalyDescription}>
                        {anomaly.anomalyDescription}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href={`/devices/${anomaly.deviceId}`}>View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
             {totalAnomalies > 0 && (
                <Button asChild className="mt-4 w-full">
                  <Link href="/reports">View All Reports</Link>
                </Button>
              )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Monitored Devices Overview</CardTitle>
            <CardDescription>Quick look at the status of your IoT devices.</CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Image src="https://placehold.co/128x128.png" alt="No Devices" width={128} height={128} className="mb-4 rounded-lg opacity-50" data-ai-hint="router network" />
                <p className="text-muted-foreground">No devices are currently being monitored.</p>
                <Button asChild className="mt-4">
                  <Link href="/devices/new">Add Your First Device</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {devices.slice(0,5).map((device) => (
                  <li key={device.id} className="p-3 rounded-md border flex items-center gap-3">
                    <DeviceStatusIcon type={device.type} status={device.status} />
                    <div className="flex-grow">
                      <p className="font-semibold">{device.name}</p>
                      <p className="text-sm text-muted-foreground">{device.type} - {device.ipAddress}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      device.status === 'online' ? 'bg-green-100 text-green-700' :
                      device.status === 'offline' ? 'bg-slate-100 text-slate-700' :
                      device.status === 'anomalous' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {device.status}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/devices/${device.id}`}>Details</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {devices.length > 0 && (
            <Button asChild className="mt-4 w-full">
              <Link href="/devices">Manage All Devices</Link>
            </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
