// frontend/src/TestConnection.tsx
import { useState, useEffect } from 'react'

function TestConnection() {
  const [status, setStatus] = useState<string>('Test en cours...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8080/')  
      .then(response => {
        if (response.ok) {
          setStatus(' Backend connecté !')
        } else {
          setStatus(' Backend répond mais avec erreur')
        }
      })
      .catch((err: Error) => {
        setError('Impossible de joindre le backend')
        console.error('Erreur:', err)
      })
  }, [])

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px' }}>
      <h3>Test de connexion Backend</h3>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}

export default TestConnection