
import React from 'react';
import { Calendar, Clock, Settings, BarChart3, Plus, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { icon: Home, label: 'Dashboard', href: '/', active: true },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Clock, label: 'Event Types', href: '/events' },
  { icon: Users, label: 'Bookings', href: '/bookings' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="mb-8">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Event Type</span>
          </button>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-gray-900 mb-2">Voice Training</h3>
          <p className="text-sm text-gray-600 mb-3">
            Learn VoiceCal with guided voice instructions
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors">
            Start Tutorial
          </button>
        </div>
      </div>
    </aside>
  );
};
