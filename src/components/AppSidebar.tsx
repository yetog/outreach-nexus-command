import React, { useState } from 'react';
import { Home, Users, DollarSign, Send, FileText, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { MiniCalendar } from './MiniCalendar';

const outreachItems = [
  { title: 'Today', url: '/', icon: Home },
  { title: 'Email Composer', url: '/composer', icon: Send },
  { title: 'Campaigns', url: '/campaigns', icon: FileText },
  { title: 'Call Notes', url: '/call-notes', icon: FileText },
  { title: 'Content', url: '/content', icon: FileText },
];

const crmItems = [
  { title: 'Contacts', url: '/contacts', icon: Users },
  { title: 'Deals', url: '/deals', icon: DollarSign },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {!isCollapsed && (
          <div className="px-3 py-2">
            <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Outreach</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {outreachItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {crmItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : ''
                }
              >
                <SettingsIcon className="h-4 w-4" />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
