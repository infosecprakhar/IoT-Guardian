"use client";
import { useRouter } from "next/navigation";
import { DeviceForm } from "@/components/devices/DeviceForm";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import type { Device } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";

export default function NewDevicePage() {
  const router = useRouter();
  const { addDevice, isLoading } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (values: Omit<Device, 'status' | 'lastSeen'>) => {
    try {
      addDevice(values);
      toast({
        title: "Device Added",
        description: `Device "${values.name}" has been successfully added.`,
      });
      router.push("/devices");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to add device:", error);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Device"
        description="Register a new IoT device for monitoring and anomaly detection."
      />
      <DeviceForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
