
import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  slots: TimeSlot[];
}

interface WeeklyHours {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

const AvailabilitySettings: React.FC = () => {
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours>({
    monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] }
  });

  const [timezone, setTimezone] = useState('America/New_York');
  const [dateOverrides, setDateOverrides] = useState<any[]>([]);

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ];

  const handleDayToggle = (day: string) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeeklyHours],
        enabled: !prev[day as keyof WeeklyHours].enabled
      }
    }));
  };

  const handleTimeChange = (day: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeeklyHours],
        slots: prev[day as keyof WeeklyHours].slots.map((slot, index) =>
          index === slotIndex ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const addTimeSlot = (day: string) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeeklyHours],
        slots: [...prev[day as keyof WeeklyHours].slots, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeeklyHours],
        slots: prev[day as keyof WeeklyHours].slots.filter((_, index) => index !== slotIndex)
      }
    }));
  };

  const copyToAllDays = (sourceDay: string) => {
    const sourceConfig = weeklyHours[sourceDay as keyof WeeklyHours];
    const newWeeklyHours = { ...weeklyHours };
    
    days.forEach(day => {
      if (day !== sourceDay) {
        newWeeklyHours[day as keyof WeeklyHours] = {
          enabled: sourceConfig.enabled,
          slots: [...sourceConfig.slots]
        };
      }
    });
    
    setWeeklyHours(newWeeklyHours);
  };

  return (
    <div className="space-y-6">
      {/* Timezone Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Timezone & General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
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
            
            <div className="space-y-2">
              <Label>Buffer Time Between Meetings</Label>
              <Select defaultValue="15">
                <SelectTrigger data-action="select-buffer-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weekly Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {days.map((day) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={weeklyHours[day as keyof WeeklyHours].enabled}
                    onCheckedChange={() => handleDayToggle(day)}
                    data-action={`toggle-${day}`}
                  />
                  <Label className="text-base font-medium">
                    {dayLabels[day as keyof typeof dayLabels]}
                  </Label>
                </div>
                
                {weeklyHours[day as keyof WeeklyHours].enabled && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(day)}
                      data-action={`add-time-slot-${day}`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Hours
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToAllDays(day)}
                      data-action={`copy-to-all-${day}`}
                    >
                      Copy to All
                    </Button>
                  </div>
                )}
              </div>

              {weeklyHours[day as keyof WeeklyHours].enabled && (
                <div className="ml-8 space-y-3">
                  {weeklyHours[day as keyof WeeklyHours].slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-3">
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) => handleTimeChange(day, slotIndex, 'start', e.target.value)}
                        className="w-32"
                        data-action={`set-start-time-${day}-${slotIndex}`}
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) => handleTimeChange(day, slotIndex, 'end', e.target.value)}
                        className="w-32"
                        data-action={`set-end-time-${day}-${slotIndex}`}
                      />
                      {weeklyHours[day as keyof WeeklyHours].slots.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(day, slotIndex)}
                          className="text-red-600 hover:text-red-700"
                          data-action={`remove-time-slot-${day}-${slotIndex}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {day !== 'sunday' && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Date Overrides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span>Date Overrides</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Set specific availability for individual dates (holidays, vacation days, etc.)
            </p>
            
            <Button variant="outline" data-action="add-date-override">
              <Plus className="h-4 w-4 mr-2" />
              Add Date Override
            </Button>
            
            {dateOverrides.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No date overrides set</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" data-action="reset-availability">
          Reset to Default
        </Button>
        <Button data-action="save-availability">
          Save Availability
        </Button>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
