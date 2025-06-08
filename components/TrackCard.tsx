"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlayerStore } from '@/store/playerStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import config from '../src/config';

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    coverUrl?: string;
    audioUrl: string;
    user: {
      id: string;
      username: string;
    };
    description?: string;
    genre?: string;
    createdAt: string;
    likesCount: number;
    isLiked: boolean;
    repostsCount: number;
    isReposted: boolean;
  };
  onPlay: (track: any) => void;
  onLike: (trackId: string) => Promise<void>;
  onRepost: (trackId: string) => void;
}

export default function TrackCard({ track, onPlay, onLike, onRepost }: TrackCardProps) {
  const { currentTrack, isPlaying } = usePlayerStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const isActive = currentTrack?.id === track.id;
  const [localLikesCount, setLocalLikesCount] = useState(track.likesCount);
  const [localIsLiked, setLocalIsLiked] = useState(track.isLiked);
  const [localRepostsCount, setLocalRepostsCount] = useState(track.repostsCount);
  const [localIsReposted, setLocalIsReposted] = useState(track.isReposted);

  useEffect(() => {
    setLocalLikesCount(track.likesCount);
    setLocalIsLiked(track.isLiked);
    setLocalRepostsCount(track.repostsCount);
    setLocalIsReposted(track.isReposted);
  }, [track.likesCount, track.isLiked, track.repostsCount, track.isReposted]);

  const handleLike = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      setLocalIsLiked(!localIsLiked);
      setLocalLikesCount(prev => localIsLiked ? prev - 1 : prev + 1);
      await onLike(track.id);
    } catch (error) {
      setLocalIsLiked(localIsLiked);
      setLocalLikesCount(prev => localIsLiked ? prev + 1 : prev - 1);
      console.error('Error liking track:', error);
    }
  };

  const handleRepost = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      setLocalIsReposted(!localIsReposted);
      setLocalRepostsCount(prev => localIsReposted ? prev - 1 : prev + 1);
      await onRepost(track.id);
    } catch (error) {
      setLocalIsReposted(localIsReposted);
      setLocalRepostsCount(prev => localIsReposted ? prev + 1 : prev - 1);
      console.error('Error reposting track:', error);
    }
  };

  const handleComment = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/track/${track.id}`);
  };

  return (
    <div
      className={`bg-soundcloud-gray rounded-xl overflow-hidden transition-all ${
        isActive 
          ? 'ring-2 ring-sc-orange shadow-lg shadow-sc-orange/20' 
          : 'hover:bg-gray-800'
      }`}
    >
      <div className="aspect-square relative">
        {track.coverUrl ? (
          <img
            src={`${config.apiUrl}${track.coverUrl}`}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
          <button 
            onClick={() => onPlay(track)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              isActive 
                ? 'bg-sc-orange hover:bg-orange-600' 
                : 'bg-soundcloud-dark hover:bg-gray-800'
            }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isActive && isPlaying 
                  ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" // pause icon
                  : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" // play icon
                }
              />
              {!isActive && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1">{track.title}</h3>
        <Link
          href={`/profile/${track.user.username}`}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          {track.user.username}
        </Link>
        <p className="text-sm text-gray-400 mt-2 mb-2">
          {track.description || 'Нет описания'}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{track.genre || 'Без жанра'}</span>
          <span>
            {new Date(track.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              localIsLiked ? 'text-sc-orange' : 'text-gray-400 hover:text-white'
            } transition`}
          >
            <svg
              className="w-5 h-5"
              fill={localIsLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{localLikesCount}</span>
          </button>
          <button
            onClick={handleRepost}
            className={`flex items-center space-x-1 ${
              localIsReposted ? 'text-sc-orange' : 'text-gray-400 hover:text-white'
            } transition`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span>{localRepostsCount}</span>
          </button>
          <button
            onClick={handleComment}
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Комментарии</span>
          </button>
        </div>
      </div>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-sc-orange animate-pulse"></div>
      )}
    </div>
  );
} 