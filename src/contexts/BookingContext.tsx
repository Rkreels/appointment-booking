import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

const initialBookings: Booking[] = [
  { id: 1, eventType: '30-min Consultation', attendee: { name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 101-0001' }, date: fmt(today), time: '09:00 AM', duration: '30 min', status: 'confirmed', location: 'Zoom Meeting', notes: 'Discussing project requirements', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 2, eventType: 'Team Sync', attendee: { name: 'Sarah Wilson', email: 'sarah@company.com', phone: '+1 (555) 101-0002' }, date: fmt(addDays(today, 1)), time: '02:00 PM', duration: '45 min', status: 'pending', location: 'Conference Room A', notes: 'Weekly team alignment meeting', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 3, eventType: '60-min Strategy Session', attendee: { name: 'Emily Davis', email: 'emily@corp.com', phone: '+1 (555) 101-0003' }, date: fmt(addDays(today, 2)), time: '10:00 AM', duration: '60 min', status: 'confirmed', location: 'Google Meet', notes: 'Q1 strategy planning', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 4, eventType: '15-min Quick Chat', attendee: { name: 'Mike Chen', email: 'mike@startup.io', phone: '+1 (555) 101-0004' }, date: fmt(addDays(today, -1)), time: '03:30 PM', duration: '15 min', status: 'completed', location: 'Phone Call', notes: 'Follow-up on proposal', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 5, eventType: '30-min Consultation', attendee: { name: 'Anna Brooks', email: 'anna@design.co', phone: '+1 (555) 101-0005' }, date: fmt(addDays(today, 3)), time: '11:00 AM', duration: '30 min', status: 'pending', location: 'Zoom Meeting', notes: 'Brand review session', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 6, eventType: 'Team Sync', attendee: { name: 'David Kim', email: 'david@tech.com', phone: '+1 (555) 101-0006' }, date: fmt(addDays(today, 4)), time: '09:30 AM', duration: '45 min', status: 'confirmed', location: 'Microsoft Teams', notes: 'Sprint retrospective', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 7, eventType: '60-min Strategy Session', attendee: { name: 'Rachel Green', email: 'rachel@media.com', phone: '+1 (555) 101-0007' }, date: fmt(addDays(today, -2)), time: '01:00 PM', duration: '60 min', status: 'completed', location: 'In Person', notes: 'Partnership discussion', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 8, eventType: '30-min Consultation', attendee: { name: 'Tom Harris', email: 'tom@agency.com', phone: '+1 (555) 101-0008' }, date: fmt(addDays(today, 5)), time: '04:00 PM', duration: '30 min', status: 'pending', location: 'Google Meet', notes: 'Campaign review', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 9, eventType: '15-min Quick Chat', attendee: { name: 'Lisa Wang', email: 'lisa@finance.co', phone: '+1 (555) 101-0009' }, date: fmt(addDays(today, -3)), time: '10:30 AM', duration: '15 min', status: 'cancelled', location: 'Phone Call', notes: 'Budget clarification', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 10, eventType: 'Team Sync', attendee: { name: 'James Martinez', email: 'james@devops.io', phone: '+1 (555) 101-0010' }, date: fmt(addDays(today, 6)), time: '02:30 PM', duration: '45 min', status: 'confirmed', location: 'Conference Room A', notes: 'Infrastructure planning', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 11, eventType: '30-min Consultation', attendee: { name: 'Olivia Taylor', email: 'olivia@health.org', phone: '+1 (555) 101-0011' }, date: fmt(addDays(today, 7)), time: '09:00 AM', duration: '30 min', status: 'pending', location: 'Zoom Meeting', notes: 'Wellness program overview', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 12, eventType: '60-min Strategy Session', attendee: { name: 'Chris Anderson', email: 'chris@enterprise.com', phone: '+1 (555) 101-0012' }, date: fmt(addDays(today, -4)), time: '11:00 AM', duration: '60 min', status: 'completed', location: 'In Person', notes: 'Annual contract review', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 13, eventType: '15-min Quick Chat', attendee: { name: 'Nina Patel', email: 'nina@legal.com', phone: '+1 (555) 101-0013' }, date: fmt(addDays(today, 8)), time: '03:00 PM', duration: '15 min', status: 'confirmed', location: 'Phone Call', notes: 'Contract terms check', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 14, eventType: 'Team Sync', attendee: { name: 'Robert Lee', email: 'robert@sales.com', phone: '+1 (555) 101-0014' }, date: fmt(addDays(today, 9)), time: '10:00 AM', duration: '45 min', status: 'pending', location: 'Microsoft Teams', notes: 'Sales pipeline review', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 15, eventType: '30-min Consultation', attendee: { name: 'Sophie Turner', email: 'sophie@creative.co', phone: '+1 (555) 101-0015' }, date: fmt(addDays(today, -5)), time: '01:30 PM', duration: '30 min', status: 'cancelled', location: 'Google Meet', notes: 'Creative brief discussion', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 16, eventType: '60-min Strategy Session', attendee: { name: 'Daniel White', email: 'daniel@invest.com', phone: '+1 (555) 101-0016' }, date: fmt(addDays(today, 10)), time: '09:00 AM', duration: '60 min', status: 'confirmed', location: 'Zoom Meeting', notes: 'Investment portfolio review', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 17, eventType: '15-min Quick Chat', attendee: { name: 'Grace Nguyen', email: 'grace@edu.org', phone: '+1 (555) 101-0017' }, date: fmt(addDays(today, 11)), time: '04:30 PM', duration: '15 min', status: 'pending', location: 'Phone Call', notes: 'Program enrollment query', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 18, eventType: 'Team Sync', attendee: { name: 'Kevin Brown', email: 'kevin@ops.com', phone: '+1 (555) 101-0018' }, date: fmt(today), time: '11:30 AM', duration: '45 min', status: 'confirmed', location: 'Conference Room A', notes: 'Operations standup', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 19, eventType: '30-min Consultation', attendee: { name: 'Amanda Clark', email: 'amanda@marketing.io', phone: '+1 (555) 101-0019' }, date: fmt(addDays(today, 12)), time: '02:00 PM', duration: '30 min', status: 'pending', location: 'Google Meet', notes: 'Marketing strategy alignment', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: 20, eventType: '60-min Strategy Session', attendee: { name: 'Brian Scott', email: 'brian@cto.com', phone: '+1 (555) 101-0020' }, date: fmt(addDays(today, 13)), time: '10:00 AM', duration: '60 min', status: 'confirmed', location: 'In Person', notes: 'Technical roadmap planning', createdAt: today.toISOString(), updatedAt: today.toISOString() },
];

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBooking: (id: number, updates: Partial<Booking>) => void;
  deleteBooking: (id: number) => void;
  getBookingsByStatus: (status: Booking['status']) => Booking[];
  getBookingsByDate: (date: string) => Booking[];
  getUpcomingBookings: (days?: number) => Booking[];
  searchBookings: (query: string) => Booking[];
  getBookingStats: () => {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  }, [bookings]);

  const updateBooking = useCallback((id: number, updates: Partial<Booking>) => {
    setLoading(true);
    try {
      const updatedBooking = bookings.find(b => b.id === id);
      if (!updatedBooking) return;
      const newBooking = { ...updatedBooking, ...updates, updatedAt: new Date().toISOString() };
      setBookings(prev => prev.map(booking => booking.id === id ? newBooking : booking));
      toast({
        title: "Booking Updated",
        description: `Booking for ${updatedBooking.attendee.name} has been updated.`,
      });
    } finally {
      setLoading(false);
    }
  }, [bookings]);

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
  }, [bookings]);

  const getBookingsByStatus = useCallback((status: Booking['status']) => {
    return bookings.filter(booking => booking.status === status);
  }, [bookings]);

  const getBookingsByDate = useCallback((date: string) => {
    return bookings.filter(booking => booking.date === date);
  }, [bookings]);

  const getUpcomingBookings = useCallback((days: number = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 86400000);
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= now && bookingDate <= futureDate;
    });
  }, [bookings]);

  const searchBookings = useCallback((query: string) => {
    const q = query.toLowerCase();
    return bookings.filter(booking =>
      booking.attendee.name.toLowerCase().includes(q) ||
      booking.attendee.email.toLowerCase().includes(q) ||
      booking.eventType.toLowerCase().includes(q) ||
      booking.notes.toLowerCase().includes(q)
    );
  }, [bookings]);

  const getBookingStats = useCallback(() => {
    const todayStr = fmt(new Date());
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const thisMonth = new Date();
    thisMonth.setDate(1);
    return {
      total: bookings.length,
      today: bookings.filter(b => b.date === todayStr).length,
      thisWeek: bookings.filter(b => new Date(b.date) >= thisWeek).length,
      thisMonth: bookings.filter(b => new Date(b.date) >= thisMonth).length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  }, [bookings]);

  return (
    <BookingContext.Provider value={{
      bookings, loading, createBooking, updateBooking, deleteBooking,
      getBookingsByStatus, getBookingsByDate, getUpcomingBookings, searchBookings, getBookingStats,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
