
import React from 'react';
import { Calendar, Clock, Settings, BarChart3, Plus, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
  { icon: Home, label: 'Dashboard', href: '/', dataAction: 'dashboard' },
  { icon: Calendar, label: 'Calendar', href: '/calendar', dataAction: 'calendar' },
  { icon: Clock, label: 'Event Types', href: '/events', dataAction: 'events' },
  { icon: Users, label: 'Bookings', href: '/bookings', dataAction: 'bookings' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', dataAction: 'analytics' },
  { icon: Settings, label: 'Settings', href: '/settings', dataAction: 'settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="mb-8">
          <Link 
            to="/events/new"
            data-action="new-event"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Event Type</span>
          </Link>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              data-action={item.dataAction}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              aria-current={location.pathname === item.href ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-gray-900 mb-2">Voice Training</h3>
          <p className="text-sm text-gray-600 mb-3">
            Learn VoiceCal with guided voice instructions
          </p>
          <button 
            data-action="start-training"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
          >
            Start Tutorial
          </button>
        </div>
      </div>
    </aside>
  );
};
