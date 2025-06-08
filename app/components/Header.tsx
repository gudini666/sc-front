"use client";

import Link from "next/link";
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-soundcloud-dark px-8 py-4 flex items-center justify-between shadow-lg">
      {/* Левый блок: Логотип и навигация */}
      <div className="flex items-center space-x-10">
        {/* Логотип */}
        <div className="flex items-center">
          <i className="fab fa-soundcloud text-orange-500 text-2xl mr-2"></i>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 font-bold text-xl">
            SoundCloud
          </span>
        </div>
        {/* Навигационные ссылки */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Главная</Link>
        </nav>
      </div>
      {/* Правый блок: Действия пользователя */}
      <div className="flex items-center space-x-6">
        {/* Кнопка загрузки */}
        <Link href="/upload" className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
          Загрузить
        </Link>
        {/* Авторизация */}
        <div className="flex items-center space-x-4">
          {isMounted && (
            isAuthenticated ? (
              <>
                <Link 
                  href={`/profile/${user?.username}`}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  {user?.username}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Войти</Link>
                <div className="w-px h-5 bg-gray-600"></div>
                <Link href="/register" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Регистрация</Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
} 