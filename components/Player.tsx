"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import config from '../src/config';

interface Track {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  coverUrl?: string;
  genre?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
  likesCount: number;
  repostsCount: number;
  isLiked: boolean;
  isReposted: boolean;
}

export default function Player() {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, initializeTrack } = usePlayerStore();
  const { user: currentUser } = useAuthStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [volume, setVolume] = useState(() => {
    // Try to get volume from localStorage, default to 1 if not found
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('playerVolume');
      return savedVolume ? parseFloat(savedVolume) : 1;
    }
    return 1;
  });
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    initializeTrack();
  }, [initializeTrack]);

  useEffect(() => {
    console.log('Current track:', currentTrack);
    if (currentTrack) {
      if (audioRef.current) {
        const audioUrl = `${config.apiUrl}${currentTrack.audioUrl}`;
        console.log('Setting audio URL:', audioUrl);
        audioRef.current.src = audioUrl;
        if (isPlaying) {
          audioRef.current.play();
        }
      }
      // Reset like state when track changes
      setIsLiked(false);
      setLikesCount(0);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    // Save volume to localStorage whenever it changes
    localStorage.setItem('playerVolume', volume.toString());
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleLike = async () => {
    if (!currentTrack || !currentUser) return;

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/tracks/${currentTrack.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success && currentTrack) {
        setCurrentTrack({
          ...currentTrack,
          isLiked: response.data.data.liked,
          likesCount: response.data.data.liked ? currentTrack.likesCount + 1 : currentTrack.likesCount - 1
        });
      }
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-soundcloud-dark border-t border-gray-700 flex flex-col z-50">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-700 relative group cursor-pointer">
          <div 
            className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-200 ease-in-out"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Player Content */}
        <div className="h-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden">
                {currentTrack?.coverUrl && (
                  <img 
                    src={`${config.apiUrl}${currentTrack.coverUrl}`} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <Link
                      href={currentTrack ? `/track/${currentTrack.id}` : '#'}
                      className="text-white hover:text-sc-orange transition truncate"
                    >
                      {currentTrack ? currentTrack.title : 'Select a track to play'}
                    </Link>
                    {currentTrack?.user && (
                      <Link
                        href={`/profile/${currentTrack.user.username}`}
                        className="text-gray-400 hover:text-white transition truncate text-sm"
                      >
                        {currentTrack.user.username}
                      </Link>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${
                    currentTrack?.isLiked ? 'text-sc-orange' : 'text-gray-400 hover:text-white'
                  } transition`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={currentTrack?.isLiked ? 'currentColor' : 'none'}
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
                  <span>{currentTrack?.likesCount || 0}</span>
                </button>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200"
              >
                <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-white">
                <i className={`fas fa-volume-${volume === 0 ? 'mute' : volume < 0.5 ? 'down' : 'up'}`}></i>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 