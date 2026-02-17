import React, { useState } from 'react';
import { Layout } from './Layout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const today = new Date();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const generateDemoEvents = () => {
  const events = [
    { id: 1, title: '30-min Consultation', time: '09:00 AM', duration: '30 min', attendee: 'John Doe', type: 'Meeting', location: 'Zoom', date: today, description: 'Initial consultation meeting' },
    { id: 2, title: 'Team Sync', time: '02:00 PM', duration: '45 min', attendee: 'Sarah Wilson', type: 'Group Meeting', location: 'Conference Room A', date: today, description: 'Weekly team synchronization' },
    { id: 3, title: 'Product Demo', time: '10:30 AM', duration: '30 min', attendee: 'Emily Davis', type: 'Demo', location: 'Google Meet', date: today, description: 'Product walkthrough' },
    { id: 4, title: 'Code Review', time: '03:00 PM', duration: '45 min', attendee: 'Mike Chen', type: 'Technical', location: 'Zoom', date: addDays(today, 1), description: 'Sprint code review' },
    { id: 5, title: 'Client Onboarding', time: '11:00 AM', duration: '60 min', attendee: 'Anna Brooks', type: 'Onboarding', location: 'In Person', date: addDays(today, 1), description: 'New client setup' },
    { id: 6, title: 'Sprint Planning', time: '09:30 AM', duration: '60 min', attendee: 'David Kim', type: 'Planning', location: 'Conference Room A', date: addDays(today, 2), description: 'Next sprint planning' },
    { id: 7, title: 'Design Review', time: '01:00 PM', duration: '30 min', attendee: 'Rachel Green', type: 'Review', location: 'Zoom', date: addDays(today, 2), description: 'UI/UX review session' },
    { id: 8, title: 'Sales Call', time: '04:00 PM', duration: '30 min', attendee: 'Tom Harris', type: 'Sales', location: 'Phone Call', date: addDays(today, 3), description: 'Discovery call' },
    { id: 9, title: 'Strategy Session', time: '10:00 AM', duration: '60 min', attendee: 'Lisa Wang', type: 'Strategy', location: 'Google Meet', date: addDays(today, 3), description: 'Q2 strategy discussion' },
    { id: 10, title: 'Investor Meeting', time: '02:00 PM', duration: '45 min', attendee: 'James Martinez', type: 'Meeting', location: 'In Person', date: addDays(today, 4), description: 'Series A discussion' },
    { id: 11, title: 'HR Check-in', time: '09:00 AM', duration: '15 min', attendee: 'Olivia Taylor', type: 'HR', location: 'Phone Call', date: addDays(today, 4), description: 'Monthly check-in' },
    { id: 12, title: 'Workshop', time: '01:30 PM', duration: '90 min', attendee: 'Chris Anderson', type: 'Training', location: 'Conference Room A', date: addDays(today, 5), description: 'React advanced patterns' },
    { id: 13, title: 'Mentorship', time: '11:00 AM', duration: '45 min', attendee: 'Nina Patel', type: 'Mentorship', location: 'Zoom', date: addDays(today, 5), description: 'Career guidance session' },
    { id: 14, title: 'Board Meeting', time: '10:00 AM', duration: '120 min', attendee: 'Robert Lee', type: 'Board', location: 'In Person', date: addDays(today, 6), description: 'Quarterly board meeting' },
    { id: 15, title: 'User Interview', time: '03:30 PM', duration: '45 min', attendee: 'Sophie Turner', type: 'Research', location: 'Google Meet', date: addDays(today, 6), description: 'User research interview' },
    { id: 16, title: 'Performance Review', time: '09:00 AM', duration: '30 min', attendee: 'Daniel White', type: 'HR', location: 'Microsoft Teams', date: addDays(today, 7), description: 'Q1 performance review' },
    { id: 17, title: 'Training Session', time: '02:00 PM', duration: '90 min', attendee: 'Grace Nguyen', type: 'Training', location: 'In Person', date: addDays(today, 7), description: 'Onboarding training' },
    { id: 18, title: 'Quick Standup', time: '08:45 AM', duration: '15 min', attendee: 'Kevin Brown', type: 'Standup', location: 'Zoom', date: today, description: 'Morning standup' },
    { id: 19, title: 'Partnership Call', time: '04:30 PM', duration: '30 min', attendee: 'Amanda Clark', type: 'Partnership', location: 'Phone Call', date: addDays(today, 8), description: 'Partnership exploration' },
    { id: 20, title: 'Technical Planning', time: '11:30 AM', duration: '60 min', attendee: 'Brian Scott', type: 'Technical', location: 'Google Meet', date: addDays(today, 9), description: 'Architecture planning' },
  ];
  return events;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const { toast } = useToast();
  const [events, setEvents] = useState(generateDemoEvents);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const getEventsForDate = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getTodayEvents = () => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === now.getDate() &&
             eventDate.getMonth() === now.getMonth() &&
             eventDate.getFullYear() === now.getFullYear();
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setIsEventDialogOpen(true);
  };

  const addEvent = (eventData: any) => {
    const newEvent = {
      id: events.length + 1,
      ...eventData,
      date: selectedDate || new Date()
    };
    setEvents([...events, newEvent]);
    setIsEventDialogOpen(false);
    toast({ title: "Event Added", description: `${eventData.title} has been added to your calendar.` });
  };

  const todayEvents = getTodayEvents();
  const thisWeekCount = events.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7);
    return d >= weekStart && d < weekEnd;
  }).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600">Manage your scheduled events</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('month')}>Month</Button>
            <Button variant={viewMode === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('week')}>Week</Button>
            <Button variant={viewMode === 'day' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('day')}>Day</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth().map((day, index) => {
                    const dayEvents = day ? getEventsForDate(day) : [];
                    const isToday = day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();
                    return (
                      <div key={index}
                        className={`p-2 sm:p-3 text-center border rounded cursor-pointer hover:bg-gray-50 min-h-[60px] sm:min-h-[80px] ${
                          isToday ? 'bg-blue-100 border-blue-300' : 'border-gray-200'
                        }`}
                        onClick={() => day && handleDateClick(day)}
                      >
                        {day && (
                          <div className="h-full flex flex-col">
                            <span className="text-xs sm:text-sm font-medium">{day}</span>
                            <div className="flex-1 mt-1 space-y-1">
                              {dayEvents.slice(0, 2).map((event, idx) => (
                                <div key={idx} className="w-full h-1 sm:h-2 bg-blue-600 rounded text-xs text-white overflow-hidden" title={event.title}>
                                  <span className="hidden sm:inline text-xs px-1">{event.title.substring(0, 8)}</span>
                                </div>
                              ))}
                              {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Today's Events</CardTitle>
                <Button size="sm" onClick={() => { setSelectedDate(new Date()); setIsEventDialogOpen(true); }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No events scheduled for today</p>
                ) : (
                  todayEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{event.time} ({event.duration})</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{event.attendee}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">{event.type}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today's Meetings</span>
                  <span className="font-medium">{todayEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium">{thisWeekCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addEvent({
                title: formData.get('title'),
                time: formData.get('time'),
                duration: formData.get('duration'),
                attendee: formData.get('attendee'),
                location: formData.get('location'),
                type: formData.get('type'),
                description: formData.get('description')
              });
            }} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" placeholder="30 min" required />
                </div>
              </div>
              <div>
                <Label htmlFor="attendee">Attendee</Label>
                <Input id="attendee" name="attendee" required />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" required />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input id="type" name="type" defaultValue="Meeting" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Calendar;
