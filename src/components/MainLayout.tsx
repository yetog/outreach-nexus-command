import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AIAssistantPanel } from './AIAssistantPanel';

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-background flex items-center px-4 gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Outreach Nexus</h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-[calc(100vw-400px)]">
              <Outlet />
            </div>
          </main>
        </div>

        <AIAssistantPanel />
      </div>
    </SidebarProvider>
  );
}
