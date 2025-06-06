"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Device } from "@/lib/types";

const deviceFormSchema = z.object({
  id: z.string().min(1, "Device ID is required"),
  name: z.string().min(1, "Device name is required"),
  type: z.string().min(1, "Device type is required (e.g., Smart Thermostat, Security Camera)"),
  fingerprint: z.string().min(1, "Device fingerprint is required (e.g., MAC address or unique ID)"),
  ipAddress: z.string().ip({ message: "Invalid IP address" }).optional().or(z.literal("")),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address").optional().or(z.literal("")),
});

type DeviceFormValues = z.infer<typeof deviceFormSchema>;

interface DeviceFormProps {
  onSubmit: (values: Omit<Device, 'status' | 'lastSeen'>) => void;
  initialData?: Partial<Device>;
  isLoading?: boolean;
}

export function DeviceForm({ onSubmit, initialData, isLoading = false }: DeviceFormProps) {
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      id: initialData?.id || "",
      name: initialData?.name || "",
      type: initialData?.type || "",
      fingerprint: initialData?.fingerprint || initialData?.id || "", // Default fingerprint to ID if not specified
      ipAddress: initialData?.ipAddress || "",
      macAddress: initialData?.macAddress || "",
    },
  });

  const handleSubmit = (values: DeviceFormValues) => {
    onSubmit({
        id: values.id,
        name: values.name,
        type: values.type,
        fingerprint: values.fingerprint,
        ipAddress: values.ipAddress || 'N/A',
        macAddress: values.macAddress || 'N/A',
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Device" : "Add New Device"}</CardTitle>
        <CardDescription>
          {initialData?.id ? "Update the details of this IoT device." : "Enter the details of the new IoT device to monitor."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., thermostat-livingroom-001" {...field} disabled={!!initialData?.id} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Living Room Thermostat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Smart Thermostat, IP Camera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fingerprint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Fingerprint</FormLabel>
                  <FormControl>
                    <Input placeholder="Unique identifier, e.g., MAC address or serial number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="macAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MAC Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AA:BB:CC:DD:EE:FF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (initialData?.id ? "Saving..." : "Adding Device...") : (initialData?.id ? "Save Changes" : "Add Device")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
