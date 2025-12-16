import React, { useState } from 'react';
import { Card, Heading, EmotionBadge, Text, Button, TextArea } from '../components/UI';
import { Post, ContentType, EmotionType } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';

interface FeedProps {
  posts: Post[];
  initialFilter?: ContentType;
  onReact: (postId: string, reactionType: string) => void;
  onComment: (postId: string, text: string) => void;
  headerTitle?: string;
  headerSubtitle?: string;
}

export const Feed: React.FC<FeedProps> = ({ 
  posts, 
  initialFilter, 
  onReact, 
  onComment,
  headerTitle = "Community Flow",
  headerSubtitle
}) => {
  const [filter, setFilter] = useState<ContentType | 'ALL'>(initialFilter || 'ALL');
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const filteredPosts = filter === 'ALL' 
    ? posts 
    : posts.filter(p => p.type === filter);

  const handleSendComment = (postId: string) => {
    if (commentText.trim()) {
      onComment(postId, commentText);
      setCommentText('');
      setCommentingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-soft-beige pb-4">
        <div>
           <Heading level={2}>{headerTitle}</Heading>
           {headerSubtitle && <Text className="mt-1 opacity-70">{headerSubtitle}</Text>}
        </div>
        
        {/* Only show filter toggles if not in a specific filtered view */}
        {!initialFilter && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['ALL', ...Object.values(ContentType)].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${filter === type ? 'bg-soft-charcoal text-white' : 'bg-white text-soft-text hover:bg-soft-beige'}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredPosts.length === 0 && (
         <div className="text-center py-20 opacity-50">
            <Text>No reflections found here yet.</Text>
         </div>
      )}

      <div className="space-y-6">
        {filteredPosts.map(post => (
          <Card key={post.id} className="p-0 overflow-hidden group">
            <div className="p-6 pb-4">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-soft-beige flex items-center justify-center font-serif text-soft-charcoal font-bold">
                     {post.authorName[0]}
                   </div>
                   <div>
                     <div className="font-medium text-soft-charcoal">{post.authorName}</div>
                     <div className="text-xs text-soft-text flex items-center gap-2">
                       <span>{new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       <span>•</span>
                       <span className="uppercase tracking-wider text-[10px]">{post.type}</span>
                     </div>
                   </div>
                 </div>
                 <button className="text-soft-text hover:text-soft-charcoal opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={20} /></button>
               </div>

               {/* Content Rendering */}
               {post.type === ContentType.ART && (
                 <div className="rounded-xl overflow-hidden mb-4 bg-soft-beige/30 border border-soft-beige">
                   <img src={post.content} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
                 </div>
               )}

               {post.type === ContentType.WRITING && (
                 <div className="pl-6 border-l-2 border-primary-pink/50 mb-6 py-2">
                   <p className="font-serif text-lg whitespace-pre-line text-soft-charcoal/90 leading-relaxed">{post.content}</p>
                 </div>
               )}
               
               {post.type === ContentType.MUSIC && (
                 <div className="mb-4 bg-soft-charcoal/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-pink rounded-full flex items-center justify-center text-white animate-pulse-slow">
                      <span className="font-serif italic">♫</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-1 bg-soft-charcoal/10 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-primary-pink w-1/3"></div>
                      </div>
                      <span className="text-xs text-soft-text mt-1 block">Audio Clip (Simulated)</span>
                    </div>
                 </div>
               )}

               {post.description && <p className="text-soft-charcoal mb-4 text-sm opacity-90">{post.description}</p>}
               
               <div className="flex gap-2 mb-2">
                 <EmotionBadge emotion={post.emotion} />
               </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-soft-beige/30 p-4 border-t border-soft-beige">
              <div className="flex items-center justify-between">
                <div className="flex gap-6">
                  <button 
                    onClick={() => onReact(post.id, 'witness')}
                    className="flex items-center gap-2 text-soft-text hover:text-primary-pink transition-colors group"
                  >
                    <Heart size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Witness ({Object.values(post.reactions).reduce((a: number, b: number) => a + b, 0)})</span>
                  </button>
                  <button 
                    onClick={() => setCommentingId(commentingId === post.id ? null : post.id)}
                    className={`flex items-center gap-2 transition-colors ${commentingId === post.id ? 'text-primary-pink' : 'text-soft-text hover:text-primary-pink'}`}
                  >
                    <MessageCircle size={18} />
                    <span className="text-xs font-medium">Reflect ({post.comments.length})</span>
                  </button>
                </div>
                <button className="text-soft-text hover:text-primary-pink">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Comments Section */}
              {commentingId === post.id && (
                <div className="mt-4 animate-fade-in space-y-4 pt-4 border-t border-soft-charcoal/5">
                   {post.comments.length > 0 && (
                     <div className="space-y-3 pl-4 border-l border-soft-beige">
                       {post.comments.map(comment => (
                         <div key={comment.id} className="text-sm">
                           <span className="font-medium text-soft-charcoal">{comment.authorName}</span>
                           <p className="text-soft-text">{comment.text}</p>
                         </div>
                       ))}
                     </div>
                   )}
                   
                   <div className="flex gap-2 items-end">
                      <TextArea 
                        placeholder="Write a gentle reflection..." 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-[60px] text-sm bg-white"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleSendComment(post.id)} disabled={!commentText.trim()}>
                        <Send size={16} />
                      </Button>
                   </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};