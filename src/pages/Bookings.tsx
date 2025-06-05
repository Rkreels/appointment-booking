import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Users, Calendar, Clock, Mail, Phone, MapPin, Filter, Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookingForm } from '../components/BookingForm';
import { toast } from '@/hooks/use-toast';

interface Booking {
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
  status: string;
  location: string;
  notes: string;
}

const Bookings = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>();

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      eventType: '30-min Consultation',
      attendee: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567'
      },
      date: '2024-01-15',
      time: '09:00 AM',
      duration: '30 min',
      status: 'confirmed',
      location: 'Zoom Meeting',
      notes: 'Discussing project requirements'
    },
    {
      id: 2,
      eventType: 'Team Sync',
      attendee: {
        name: 'Sarah Wilson',
        email: 'sarah@company.com',
        phone: '+1 (555) 987-6543'
      },
      date: '2024-01-15',
      time: '02:00 PM',
      duration: '45 min',
      status: 'pending',
      location: 'Conference Room A',
      notes: 'Weekly team alignment meeting'
    },
    {
      id: 3,
      eventType: '60-min Strategy Session',
      attendee: {
        name: 'Mike Johnson',
        email: 'mike@startup.com',
        phone: '+1 (555) 456-7890'
      },
      date: '2024-01-16',
      time: '11:00 AM',
      duration: '60 min',
      status: 'confirmed',
      location: 'Google Meet',
      notes: 'Q1 planning and strategy discussion'
    },
    {
      id: 4,
      eventType: '15-min Quick Chat',
      attendee: {
        name: 'Emily Davis',
        email: 'emily@agency.com',
        phone: '+1 (555) 321-0987'
      },
      date: '2024-01-14',
      time: '03:30 PM',
      duration: '15 min',
      status: 'completed',
      location: 'Phone Call',
      notes: 'Follow-up on proposal'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleSaveBooking = (bookingData: Booking) => {
    if (editingBooking) {
      // Update existing booking
      setBookings(prev => prev.map(booking => 
        booking.id === editingBooking.id ? { ...bookingData, id: editingBooking.id } : booking
      ));
      toast({
        title: "Booking Updated",
        description: `Booking for ${bookingData.attendee.name} has been updated.`,
      });
    } else {
      // Create new booking
      const newBooking = {
        ...bookingData,
        id: Math.max(...bookings.map(b => b.id)) + 1
      };
      setBookings(prev => [...prev, newBooking]);
      toast({
        title: "Booking Created",
        description: `New booking for ${bookingData.attendee.name} has been created.`,
      });
    }
    setShowForm(false);
    setEditingBooking(undefined);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleDeleteBooking = (bookingId: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && window.confirm(`Are you sure you want to delete the booking for ${booking.attendee.name}?`)) {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      toast({
        title: "Booking Deleted",
        description: `Booking for ${booking.attendee.name} has been deleted.`,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      toast({
        title: "Status Updated",
        description: `Booking for ${booking.attendee.name} is now ${newStatus}.`,
      });
    }
  };

  const getStatusCounts = () => {
    return {
      today: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length,
      week: 45, // Mock data
      month: 168, // Mock data
      pending: bookings.filter(b => b.status === 'pending').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
              <p className="text-gray-600">Manage all your scheduled appointments</p>
            </div>
          </div>
          
          <Button 
            data-action="new-booking"
            className="flex items-center space-x-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Booking</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{statusCounts.today}</div>
                    <div className="text-sm text-gray-600">Today</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statusCounts.week}</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{statusCounts.month}</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{statusCounts.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.eventType}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditBooking(booking)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                                  Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                                  Cancel
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{booking.attendee.name}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{booking.attendee.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{booking.attendee.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{booking.time} ({booking.duration})</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{booking.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredBookings.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                      <p className="text-sm">Try adjusting your search or filters, or create a new booking.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <BookingForm
          booking={editingBooking}
          onSave={handleSaveBooking}
          onCancel={() => {
            setShowForm(false);
            setEditingBooking(undefined);
          }}
        />
      )}
    </Layout>
  );
};

export default Bookings;
