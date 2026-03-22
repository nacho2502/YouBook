import { useState, useEffect } from 'react'

function useLibrary() {
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('appLibros_library')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    const booksSinSubjects = library.filter(b => !b.subjects || b.subjects.length === 0)
    if (booksSinSubjects.length === 0) return

    async function migrateSubjects() {
      const updated = await Promise.all(
        library.map(async (book) => {
          if (book.subjects && book.subjects.length > 0) return book
          try {
            const res = await fetch(`https://openlibrary.org${book.key}.json`)
            const data = await res.json()
            const subjects = data.subjects ? data.subjects.slice(0, 8) : []
            return { ...book, subjects }
          } catch {
            return { ...book, subjects: [] }
          }
        })
      )
      localStorage.setItem('appLibros_library', JSON.stringify(updated))
      setLibrary(updated)
    }

    migrateSubjects()
  }, [])

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
      subjects: book.subject ? book.subject.slice(0, 8) : [],
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