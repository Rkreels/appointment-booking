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

const initialEventTypes: EventType[] = [
  {
    id: 1,
    name: '30-min Consultation',
    duration: 30,
    price: '$150',
    description: 'One-on-one consultation for project planning and strategy.',
    bookings: 45,
    color: 'bg-blue-500',
    active: true,
    location: 'Zoom Meeting',
    bufferTime: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Team Sync Meeting',
    duration: 45,
    price: 'Free',
    description: 'Weekly team alignment and progress review.',
    bookings: 23,
    color: 'bg-green-500',
    active: true,
    location: 'Conference Room A',
    bufferTime: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: '60-min Strategy Session',
    duration: 60,
    price: '$250',
    description: 'Deep dive into business strategy and planning.',
    bookings: 12,
    color: 'bg-purple-500',
    active: true,
    location: 'Google Meet',
    bufferTime: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: '15-min Quick Chat',
    duration: 15,
    price: 'Free',
    description: 'Brief check-in or follow-up conversation.',
    bookings: 67,
    color: 'bg-orange-500',
    active: true,
    location: 'Phone Call',
    bufferTime: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
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
      
      toast({
        title: "Event Type Created",
        description: `${eventData.name} has been created successfully.`,
      });

      return newEventType;
    } finally {
      setLoading(false);
    }
  }, [eventTypes, setEventTypes]);

  const updateEventType = useCallback((id: number, updates: Partial<EventType>) => {
    setLoading(true);
    
    try {
      setEventTypes(prev => prev.map(eventType => 
        eventType.id === id 
          ? { ...eventType, ...updates, updatedAt: new Date().toISOString() }
          : eventType
      ));

      const eventType = eventTypes.find(e => e.id === id);
      toast({
        title: "Event Type Updated",
        description: `${eventType?.name} has been updated successfully.`,
      });
    } finally {
      setLoading(false);
    }
  }, [eventTypes, setEventTypes]);

  const deleteEventType = useCallback((id: number) => {
    setLoading(true);
    
    try {
      const eventType = eventTypes.find(e => e.id === id);
      if (eventType && window.confirm(`Are you sure you want to delete "${eventType.name}"?`)) {
        setEventTypes(prev => prev.filter(e => e.id !== id));
        
        toast({
          title: "Event Type Deleted",
          description: `${eventType.name} has been deleted.`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [eventTypes, setEventTypes]);

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
      
      toast({
        title: "Event Type Duplicated",
        description: `${eventType.name} has been duplicated.`,
      });

      return duplicatedEventType;
    } finally {
      setLoading(false);
    }
  }, [eventTypes, setEventTypes]);

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
  }, [eventTypes, setEventTypes]);

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
    eventTypes,
    loading,
    createEventType,
    updateEventType,
    deleteEventType,
    duplicateEventType,
    toggleActiveStatus,
    getActiveEventTypes,
    getEventTypeStats,
  };
};