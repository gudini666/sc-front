"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import config from '../../../src/config';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
}

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
  comments: Comment[];
}

export default function TrackPage() {
  const { trackId } = useParams();
  const { user: currentUser } = useAuthStore();
  const router = useRouter();
  const [track, setTrack] = useState<Track | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    const fetchTrack = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        
        if (response.data.success) {
          setTrack(response.data.data);
        }
    } catch (error) {
      console.error('Error fetching track:', error);
      setError('Failed to load track');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTrack();
  }, [trackId]);

  const handleLike = async () => {
    if (!currentUser || !track) return;

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/tracks/${track.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setTrack(prevTrack => {
          if (!prevTrack) return null;
          return {
            ...prevTrack,
            isLiked: !prevTrack.isLiked,
            likesCount: prevTrack.isLiked ? prevTrack.likesCount - 1 : prevTrack.likesCount + 1
          };
        });
      }
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const handleRepost = async () => {
    if (!currentUser || !track) return;

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/tracks/${track.id}/repost`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setTrack(prevTrack => {
          if (!prevTrack) return null;
          return {
            ...prevTrack,
            isReposted: !prevTrack.isReposted,
            repostsCount: prevTrack.isReposted ? prevTrack.repostsCount - 1 : prevTrack.repostsCount + 1
          };
        });
      }
    } catch (error) {
      console.error('Error reposting track:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/tracks/${trackId}/comments`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setComment('');
        // Обновляем трек, чтобы показать новый комментарий
        fetchTrack();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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

  if (!track) {
    return (
      <div className="min-h-screen bg-soundcloud-dark text-white flex items-center justify-center">
        <div className="text-gray-400">Трек не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soundcloud-dark text-white flex justify-center items-start py-12">
      {/* Левая колонка: обложка и инфо */}
      <div className="w-96 flex-shrink-0 mr-12">
        <div className="rounded-xl overflow-hidden bg-soundcloud-gray">
          {track.coverUrl ? (
            <img
              src={`${config.apiUrl}${track.coverUrl}`}
              alt={track.title}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gray-700 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
            <Link href={`/profile/${track.user.username}`} className="text-gray-400 hover:text-white transition mb-4 block">
              {track.user.username}
            </Link>
            <div className="flex items-center gap-6 mb-4">
              <button onClick={handleLike} className={`flex items-center gap-1 ${track.isLiked ? 'text-sc-orange' : 'text-gray-400 hover:text-white'} transition`}>
                <svg className="w-6 h-6" fill={track.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{track.likesCount}</span>
              </button>
              <button onClick={handleRepost} className={`flex items-center gap-1 ${track.isReposted ? 'text-sc-orange' : 'text-gray-400 hover:text-white'} transition`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>{track.repostsCount}</span>
              </button>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Описание: </span>
              <span className="text-gray-300">{track.description || 'Нет описания'}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Жанр: </span>
              <span className="text-gray-300">{track.genre || 'Без жанра'}</span>
            </div>
            <div className="text-gray-500 text-sm mt-4">Загружено: {new Date(track.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      {/* Правая колонка: комментарии */}
      <div className="flex-1 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Комментарии</h2>
        <div className="bg-soundcloud-gray rounded-lg p-6 max-h-[600px] overflow-y-auto">
          {/* Список комментариев */}
          {track.comments.length === 0 ? (
            <div className="text-gray-400">Пока нет комментариев</div>
          ) : (
            track.comments.map(comment => (
              <div key={comment.id} className="mb-6 border-b border-gray-700 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9A3.75 3.75 0 1 1 8.25 9a3.75 3.75 0 0 1 7.5 0zM4.5 19.5a7.5 7.5 0 0 1 15 0v.75a.75.75 0 0 1-.75.75h-13.5a.75.75 0 0 1-.75-.75v-.75z" />
                    </svg>
                  </div>
                  <div>
                    <Link href={`/profile/${comment.user.username}`} className="font-semibold text-white hover:underline">
                      {comment.user.username}
                    </Link>
                    <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-gray-200 whitespace-pre-line">{comment.content}</div>
              </div>
            ))
          )}
          {/* Форма добавления комментария */}
          {currentUser ? (
          <form onSubmit={handleComment} className="mt-6 flex gap-2">
            <input
              type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
              placeholder="Добавить комментарий..."
              className="flex-1 rounded-lg bg-gray-800 text-white px-4 py-2 focus:outline-none"
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
              Отправить
            </button>
          </form>
          ) : (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400">
                Чтобы оставить комментарий, пожалуйста,{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-sc-orange hover:text-orange-400"
                >
                  войдите в аккаунт
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 