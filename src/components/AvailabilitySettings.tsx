import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot { start: string; end: string; }
interface DayAvailability { enabled: boolean; slots: TimeSlot[]; }
interface WeeklyHours {
  monday: DayAvailability; tuesday: DayAvailability; wednesday: DayAvailability;
  thursday: DayAvailability; friday: DayAvailability; saturday: DayAvailability; sunday: DayAvailability;
}

interface DateOverride { id: string; date: string; available: boolean; slots: TimeSlot[]; }

const defaultWeeklyHours: WeeklyHours = {
  monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] }
};

const AvailabilitySettings: React.FC = () => {
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours>({ ...defaultWeeklyHours });
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([]);
  const { toast } = useToast();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: Record<string, string> = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
    friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
  };
  const timezones = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'];

  const handleDayToggle = (day: string) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof WeeklyHours], enabled: !prev[day as keyof WeeklyHours].enabled }
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
      [day]: { ...prev[day as keyof WeeklyHours], slots: [...prev[day as keyof WeeklyHours].slots, { start: '09:00', end: '17:00' }] }
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof WeeklyHours], slots: prev[day as keyof WeeklyHours].slots.filter((_, index) => index !== slotIndex) }
    }));
  };

  const copyToAllDays = (sourceDay: string) => {
    const sourceConfig = weeklyHours[sourceDay as keyof WeeklyHours];
    const newWeeklyHours = { ...weeklyHours };
    days.forEach(day => {
      if (day !== sourceDay) {
        newWeeklyHours[day as keyof WeeklyHours] = { enabled: sourceConfig.enabled, slots: [...sourceConfig.slots] };
      }
    });
    setWeeklyHours(newWeeklyHours);
    toast({ title: "Hours Copied", description: `${dayLabels[sourceDay]}'s hours applied to all days.` });
  };

  const addDateOverride = () => {
    const newOverride: DateOverride = {
      id: Date.now().toString(),
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      available: false,
      slots: []
    };
    setDateOverrides(prev => [...prev, newOverride]);
    toast({ title: "Date Override Added", description: "Configure the date override below." });
  };

  const removeDateOverride = (id: string) => {
    setDateOverrides(prev => prev.filter(o => o.id !== id));
    toast({ title: "Date Override Removed", description: "The date override has been removed." });
  };

  const updateDateOverride = (id: string, field: string, value: any) => {
    setDateOverrides(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleSave = () => {
    toast({ title: "Availability Saved", description: "Your availability settings have been saved successfully." });
  };

  const handleReset = () => {
    setWeeklyHours({ ...defaultWeeklyHours });
    setDateOverrides([]);
    setTimezone('America/New_York');
    toast({ title: "Reset Complete", description: "Availability settings have been reset to defaults." });
  };

  return (
    <div className="space-y-6">
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
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (<SelectItem key={tz} value={tz}>{tz}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Buffer Time Between Meetings</Label>
              <Select defaultValue="15">
                <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Switch checked={weeklyHours[day as keyof WeeklyHours].enabled} onCheckedChange={() => handleDayToggle(day)} />
                  <Label className="text-base font-medium">{dayLabels[day]}</Label>
                </div>
                {weeklyHours[day as keyof WeeklyHours].enabled && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => addTimeSlot(day)}>
                      <Plus className="h-4 w-4 mr-1" />Add Hours
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToAllDays(day)}>Copy to All</Button>
                  </div>
                )}
              </div>
              {weeklyHours[day as keyof WeeklyHours].enabled && (
                <div className="ml-8 space-y-3">
                  {weeklyHours[day as keyof WeeklyHours].slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-3">
                      <Input type="time" value={slot.start} onChange={(e) => handleTimeChange(day, slotIndex, 'start', e.target.value)} className="w-32" />
                      <span className="text-gray-500">to</span>
                      <Input type="time" value={slot.end} onChange={(e) => handleTimeChange(day, slotIndex, 'end', e.target.value)} className="w-32" />
                      {weeklyHours[day as keyof WeeklyHours].slots.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeTimeSlot(day, slotIndex)} className="text-red-600 hover:text-red-700">
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
            <Button variant="outline" onClick={addDateOverride}>
              <Plus className="h-4 w-4 mr-2" />Add Date Override
            </Button>
            {dateOverrides.map((override) => (
              <div key={override.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Input type="date" value={override.date} onChange={(e) => updateDateOverride(override.id, 'date', e.target.value)} className="w-44" />
                <div className="flex items-center space-x-2">
                  <Switch checked={override.available} onCheckedChange={(checked) => updateDateOverride(override.id, 'available', checked)} />
                  <Label className="text-sm">{override.available ? 'Available' : 'Unavailable'}</Label>
                </div>
                <Button variant="outline" size="sm" onClick={() => removeDateOverride(override.id)} className="text-red-600 hover:text-red-700 ml-auto">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
        <Button onClick={handleSave}>Save Availability</Button>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
