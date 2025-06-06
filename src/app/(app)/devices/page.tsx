"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Eye, Edit, Trash2, Thermometer, Video, Router as RouterIcon, ShieldAlert, CheckCircle, AlertCircle } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { PageHeader } from "@/components/PageHeader";
import type { Device } from "@/lib/types";
import Image from "next/image";

const DeviceStatusIndicator = ({ status }: { status: Device['status'] }) => {
  switch (status) {
    case 'online':
      return <span className="flex items-center text-xs text-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Online</span>;
    case 'offline':
      return <span className="flex items-center text-xs text-slate-600"><AlertCircle className="mr-1 h-3 w-3" /> Offline</span>;
    case 'anomalous':
      return <span className="flex items-center text-xs text-orange-600"><ShieldAlert className="mr-1 h-3 w-3" /> Anomalous</span>;
    default:
      return <span className="flex items-center text-xs text-gray-500"><AlertCircle className="mr-1 h-3 w-3" /> Unknown</span>;
  }
};

const DeviceTypeIcon = ({ type }: { type: string }) => {
  if (type.toLowerCase().includes('thermostat')) return <Thermometer className="h-5 w-5 text-primary" />;
  if (type.toLowerCase().includes('camera')) return <Video className="h-5 w-5 text-primary" />;
  return <RouterIcon className="h-5 w-5 text-primary" />;
};


export default function DevicesPage() {
  const { devices } = useAppContext();

  return (
    <div>
      <PageHeader
        title="Manage Devices"
        description="View, add, or manage your IoT devices."
        actions={
          <Button asChild>
            <Link href="/devices/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Device
            </Link>
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>
            A list of all IoT devices currently being monitored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-10">
              <Image src="https://placehold.co/200x150.png" alt="No devices" width={200} height={150} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="empty state network"/>
              <p className="text-muted-foreground mb-4">No devices found. Start by adding a new device.</p>
              <Button asChild>
                <Link href="/devices/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Device
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell><DeviceTypeIcon type={device.type} /></TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>{device.ipAddress}</TableCell>
                    <TableCell><DeviceStatusIndicator status={device.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild title="View Details">
                        <Link href={`/devices/${device.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Placeholder for Edit/Delete actions if needed in future */}
                      {/* <Button variant="ghost" size="icon" asChild title="Edit Device">
                        <Link href={`/devices/${device.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete Device" onClick={() => alert('Delete functionality not implemented.')}>
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
