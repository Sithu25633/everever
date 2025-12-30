
export interface MemoryFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  download_url: string;
  type: 'file' | 'dir';
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface AuthState {
  isSecurityUnlocked: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

export enum AppSection {
  HOME = 'home',
  PHOTOS = 'photos',
  VIDEOS = 'videos',
  LETTERS = 'letters',
  COUNTER = 'counter'
}
