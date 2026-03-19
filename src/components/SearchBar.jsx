import { useState } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  function handleClick() {
    if (query.trim() !== '') {
      onSearch(query)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <div className="flex gap-2 max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Busca un libro..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Buscar
      </button>
    </div>
  )
}

export default SearchBar