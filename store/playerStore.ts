import { create } from 'zustand';
import axios from 'axios';
import config from '../src/config';

interface Track {
  id: string;
  title: string;
  audioUrl: string;
  coverUrl?: string;
  user: {
    id: string;
    username: string;
  };
  likesCount: number;
  isLiked: boolean;
  repostsCount: number;
  isReposted: boolean;
}

interface PlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  savedTrackId: string | null;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
  initializeTrack: () => Promise<void>;
}

// Load initial state from localStorage
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedTrackId = localStorage.getItem('lastPlayedTrackId');
    return {
      currentTrack: null,
      isPlaying: false,
      savedTrackId: savedTrackId || null
    };
  }
  return {
  currentTrack: null,
    isPlaying: false,
    savedTrackId: null
  };
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...loadInitialState(),
  setCurrentTrack: (track) => {
    if (track) {
      localStorage.setItem('lastPlayedTrackId', track.id);
    } else {
      localStorage.removeItem('lastPlayedTrackId');
    }
    set({ currentTrack: track, isPlaying: false });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  initializeTrack: async () => {
    const { savedTrackId } = get();
    if (savedTrackId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiUrl}/api/tracks/${savedTrackId}`, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });

        if (response.data.success) {
          set({ currentTrack: response.data.data });
        }
      } catch (error) {
        console.error('Error loading saved track:', error);
        localStorage.removeItem('lastPlayedTrackId');
      }
    }
  }
})); 