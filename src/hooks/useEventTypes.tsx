import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface EventType {
  id: number;
  name: string;
  duration: number;
  price: string;
  description: string;
  bookings: number;
  color: string;
  active: boolean;
  location: string;
  bufferTime: number;
  createdAt: string;
  updatedAt: string;
}

const now = new Date().toISOString();

const initialEventTypes: EventType[] = [
  { id: 1, name: '30-min Consultation', duration: 30, price: '$150', description: 'One-on-one consultation for project planning and strategy.', bookings: 45, color: 'bg-blue-500', active: true, location: 'Zoom Meeting', bufferTime: 10, createdAt: now, updatedAt: now },
  { id: 2, name: 'Team Sync Meeting', duration: 45, price: 'Free', description: 'Weekly team alignment and progress review.', bookings: 23, color: 'bg-green-500', active: true, location: 'Conference Room A', bufferTime: 5, createdAt: now, updatedAt: now },
  { id: 3, name: '60-min Strategy Session', duration: 60, price: '$250', description: 'Deep dive into business strategy and planning.', bookings: 12, color: 'bg-purple-500', active: true, location: 'Google Meet', bufferTime: 15, createdAt: now, updatedAt: now },
  { id: 4, name: '15-min Quick Chat', duration: 15, price: 'Free', description: 'Brief check-in or follow-up conversation.', bookings: 67, color: 'bg-orange-500', active: true, location: 'Phone Call', bufferTime: 0, createdAt: now, updatedAt: now },
  { id: 5, name: '90-min Workshop', duration: 90, price: '$400', description: 'Hands-on workshop for team skill development.', bookings: 8, color: 'bg-red-500', active: true, location: 'In Person', bufferTime: 15, createdAt: now, updatedAt: now },
  { id: 6, name: 'Product Demo', duration: 30, price: 'Free', description: 'Live product demonstration and Q&A session.', bookings: 34, color: 'bg-blue-500', active: true, location: 'Zoom Meeting', bufferTime: 5, createdAt: now, updatedAt: now },
  { id: 7, name: 'Technical Interview', duration: 60, price: 'Free', description: 'Technical screening interview for candidates.', bookings: 19, color: 'bg-green-500', active: true, location: 'Google Meet', bufferTime: 10, createdAt: now, updatedAt: now },
  { id: 8, name: 'Client Onboarding', duration: 45, price: '$100', description: 'New client onboarding and setup walkthrough.', bookings: 28, color: 'bg-purple-500', active: true, location: 'Microsoft Teams', bufferTime: 10, createdAt: now, updatedAt: now },
  { id: 9, name: 'Design Review', duration: 30, price: '$75', description: 'Review design mockups and provide feedback.', bookings: 15, color: 'bg-yellow-500', active: true, location: 'Zoom Meeting', bufferTime: 5, createdAt: now, updatedAt: now },
  { id: 10, name: 'Code Review Session', duration: 45, price: '$125', description: 'In-depth code review and architecture discussion.', bookings: 11, color: 'bg-red-500', active: true, location: 'Google Meet', bufferTime: 10, createdAt: now, updatedAt: now },
  { id: 11, name: 'Sprint Planning', duration: 60, price: 'Free', description: 'Sprint planning and backlog grooming session.', bookings: 22, color: 'bg-blue-500', active: true, location: 'Conference Room A', bufferTime: 15, createdAt: now, updatedAt: now },
  { id: 12, name: 'Investor Pitch', duration: 30, price: 'Free', description: 'Pitch presentation for potential investors.', bookings: 5, color: 'bg-green-500', active: true, location: 'In Person', bufferTime: 15, createdAt: now, updatedAt: now },
  { id: 13, name: 'HR Check-in', duration: 15, price: 'Free', description: 'Regular HR check-in with team members.', bookings: 41, color: 'bg-orange-500', active: true, location: 'Phone Call', bufferTime: 0, createdAt: now, updatedAt: now },
  { id: 14, name: 'Sales Discovery Call', duration: 30, price: 'Free', description: 'Initial discovery call with prospective clients.', bookings: 56, color: 'bg-purple-500', active: true, location: 'Zoom Meeting', bufferTime: 5, createdAt: now, updatedAt: now },
  { id: 15, name: 'Mentorship Session', duration: 45, price: '$50', description: 'One-on-one mentorship and career guidance.', bookings: 18, color: 'bg-yellow-500', active: true, location: 'Google Meet', bufferTime: 10, createdAt: now, updatedAt: now },
  { id: 16, name: 'Board Meeting', duration: 120, price: 'Free', description: 'Quarterly board meeting and strategic review.', bookings: 4, color: 'bg-red-500', active: false, location: 'Conference Room A', bufferTime: 30, createdAt: now, updatedAt: now },
  { id: 17, name: 'User Research Interview', duration: 45, price: '$25', description: 'User research and feedback interview session.', bookings: 32, color: 'bg-blue-500', active: true, location: 'Zoom Meeting', bufferTime: 5, createdAt: now, updatedAt: now },
  { id: 18, name: 'Training Session', duration: 90, price: '$300', description: 'Comprehensive training on tools and processes.', bookings: 9, color: 'bg-green-500', active: true, location: 'In Person', bufferTime: 15, createdAt: now, updatedAt: now },
  { id: 19, name: 'Performance Review', duration: 30, price: 'Free', description: 'Quarterly performance review and goal setting.', bookings: 27, color: 'bg-orange-500', active: false, location: 'Microsoft Teams', bufferTime: 10, createdAt: now, updatedAt: now },
  { id: 20, name: 'Emergency Support Call', duration: 15, price: '$200', description: 'Urgent support call for critical issues.', bookings: 13, color: 'bg-red-500', active: true, location: 'Phone Call', bufferTime: 0, createdAt: now, updatedAt: now },
];

