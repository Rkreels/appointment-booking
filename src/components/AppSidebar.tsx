
import React from 'react';
import { Calendar, Clock, Settings, BarChart3, Plus, Users, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navigationItems = [
  { icon: Home, label: 'Dashboard', href: '/', dataAction: 'dashboard' },
  { icon: Calendar, label: 'Calendar', href: '/calendar', dataAction: 'calendar' },
  { icon: Clock, label: 'Event Types', href: '/events', dataAction: 'events' },
  { icon: Users, label: 'Bookings', href: '/bookings', dataAction: 'bookings' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', dataAction: 'analytics' },
  { icon: Settings, label: 'Settings', href: '/settings', dataAction: 'settings' },
];

export const AppSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 shadow-sm">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 group-data-[collapsible=icon]:hidden">
            VoiceCal
          </h2>
          <SidebarTrigger data-action="toggle-sidebar" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mb-6 group-data-[collapsible=icon]:mb-2">
              <SidebarMenuButton asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                <Link 
                  to="/events"
                  data-action="new-event"
                  className="flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">New Event Type</span>
                </Link>
              </SidebarMenuButton>
            </div>
            
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.href}
                    data-action={item.dataAction}
                  >
                    <Link to={item.href} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 group-data-[collapsible=icon]:p-2">
          <h3 className="font-medium text-gray-900 mb-2 group-data-[collapsible=icon]:hidden">Quick Access</h3>
          <p className="text-sm text-gray-600 mb-3 group-data-[collapsible=icon]:hidden">
            Manage your bookings and settings
          </p>
          <Link 
            to="/book"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors group-data-[collapsible=icon]:px-2 flex items-center justify-center"
          >
            <span className="group-data-[collapsible=icon]:hidden">Public Booking</span>
            <span className="group-data-[collapsible=icon]:block hidden">📅</span>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
