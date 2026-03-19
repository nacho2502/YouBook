import { useState } from 'react'
import SearchBar from './components/SearchBar'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(query) {
    setLoading(true)
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}&limit=12`
    )
    const data = await response.json()
    setBooks(data.docs)
    setLoading(false)
  }

  return (
    <div>
      <h1>Mi app de libros</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Buscando...</p>}
      {books.map((book) => (
        <p key={book.key}>{book.title}</p>
      ))}
    </div>
  )
}

export default App