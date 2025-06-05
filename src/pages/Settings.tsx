import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Settings as SettingsIcon, User, Calendar, Bell, Shield, Palette, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailabilitySettings from '../components/AvailabilitySettings';
import IntegrationSettings from '../components/IntegrationSettings';

const ProfileSettings = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Profile settings content...</p>
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
      <CardContent>
        <p>Notification settings content...</p>
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
      <CardContent>
        <p>Security settings content...</p>
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
      <CardContent>
        <p>Appearance settings content...</p>
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
                <CardContent>
                  <p>Advanced configuration options...</p>
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
