export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-4 bg-sc-dark text-white min-h-screen">
      {/* Минималистичное поле поиска */}
      <div className="mb-6 sticky top-0 bg-sc-dark pt-4 pb-2 z-10">
        <input
          type="text"
          id="search-input"
          placeholder="Искать треки, исполнителей, альбомы..."
          className="w-full p-4 bg-transparent text-2xl text-white placeholder-gray-500 focus:outline-none border-b border-gray-800 focus:border-sc-orange transition-colors"
          autoFocus
        />
      </div>
      {/* Результаты поиска */}
      <div id="search-results">
        {/* Фильтры */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button className="filter-btn px-4 py-2 bg-sc-orange text-white rounded-full text-sm font-medium whitespace-nowrap" data-type="all">Все</button>
          <button className="filter-btn px-4 py-2 bg-sc-gray hover:bg-gray-700 rounded-full text-sm font-medium transition whitespace-nowrap" data-type="tracks">Треки</button>
          <button className="filter-btn px-4 py-2 bg-sc-gray hover:bg-gray-700 rounded-full text-sm font-medium transition whitespace-nowrap" data-type="artists">Исполнители</button>
          <button className="filter-btn px-4 py-2 bg-sc-gray hover:bg-gray-700 rounded-full text-sm font-medium transition whitespace-nowrap" data-type="albums">Альбомы</button>
        </div>
        {/* Контейнер для результатов */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" id="results-container">
          {/* Пример трека */}
          <div className="track-item bg-sc-gray bg-opacity-20 rounded hover:bg-opacity-40 transition cursor-pointer p-2" data-type="track">
            <div className="relative mb-2">
              <img src="https://source.unsplash.com/random/300x300/?music,electronic" alt="Обложка" className="w-full aspect-square object-cover rounded" />
              <button className="play-btn absolute bottom-2 right-2 w-8 h-8 bg-sc-orange rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              </button>
            </div>
            <h3 className="font-medium text-sm truncate">Summer Vibes</h3>
            <p className="text-gray-400 text-xs truncate">DJ Sunshine</p>
          </div>
          {/* Пример исполнителя */}
          <div className="artist-item bg-sc-gray bg-opacity-20 rounded hover:bg-opacity-40 transition cursor-pointer p-3 flex flex-col items-center" data-type="artist">
            <img src="https://source.unsplash.com/random/300x300/?singer" alt="Исполнитель" className="w-16 h-16 rounded-full object-cover mb-2" />
            <h3 className="font-medium text-sm text-center truncate w-full">DJ Sunshine</h3>
            <p className="text-gray-400 text-xs">Исполнитель</p>
          </div>
          {/* Пример альбома */}
          <div className="album-item bg-sc-gray bg-opacity-20 rounded hover:bg-opacity-40 transition cursor-pointer p-2" data-type="album">
            <img src="https://source.unsplash.com/random/300x300/?album,cover" alt="Обложка" className="w-full aspect-square object-cover rounded mb-2" />
            <h3 className="font-medium text-sm truncate">Summer Hits</h3>
            <p className="text-gray-400 text-xs truncate">Various Artists</p>
          </div>
          {/* Ещё примеры... */}
          <div className="track-item bg-sc-gray bg-opacity-20 rounded hover:bg-opacity-40 transition cursor-pointer p-2" data-type="track">
            <div className="relative mb-2">
              <img src="https://source.unsplash.com/random/300x300/?music,house" alt="Обложка" className="w-full aspect-square object-cover rounded" />
              <button className="play-btn absolute bottom-2 right-2 w-8 h-8 bg-sc-orange rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              </button>
            </div>
            <h3 className="font-medium text-sm truncate">Deep House Session</h3>
            <p className="text-gray-400 text-xs truncate">Mike Soul</p>
          </div>
          <div className="album-item bg-sc-gray bg-opacity-20 rounded hover:bg-opacity-40 transition cursor-pointer p-2" data-type="album">
            <img src="https://source.unsplash.com/random/300x300/?vinyl" alt="Обложка" className="w-full aspect-square object-cover rounded mb-2" />
            <h3 className="font-medium text-sm truncate">Retro Vibes</h3>
            <p className="text-gray-400 text-xs truncate">Vinyl Collector</p>
          </div>
        </div>
      </div>
    </main>
  );
} 