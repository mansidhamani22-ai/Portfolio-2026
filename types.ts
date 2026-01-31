
export enum ViewType {
  CHAT = 'chat',
  IMAGE = 'image',
  LIVE = 'live',
  GALLERY = 'gallery'
}

export type Category = 'All' | 'Packaging Design' | 'Branding' | 'Publication Design';

export interface Project {
  id: string;
  title: string;
  category: Category;
  description: string;
  fullDescription: string;
  thumbnail: string;
  images: string[];
  tools: string[];
  year: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  timestamp?: Date;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface TranscriptionItem {
  id: string;
  text: string;
  type: 'input' | 'output';
}