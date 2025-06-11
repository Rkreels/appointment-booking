
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ExternalLink, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface EventType {
  id: number;
  name: string;
  duration: number;
  description: string;
  color: string;
}

const BookingLinkShare: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [customPath, setCustomPath] = useState<string>('');
  
  const eventTypes: EventType[] = [
    {
      id: 1,
      name: '30-min Consultation',
      duration: 30,
      description: 'One-on-one consultation for project planning and strategy.',
      color: 'bg-blue-500'
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

  const generateBookingUrl = () => {
    const baseUrl = window.location.origin;
    if (selectedEvent === 'all') {
      return `${baseUrl}/book${customPath ? `?user=${customPath}` : ''}`;
    } else {
      return `${baseUrl}/book/${selectedEvent}${customPath ? `?user=${customPath}` : ''}`;
    }
  };

  const copyToClipboard = () => {
    const url = generateBookingUrl();
    navigator.clipboard.writeText(url);
    toast.success('Booking link copied to clipboard!');
  };

  const openInNewTab = () => {
    const url = generateBookingUrl();
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ExternalLink className="h-5 w-5" />
          <span>Share Booking Link</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event-select">Event Type</Label>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger data-action="select-event-for-link">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Event Types</SelectItem>
              {eventTypes.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${event.color}`} />
                    <span>{event.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-path">Custom User Path (Optional)</Label>
          <Input
            id="custom-path"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="e.g., john-doe"
            data-action="enter-custom-path"
          />
          <p className="text-xs text-gray-500">
            Add a custom path to create user-specific booking pages
          </p>
        </div>

        <div className="space-y-2">
          <Label>Generated Link</Label>
          <div className="flex space-x-2">
            <Input value={generateBookingUrl()} readOnly className="font-mono text-sm" />
            <Button size="sm" onClick={copyToClipboard} data-action="copy-booking-link">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openInNewTab} data-action="open-booking-link">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Settings className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Customization Tips:</p>
              <ul className="mt-1 text-blue-700 list-disc list-inside space-y-1">
                <li>Use custom paths to create personalized booking experiences</li>
                <li>Share specific event links for targeted bookings</li>
                <li>Track different marketing campaigns with unique paths</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingLinkShare;
