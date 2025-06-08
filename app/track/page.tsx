export default function TrackPage() {
  return (
    <main className="container mx-auto px-4 py-8 bg-sc-dark text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Левая часть - обложка с интегрированным плеером */}
        <div className="lg:w-1/2 xl:w-2/5">
          {/* Обложка с плеером */}
          <div className="relative group mb-6">
            <img src="https://source.unsplash.com/random/800x800/?music,vinyl"
              alt="Обложка трека"
              className="w-full rounded-xl shadow-2xl aspect-square object-cover" />
            {/* Элементы плеера поверх обложки */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              {/* Информация о треке */}
              <div>
                <h1 className="text-3xl font-bold">Название трека</h1>
                <h2 className="text-xl text-sc-orange">Исполнитель</h2>
              </div>
              {/* Основные кнопки управления */}
              <div className="flex items-center justify-center space-x-8">
                <button className="text-white hover:text-sc-orange text-2xl transition-transform hover:scale-110">
                  <i className="fas fa-step-backward"></i>
                </button>
                <button className="bg-sc-orange hover:bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                  <i className="fas fa-play text-2xl"></i>
                </button>
                <button className="text-white hover:text-sc-orange text-2xl transition-transform hover:scale-110">
                  <i className="fas fa-step-forward"></i>
                </button>
              </div>
              {/* Прогресс-бар */}
              <div className="w-full">
                <div className="w-full bg-sc-light-gray bg-opacity-80 rounded-full h-1.5 mb-2">
                  <div className="bg-sc-orange h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex justify-between text-white text-sm">
                  <span>1:42</span>
                  <span>3:45</span>
                </div>
              </div>
            </div>
          </div>
          {/* Дополнительная информация */}
          <div className="bg-sc-gray rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-gray-400 text-sm">24.5K прослушиваний</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Лайки */}
                <button className="flex items-center space-x-1 group">
                  <i className="far fa-heart text-xl group-hover:text-sc-orange"></i>
                  <span className="text-sm group-hover:text-sc-orange">12.4K</span>
                </button>
                {/* Репосты */}
                <button className="flex items-center space-x-1 group">
                  <i className="fas fa-retweet text-xl group-hover:text-sc-orange"></i>
                  <span className="text-sm group-hover:text-sc-orange">3.2K</span>
                </button>
                {/* Поделиться */}
                <button className="flex items-center space-x-1 group">
                  <i className="fas fa-share-alt text-xl group-hover:text-sc-orange"></i>
                </button>
              </div>
            </div>
            {/* Описание трека */}
            <h3 className="text-lg font-bold mb-2">Описание</h3>
            <p className="text-gray-300 mb-4">Этот трек был записан в 2023 году на студии SoundCloud. Вдохновлен классической электроникой 90-х с современным звучанием.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-sc-dark px-3 py-1 rounded-full text-sm">электроника</span>
              <span className="bg-sc-dark px-3 py-1 rounded-full text-sm">хип-хоп</span>
              <span className="bg-sc-dark px-3 py-1 rounded-full text-sm">бит</span>
            </div>
          </div>
        </div>
        {/* Правая часть - комментарии */}
        <div className="lg:w-1/2 xl:w-3/5">
          <div className="bg-sc-gray rounded-xl p-6 shadow-lg h-full">
            <h2 className="text-2xl font-bold mb-6">Комментарии <span className="text-gray-400">(24)</span></h2>
            {/* Форма комментария */}
            <div className="flex items-start space-x-3 mb-6">
              <img src="https://source.unsplash.com/random/50x50/?portrait" alt="Аватар" className="w-10 h-10 rounded-full" />
              <div className="flex-1 relative">
                <textarea className="w-full bg-sc-dark text-white rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-sc-orange"
                  placeholder="Напишите комментарий..."
                  rows={2}></textarea>
                <button className="absolute right-2 bottom-2 text-gray-400 hover:text-sc-orange">
                  <i className="far fa-smile text-xl"></i>
                </button>
              </div>
            </div>
            {/* Список комментариев */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {/* Комментарий 1 */}
              <div className="flex items-start space-x-3 group">
                <img src="https://source.unsplash.com/random/50x50/?man" alt="Аватар" className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Иван Петров</h4>
                      <span className="text-gray-400 text-xs">2 дня назад</span>
                    </div>
                    <button className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-sc-orange">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                  <p className="mt-1">Отличный трек! Слушаю уже третий день подряд, не могу остановиться. Бит просто огонь!</p>
                  <div className="flex items-center space-x-4 mt-2 text-gray-400 text-sm">
                    <button className="hover:text-sc-orange flex items-center space-x-1">
                      <i className="far fa-thumbs-up"></i>
                      <span>12</span>
                    </button>
                    <button className="hover:text-sc-orange flex items-center space-x-1">
                      <i className="far fa-thumbs-down"></i>
                    </button>
                    <button className="hover:text-sc-orange">
                      Ответить
                    </button>
                  </div>
                </div>
              </div>
              {/* Комментарий 2 */}
              <div className="flex items-start space-x-3 group">
                <img src="https://source.unsplash.com/random/50x50/?woman" alt="Аватар" className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Анна Смирнова</h4>
                      <span className="text-gray-400 text-xs">неделю назад</span>
                    </div>
                    <button className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-sc-orange">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                  <p className="mt-1">Обожаю этот бит! Когда выйдет новый альбом? Жду с нетерпением!</p>
                  <div className="flex items-center space-x-4 mt-2 text-gray-400 text-sm">
                    <button className="hover:text-sc-orange flex items-center space-x-1">
                      <i className="far fa-thumbs-up"></i>
                      <span>8</span>
                    </button>
                    <button className="hover:text-sc-orange flex items-center space-x-1">
                      <i className="far fa-thumbs-down"></i>
                    </button>
                    <button className="hover:text-sc-orange">
                      Ответить
                    </button>
                  </div>
                  {/* Ответ на комментарий */}
                  <div className="mt-4 ml-6 pl-4 border-l-2 border-sc-orange">
                    <div className="flex items-start space-x-3 group">
                      <img src="https://source.unsplash.com/random/50x50/?artist" alt="Аватар" className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">Исполнитель</h4>
                            <span className="text-gray-400 text-xs">5 дней назад</span>
                          </div>
                          <button className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-sc-orange text-sm">
                            <i className="fas fa-ellipsis-h"></i>
                          </button>
                        </div>
                        <p className="mt-1 text-sm">Спасибо! Новый альбом выйдет в следующем месяце, следите за обновлениями!</p>
                        <div className="flex items-center space-x-4 mt-2 text-gray-400 text-xs">
                          <button className="hover:text-sc-orange flex items-center space-x-1">
                            <i className="far fa-thumbs-up"></i>
                            <span>5</span>
                          </button>
                          <button className="hover:text-sc-orange flex items-center space-x-1">
                            <i className="far fa-thumbs-down"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 