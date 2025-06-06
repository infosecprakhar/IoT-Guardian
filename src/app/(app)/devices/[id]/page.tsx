
"use client";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BaselineGenerator } from "@/components/devices/BaselineGenerator";
import { AnomalyDetector } from "@/components/devices/AnomalyDetector";
import { Thermometer, Video, Router as RouterIcon, Fingerprint, Network, Tag, CalendarDays, ShieldAlert, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ClientFormattedDate } from "@/components/ClientFormattedDate";

const DeviceStatusInfo = ({ status }: { status: string }) => {
  switch (status) {
    case 'online':
      return <span className="flex items-center text-green-600"><CheckCircle className="mr-2 h-5 w-5" /> Online</span>;
    case 'offline':
      return <span className="flex items-center text-slate-600"><AlertCircle className="mr-2 h-5 w-5" /> Offline</span>;
    case 'anomalous':
      return <span className="flex items-center text-orange-600"><ShieldAlert className="mr-2 h-5 w-5" /> Anomalous Behavior</span>;
    default:
      return <span className="flex items-center text-gray-500"><AlertCircle className="mr-2 h-5 w-5" /> Unknown</span>;
  }
};

const DeviceProperty = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: ReactNode | undefined | null }) => (
  <div className="flex items-start">
    <Icon className="h-5 w-5 text-muted-foreground mr-3 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value || 'N/A'}</p>
    </div>
  </div>
);


export default function DeviceDetailPage() {
  const params = useParams();
  const deviceId = typeof params.id === 'string' ? params.id : '';
  const { getDeviceById, getBaselineByDeviceId } = useAppContext();

  const device = getDeviceById(deviceId);
  const baseline = getBaselineByDeviceId(deviceId);

  if (!device) {
    return (
      <div className="container mx-auto py-6 text-center">
        <PageHeader title="Device Not Found" />
        <Image src="https://placehold.co/300x200.png" alt="Not found" width={300} height={200} className="mx-auto my-8 rounded-lg opacity-70" data-ai-hint="error question mark" />
        <p className="text-muted-foreground mb-4">The device you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="outline">
          <Link href="/devices">Back to Devices List</Link>
        </Button>
      </div>
    );
  }

  let DeviceIcon = RouterIcon;
  if (device.type.toLowerCase().includes('thermostat')) DeviceIcon = Thermometer;
  if (device.type.toLowerCase().includes('camera')) DeviceIcon = Video;

  return (
    <div className="space-y-6">
      <PageHeader
        title={device.name}
        description={`Details and security status for ${device.type}.`}
        actions={
          <Button asChild variant="outline">
            <Link href="/devices">Back to Devices</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DeviceIcon className="h-6 w-6 text-primary" />
              Device Information
            </CardTitle>
            <div className="text-lg font-semibold">
               <DeviceStatusInfo status={device.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DeviceProperty icon={Tag} label="Device ID" value={device.id} />
          <DeviceProperty icon={RouterIcon} label="Device Type" value={device.type} />
          <DeviceProperty icon={Fingerprint} label="Fingerprint" value={device.fingerprint} />
          <DeviceProperty icon={Network} label="IP Address" value={device.ipAddress} />
          <DeviceProperty icon={Network} label="MAC Address" value={device.macAddress} />
          <DeviceProperty icon={CalendarDays} label="Last Seen" value={device.lastSeen ? <ClientFormattedDate dateString={device.lastSeen} /> : 'N/A'} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaselineGenerator device={device} existingBaseline={baseline} />
        <AnomalyDetector device={device} baseline={baseline} />
      </div>
    </div>
  );
}
