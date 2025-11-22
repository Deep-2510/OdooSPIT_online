import React, { useState } from 'react'
import authService from '../../services/auth'

const RegisterForm = ({ onSuccess = () => {} }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.register({ name, email, password })
      onSuccess(res)
    } catch (err) {
      alert(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
