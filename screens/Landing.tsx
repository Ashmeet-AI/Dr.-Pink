import React from 'react';
import { Button, Heading, Text, Card } from '../components/UI';
import { ViewState } from '../types';

interface LandingProps {
  onJoin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onJoin }) => {
  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-pink/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-emotion-calm/20 rounded-full blur-3xl" />

      <div className="max-w-2xl text-center z-10 space-y-8 animate-fade-in">
        <div className="space-y-4">
          <Heading level={1} className="leading-snug">
            A space to feel, create, and share <br/>
            <span className="italic text-soft-rose">without performance.</span>
          </Heading>
          <Text className="text-lg md:text-xl text-soft-text max-w-lg mx-auto">
            You don't need to explain. Noticing is enough. Join a community built on witnessing, not rating.
          </Text>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" onClick={onJoin}>
            Enter the Community
          </Button>
          <Button variant="ghost" size="lg">
            Read Philosophy
          </Button>
        </div>

        {/* Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 text-left opacity-80">
          <Card className="transform rotate-[-2deg]">
            <div className="h-32 bg-soft-beige/50 rounded-lg mb-4 flex items-center justify-center text-soft-text italic">
              "Today was heavy."
            </div>
            <div className="flex gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-soft-rose text-white text-[10px]">Heavy</span>
              <span className="px-2 py-0.5 rounded-full bg-soft-beige text-soft-charcoal text-[10px]">Journal</span>
            </div>
            <p className="text-sm text-soft-charcoal">Resonating silently...</p>
          </Card>
          <Card className="transform rotate-[2deg] translate-y-4">
            <div className="h-32 bg-primary-pink/20 rounded-lg mb-4 flex items-center justify-center text-soft-text italic">
              [Visual Art Preview]
            </div>
             <div className="flex gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-emotion-hopeful text-soft-charcoal text-[10px]">Hopeful</span>
            </div>
            <p className="text-sm text-soft-charcoal">4 people felt this.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};