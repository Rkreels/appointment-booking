
import React, { useState } from 'react';
import { Layout } from './Layout';
import { Clock, Plus, Copy, Edit, Trash2, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EventTypes: React.FC = () => {
  const [eventTypes] = useState([
    {
      id: 1,
      name: '30-min Consultation',
      duration: 30,
      price: '$150',
      description: 'One-on-one consultation for project planning and strategy.',
      bookings: 45,
      color: 'bg-blue-500',
      active: true
    },
    {
      id: 2,
      name: 'Team Sync Meeting',
      duration: 45,
      price: 'Free',
      description: 'Weekly team alignment and progress review.',
      bookings: 23,
      color: 'bg-green-500',
      active: true
    },
    {
      id: 3,
      name: '60-min Strategy Session',
      duration: 60,
      price: '$250',
      description: 'Deep dive into business strategy and planning.',
      bookings: 12,
      color: 'bg-purple-500',
      active: false
    },
    {
      id: 4,
      name: '15-min Quick Chat',
      duration: 15,
      price: 'Free',
      description: 'Brief check-in or follow-up conversation.',
      bookings: 67,
      color: 'bg-orange-500',
      active: true
    }
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Types</h1>
              <p className="text-gray-600">Create and manage your booking types</p>
            </div>
          </div>
          
          <Button data-action="new-event" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Event Type</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventTypes.map((eventType) => (
            <Card key={eventType.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${eventType.color}`} />
                    <div>
                      <CardTitle className="text-lg">{eventType.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">
                          {eventType.duration} min
                        </Badge>
                        <Badge variant={eventType.price === 'Free' ? 'secondary' : 'default'}>
                          {eventType.price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant={eventType.active ? 'default' : 'secondary'}>
                    {eventType.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {eventType.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{eventType.bookings} bookings</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Event Type Card */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900">Create New Event Type</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Set up a new type of meeting or appointment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{eventTypes.length}</div>
                <div className="text-sm text-gray-600">Total Types</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {eventTypes.filter(et => et.active).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {eventTypes.reduce((sum, et) => sum + et.bookings, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(eventTypes.reduce((sum, et) => sum + et.duration, 0) / eventTypes.length)}m
                </div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EventTypes;
