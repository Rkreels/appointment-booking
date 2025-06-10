
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger data-action="toggle-sidebar" />
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search events, bookings..."
                className="pl-10 w-64"
                data-action="global-search"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" data-action="notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" data-action="user-menu">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
