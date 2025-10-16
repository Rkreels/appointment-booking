import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Booking {
  id: number;
  eventType: string;
  attendee: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const initialBookings: Booking[] = [
  {
    id: 1,
    eventType: '30-min Consultation',
    attendee: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567'
    },
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    duration: '30 min',
    status: 'confirmed',
    location: 'Zoom Meeting',
    notes: 'Discussing project requirements',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    eventType: 'Team Sync',
    attendee: {
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      phone: '+1 (555) 987-6543'
    },
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '02:00 PM',
    duration: '45 min',
    status: 'pending',
    location: 'Conference Room A',
    notes: 'Weekly team alignment meeting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(false);

  const createBooking = useCallback((bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    
    try {
      const newBooking: Booking = {
        ...bookingData,
        id: Math.max(0, ...bookings.map(b => b.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setBookings(prev => [...prev, newBooking]);
      
      toast({
        title: "Booking Created",
        description: `New booking for ${bookingData.attendee.name} has been created.`,
      });

      return newBooking;
    } finally {
      setLoading(false);
    }
  }, [bookings, setBookings]);

  const updateBooking = useCallback((id: number, updates: Partial<Booking>) => {
    setLoading(true);
    
    try {
      setBookings(prev => prev.map(booking => 
        booking.id === id 
          ? { ...booking, ...updates, updatedAt: new Date().toISOString() }
          : booking
      ));

      const booking = bookings.find(b => b.id === id);
      toast({
        title: "Booking Updated",
        description: `Booking for ${booking?.attendee.name} has been updated.`,
      });
    } finally {
      setLoading(false);
    }
  }, [bookings, setBookings]);

  const deleteBooking = useCallback((id: number) => {
    setLoading(true);
    
    try {
      const booking = bookings.find(b => b.id === id);
      setBookings(prev => prev.filter(b => b.id !== id));
      
      toast({
        title: "Booking Deleted",
        description: `Booking for ${booking?.attendee.name} has been deleted.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [bookings, setBookings]);

  const getBookingsByStatus = useCallback((status: Booking['status']) => {
    return bookings.filter(booking => booking.status === status);
  }, [bookings]);

  const getBookingsByDate = useCallback((date: string) => {
    return bookings.filter(booking => booking.date === date);
  }, [bookings]);

  const getUpcomingBookings = useCallback((days: number = 7) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= today && bookingDate <= futureDate;
    });
  }, [bookings]);

  const searchBookings = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return bookings.filter(booking => 
      booking.attendee.name.toLowerCase().includes(lowercaseQuery) ||
      booking.attendee.email.toLowerCase().includes(lowercaseQuery) ||
      booking.eventType.toLowerCase().includes(lowercaseQuery) ||
      booking.notes.toLowerCase().includes(lowercaseQuery)
    );
  }, [bookings]);

  const getBookingStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const thisMonth = new Date();
    thisMonth.setDate(1);

    return {
      total: bookings.length,
      today: bookings.filter(b => b.date === today).length,
      thisWeek: bookings.filter(b => new Date(b.date) >= thisWeek).length,
      thisMonth: bookings.filter(b => new Date(b.date) >= thisMonth).length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  }, [bookings]);

  return {
    bookings,
    loading,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingsByStatus,
    getBookingsByDate,
    getUpcomingBookings,
    searchBookings,
    getBookingStats,
  };
};