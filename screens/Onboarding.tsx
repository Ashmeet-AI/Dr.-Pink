import React, { useState } from 'react';
import { Button, Heading, Text, EmotionBadge } from '../components/UI';
import { User, EmotionType, ContentType } from '../types';
import { ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [emotion, setEmotion] = useState<EmotionType | undefined>();
  const [preferences, setPreferences] = useState<ContentType[]>([]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({
        id: crypto.randomUUID(),
        name: name || 'Wanderer',
        currentEmotion: emotion,
        creativePreference: preferences
      });
    }
  };

  const togglePreference = (type: ContentType) => {
    setPreferences(prev => 
      prev.includes(type) ? prev.filter(p => p !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-primary-pink' : 'w-2 bg-soft-beige'}`} />
          ))}
        </div>

        <div className="min-h-[400px] flex flex-col justify-center animate-fade-in">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <Heading level={2}>Welcome.</Heading>
              <Text>How would you like to be known in this space?</Text>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full text-center text-2xl border-b-2 border-soft-beige bg-transparent py-2 focus:outline-none focus:border-primary-pink transition-colors font-serif placeholder:text-soft-beige"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <Heading level={2}>How are you arriving today?</Heading>
              <Text>No need to explain. Just noticing is enough.</Text>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {Object.values(EmotionType).map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmotion(e)}
                    className={`
                      px-4 py-2 rounded-full text-sm transition-all duration-300 border
                      ${emotion === e 
                        ? 'bg-primary-pink border-primary-pink text-soft-charcoal' 
                        : 'bg-transparent border-soft-beige text-soft-text hover:border-primary-pink/50'}
                    `}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <Heading level={2}>What calls to you?</Heading>
              <Text>You can explore everything, but we'll prioritize these spaces for you.</Text>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[ContentType.ART, ContentType.WRITING, ContentType.MUSIC, ContentType.CHECKIN].map((type) => (
                  <button
                    key={type}
                    onClick={() => togglePreference(type)}
                    className={`
                      p-4 rounded-xl border text-left transition-all duration-300
                      ${preferences.includes(type)
                        ? 'bg-soft-blush/30 border-primary-pink shadow-sm'
                        : 'bg-white border-soft-beige hover:border-soft-rose'}
                    `}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-soft-charcoal">{type}</span>
                      {preferences.includes(type) && <Check size={16} className="text-primary-pink" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-8 border-t border-soft-beige/50">
           {step > 1 ? (
             <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
           ) : <div />}
           
           <Button onClick={handleNext} disabled={step === 1 && !name} className="flex items-center gap-2">
             {step === 3 ? 'Enter Space' : 'Next'}
             <ArrowRight size={16} />
           </Button>
        </div>
      </div>
    </div>
  );
};