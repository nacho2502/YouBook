import { useState } from 'react'
import SearchBar from './components/SearchBar'
import BookCard from './components/BookCard'
import BookDetail from './components/BookDetail'
import useLibrary from './hooks/useLibrary'

function App() {
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-2">📚 Mi App de Libros</h1>
        <p className="text-center text-gray-400 mb-8">Busca cualquier libro del mundo</p>
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

export default App