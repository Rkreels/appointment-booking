
import React, { useState } from 'react';
import { Calendar, Video, Mail, Webhook, Zap, Shield, Link, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  connected: boolean;
  type: 'calendar' | 'video' | 'email' | 'automation' | 'payment';
}

const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync events with your Google Calendar',
      icon: Calendar,
      connected: true,
      type: 'calendar'
    },
    {
      id: 'outlook',
      name: 'Outlook Calendar',
      description: 'Sync events with Microsoft Outlook',
      icon: Calendar,
      connected: false,
      type: 'calendar'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Automatically create Zoom meetings',
      icon: Video,
      connected: true,
      type: 'video'
    },
    {
      id: 'google-meet',
      name: 'Google Meet',
      description: 'Generate Google Meet links automatically',
      icon: Video,
      connected: false,
      type: 'video'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Create Teams meetings for appointments',
      icon: Video,
      connected: false,
      type: 'video'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Send emails through your Gmail account',
      icon: Mail,
      connected: false,
      type: 'email'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 1000+ apps through Zapier',
      icon: Zap,
      connected: false,
      type: 'automation'
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Send booking data to your custom endpoints',
      icon: Webhook,
      connected: false,
      type: 'automation'
    }
  ]);

  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id 
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'calendar': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      case 'automation': return 'bg-orange-100 text-orange-800';
      case 'payment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.type]) {
      acc[integration.type] = [];
    }
    acc[integration.type].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <div className="space-y-6">
      {/* Calendar Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Calendar Integrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {groupedIntegrations.calendar?.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <integration.icon className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getTypeColor(integration.type)}>
                  {integration.type}
                </Badge>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                  data-action={`toggle-${integration.id}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Video Conferencing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Video Conferencing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {groupedIntegrations.video?.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <integration.icon className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getTypeColor(integration.type)}>
                  {integration.type}
                </Badge>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                  data-action={`toggle-${integration.id}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email & Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {groupedIntegrations.email?.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <integration.icon className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getTypeColor(integration.type)}>
                  {integration.type}
                </Badge>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                  data-action={`toggle-${integration.id}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Automation & Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Automation & Webhooks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedIntegrations.automation?.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <integration.icon className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getTypeColor(integration.type)}>
                  {integration.type}
                </Badge>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                  data-action={`toggle-${integration.id}`}
                />
              </div>
            </div>
          ))}

          <Separator />

          {/* Webhook Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Webhook Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-app.com/webhook"
                  data-action="set-webhook-url"
                />
              </div>
              <div className="space-y-2">
                <Label>Secret Key (Optional)</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter webhook secret"
                  data-action="set-webhook-secret"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                data-action="test-webhook"
                onClick={() => toast.success('Webhook test sent successfully!')}
              >
                Test Webhook
              </Button>
              <Button 
                data-action="save-webhook"
                onClick={() => toast.success('Webhook configuration saved!')}
              >
                Save Webhook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>API Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">API Key</h4>
              <Button 
                variant="outline" 
                size="sm" 
                data-action="generate-api-key"
                onClick={() => toast.success('New API key generated successfully!')}
              >
                Generate New Key
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Use this API key to access your scheduling data programmatically.
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="password"
                value="sk_test_1234567890abcdef"
                readOnly
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="sm" 
                data-action="copy-api-key"
                onClick={() => {
                  navigator.clipboard.writeText('sk_test_1234567890abcdef');
                  toast.success('API key copied to clipboard!');
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            data-action="view-api-docs"
            onClick={() => window.open('https://docs.lovable.dev', '_blank')}
          >
            <Link className="h-4 w-4 mr-2" />
            View API Documentation
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          data-action="save-integrations"
          onClick={() => toast.success('Integration settings saved successfully!')}
        >
          Save Integration Settings
        </Button>
      </div>
    </div>
  );
};

export default IntegrationSettings;
