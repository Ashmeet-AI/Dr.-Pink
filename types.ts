export enum ViewState {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  FEED = 'FEED',
  SPACE_ART = 'SPACE_ART',
  SPACE_WRITING = 'SPACE_WRITING',
  SPACE_MUSIC = 'SPACE_MUSIC',
  PROFILE = 'PROFILE',
}

export enum EmotionType {
  HAPPY = 'Happy',
  CURIOUS = 'Curious',
  ANXIOUS = 'Anxious',
  TENDER = 'Tender',
  HEAVY = 'Heavy',
  EXCITED = 'Excited',
  UNSURE = 'Unsure',
  CALM = 'Calm',
}

export enum ContentType {
  ART = 'Art',
  WRITING = 'Writing',
  MUSIC = 'Music',
  CHECKIN = 'Check-in',
}

export interface User {
  id: string;
  name: string;
  creativePreference: ContentType[];
  currentEmotion?: EmotionType;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  type: ContentType;
  content: string; // URL for images/audio, text for writing
  description?: string;
  emotion: EmotionType;
  timestamp: number;
  reactions: Record<string, number>; // e.g., { 'holding-space': 5 }
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorName: string;
  text: string;
  timestamp: number;
}

export interface DailyTheme {
  title: string;
  prompt: string;
  invitation: string;
}