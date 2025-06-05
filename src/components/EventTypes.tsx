
import React, { useState } from 'react';
import { Plus, Clock, Users, Copy, Settings, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EventType {
  id: string;
  name: string;
  duration: number;
  description: string;
  type: 'one-on-one' | 'group' | 'collective';
  bookings: number;
  color: string;
  active: boolean;
}

export const EventTypes: React.FC = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    {
      id: '1',
      name: '30-Minute Consultation',
      duration: 30,
      description: 'Quick consultation call to discuss your needs',
      type: 'one-on-one',
      bookings: 24,
      color: 'blue',
      active: true
    },
    {
      id: '2',
      name: 'Team Sync Meeting',
      duration: 60,
      description: 'Weekly team synchronization meeting',
      type: 'group',
      bookings: 8,
      color: 'green',
      active: true
    },
    {
      id: '3',
      name: 'Discovery Call',
      duration: 45,
      description: 'Initial discovery call for new projects',
      type: 'one-on-one',
      bookings: 12,
      color: 'purple',
      active: true
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    duration: 30,
    description: '',
    type: 'one-on-one' as EventType['type']
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'one-on-one': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-green-100 text-green-800';
      case 'collective': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateEvent = () => {
    const newEventType: EventType = {
      id: Date.now().toString(),
      ...newEvent,
      bookings: 0,
      color: 'blue',
      active: true
    };
    setEventTypes([...eventTypes, newEventType]);
    setNewEvent({ name: '', duration: 30, description: '', type: 'one-on-one' });
    setIsCreateDialogOpen(false);
  };

  const copyBookingLink = (eventId: string) => {
    const link = `https://voicecal.app/book/${eventId}`;
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Types</h2>
          <p className="text-gray-600 mt-1">
            Create and manage your scheduling event types
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Event Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Event Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  placeholder="e.g., 30-Minute Consultation"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={newEvent.duration.toString()}
                  onValueChange={(value) => setNewEvent({ ...newEvent, duration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type">Meeting Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as EventType['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-on-one">One-on-One</SelectItem>
                    <SelectItem value="group">Group Meeting</SelectItem>
                    <SelectItem value="collective">Collective Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Brief description of this event type"
                  rows={3}
                />
              </div>
              
              <Button onClick={handleCreateEvent} className="w-full">
                Create Event Type
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Event Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {event.name}
                  </CardTitle>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.duration}m
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.bookings}
                    </div>
                  </div>
                </div>
                <Badge className={getTypeColor(event.type)}>
                  {event.type.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {event.description}
              </p>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyBookingLink(event.id)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Link
                </Button>
                
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={event.active ? "default" : "secondary"}>
                    {event.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Voice Training Tip */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Voice Training Available
              </h3>
              <p className="text-gray-600 text-sm">
                Learn how to create and customize event types with step-by-step voice guidance. 
                Perfect for mastering advanced features like buffer times and location settings.
              </p>
            </div>
            <Button variant="outline" className="bg-white">
              Start Training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
