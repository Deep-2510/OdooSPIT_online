import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = await authService.register({ email, password, name });
      login(payload.token, payload.user);
      navigate('/');
    } catch (err) {
      alert(err.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Create account</h2>
      <form onSubmit={submit}>
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
          <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Creating...' : 'Create account'}</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
