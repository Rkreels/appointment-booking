import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface EventType {
  id: number;
  name: string;
  duration: number;
  description: string;
  color: string;
  allowedUsers?: string[];
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  timezone: string;
}

interface UserConfig {
  name: string;
  title: string;
  allowedEvents: number[];
  customMessage?: string;
}

const PublicBookingPage: React.FC = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const userPath = searchParams.get('user');
  
  const [step, setStep] = useState<'select-event' | 'select-time' | 'booking-form' | 'confirmation'>('select-event');
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    timezone: 'America/New_York'
  });

  const allEventTypes: EventType[] = [
    {
      id: 1,
      name: '30-min Consultation',
      duration: 30,
      description: 'One-on-one consultation for project planning and strategy.',
      color: 'bg-blue-500',
      allowedUsers: ['john-doe', 'premium-users']
    },
    {
      id: 2,
      name: 'Team Sync Meeting',
      duration: 45,
      description: 'Weekly team alignment and progress review.',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: '15-min Quick Chat',
      duration: 15,
      description: 'Brief check-in or follow-up conversation.',
      color: 'bg-orange-500'
    }
  ];

  // Mock user configurations
  const userConfigs: Record<string, UserConfig> = {
    'john-doe': {
      name: 'John Doe',
      title: 'Senior Consultant',
      allowedEvents: [1, 3],
      customMessage: 'Book a session with John for personalized consulting.'
    },
    'premium-users': {
      name: 'Premium Support',
      title: 'Exclusive Access',
      allowedEvents: [1, 2],
      customMessage: 'Premium users get access to extended consultation sessions.'
    }
  };

  useEffect(() => {
    if (userPath && userConfigs[userPath]) {
      setUserConfig(userConfigs[userPath]);
    }

    // If eventId is provided, find and auto-select the event
    if (eventId) {
      const event = allEventTypes.find(e => e.id.toString() === eventId);
      if (event) {
        // Check if user is allowed to book this event
        if (userConfig && !userConfig.allowedEvents.includes(event.id)) {
          // Redirect to event selection if not allowed
          setStep('select-event');
        } else {
          setSelectedEvent(event);
          setStep('select-time');
        }
      }
    }
  }, [eventId, userPath, userConfig]);

  const getAvailableEvents = () => {
    if (userConfig) {
      return allEventTypes.filter(event => userConfig.allowedEvents.includes(event.id));
    }
    return allEventTypes;
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ];

  const handleEventSelect = (event: EventType) => {
    setSelectedEvent(event);
    setStep('select-time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('booking-form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const eventTypes = getAvailableEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userConfig ? `Schedule with ${userConfig.name}` : 'Schedule a Meeting'}
            </h1>
          </div>
          <p className="text-gray-600">
            {userConfig ? userConfig.customMessage : 'Choose a time that works best for you'}
          </p>
          {userConfig && (
            <p className="text-sm text-gray-500 mt-2">
              {userConfig.title}
            </p>
          )}
        </div>

        {step === 'select-event' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">
              {userConfig ? `Available Sessions with ${userConfig.name}` : 'Select Event Type'}
            </h2>
            {eventTypes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No events available for this configuration.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventTypes.map((event) => (
                  <Card 
                    key={event.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleEventSelect(event)}
                    data-action="select-event-type"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-4 h-4 rounded-full ${event.color}`} />
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{event.duration} minutes</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'select-time' && selectedEvent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep('select-event')}
                  data-action="back-to-events"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${selectedEvent.color}`} />
                    <span>{selectedEvent.name}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedEvent.duration} minutes</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Select Date</Label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                  data-action="select-date"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label className="text-base font-medium mb-3 block">Available Times</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => handleTimeSelect(time)}
                        className="justify-center"
                        data-action="select-time-slot"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'booking-form' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('select-time')}
                data-action="back-to-time-selection"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        data-action="enter-name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        data-action="enter-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        data-action="enter-phone"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                        <SelectTrigger data-action="select-timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please share anything that will help prepare for our meeting..."
                      rows={3}
                      data-action="enter-message"
                    />
                  </div>

                  <Button type="submit" className="w-full" data-action="confirm-booking">
                    Confirm Booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Your meeting has been successfully scheduled. You will receive a confirmation email shortly.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${selectedEvent?.color}`} />
                    <span className="font-medium">{selectedEvent?.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{selectedTime} ({selectedEvent?.duration} minutes)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{formData.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{formData.email}</span>
                  </div>
                </div>
                
                <Button 
                  className="mt-6" 
                  onClick={() => window.location.reload()}
                  data-action="schedule-another"
                >
                  Schedule Another Meeting
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBookingPage;