export const useEventTypes = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialEventTypes);
  const [loading, setLoading] = useState(false);

  const createEventType = useCallback((eventData: Omit<EventType, 'id' | 'bookings' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newEventType: EventType = {
        ...eventData,
        id: Math.max(0, ...eventTypes.map(e => e.id)) + 1,
        bookings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEventTypes(prev => [...prev, newEventType]);
      toast({ title: "Event Type Created", description: `${eventData.name} has been created successfully.` });
      return newEventType;
    } finally {
      setLoading(false);
    }
  }, [eventTypes]);

  const updateEventType = useCallback((id: number, updates: Partial<EventType>) => {
    setLoading(true);
    try {
      setEventTypes(prev => prev.map(eventType =>
        eventType.id === id ? { ...eventType, ...updates, updatedAt: new Date().toISOString() } : eventType
      ));
      const eventType = eventTypes.find(e => e.id === id);
      toast({ title: "Event Type Updated", description: `${eventType?.name} has been updated successfully.` });
    } finally {
      setLoading(false);
    }
  }, [eventTypes]);

  const deleteEventType = useCallback((id: number) => {
    setLoading(true);
    try {
      const eventType = eventTypes.find(e => e.id === id);
      if (eventType && window.confirm(`Are you sure you want to delete "${eventType.name}"?`)) {
        setEventTypes(prev => prev.filter(e => e.id !== id));
        toast({ title: "Event Type Deleted", description: `${eventType.name} has been deleted.`, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }, [eventTypes]);

  const duplicateEventType = useCallback((eventType: EventType) => {
    setLoading(true);
    try {
      const duplicatedEventType: EventType = {
        ...eventType,
        id: Math.max(0, ...eventTypes.map(e => e.id)) + 1,
        name: `${eventType.name} (Copy)`,
        bookings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEventTypes(prev => [...prev, duplicatedEventType]);
      toast({ title: "Event Type Duplicated", description: `${eventType.name} has been duplicated.` });
      return duplicatedEventType;
    } finally {
      setLoading(false);
    }
  }, [eventTypes]);

  const toggleActiveStatus = useCallback((id: number) => {
    setLoading(true);
    try {
      const eventType = eventTypes.find(e => e.id === id);
      if (eventType) {
        setEventTypes(prev => prev.map(e =>
          e.id === id ? { ...e, active: !e.active, updatedAt: new Date().toISOString() } : e
        ));
        toast({
          title: eventType.active ? "Event Type Deactivated" : "Event Type Activated",
          description: `${eventType.name} is now ${eventType.active ? 'inactive' : 'active'}.`,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [eventTypes]);

  const getActiveEventTypes = useCallback(() => {
    return eventTypes.filter(eventType => eventType.active);
  }, [eventTypes]);

  const getEventTypeStats = useCallback(() => {
    return {
      total: eventTypes.length,
      active: eventTypes.filter(et => et.active).length,
      inactive: eventTypes.filter(et => !et.active).length,
      totalBookings: eventTypes.reduce((sum, et) => sum + et.bookings, 0),
      averageDuration: eventTypes.length > 0
        ? Math.round(eventTypes.reduce((sum, et) => sum + et.duration, 0) / eventTypes.length)
        : 0
    };
  }, [eventTypes]);

  return {
    eventTypes, loading, createEventType, updateEventType, deleteEventType,
    duplicateEventType, toggleActiveStatus, getActiveEventTypes, getEventTypeStats,
  };
};
