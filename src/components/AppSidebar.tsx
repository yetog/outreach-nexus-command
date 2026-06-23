import React, { useState } from 'react';
import {
  Home,
  Users,
  DollarSign,
  Send,
  FileText,
  BarChart3,
  Phone,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const outreachItems = [
  { title: 'Today', url: '/', icon: Home },
  { title: 'Email Composer', url: '/composer', icon: Send },
  { title: 'Campaigns', url: '/campaigns', icon: FileText },
  { title: 'Call Notes', url: '/call-notes', icon: Phone },
  { title: 'Content Hub', url: '/content', icon: BookOpen },
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : '';

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
                    <NavLink to={item.url} end={item.url === '/'} className={navClass}>
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
                    <NavLink to={item.url} className={navClass}>
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
              <NavLink to="/settings" className={navClass}>
                <SettingsIcon className="h-4 w-4" />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isCollapsed && user && (
          <div className="px-2 pb-2 pt-1 border-t mt-1">
            <div className="text-xs text-muted-foreground truncate px-1 py-1.5" title={user.email ?? ''}>
              {user.email}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        )}
        {isCollapsed && user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign out" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
