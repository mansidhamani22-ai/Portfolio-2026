
import { CSSProperties } from 'react';

export enum ViewType {
  CHAT = 'chat',
  IMAGE = 'image',
  LIVE = 'live',
  GALLERY = 'gallery'
}

export type Category = 'All' | 'Packaging Design' | 'Branding' | 'Publication & Editorial Design';

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
  thumbnailStyle?: CSSProperties;
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
