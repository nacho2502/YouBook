import { useState } from 'react'
import Home from './components/Home'
import SearchBar from './components/SearchBar'
import BookCard from './components/BookCard'
import BookDetail from './components/BookDetail'
import MyLibrary from './components/MyLibrary'
import Stats from './components/Stats'
import useLibrary from './hooks/useLibrary'

function App() {
  const [screen, setScreen] = useState('home')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const library = useLibrary()

  async function handleSearch(query) {
    setLoading(true)
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}&limit=12`
    )
    const data = await response.json()
    setBooks(data.docs)
    setLoading(false)
  }

  if (selectedBook) {
    return (
      <BookDetail
        book={selectedBook}
        onBack={() => setSelectedBook(null)}
        library={library}
      />
    )
  }

  if (screen === 'library') {
    return (
      <MyLibrary
        library={library}
        onBack={() => setScreen('home')}
        onBookClick={(book) => setSelectedBook(book)}
      />
    )
  }

  if (screen === 'stats') {
    return (
      <Stats
        library={library}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'search') {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setScreen('home')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Volver
            </button>
            <h1 className="text-2xl font-bold">🔍 Buscar libros</h1>
            <div className="w-20" />
          </div>
          <SearchBar onSearch={handleSearch} />
          {loading && (
            <p className="text-center text-gray-400 mt-12">Buscando...</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-10">
            {books.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Home
      library={library}
      onBookClick={(book) => setSelectedBook(book)}
      onSearch={() => setScreen('search')}
      onLibrary={() => setScreen('library')}
      onStats={() => setScreen('stats')}
    />
  )
}

export default App