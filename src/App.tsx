
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import VoiceTrainer from "./components/VoiceTrainer";
import { VolumeControl } from "@/components/VolumeControl";
import { UserTracker } from "@/components/UserTracker";
import { useVoiceGuide } from "@/hooks/useVoiceGuide";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import EventTypes from "./components/EventTypes";
import Bookings from "./pages/Bookings";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PublicBookingPage from "./components/PublicBookingPage";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { announcePageNavigation } = useVoiceGuide();

  const handleVolumeToggle = (enabled: boolean) => {
    if (enabled) {
      announcePageNavigation("Voice guidance activated");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <UserTracker>
              <VoiceTrainer />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/events" element={<EventTypes />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/book" element={<PublicBookingPage />} />
                <Route path="/book/:eventId" element={<PublicBookingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <VolumeControl onVolumeToggle={handleVolumeToggle} />
            </UserTracker>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
