import React, { useState } from 'react'
import authService from '../../services/auth'

const ForgotPassword = ({ onSuccess = () => {} }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword({ email })
      onSuccess()
      alert('If the email exists, a reset link has been sent.')
    } catch (err) {
      alert(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </div>
    </form>
  )
}

export default ForgotPassword
