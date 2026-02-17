import React from 'react';
import { Layout } from '../components/Layout';
import { Calendar, Clock, Users, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useBookings } from '@/contexts/BookingContext';

const Index = () => {
  const navigate = useNavigate();
  const { bookings, getBookingStats } = useBookings();
  const stats = getBookingStats();

  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]);
  const upcomingBookings = bookings
    .filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => window.open('/book', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />View Public Booking Page
            </Button>
            <Button variant="outline" onClick={() => navigate('/events')}>
              <Plus className="h-4 w-4 mr-2" />New Event Type
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/bookings')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">{stats.total} total bookings</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/bookings')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">{stats.pending} pending</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/bookings')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmed}</div>
              <p className="text-xs text-muted-foreground">{stats.completed} completed</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/analytics')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground">{stats.cancelled} cancelled</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming bookings</p>
              ) : (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{booking.eventType} with {booking.attendee.name}</h4>
                      <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/bookings">View All Bookings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayBookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No bookings for today</p>
              ) : (
                todayBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{booking.attendee.name}</h4>
                      <p className="text-sm text-gray-600">{booking.eventType}</p>
                      <p className="text-xs text-gray-500">{booking.time} • {booking.location}</p>
                    </div>
                    <Badge variant="secondary">{booking.status}</Badge>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/calendar">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => navigate('/events')}>
                <Plus className="h-6 w-6" /><span className="text-sm">New Event Type</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => navigate('/calendar')}>
                <Calendar className="h-6 w-6" /><span className="text-sm">View Calendar</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => navigate('/analytics')}>
                <TrendingUp className="h-6 w-6" /><span className="text-sm">Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => navigate('/settings')}>
                <Users className="h-6 w-6" /><span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
