import React from 'react';
import { Card, Heading, Text, EmotionBadge, Button } from '../components/UI';
import { User, Post, ContentType } from '../types';
import { Settings, LogOut, Heart, Clock } from 'lucide-react';

interface ProfileProps {
  user: User;
  userPosts: Post[];
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, userPosts, onLogout }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-soft-blush flex items-center justify-center text-4xl font-serif text-soft-charcoal shadow-inner">
            {user.name.charAt(0)}
          </div>
          <div>
            <Heading level={2} className="mb-2">{user.name}</Heading>
            <div className="flex flex-wrap gap-2">
              {user.creativePreference.map(pref => (
                <span key={pref} className="px-3 py-1 bg-soft-beige/50 rounded-full text-xs uppercase tracking-wide text-soft-text">
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" onClick={onLogout}>
             <LogOut size={18} className="mr-2" />
             Leave Space
           </Button>
        </div>
      </div>

      {/* Stats / Emotion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
           <Heading level={3} className="mb-4">Current Resonance</Heading>
           {user.currentEmotion ? (
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                   <EmotionBadge emotion={user.currentEmotion} selected />
                   <span className="text-soft-text text-sm">Last checked in recently</span>
                </div>
                <Text className="mt-4 italic opacity-80">
                  "Allowing the {user.currentEmotion.toLowerCase()} to just be here."
                </Text>
             </div>
           ) : (
             <Text>No emotion checked in yet today.</Text>
           )}
        </Card>

        <Card className="bg-soft-beige/20">
           <Heading level={3} className="mb-4">Creative Journey</Heading>
           <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-soft-charcoal/10 pb-2">
               <span className="text-soft-text">Reflections Shared</span>
               <span className="font-serif text-xl">{userPosts.length}</span>
             </div>
             <div className="flex justify-between items-center border-b border-soft-charcoal/10 pb-2">
               <span className="text-soft-text">Witnessed by others</span>
               <span className="font-serif text-xl">
                 {userPosts.reduce((acc: number, post: Post) => acc + Object.values(post.reactions).reduce((a: number, b: number) => a + b, 0), 0)}
               </span>
             </div>
           </div>
        </Card>
      </div>

      {/* User Posts History */}
      <div className="space-y-6 pt-6">
        <Heading level={2}>Your Reflections</Heading>
        {userPosts.length === 0 ? (
          <div className="text-center py-10 bg-white/40 rounded-2xl border border-soft-beige border-dashed">
            <Text>You haven't shared anything yet.</Text>
            <Text variant="meta" className="mt-2">Your space is waiting.</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPosts.map(post => (
              <Card key={post.id} className="hover:shadow-lg transition-all duration-500">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-soft-text uppercase tracking-wider">{post.type}</span>
                  <span className="text-xs text-soft-text flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-3">
                   <EmotionBadge emotion={post.emotion} />
                </div>
                <p className="text-soft-charcoal line-clamp-3 mb-4 font-serif">
                   {post.type === ContentType.WRITING ? post.content : post.description}
                </p>
                <div className="flex gap-2 text-xs text-soft-text">
                   <span className="flex items-center gap-1"><Heart size={12} /> {Object.values(post.reactions).reduce((a: number, b: number) => a + b, 0)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};