import React, { useState, useEffect } from 'react';
import MovieReviewForm from './components/MovieReviewForm';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'watch', 'list', 'reviews'
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [myList, setMyList] = useState([]);

  // Cargar catálogo local y lista guardada
  useEffect(() => {
    fetch('/movies.json')
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error('Error al cargar catálogo local:', err));

    const savedList = JSON.parse(localStorage.getItem('myList') || '[]');
    setMyList(savedList);
  }, []);

  // Manejar reproducción y historial
  const handlePlayMovie = (movie) => {
    setSelectedMovie(movie);
    setCurrentView('watch');

    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    history.push(movie.category);
    localStorage.setItem('watchHistory', JSON.stringify(history));
  };

  // Agregar/Quitar de Mi Lista
  const toggleMyList = (movie, e) => {
    e.stopPropagation();
    let updatedList;
    if (myList.some((m) => m.id === movie.id)) {
      updatedList = myList.filter((m) => m.id !== movie.id);
    } else {
      updatedList = [...myList, movie];
    }
    setMyList(updatedList);
    localStorage.setItem('myList', JSON.stringify(updatedList));
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.year.toString().includes(searchTerm)
  );

  const categories = [...new Set(movies.map((m) => m.category))];
  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Navbar Superior */}
      <nav className="flex items-center justify-between px-8 py-4 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-8">
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded">CF</span>
            <h1 className="text-xl font-extrabold tracking-wider group-hover:text-red-500 transition">
              CLASSICFLIX <span className="text-xs text-red-500 bg-red-950/50 border border-red-800/50 px-1.5 py-0.5 rounded">LAN</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <button 
              onClick={() => setCurrentView('home')}
              className={`hover:text-white transition ${currentView === 'home' ? 'text-white font-bold border-b-2 border-red-600 pb-1' : ''}`}
            >
              🏠 Inicio
            </button>
            <button 
              onClick={() => setCurrentView('list')}
              className={`hover:text-white transition ${currentView === 'list' ? 'text-white font-bold border-b-2 border-red-600 pb-1' : ''}`}
            >
              📁 Mi Lista ({myList.length})
            </button>
            <button 
              onClick={() => setCurrentView('reviews')}
              className={`hover:text-white transition ${currentView === 'reviews' ? 'text-white font-bold border-b-2 border-red-600 pb-1' : ''}`}
            >
              📋 Reseñas & Registro
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar título, año, género..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-zinc-800/80 border border-zinc-700 rounded-full text-sm focus:outline-none focus:border-red-600 w-64 transition"
            />
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-bold text-amber-500">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            LIS Modo Offline
          </div>
        </div>
      </nav>

      {/* VISTA INICIO */}
      {currentView === 'home' && (
        <main className="p-8 space-y-10">
          {/* Hero Banner Destacado */}
          {featuredMovie && (
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-t from-zinc-950 via-zinc-900 to-zinc-900 p-8 md:p-12 shadow-2xl flex flex-col justify-end min-h-[420px] border border-zinc-800/80">
              <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                <img src={featuredMovie.posterUrl} alt={featuredMovie.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-0"></div>

              <div className="max-w-2xl space-y-4 z-10">
                <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow">
                  📌 DESTACADO DE DOMINIO PÚBLICO
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                  {featuredMovie.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-zinc-300 font-semibold">
                  <span className="text-amber-400 flex items-center gap-1">★ {featuredMovie.rating || 4.9}</span>
                  <span>•</span>
                  <span>{featuredMovie.year}</span>
                  <span>•</span>
                  <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs">{featuredMovie.category}</span>
                  <span>•</span>
                  <span>⏱ {featuredMovie.duration}</span>
                </div>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed line-clamp-2">
                  {featuredMovie.synopsis}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handlePlayMovie(featuredMovie)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3 rounded-xl flex items-center gap-2 transition shadow-lg shadow-red-600/30"
                  >
                    ▶ Reproducir
                  </button>
                  <button
                    onClick={() => handlePlayMovie(featuredMovie)}
                    className="bg-zinc-800/80 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition border border-zinc-700"
                  >
                    ⓘ Más información
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sección Recomendados para ti */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                ✨ Recomendados para ti
              </h3>
              <span className="text-xs text-zinc-400 hover:text-white cursor-pointer">Más populares</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {movies.slice(0, 5).map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handlePlayMovie(movie)}
                  className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/80 hover:border-red-600/60 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-amber-400 text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-zinc-700">
                      ★ {movie.rating || 4.8}
                    </span>
                    <button 
                      onClick={(e) => toggleMyList(movie, e)}
                      className="absolute top-2 left-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition"
                      title="Mi Lista"
                    >
                      {myList.some(m => m.id === movie.id) ? '✓' : '+'}
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100 group-hover:text-red-500 transition line-clamp-1">{movie.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{movie.year} • {movie.category}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/80">
                      <span>⏱ {movie.duration}</span>
                      <span className="text-red-400 group-hover:underline">Detalles</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Categorías Generales */}
          {categories.map((cat) => (
            <section key={cat} className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-white">{cat}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {filteredMovies
                  .filter((m) => m.category === cat)
                  .map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handlePlayMovie(movie)}
                      className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/80 hover:border-red-600/60 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-amber-400 text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-zinc-700">
                          ★ {movie.rating || 4.7}
                        </span>
                        <button 
                          onClick={(e) => toggleMyList(movie, e)}
                          className="absolute top-2 left-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition"
                        >
                          {myList.some(m => m.id === movie.id) ? '✓' : '+'}
                        </button>
                      </div>
                      <div className="p-4 flex flex-col flex-grow justify-between space-y-2">
                        <div>
                          <h4 className="font-bold text-sm text-zinc-100 group-hover:text-red-500 transition line-clamp-1">{movie.title}</h4>
                          <p className="text-xs text-zinc-400 mt-0.5">{movie.year} • {movie.category}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/80">
                          <span>⏱ {movie.duration}</span>
                          <span className="text-red-400 group-hover:underline">Detalles</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </main>
      )}

      {/* VISTA MI LISTA */}
      {currentView === 'list' && (
        <main className="p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              📁 Mi Lista de Películas Guardadas
            </h2>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
            >
              ← Volver al catálogo
            </button>
          </div>

          {myList.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-3">
              <p className="text-zinc-400">Aún no has agregado películas a tu lista.</p>
              <button 
                onClick={() => setCurrentView('home')}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {myList.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handlePlayMovie(movie)}
                  className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:scale-105 transition cursor-pointer group shadow-lg"
                >
                  <div className="relative h-56">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => toggleMyList(movie, e)}
                      className="absolute top-2 left-2 bg-red-600 text-white p-1.5 rounded-full transition text-xs font-bold"
                    >
                      ✕ Quitar
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm group-hover:text-red-500 transition line-clamp-1">{movie.title}</h4>
                    <span className="text-xs text-zinc-400">{movie.year} • {movie.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* VISTA RESEÑAS & REGISTRO */}
      {currentView === 'reviews' && (
        <main className="p-8 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-black text-white">📋 Reseñas & Registro Local</h2>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
            >
              ← Volver al inicio
            </button>
          </div>
          <p className="text-zinc-400 text-sm">
            Comparte tu opinión sobre las películas clásicas del catálogo LAN. Las reseñas se procesan localmente con validación estricta.
          </p>
          <MovieReviewForm movieId="general" />
        </main>
      )}

      {/* VISTA REPRODUCTOR DE VIDEO */}
      {currentView === 'watch' && selectedMovie && (
        <main className="p-8 max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setCurrentView('home')}
            className="text-sm bg-zinc-800 hover:bg-zinc-700 hover:text-white px-4 py-2 rounded-xl transition flex items-center gap-2 w-fit border border-zinc-700"
          >
            ← Volver al catálogo
          </button>

          <div className="bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <video
              controls
              autoPlay
              src={selectedMovie.videoUrl}
              className="w-full max-h-[500px] object-contain bg-zinc-950"
            />
          </div>

          <div className="space-y-3 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-white">{selectedMovie.title}</h2>
              <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
                ★ {selectedMovie.rating || 4.8} / 5.0
              </span>
            </div>
            <p className="text-zinc-400 text-sm font-medium">
              {selectedMovie.year} • {selectedMovie.duration} • Director: <span className="text-white">{selectedMovie.director}</span> • Categoría: <span className="text-red-500">{selectedMovie.category}</span>
            </p>
            <p className="text-zinc-300 leading-relaxed pt-2 border-t border-zinc-800">{selectedMovie.synopsis}</p>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-bold mb-4 text-white">Deja tu reseña para esta película</h3>
            <MovieReviewForm movieId={selectedMovie.id} />
          </div>
        </main>
      )}
    </div>
  );
}