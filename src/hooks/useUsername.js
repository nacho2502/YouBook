import { useState } from 'react'

function useUsername() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('appLibros_username') ?? ''
  })

  function saveUsername(name) {
    localStorage.setItem('appLibros_username', name)
    setUsername(name)
  }

  return { username, saveUsername }
}

export default useUsername