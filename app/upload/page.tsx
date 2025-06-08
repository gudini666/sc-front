"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import config from '../../src/config';

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    if (!user) {
      router.push('/login');
    } else {
      setShowContent(true);
    }
  }, [user, router]);

  if (!showContent) return null;

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    if (!audioFile) {
      setError('Пожалуйста, выберите аудиофайл');
      setUploading(false);
      return;
    }

    if (!title) {
      setError('Пожалуйста, введите название трека');
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('genre', genre);
      formData.append('audio', audioFile);
      if (coverFile) {
        formData.append('cover', coverFile);
      }

      console.log('Sending request with files:', {
        audio: audioFile.name,
        cover: coverFile?.name
      });

      if (!isClient) {
        setError('Требуется клиентская среда');
        setUploading(false);
        return;
      }

      const token = localStorage.getItem('token');
      console.log('Auth token:', token);

      if (!token) {
        setError('Требуется авторизация');
        setUploading(false);
        return;
      }

      const response = await axios.post(`${config.apiUrl}/api/tracks/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const data = response.data;
      console.log('Response data:', data);

      if (!response.data.success) {
        throw new Error(data.message || 'Ошибка при загрузке трека');
      }

      setSuccess('Трек успешно загружен!');
      setTitle('');
      setDescription('');
      setGenre('');
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview(null);
      if (audioInputRef.current) {
        audioInputRef.current.value = '';
      }
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }

      router.push(`/track/${data.data.id}`);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Ошибка при загрузке трека'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-sc-dark text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Загрузить новый трек</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Карточка загрузки */}
          <div className="upload-card rounded-xl border border-gray-800 overflow-hidden mb-8">
            <div className="p-8 text-center">
              <div className="mx-auto max-w-xs">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <svg className="w-full h-full text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">
                  {audioFile ? audioFile.name : 'Перетащите аудиофайл'}
                </h3>
                <p className="text-sm text-gray-400 mb-6">MP3, WAV или FLAC до 50MB</p>
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="px-6 py-2 bg-sc-orange text-white rounded-full font-medium hover:bg-orange-600 transition shadow-lg"
                >
                  Выбрать файл
                </button>
                <input
                  ref={audioInputRef}
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleAudioChange}
                />
              </div>
            </div>
          </div>

          {/* Карточка информации */}
          <div className="upload-card rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Информация о треке</h2>
            <div className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Название трека*"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-sc-gray border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange placeholder-gray-500"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Описание"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-sc-gray border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange placeholder-gray-500"
                ></textarea>
              </div>
              <div>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-3 bg-sc-gray border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange text-gray-300"
                >
                  <option value="" disabled>Выберите жанр</option>
                  <option value="electronic">Электронная</option>
                  <option value="hiphop">Хип-хоп</option>
                  <option value="rock">Рок</option>
                  <option value="pop">Поп</option>
                </select>
              </div>
            </div>
          </div>

          {/* Карточка обложки */}
          <div className="upload-card rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Обложка трека</h2>
            <div className="flex flex-col items-center">
              <input
                ref={coverInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleCoverChange}
              />
              <label
                htmlFor="cover-upload"
                className="cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                <div className="w-48 h-48 cover-placeholder rounded-lg overflow-hidden relative group">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Обложка"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-500 group-hover:text-gray-400 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-center text-gray-500">Нажмите для загрузки обложки</p>
              </label>
            </div>
          </div>

          {/* Кнопка публикации */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 bg-sc-orange text-white rounded-full font-bold hover:bg-orange-600 transition shadow-lg hover:shadow-sc disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Загрузка...' : 'Опубликовать трек'}
          </button>
        </form>
      </div>
    </div>
  );
} 