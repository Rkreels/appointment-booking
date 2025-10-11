
import React from 'react';
import { Layout } from '../components/Layout';
import { Calendar, Clock, Users, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => window.open('/book', '_blank')}
              data-action="view-public-booking"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Booking Page
            </Button>
            <Button asChild data-action="create-new-event">
              <Link to="/events" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Event Type</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-action="view-today-bookings">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card data-action="view-this-week">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card data-action="view-total-clients">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">+18 new this month</p>
            </CardContent>
          </Card>

          <Card data-action="view-revenue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg" data-action="view-upcoming-event">
                <div>
                  <h4 className="font-medium">30-min Consultation with John Doe</h4>
                  <p className="text-sm text-gray-600">2:00 PM - 2:30 PM</p>
                </div>
                <Badge>Upcoming</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg" data-action="view-upcoming-event">
                <div>
                  <h4 className="font-medium">Team Sync Meeting</h4>
                  <p className="text-sm text-gray-600">4:00 PM - 4:45 PM</p>
                </div>
                <Badge variant="secondary">Confirmed</Badge>
              </div>
              
              <Button variant="outline" className="w-full" asChild data-action="view-all-events">
                <Link to="/calendar">View All Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg" data-action="view-recent-booking">
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">60-min Strategy Session</p>
                  <p className="text-xs text-gray-500">Tomorrow at 10:00 AM</p>
                </div>
                <Badge>New</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg" data-action="view-recent-booking">
                <div>
                  <h4 className="font-medium">Mike Chen</h4>
                  <p className="text-sm text-gray-600">15-min Quick Chat</p>
                  <p className="text-xs text-gray-500">Dec 15 at 3:30 PM</p>
                </div>
                <Badge variant="secondary">Confirmed</Badge>
              </div>
              
              <Button variant="outline" className="w-full" asChild data-action="view-all-bookings">
                <Link to="/bookings">View All Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild data-action="quick-create-event">
                <Link to="/events">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">New Event Type</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild data-action="quick-view-calendar">
                <Link to="/calendar">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">View Calendar</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild data-action="quick-view-analytics">
                <Link to="/analytics">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Analytics</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild data-action="quick-settings">
                <Link to="/settings">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
