import React, { useState } from 'react';
import { Layout } from './Layout';
import { Clock, Plus, Copy, Edit, Trash2, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventForm } from './EventForm';
import { useEventTypes, EventType } from '@/hooks/useEventTypes';
import { toast } from '@/hooks/use-toast';

const EventTypes: React.FC = () => {
  const {
    eventTypes,
    loading,
    createEventType,
    updateEventType,
    deleteEventType,
    duplicateEventType,
    toggleActiveStatus,
    getEventTypeStats,
  } = useEventTypes();

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | undefined>();

  const handleSaveEvent = (eventData: Omit<EventType, 'id' | 'bookings' | 'createdAt' | 'updatedAt'>) => {
    if (editingEvent) {
      updateEventType(editingEvent.id, eventData);
    } else {
      createEventType(eventData);
    }
    setShowForm(false);
    setEditingEvent(undefined);
  };

  const handleEditEvent = (event: EventType) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    deleteEventType(eventId);
  };

  const handleDuplicateEvent = (event: EventType) => {
    duplicateEventType(event);
  };

  const handleToggleActive = (eventId: number) => {
    toggleActiveStatus(eventId);
  };

  const stats = getEventTypeStats();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Types</h1>
              <p className="text-gray-600">Create and manage your booking types</p>
            </div>
          </div>
          
          <Button 
            data-action="new-event" 
            className="flex items-center space-x-2"
            onClick={() => setShowForm(true)}
          >
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
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{eventType.name}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {eventType.duration} min
                        </Badge>
                        <Badge variant={eventType.price === 'Free' ? 'secondary' : 'default'}>
                          {eventType.price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={eventType.active ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleToggleActive(eventType.id)}
                  >
                    {eventType.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {eventType.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{eventType.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Buffer:</span>
                    <span className="font-medium">{eventType.bufferTime}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Bookings:</span>
                    </div>
                    <span className="font-medium">{eventType.bookings}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateEvent(eventType)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditEvent(eventType)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      title="Settings"
                      onClick={() => handleEditEvent(eventType)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteEvent(eventType.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Event Type Card */}
          <Card 
            className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => setShowForm(true)}
          >
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Types</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.averageDuration}m</div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showForm && (
        <EventForm
          eventType={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(undefined);
          }}
        />
      )}
    </Layout>
  );
};

export default EventTypes;
