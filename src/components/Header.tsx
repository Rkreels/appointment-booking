
import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const searchResults = [
    { id: 1, title: '30-min Consultation', type: 'Event Type', action: () => navigate('/events') },
    { id: 2, title: 'Sarah Johnson Meeting', type: 'Booking', action: () => navigate('/bookings') },
    { id: 3, title: 'Calendar Settings', type: 'Settings', action: () => navigate('/settings') },
  ];

  const notifications = [
    { id: 1, title: 'New booking from Sarah Johnson', time: '2 minutes ago', read: false },
    { id: 2, title: 'Meeting reminder: Team Sync in 1 hour', time: '1 hour ago', read: false },
    { id: 3, title: 'Weekly analytics report ready', time: '2 hours ago', read: true },
  ];

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.length > 2) {
      // Filter search results based on search value
      const filtered = searchResults.filter(result => 
        result.title.toLowerCase().includes(value.toLowerCase())
      );
      // Additional search functionality can be implemented here
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    toast({
      title: "Notifications",
      description: `You have ${notifications.filter(n => !n.read).length} unread notifications`,
    });
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger data-action="toggle-sidebar" />
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search events, bookings... (Ctrl+K)"
                  className="pl-10 w-64"
                  data-action="global-search"
                  onClick={() => setOpen(true)}
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = 'https://skillsim.vercel.app/dashboard'}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Master Dashboard
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-action="notifications" onClick={handleNotificationClick}>
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {notifications.filter(n => !n.read).length}
                      </Badge>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-gray-500">{notification.time}</div>
                    {!notification.read && <Badge variant="secondary" className="mt-1">New</Badge>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-action="user-menu">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-action="profile" onClick={() => navigate('/settings')}>Profile</DropdownMenuItem>
                <DropdownMenuItem data-action="billing" onClick={() => toast({ title: "Coming Soon", description: "Billing management is being developed." })}>Billing</DropdownMenuItem>
                <DropdownMenuItem data-action="team" onClick={() => navigate('/settings?tab=access')}>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-action="logout" onClick={() => toast({ title: "Logged Out", description: "You have been successfully logged out." })}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search events, bookings, settings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {searchResults.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => {
                  result.action();
                  setOpen(false);
                }}
                data-action={`search-${result.type.toLowerCase()}`}
              >
                <span>{result.title}</span>
                <Badge variant="outline" className="ml-auto">
                  {result.type}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
