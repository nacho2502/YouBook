import { useState, useEffect } from 'react'

const EXCLUIR = ['award', 'series', 'winner', 'hugo', 'nebula', 'prize', 'fiction/', 'nonfiction/']

function getTopGenero(library) {
  const generos = {}
  library.forEach(b => {
    if (b.subjects) {
      b.subjects
        .filter(g =>
          !g.includes(':') &&
          !g.includes('_') &&
          !g.includes('/') &&
          !g.match(/^\d/) &&
          g.length < 40 &&
          !EXCLUIR.some(e => g.toLowerCase().includes(e))
        )
        .slice(0, 3)
        .forEach(g => {
          generos[g] = (generos[g] || 0) + 1
        })
    }
  })
  const sorted = Object.entries(generos).sort(([, a], [, b]) => b - a)
  return sorted[0]?.[0] ?? null
}

function Home({ library, onBookClick, onSearch, onLibrary, onStats }) {
  const [recomendaciones, setRecomendaciones] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [topGenero, setTopGenero] = useState(null)

  const leidos = library.library.filter(b => b.status === 'leído').length
  const leyendo = library.library.filter(b => b.status === 'leyendo').length
  const pendientes = library.library.filter(b => b.status === 'quiero_leer').length
  const tieneLibros = library.library.length > 0

  useEffect(() => {
    if (!tieneLibros) return

    const genero = getTopGenero(library.library)
    setTopGenero(genero)
    if (!genero) return

    async function fetchRecomendaciones() {
      setLoadingRecs(true)
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?subject=${encodeURIComponent(genero)}&limit=18&sort=rating`
        )
        const data = await res.json()
        const librosEnBiblioteca = new Set(library.library.map(b => b.key))
        const filtrados = data.docs
          .filter(b => b.cover_i && !librosEnBiblioteca.has(b.key))
          .slice(0, 6)
        setRecomendaciones(filtrados)
      } catch (error) {
        console.error('Error fetching recomendaciones:', error)
      } finally {
        setLoadingRecs(false)
      }
    }

    fetchRecomendaciones()
  }, [library.library.length])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-10">
          <p className="text-xl font-bold">📚 appLibros</p>
          <div className="flex gap-2">
            <button
              onClick={onSearch}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              🔍 Buscar
            </button>
            <button
              onClick={onLibrary}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              📖 Biblioteca
              {library.library.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {library.library.length}
                </span>
              )}
            </button>
            <button
              onClick={onStats}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              📊 Stats
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white">Bienvenido 👋</h2>
          <p className="text-gray-400 text-sm mt-1">Aquí tienes un resumen de tu actividad lectora</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Leídos', value: leidos },
            { label: 'Leyendo', value: leyendo },
            { label: 'Pendientes', value: pendientes },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-800 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Recomendados para ti</p>

          {!tieneLibros ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-base">Añade libros a tu biblioteca para mostrar recomendaciones</p>
              <button
                onClick={onSearch}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Buscar libros
              </button>
            </div>
          ) : loadingRecs ? (
            <p className="text-gray-500 text-sm">Cargando recomendaciones...</p>
          ) : recomendaciones.length === 0 ? (
            <p className="text-gray-500 text-sm">No se encontraron recomendaciones para tus géneros.</p>
          ) : (
            <>
              {topGenero && (
                <span className="inline-block text-xs bg-blue-950 text-blue-300 px-3 py-1 rounded-full mb-4">
                  Basado en: {topGenero}
                </span>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {recomendaciones.map((book) => (
                  <div
                    key={book.key}
                    onClick={() => onBookClick(book)}
                    className="flex flex-col gap-2 cursor-pointer group"
                  >
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={book.title}
                      className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200"
                    />
                    <div>
                      <p className="text-sm font-semibold leading-tight line-clamp-2">{book.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {book.author_name ? book.author_name[0] : 'Autor desconocido'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Home