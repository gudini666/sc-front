export default function Footer() {
  return (
    <footer className="bg-soundcloud-dark text-gray-400 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © 2025 SoundCloud Clone. Все права защищены.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm hover:text-white transition">
              О нас
            </a>
            <a href="#" className="text-sm hover:text-white transition">
              Условия использования
            </a>
            <a href="#" className="text-sm hover:text-white transition">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 