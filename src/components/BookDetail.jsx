import { useState, useEffect } from 'react'

function BookDetail({ book, onBack, library }) {
  const { addBook, updateStatus, updateRating, removeBook, getBook } = library
  const savedBook = getBook(book.key)

  const [details, setDetails] = useState(null)
  const [pages, setPages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ratingInput, setRatingInput] = useState(savedBook?.rating ?? '')

  const coverId = book.cover_i
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null

  const authors = book.author_name ? book.author_name.join(', ') : 'Autor desconocido'
  const year = book.first_publish_year ?? 'Desconocido'
  const publishers = book.publisher ? book.publisher.slice(0, 3).join(', ') : 'Desconocido'
  const languages = book.language ? book.language.slice(0, 5).join(', ').toUpperCase() : 'Desconocido'
  const subjects = book.subject ? book.subject.slice(0, 8) : []

  useEffect(() => {
    async function fetchDetails() {
      try {
        const [worksRes, editionsRes] = await Promise.all([
          fetch(`https://openlibrary.org${book.key}.json`),
          fetch(`https://openlibrary.org${book.key}/editions.json?limit=10`)
        ])
        const worksData = await worksRes.json()
        const editionsData = await editionsRes.json()

        setDetails(worksData)

        const pagesFound = editionsData.entries
          ?.map(e => e.number_of_pages)
          .find(p => p != null)

        setPages(
          book.number_of_pages_median
          ?? pagesFound
          ?? 'Desconocido'
        )
      } catch (error) {
        console.error('Error fetching details:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [book.key, book.number_of_pages_median])

  const description = details?.description
    ? typeof details.description === 'string'
      ? details.description
      : details.description.value
    : null

  function handleStatusChange(status) {
    if (!savedBook) {
      addBook(book, status)
    } else {
      updateStatus(book.key, status)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          ← Volver a resultados
        </button>

        <div className="flex flex-col md:flex-row gap-10">

          <div className="flex-shrink-0">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={book.title}
                className="w-48 rounded-lg shadow-xl"
              />
            ) : (
              <div className="w-48 h-72 bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                <span className="text-5xl">📚</span>
                <p className="text-xs text-gray-400 mt-3">{book.title}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 flex-1">

            <div>
              <h1 className="text-3xl font-bold leading-tight">{book.title}</h1>
              <p className="text-xl text-gray-300 mt-2">{authors}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 flex flex-col gap-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Tu biblioteca</p>

              <div className="flex gap-3">
                {[
                  { status: 'quiero_leer', icon: '🔖', label: 'Quiero leer' },
                  { status: 'leyendo', icon: '📖', label: 'Leyendo' },
                  { status: 'leído', icon: '✅', label: 'Leído' },
                ].map(({ status, icon, label }) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border text-sm font-medium transition-all ${
                      savedBook?.status === status
                        ? 'bg-blue-950 border-blue-500 text-blue-300'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              {savedBook?.status === 'leído' && (
                <>
                  <div className="h-px bg-gray-700" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Tu nota</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            setRatingInput(star)
                            updateRating(book.key, star)
                          }}
                          className={`text-3xl transition-colors ${
                            star <= (ratingInput || 0)
                              ? 'text-amber-400'
                              : 'text-gray-700 hover:text-amber-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      {ratingInput && (
                        <>
                          <span className="text-xl font-semibold text-white ml-2">{ratingInput}</span>
                          <span className="text-sm text-gray-500 self-end mb-1">/10</span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {savedBook && (
                <div className="flex justify-end">
                  <button
                    onClick={() => removeBook(book.key)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    Eliminar de mi biblioteca
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Año de publicación</p>
                <p className="text-lg font-semibold">{year}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Páginas</p>
                <p className="text-lg font-semibold">
                  {loading ? '...' : pages}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Editorial</p>
                <p className="text-sm font-semibold">{publishers}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Idiomas disponibles</p>
                <p className="text-sm font-semibold">{languages}</p>
              </div>
            </div>

            {subjects.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Géneros y temáticas</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400 mb-2">Sinopsis</p>
              {loading ? (
                <p className="text-gray-500 text-sm">Cargando sinopsis...</p>
              ) : description ? (
                <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
              ) : (
                <p className="text-gray-500 text-sm">No hay sinopsis disponible para este libro.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail