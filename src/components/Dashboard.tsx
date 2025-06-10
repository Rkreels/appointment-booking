
import React from 'react';
import { Calendar, Clock, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, onClick }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="text-blue-600 bg-blue-50 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface UpcomingMeeting {
  id: string;
  title: string;
  attendee: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const upcomingMeetings: UpcomingMeeting[] = [
    {
      id: '1',
      title: '30-min Consultation',
      attendee: 'Sarah Johnson',
      time: 'Today, 2:00 PM',
      type: 'Video Call',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Team Sync',
      attendee: 'Marketing Team',
      time: 'Tomorrow, 10:00 AM',
      type: 'In-person',
      status: 'confirmed'
    },
    {
      id: '3',
      title: 'Discovery Call',
      attendee: 'John Smith',
      time: 'Wednesday, 3:30 PM',
      type: 'Phone Call',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
            <p className="text-blue-100 mb-4">
              You have 3 meetings scheduled for today.
            </p>
            <Button 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate('/book')}
              data-action="view-public-booking"
            >
              View Public Booking Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 p-4 rounded-lg">
              <Calendar className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value="127"
          icon={<Calendar className="h-6 w-6" />}
          trend="+12% from last month"
          trendUp={true}
          onClick={() => navigate('/bookings')}
        />
        <StatCard
          title="Event Types"
          value="5"
          icon={<Clock className="h-6 w-6" />}
          onClick={() => navigate('/events')}
        />
        <StatCard
          title="This Week"
          value="18"
          icon={<Users className="h-6 w-6" />}
          trend="+5 from last week"
          trendUp={true}
          onClick={() => navigate('/calendar')}
        />
        <StatCard
          title="Conversion Rate"
          value="84%"
          icon={<TrendingUp className="h-6 w-6" />}
          trend="+2% improvement"
          trendUp={true}
          onClick={() => navigate('/analytics')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Meetings</span>
              <Button variant="outline" size="sm" onClick={() => navigate('/bookings')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                  <p className="text-sm text-gray-600">{meeting.attendee}</p>
                  <p className="text-sm text-gray-500">{meeting.time}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                  <p className="text-xs text-gray-500">{meeting.type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/events')}
              data-action="create-new-event"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Event Type
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/calendar')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/bookings')}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Bookings
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
