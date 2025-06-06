"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LayoutDashboard, Router, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}

const NavItem = ({ href, icon: Icon, label, exact = false }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  const { state: sidebarState, isMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <Link href={href} passHref legacyBehavior>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={sidebarState === 'collapsed' && !isMobile ? label : undefined}
          className={cn(
            isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/80',
            'w-full justify-start'
          )}
        >
          <a>
            <Icon className="h-5 w-5" />
            <span className={cn(sidebarState === 'collapsed' && !isMobile && 'sr-only')}>{label}</span>
          </a>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-sidebar-primary" />
             <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">IoT Guardian</h1>
          </SidebarHeader>
          <SidebarContent className="flex-grow p-2">
            <SidebarMenu>
              <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" exact />
              <NavItem href="/devices" icon={Router} label="Devices" />
              <NavItem href="/reports" icon={FileText} label="Reports" />
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto">
            {/* Placeholder for settings or logout if needed */}
            {/* <NavItem href="/settings" icon={Settings} label="Settings" />
            <SidebarMenuItem>
               <SidebarMenuButton className="w-full justify-start">
                <LogOut className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-6 shadow-sm md:h-[60px]">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* Current Page Title or Breadcrumbs can go here */}
            </div>
            {/* <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Button> */}
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
