
import React from 'react';
import { Camera, Video, Heart, BookOpen, Clock } from 'lucide-react';
import { AppSection } from './types';

export const PIN_CODE = "1234"; // Default PIN
export const SHARED_USERNAME = "couple";
export const SHARED_PASSWORD = "love";
export const RELATIONSHIP_START_DATE = "2024-07-29"; // Format: YYYY-MM-DD

export const NAV_ITEMS = [
  { id: AppSection.HOME, label: 'Home', icon: <Heart size={20} /> },
  { id: AppSection.PHOTOS, label: 'Photos', icon: <Camera size={20} /> },
  { id: AppSection.VIDEOS, label: 'Videos', icon: <Video size={20} /> },
  { id: AppSection.LETTERS, label: 'Letters', icon: <BookOpen size={20} /> },
  { id: AppSection.COUNTER, label: 'Clock', icon: <Clock size={20} /> },
];

export const LOVE_QUOTES = [
  "In all the world, there is no heart for me like yours.",
  "I love you more than words can say.",
  "You are my sun, my moon, and all my stars.",
  "Forever is a long time, but I wouldn't mind spending it by your side.",
  "Home is wherever I'm with you.",
];
