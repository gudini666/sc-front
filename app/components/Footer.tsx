export default function Footer() {
  return (
    <footer className="bg-black py-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Логотип */}
          <div className="mb-4 md:mb-0">
            <a href="#" className="flex items-center">
              <i className="fab fa-soundcloud text-2xl text-sc-orange mr-2"></i>
              <span className="text-xl font-bold text-white">SoundCloud</span>
            </a>
          </div>
          {/* Основные ссылки */}
          <div className="flex space-x-6">
          </div>
        </div>
        {/* Копирайт и соцсети */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-3 md:mb-0">
            © 2025 SoundCloud Clone
          </div>
          <div className="flex space-x-4">
          </div>
        </div>
      </div>
    </footer>
  );
} 