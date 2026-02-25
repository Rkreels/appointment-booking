
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Settings as SettingsIcon, User, Calendar, Bell, Shield, Palette, Globe, Zap, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AvailabilitySettings from '../components/AvailabilitySettings';
import IntegrationSettings from '../components/IntegrationSettings';
import AccessControl from '../components/AccessControl';
import ProtectedRoute from '../components/ProtectedRoute';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name.split(' ')[1] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  
  const handleSave = () => {
    if (!firstName.trim() || !email.trim()) {
      toast({ title: "Validation Error", description: "First name and email are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Profile Information
            <Badge variant="outline">{user?.role}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about yourself..." />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationSettings = () => {
  const { toast } = useToast();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [calendarReminders, setCalendarReminders] = useState(true);
  
  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive booking confirmations via email</p>
          </div>
          <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>SMS Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive booking reminders via SMS</p>
          </div>
          <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Calendar Reminders</Label>
            <p className="text-sm text-muted-foreground">Send reminders to attendees</p>
          </div>
          <Switch checked={calendarReminders} onCheckedChange={setCalendarReminders} />
        </div>
        <Button 
          onClick={() => toast({ title: "Preferences Saved", description: "Your notification preferences have been updated." })}
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  </div>
  );
};

const SecuritySettings = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  const handleUpdateSecurity = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (newPassword && newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast({ title: "Security Updated", description: "Your security settings have been updated successfully." });
  };

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>
        <Button onClick={handleUpdateSecurity}>Update Security</Button>
      </CardContent>
    </Card>
  </div>
  );
};

const AppearanceSettings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('light');
  const [brandColor, setBrandColor] = useState('blue');
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({ title: "Theme Changed", description: `Theme set to ${newTheme}.` });
  };

  const handleColorChange = (color: string) => {
    setBrandColor(color);
    toast({ title: "Brand Color Changed", description: `Brand color set to ${color}.` });
  };

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Appearance Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex space-x-2">
            <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => handleThemeChange('light')}>Light</Button>
            <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => handleThemeChange('dark')}>Dark</Button>
            <Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" onClick={() => handleThemeChange('system')}>System</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Brand Color</Label>
          <div className="flex space-x-2">
            <div className={`w-8 h-8 bg-blue-600 rounded cursor-pointer ring-2 ${brandColor === 'blue' ? 'ring-blue-400' : 'ring-transparent'}`} onClick={() => handleColorChange('blue')}></div>
            <div className={`w-8 h-8 bg-green-600 rounded cursor-pointer ring-2 ${brandColor === 'green' ? 'ring-green-400' : 'ring-transparent'}`} onClick={() => handleColorChange('green')}></div>
            <div className={`w-8 h-8 bg-purple-600 rounded cursor-pointer ring-2 ${brandColor === 'purple' ? 'ring-purple-400' : 'ring-transparent'}`} onClick={() => handleColorChange('purple')}></div>
            <div className={`w-8 h-8 bg-red-600 rounded cursor-pointer ring-2 ${brandColor === 'red' ? 'ring-red-400' : 'ring-transparent'}`} onClick={() => handleColorChange('red')}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

const Settings = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 h-auto p-1">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Availability</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            {hasPermission('manage_users') && (
              <TabsTrigger value="access" className="flex items-center space-x-2" data-action="access-control-settings">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Access</span>
              </TabsTrigger>
            )}
            {hasPermission('manage_settings') && (
              <TabsTrigger value="advanced" className="flex items-center space-x-2" data-action="advanced-settings">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilitySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="integrations">
            <ProtectedRoute requiredPermission="manage_settings">
              <IntegrationSettings />
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="access">
            <ProtectedRoute requiredPermission="manage_users">
              <AccessControl />
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="advanced">
            <ProtectedRoute requiredPermission="manage_settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook">Webhook URL</Label>
                      <Input id="webhook" placeholder="https://your-site.com/webhook" data-action="edit-webhook" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Default Timezone</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md" data-action="select-timezone">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                      </select>
                    </div>
                    <Button 
                      data-action="save-advanced-settings"
                      onClick={() => toast({ title: "Settings Saved", description: "Advanced settings have been saved successfully." })}
                    >
                      Save Advanced Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ProtectedRoute>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
