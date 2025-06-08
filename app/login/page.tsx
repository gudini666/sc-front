'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка при входе');
    }
  };

  return (
    <div className="min-h-screen bg-sc-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-sc-gray rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Вход в аккаунт</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-sc-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Пароль"
                className="w-full px-4 py-3 bg-sc-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sc-orange text-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-sc-orange text-white rounded-lg font-medium hover:bg-orange-600 transition"
            >
              Войти
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-sc-orange hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 