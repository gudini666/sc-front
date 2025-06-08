'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sc-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-sc-gray rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Регистрация</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-sc-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange placeholder-gray-500 text-white"
                placeholder="Введите имя пользователя"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-sc-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange placeholder-gray-500 text-white"
                placeholder="Введите email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-sc-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange placeholder-gray-500 text-white"
                placeholder="Введите пароль"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Подтвердите пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-sc-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange placeholder-gray-500 text-white"
                placeholder="Подтвердите пароль"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sc-orange text-white rounded-lg font-medium hover:bg-orange-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-sc-orange hover:text-orange-400 transition">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 