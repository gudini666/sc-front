"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { usePlayerStore } from '@/store/playerStore';
import config from '../src/config';

interface Track {
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
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const { setCurrentTrack, setIsPlaying } = usePlayerStore();

  const fetchLatestTracks = async () => {
    try {
      console.log('Fetching latest tracks...');
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);

      const response = await axios.get(`${config.apiUrl}/api/tracks/latest`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {}
      });

      console.log('Response:', response.data);
      console.log('Tracks with likes:', response.data.data.map((track: Track) => ({
        id: track.id,
        title: track.title,
        isLiked: track.isLiked,
        likesCount: track.likesCount
      })));
      
      if (response.data.success) {
        setTracks(response.data.data);
      } else {
        console.error('Server returned error:', response.data.message);
        setError(response.data.message || 'Ошибка при загрузке треков');
      }
    } catch (err: any) {
      console.error('Error fetching tracks:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка при загрузке треков');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestTracks();
  }, [user]);

  const handleLike = async (trackId: string) => {
    if (!user) {
      console.log('User not logged in, cannot like track');
      return;
    }

    try {
      console.log('Liking track:', trackId);
      const response = await axios.post(
        `${config.apiUrl}/api/tracks/${trackId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Like response:', response.data);

      if (response.data.success) {
        setTracks(prevTracks => 
          prevTracks.map(track => {
          if (track.id === trackId) {
              const updatedTrack = {
              ...track,
              isLiked: response.data.data.liked,
              likesCount: response.data.data.liked ? track.likesCount + 1 : track.likesCount - 1
            };
              console.log('Updated track:', updatedTrack);
              return updatedTrack;
          }
          return track;
          })
        );
      }
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const handleRepost = async (trackId: string) => {
    if (!user) {
      // Можно добавить редирект на страницу входа или показать уведомление
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/tracks/${trackId}/repost`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        // Обновляем состояние треков
        setTracks(tracks.map(track => {
          if (track.id === trackId) {
            return {
              ...track,
              isReposted: response.data.data.reposted,
              repostsCount: response.data.data.reposted ? track.repostsCount + 1 : track.repostsCount - 1
            };
          }
          return track;
        }));
      }
    } catch (error) {
      console.error('Error reposting track:', error);
    }
  };

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soundcloud-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sc-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-soundcloud-dark text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soundcloud-dark text-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold mb-4">Добро пожаловать в SoundCloud</h1>
          <p className="text-xl mb-8">Откройте для себя новую музыку и поделитесь своим творчеством</p>
          <Link
            href="/upload"
            className="bg-sc-orange text-white px-8 py-3 rounded-full text-lg hover:bg-orange-600 transition"
          >
            Загрузить трек
          </Link>
        </div>
      </div>

      {/* Latest Tracks Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Новые релизы</h2>
        {tracks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Пока нет загруженных треков</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-soundcloud-gray rounded-xl overflow-hidden hover:bg-gray-800 transition"
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
                      onClick={() => handlePlay(track)}
                      className="w-12 h-12 bg-sc-orange rounded-full flex items-center justify-center hover:bg-orange-600 transition"
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
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
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
                      onClick={() => handleLike(track.id)}
                      className={`flex items-center space-x-1 ${
                        track.isLiked ? 'text-sc-orange' : 'text-gray-400 hover:text-white'
                      } transition`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={track.isLiked ? 'currentColor' : 'none'}
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
                      <span>{track.likesCount}</span>
                    </button>
                    <button
                      onClick={() => handleRepost(track.id)}
                      className={`flex items-center space-x-1 ${
                        track.isReposted ? 'text-sc-orange' : 'text-gray-400 hover:text-white'
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
                      <span>{track.repostsCount}</span>
                    </button>
                    <Link
                          href={`/track/${track.id}`}
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
                        </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
