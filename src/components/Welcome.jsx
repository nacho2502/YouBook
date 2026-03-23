import { useState } from 'react'

function Welcome({ onSave }) {
  const [name, setName] = useState('')

  function handleSubmit() {
    if (name.trim() !== '') {
      onSave(name.trim())
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <p className="text-6xl mb-6">📚</p>
      <h1 className="text-3xl font-bold mb-2 text-center">Bienvenido a appLibros</h1>
      <p className="text-gray-400 text-center mb-10">Tu biblioteca personal. ¿Cómo te llamas?</p>
      <div className="flex gap-3 w-full max-w-sm">
        <input
          type="text"
          placeholder="Tu nombre..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Welcome