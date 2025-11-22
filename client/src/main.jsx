// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Inventory Management System</h1>
      <p>Frontend is working! 🎉</p>
      <p>Next step: Setting up the full application...</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)