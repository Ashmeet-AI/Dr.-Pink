import React, { useState, useEffect } from 'react';
import { Landing } from './screens/Landing';
import { Onboarding } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { Feed } from './screens/Feed';
import { Profile } from './screens/Profile';
import { Layout } from './components/Layout';
import { ViewState, User, ContentType, EmotionType, Post } from './types';
import { Card, Heading, Button, EmotionBadge, TextArea, Input, Text } from './components/UI';
import { getCreativePrompt } from './services/geminiService';
import { X, Mic, PenTool, Image as ImageIcon, Check } from 'lucide-react';

// --- Global Mock Data ---
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'a1',
    authorName: 'Elara',
    type: ContentType.ART,
    content: 'https://picsum.photos/600/400?grayscale',
    description: 'Feeling the grey today, but finding texture in it.',
    emotion: EmotionType.HEAVY,
    timestamp: Date.now() - 3600000,
    reactions: { 'witness': 4 },
    comments: []
  },
  {
    id: '2',
    authorId: 'a2',
    authorName: 'Jonas',
    type: ContentType.WRITING,
    content: "The water doesn't ask to flow,\nit simply surrenders to gravity.\nI am trying to learn the weight of my own allowing.",
    description: 'Morning scribble.',
    emotion: EmotionType.CALM,
    timestamp: Date.now() - 7200000,
    reactions: { 'witness': 8 },
    comments: []
  },
  {
    id: '3',
    authorId: 'a3',
    authorName: 'Mira',
    type: ContentType.MUSIC,
    content: "audio-placeholder",
    description: 'A melody for the unsure moments.',
    emotion: EmotionType.UNSURE,
    timestamp: Date.now() - 12000000,
    reactions: { 'witness': 2 },
    comments: []
  }
];

// --- Sub-components (Modals) ---

const CheckInModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (emotion: EmotionType) => void;
}> = ({ isOpen, onClose, onCheckIn }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-soft-charcoal/20 backdrop-blur-sm" onClick={onClose}></div>
       <Card className="w-full max-w-md relative z-10 animate-fade-in bg-white">
          <Heading level={2} className="text-center mb-6">How is the weather inside?</Heading>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.values(EmotionType).map((e) => (
               <button
                 key={e}
                 onClick={() => { onCheckIn(e); onClose(); }}
                 className="px-4 py-2 rounded-full border border-soft-beige hover:border-primary-pink hover:bg-soft-blush/20 transition-all text-soft-charcoal"
               >
                 {e}
               </button>
            ))}
          </div>
          <div className="text-center">
             <Button variant="ghost" onClick={onClose}>Skip for now</Button>
          </div>
       </Card>
    </div>
  );
};

const CreateModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  currentEmotion?: EmotionType;
  onCreate: (post: Omit<Post, 'id' | 'timestamp' | 'reactions' | 'comments' | 'authorId' | 'authorName'>) => void;
}> = ({ isOpen, onClose, currentEmotion, onCreate }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'SELECT' | 'CREATE'>('SELECT');
  const [selectedType, setSelectedType] = useState<ContentType>(ContentType.WRITING);
  
  // Form State
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [emotion, setEmotion] = useState<EmotionType | undefined>(currentEmotion);

  React.useEffect(() => {
    if (isOpen && step === 'SELECT') {
      // Reset form
      setContent('');
      setDescription('');
      setStep('SELECT');
      setLoading(true);
      getCreativePrompt(currentEmotion || "Unknown").then(p => {
        setPrompt(p);
        setLoading(false);
      });
    }
  }, [isOpen, currentEmotion]);

  const handleSelectType = (type: ContentType) => {
    setSelectedType(type);
    setStep('CREATE');
  };

  const handleSubmit = () => {
    if (!emotion) return;
    
    // For demo purposes, we simulate image/audio uploads with placeholders if empty
    let finalContent = content;
    if (selectedType === ContentType.ART && !content) {
        finalContent = `https://picsum.photos/600/400?random=${Math.random()}`; 
    } else if (selectedType === ContentType.MUSIC && !content) {
        finalContent = "audio-placeholder"; 
    }

    onCreate({
      type: selectedType,
      content: finalContent,
      description,
      emotion
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-soft-charcoal/20 backdrop-blur-sm" onClick={onClose}></div>
      <Card className="w-full max-w-lg relative z-10 animate-fade-in bg-white max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-soft-text hover:text-soft-charcoal">
          <X />
        </button>
        
        <Heading level={2} className="mb-2">Express</Heading>
        <p className="text-soft-text mb-6 text-sm">This space is safe. Nothing needs to be perfect.</p>

        {step === 'SELECT' ? (
          <>
            <div className="bg-soft-beige/30 p-4 rounded-xl mb-6 border border-soft-beige">
              <p className="text-xs font-semibold uppercase text-soft-text tracking-wider mb-2">Prompt for you</p>
              {loading ? (
                 <div className="animate-pulse h-4 bg-soft-beige rounded w-3/4"></div>
              ) : (
                <p className="font-serif text-lg italic text-soft-charcoal">{prompt}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <button onClick={() => handleSelectType(ContentType.ART)} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-soft-beige hover:border-primary-pink hover:bg-soft-blush/20 transition-all group">
                <ImageIcon className="text-soft-text group-hover:text-primary-pink" />
                <span className="text-sm font-medium">Image</span>
              </button>
              <button onClick={() => handleSelectType(ContentType.WRITING)} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-soft-beige hover:border-primary-pink hover:bg-soft-blush/20 transition-all group">
                <PenTool className="text-soft-text group-hover:text-primary-pink" />
                <span className="text-sm font-medium">Writing</span>
              </button>
              <button onClick={() => handleSelectType(ContentType.MUSIC)} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-soft-beige hover:border-primary-pink hover:bg-soft-blush/20 transition-all group">
                 <Mic className="text-soft-text group-hover:text-primary-pink" />
                 <span className="text-sm font-medium">Sound</span>
              </button>
            </div>
          </>
        ) : (
           <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                 {selectedType === ContentType.WRITING && (
                    <TextArea 
                      placeholder="Let it flow..." 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] font-serif text-lg"
                      autoFocus
                    />
                 )}
                 {selectedType === ContentType.ART && (
                    <div className="space-y-2">
                        <div className="w-full h-48 bg-soft-beige/30 rounded-xl border-2 border-dashed border-soft-beige flex flex-col items-center justify-center text-soft-text">
                            {content ? (
                                <img src={content} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                            ) : (
                                <>
                                    <ImageIcon size={32} className="mb-2 opacity-50" />
                                    <span className="text-sm">Image Upload (Simulated)</span>
                                    <span className="text-xs opacity-60">We'll use a random placeholder</span>
                                </>
                            )}
                        </div>
                        <Input 
                            placeholder="Or paste an image URL..." 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                 )}
                 {selectedType === ContentType.MUSIC && (
                     <div className="space-y-2">
                         <div className="w-full h-32 bg-soft-beige/30 rounded-xl flex items-center justify-center border border-soft-beige">
                             <Button variant="secondary" onClick={() => setContent('recorded-audio')}>
                                <Mic className="mr-2" size={16} />
                                {content ? "Recording Saved" : "Simulate Recording"}
                             </Button>
                         </div>
                     </div>
                 )}
                 
                 <Input 
                   placeholder="Add a gentle caption (optional)..."
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                 />

                 <div>
                    <p className="text-sm text-soft-text mb-2">Attached Emotion</p>
                    <div className="flex flex-wrap gap-2">
                       {Object.values(EmotionType).map(e => (
                          <EmotionBadge 
                            key={e} 
                            emotion={e} 
                            selected={emotion === e} 
                            onClick={() => setEmotion(e)} 
                          />
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex justify-between pt-4">
                 <Button variant="ghost" onClick={() => setStep('SELECT')}>Back</Button>
                 <Button onClick={handleSubmit} disabled={selectedType === ContentType.WRITING && !content}>
                    Share to Space
                 </Button>
              </div>
           </div>
        )}
      </Card>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<User | undefined>();
  
  // Global App State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  
  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // --- Handlers ---

  const handleJoin = () => setView(ViewState.ONBOARDING);
  
  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    setView(ViewState.DASHBOARD);
  };

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'timestamp' | 'reactions' | 'comments' | 'authorId' | 'authorName'>) => {
    if (!user) return;
    
    const newPost: Post = {
        id: crypto.randomUUID(),
        authorId: user.id,
        authorName: user.name,
        timestamp: Date.now(),
        reactions: {},
        comments: [],
        ...newPostData
    };

    setPosts(prev => [newPost, ...prev]);
    setView(ViewState.FEED); // Redirect to feed to see post
  };

  const handleReact = (postId: string, reaction: string) => {
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              const currentCount = p.reactions[reaction] || 0;
              return { ...p, reactions: { ...p.reactions, [reaction]: currentCount + 1 } };
          }
          return p;
      }));
  };

  const handleComment = (postId: string, text: string) => {
      if (!user) return;
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              return { 
                  ...p, 
                  comments: [...p.comments, { 
                      id: crypto.randomUUID(), 
                      authorName: user.name, 
                      text, 
                      timestamp: Date.now() 
                  }] 
              };
          }
          return p;
      }));
  };

  const handleCheckIn = (emotion: EmotionType) => {
      if (!user) return;
      setUser({ ...user, currentEmotion: emotion });
      
      // Optionally create a check-in post
      const checkInPost: Post = {
          id: crypto.randomUUID(),
          authorId: user.id,
          authorName: user.name,
          type: ContentType.CHECKIN,
          content: '',
          description: `Checked in feeling ${emotion}.`,
          emotion: emotion,
          timestamp: Date.now(),
          reactions: {},
          comments: []
      };
      setPosts(prev => [checkInPost, ...prev]);
  };

  // --- Render Logic ---

  const renderContent = () => {
    if (!user) return null;

    switch (view) {
      case ViewState.LANDING:
        return <Landing onJoin={handleJoin} />;
      case ViewState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            user={user} 
            onCheckIn={() => setIsCheckInModalOpen(true)} 
            onNavigateToFeed={() => setView(ViewState.FEED)}
          />
        );
      case ViewState.FEED:
        return (
            <Feed 
                posts={posts} 
                onReact={handleReact} 
                onComment={handleComment} 
            />
        );
      case ViewState.SPACE_ART:
         return (
             <Feed 
                posts={posts} 
                initialFilter={ContentType.ART} 
                onReact={handleReact} 
                onComment={handleComment}
                headerTitle="Art Space"
                headerSubtitle="Visual expressions of the inner world."
             />
         );
      case ViewState.SPACE_MUSIC:
         return (
             <Feed 
                posts={posts} 
                initialFilter={ContentType.MUSIC} 
                onReact={handleReact} 
                onComment={handleComment}
                headerTitle="Sound Space"
                headerSubtitle="Listen to the frequency of the community."
             />
         );
      case ViewState.SPACE_WRITING:
         return (
             <Feed 
                posts={posts} 
                initialFilter={ContentType.WRITING} 
                onReact={handleReact} 
                onComment={handleComment}
                headerTitle="Writing Space"
                headerSubtitle="Words that need to be witnessed."
             />
         );
      case ViewState.PROFILE:
        return (
          <Profile 
            user={user} 
            userPosts={posts.filter(p => p.authorId === user.id)}
            onLogout={() => { setUser(undefined); setView(ViewState.LANDING); }}
          />
        );
      default:
        return <div className="p-10">Page under construction...</div>;
    }
  };

  // Views that don't need the main layout
  if (view === ViewState.LANDING || view === ViewState.ONBOARDING) {
    return (
      <div className="font-sans text-soft-charcoal">
        {view === ViewState.LANDING ? <Landing onJoin={handleJoin} /> : <Onboarding onComplete={handleOnboardingComplete} />}
      </div>
    );
  }

  return (
    <div className="font-sans text-soft-charcoal">
      <Layout 
        currentView={view} 
        setView={setView} 
        user={user} 
        onOpenCreate={() => setIsCreateModalOpen(true)}
      >
        {renderContent()}
      </Layout>
      
      <CreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        currentEmotion={user?.currentEmotion}
        onCreate={handleCreatePost}
      />

      <CheckInModal 
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onCheckIn={handleCheckIn}
      />
    </div>
  );
}