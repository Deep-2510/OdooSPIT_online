import React, { useState } from 'react';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      alert('If this email exists, a reset link was sent.');
    } catch (err) {
      alert(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Forgot password</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Sending...' : 'Send reset link'}</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;