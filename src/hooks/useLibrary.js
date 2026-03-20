import { useState } from 'react'

function useLibrary() {
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('appLibros_library')
    return saved ? JSON.parse(saved) : []
  })

  function saveToStorage(newLibrary) {
    localStorage.setItem('appLibros_library', JSON.stringify(newLibrary))
    setLibrary(newLibrary)
  }

  function addBook(book, status) {
    const exists = library.find(b => b.key === book.key)
    if (exists) return
    const newBook = {
      key: book.key,
      title: book.title,
      author_name: book.author_name,
      cover_i: book.cover_i,
      first_publish_year: book.first_publish_year,
      status,
      rating: null,
      addedAt: Date.now()
    }
    saveToStorage([...library, newBook])
  }

  function updateStatus(key, status) {
    const updated = library.map(b =>
      b.key === key ? { ...b, status } : b
    )
    saveToStorage(updated)
  }

  function updateRating(key, rating) {
    const updated = library.map(b =>
      b.key === key ? { ...b, rating } : b
    )
    saveToStorage(updated)
  }

  function removeBook(key) {
    saveToStorage(library.filter(b => b.key !== key))
  }

  function getBook(key) {
    return library.find(b => b.key === key) ?? null
  }

  return { library, addBook, updateStatus, updateRating, removeBook, getBook }
}

export default useLibrary