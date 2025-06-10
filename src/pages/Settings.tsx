
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Settings as SettingsIcon, User, Calendar, Bell, Shield, Palette, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AvailabilitySettings from '../components/AvailabilitySettings';
import IntegrationSettings from '../components/IntegrationSettings';

const ProfileSettings = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Alex" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Smith" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="alex@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" placeholder="Tell people about yourself..." />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  </div>
);

const NotificationSettings = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-gray-500">Receive booking confirmations via email</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>SMS Notifications</Label>
            <p className="text-sm text-gray-500">Receive booking reminders via SMS</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Calendar Reminders</Label>
            <p className="text-sm text-gray-500">Send reminders to attendees</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  </div>
);

const SecuritySettings = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-gray-500">Add an extra layer of security</p>
          </div>
          <Switch />
        </div>
        <Button>Update Security</Button>
      </CardContent>
    </Card>
  </div>
);

const AppearanceSettings = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Appearance Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Light</Button>
            <Button variant="outline" size="sm">Dark</Button>
            <Button variant="outline" size="sm">System</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Brand Color</Label>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded cursor-pointer"></div>
            <div className="w-8 h-8 bg-green-600 rounded cursor-pointer"></div>
            <div className="w-8 h-8 bg-purple-600 rounded cursor-pointer"></div>
            <div className="w-8 h-8 bg-red-600 rounded cursor-pointer"></div>
          </div>
        </div>
        <Button>Save Appearance</Button>
      </CardContent>
    </Card>
  </div>
);

const Settings = () => {
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center space-x-2" data-action="profile-settings">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center space-x-2" data-action="availability-settings">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Availability</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2" data-action="notification-settings">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2" data-action="integration-settings">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2" data-action="security-settings">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2" data-action="appearance-settings">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2" data-action="advanced-settings">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
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
            <IntegrationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="advanced">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <Input id="webhook" placeholder="https://your-site.com/webhook" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                    </select>
                  </div>
                  <Button>Save Advanced Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
