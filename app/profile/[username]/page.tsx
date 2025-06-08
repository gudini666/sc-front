"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { usePlayerStore } from '@/store/playerStore';
import config from '../../../src/config';

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

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  createdAt: string;
  tracks: Track[];
  likedTracks: Track[];
  repostedTracks: Track[];
  isFollowing?: boolean;
  followers: {
    id: string;
    username: string;
  }[];
  following: {
    id: string;
    username: string;
  }[];
  _count: {
    tracks: number;
    followers: number;
    following: number;
    likes: number;
    reposts: number;
    comments: number;
  };
}

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isCurrentUser = currentUser?.username === username;
  const { setCurrentTrack, setIsPlaying } = usePlayerStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user data for:', username);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiUrl}/api/users/${username}`, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });

        console.log('User data response:', response.data);
        console.log('Followers data:', response.data.data.followers);
        
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError(response.data.message || 'Пользователь не найден');
        }
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.response?.data?.message || 'Ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const handleLike = async (trackId: string) => {
    if (!currentUser) return;

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/tracks/${trackId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success && user) {
        const updateTrack = (track: Track) => {
          if (track.id === trackId) {
            const newLikesCount = response.data.data.liked ? track.likesCount + 1 : track.likesCount - 1;
            return {
              ...track,
              isLiked: response.data.data.liked,
              likesCount: newLikesCount
            };
          }
          return track;
        };

        // Обновляем все треки
        const updatedTracks = user.tracks.map(updateTrack);
        const updatedLikedTracks = user.likedTracks.map(updateTrack);
        const updatedRepostedTracks = user.repostedTracks.map(updateTrack);

        // Если трек был лайкнут, добавляем его в likedTracks
        if (response.data.data.liked) {
          const track = updatedTracks.find(t => t.id === trackId);
          if (track && !updatedLikedTracks.some(t => t.id === trackId)) {
            updatedLikedTracks.unshift(track);
          }
        } else {
          // Если лайк убран, удаляем трек из likedTracks
          const likedTrackIndex = updatedLikedTracks.findIndex(t => t.id === trackId);
          if (likedTrackIndex !== -1) {
            updatedLikedTracks.splice(likedTrackIndex, 1);
          }
        }

        setUser({
          ...user,
          tracks: updatedTracks,
          likedTracks: updatedLikedTracks,
          repostedTracks: updatedRepostedTracks
        });
      }
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const handleRepost = async (trackId: string) => {
    if (!currentUser) return;

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

      if (response.data.success && user) {
        const updateTrack = (track: Track) => {
          if (track.id === trackId) {
            const newRepostsCount = response.data.data.reposted ? track.repostsCount + 1 : track.repostsCount - 1;
            return {
              ...track,
              isReposted: response.data.data.reposted,
              repostsCount: newRepostsCount
            };
          }
          return track;
        };

        // Обновляем все треки
        const updatedTracks = user.tracks.map(updateTrack);
        const updatedLikedTracks = user.likedTracks.map(updateTrack);
        const updatedRepostedTracks = user.repostedTracks.map(updateTrack);

        // Если трек был репостнут, добавляем его в repostedTracks
        if (response.data.data.reposted) {
          const track = updatedTracks.find(t => t.id === trackId);
          if (track && !updatedRepostedTracks.some(t => t.id === trackId)) {
            updatedRepostedTracks.unshift(track);
          }
        } else {
          // Если репост убран, удаляем трек из repostedTracks
          const repostedTrackIndex = updatedRepostedTracks.findIndex(t => t.id === trackId);
          if (repostedTrackIndex !== -1) {
            updatedRepostedTracks.splice(repostedTrackIndex, 1);
          }
        }

        setUser({
          ...user,
          tracks: updatedTracks,
          likedTracks: updatedLikedTracks,
          repostedTracks: updatedRepostedTracks
        });
      }
    } catch (error) {
      console.error('Error reposting track:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      console.log('Making follow request:', {
        targetUsername: username,
        token: token ? 'present' : 'missing'
      });

      const response = await axios.post(
        `${config.apiUrl}/api/users/${username}/follow`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Follow response:', response.data);

      if (response.data.success && user) {
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            isFollowing: !prevUser.isFollowing,
            _count: {
              ...prevUser._count,
              followers: prevUser.isFollowing 
                ? (prevUser._count?.followers || 0) - 1 
                : (prevUser._count?.followers || 0) + 1
            }
          };
        });
      }
    } catch (error) {
      console.error('Follow error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
    }
  };

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soundcloud-dark">
        <div className="animate-pulse">
          <div className="h-64 bg-soundcloud-gray"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
            <div className="h-32 bg-soundcloud-gray rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-soundcloud-dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soundcloud-dark">
      {/* Hero Section */}
      <div className="h-64 bg-gradient-to-r from-orange-500 to-yellow-500"></div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <div className="bg-soundcloud-gray rounded-lg shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full bg-soundcloud-dark flex items-center justify-center">
                  <i className="fas fa-user text-4xl text-gray-400"></i>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user?.username}</h1>
                  <p className="text-gray-400 mt-1">
                    Дата регистрации: {new Date(user?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isCurrentUser ? (
                  <Link
                    href="/upload"
                    className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Загрузить трек
                  </Link>
                ) : currentUser && user?.id !== currentUser.id && (
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-full transition-colors ${
                      user?.isFollowing
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {user?.isFollowing ? 'Отписаться' : 'Подписаться'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="border-t border-gray-700">
            <div className="grid grid-cols-6 divide-x divide-gray-700">
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {user?._count.tracks || 0}
                </div>
                <div className="text-sm text-gray-400">Треков</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {user?._count.followers || 0}
                </div>
                <div className="text-sm text-gray-400">Подписчиков</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {user?._count.following || 0}
                </div>
                <div className="text-sm text-gray-400">Подписок</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {user?._count.reposts || 0}
                </div>
                <div className="text-sm text-gray-400">Репостов</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {user?._count.likes || 0}
                </div>
                <div className="text-sm text-gray-400">Лайков</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{user?._count.comments || 0}</div>
                <div className="text-sm text-gray-400">Комментариев</div>
              </div>
            </div>
          </div>

          {/* Tracks Section */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Треки</h2>
            {!user ? (
              <div className="text-center py-12 text-gray-400">
                <p>Загрузка...</p>
              </div>
            ) : !user.tracks ? (
              <div className="text-center py-12 text-gray-400">
                <p>Ошибка загрузки треков</p>
              </div>
            ) : user.tracks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {isCurrentUser ? (
                  <>
                    <p className="mb-4">У вас пока нет загруженных треков</p>
                    <Link
                      href="/upload"
                      className="text-sc-orange hover:text-orange-400 transition"
                    >
                      Загрузить первый трек
                    </Link>
                  </>
                ) : (
                  <p>У пользователя пока нет загруженных треков</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-soundcloud-dark rounded-xl overflow-hidden hover:bg-gray-800 transition"
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
                          className="w-12 h-12 bg-soundcloud-dark rounded-full flex items-center justify-center hover:bg-gray-800 transition"
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
                      <p className="text-sm text-gray-400 mb-2">
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

          {/* Reposts Section */}
          <div className="p-8 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Репосты</h2>
            {!user?.repostedTracks || user.repostedTracks.length === 0 ? (
              <div className="bg-soundcloud-dark rounded-lg p-8 text-center">
                <i className="fas fa-retweet text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Пока нет репостов</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.repostedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-soundcloud-dark rounded-xl overflow-hidden hover:bg-gray-800 transition"
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
                          className="w-12 h-12 bg-soundcloud-dark rounded-full flex items-center justify-center hover:bg-gray-800 transition"
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

          {/* Likes Section */}
          <div className="p-8 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Лайки</h2>
            {!user?.likedTracks || user.likedTracks.length === 0 ? (
              <div className="bg-soundcloud-dark rounded-lg p-8 text-center">
                <i className="fas fa-heart text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Пока нет лайков</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.likedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-soundcloud-dark rounded-xl overflow-hidden hover:bg-gray-800 transition"
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
                          className="w-12 h-12 bg-soundcloud-dark rounded-full flex items-center justify-center hover:bg-gray-800 transition"
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

          {/* Subscribers Section */}
          <div className="p-8 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Подписчики</h2>
            {(() => {
              console.log('Rendering followers section:', user?.followers);
              return null;
            })()}
            {!user?.followers ? (
              <div className="bg-soundcloud-dark rounded-lg p-8 text-center">
                <i className="fas fa-user-friends text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Загрузка подписчиков...</p>
              </div>
            ) : user.followers.length === 0 ? (
              <div className="bg-soundcloud-dark rounded-lg p-8 text-center">
                <i className="fas fa-user-friends text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Пока нет подписчиков</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.followers.map((follower) => (
                  <Link
                    key={follower.id}
                    href={`/profile/${follower.username}`}
                    className="bg-soundcloud-dark rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-800 transition"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <i className="fas fa-user text-2xl text-gray-400"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{follower.username}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Following Section */}
          <div className="p-8 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Подписки</h2>
            {!user?.following || user.following.length === 0 ? (
              <div className="bg-soundcloud-dark rounded-lg p-8 text-center">
                <i className="fas fa-user-friends text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Пока нет подписок</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.following.map((following) => (
                  <Link
                    key={following.id}
                    href={`/profile/${following.username}`}
                    className="bg-soundcloud-dark rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-800 transition"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <i className="fas fa-user text-2xl text-gray-400"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{following.username}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 