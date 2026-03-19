function BookCard({ book }) {
  const coverId = book.cover_i
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null

  const author = book.author_name ? book.author_name[0] : 'Autor desconocido'
  const year = book.first_publish_year ?? 'Año desconocido'

  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex flex-col items-center justify-center p-3 text-center group-hover:scale-105 transition-transform duration-200">
          <span className="text-3xl">📚</span>
          <p className="text-xs text-gray-400 mt-2 line-clamp-3">{book.title}</p>
        </div>
      )}
      <div>
        <p className="text-sm font-semibold leading-tight line-clamp-2">{book.title}</p>
        <p className="text-xs text-gray-400 mt-1">{author}</p>
        <p className="text-xs text-gray-500">{year}</p>
      </div>
    </div>
  )
}

export default BookCard