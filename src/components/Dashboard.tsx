
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { useBookings } from '@/contexts/BookingContext';
import BookingLinkShare from './BookingLinkShare';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, getBookingStats } = useBookings();
  const stats = getBookingStats();

  const upcomingBookings = bookings
    .filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button data-action="create-new-event" onClick={() => navigate('/events')}>
            <Plus className="h-4 w-4 mr-2" />
            New Event Type
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('/book', '_blank')}
            data-action="view-public-booking"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public Page
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/bookings')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.confirmed} confirmed</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/bookings')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">{stats.pending} pending</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/bookings')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.confirmed + stats.pending}</div>
            <p className="text-xs text-muted-foreground">{stats.completed} completed</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">{stats.cancelled} cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" onClick={() => navigate('/events')} data-action="create-new-event">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event Type
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('/book', '_blank')}
              data-action="view-public-booking"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Booking Page
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/calendar')} data-action="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Booking Link Share */}
        <BookingLinkShare />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Bookings</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/bookings">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming bookings</p>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2">
                  <div>
                    <p className="font-medium">{booking.attendee.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.eventType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{booking.date} {booking.time}</span>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
