import { useState } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  function handleClick() {
    if (query.trim() !== '') {
      onSearch(query)
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Busca un libro..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleClick}>Buscar</button>
    </div>
  )
}


export default SearchBar