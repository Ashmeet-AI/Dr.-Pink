import React, { useEffect, useState } from 'react';
import { Card, Heading, Text, Button, EmotionBadge } from '../components/UI';
import { User, DailyTheme, EmotionType } from '../types';
import { getDailyTheme } from '../services/geminiService';
import { Sparkles, Sun, Moon } from 'lucide-react';

interface DashboardProps {
  user: User;
  onCheckIn: () => void;
  onNavigateToFeed: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onCheckIn, onNavigateToFeed }) => {
  const [theme, setTheme] = useState<DailyTheme | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      const data = await getDailyTheme();
      setTheme(data);
    };
    fetchTheme();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <Heading level={2} className="text-soft-text mb-1 font-sans font-light">{greeting()}, {user.name}.</Heading>
          <Text className="italic opacity-70">"You are allowed to be slow today."</Text>
        </div>
        <div className="hidden md:block">
           <Sun className="text-primary-pink/50 animate-pulse-slow" size={32} />
        </div>
      </header>

      {/* Hero: Daily Theme */}
      <Card className="bg-gradient-to-br from-white to-soft-blush/20 border-none shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={100} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-semibold tracking-widest uppercase text-soft-text">
            Weekly Theme
          </div>
          
          <div className="space-y-2">
             <h3 className="font-serif text-3xl md:text-4xl text-soft-charcoal">
               {theme ? theme.title : "Loading stillness..."}
             </h3>
             <p className="text-lg md:text-xl font-light text-soft-charcoal/80 max-w-xl leading-relaxed">
               {theme ? theme.prompt : "..."}
             </p>
          </div>

          <div className="pt-4 border-t border-soft-charcoal/5">
             <Text className="text-sm font-medium mb-3">Invitation</Text>
             <p className="italic text-soft-charcoal">{theme?.invitation}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotional Check-in */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Heading level={3}>Current State</Heading>
            {user.currentEmotion && (
              <EmotionBadge emotion={user.currentEmotion} selected />
            )}
          </div>
          <Text className="mb-6">Has your internal weather changed since you arrived?</Text>
          <Button variant="outline" size="sm" onClick={onCheckIn} className="w-full">
            Update Check-in
          </Button>
        </Card>

        {/* Community Pulse */}
        <Card className="bg-emotion-calm/10 border-emotion-calm/20">
          <Heading level={3} className="mb-4">Community Pulse</Heading>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emotion-tender"></div>
                <Text variant="meta">Sarah shared a poem about 'Drifting'</Text>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emotion-grounded"></div>
                <Text variant="meta">New reflection in "Art as Healing"</Text>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-pink"></div>
                <Text variant="meta">Weekly circle starts in 2 hours</Text>
             </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 px-0 hover:bg-transparent hover:underline" onClick={onNavigateToFeed}>
            Go to Feed &rarr;
          </Button>
        </Card>
      </div>
    </div>
  );
};