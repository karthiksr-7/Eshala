import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/reset/send-otp', { email });
      setMessage('✅ OTP sent to your email');
      setSuccess(true);
      setStep(2);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Error sending OTP'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/reset/verify-otp', { email, otp });
      setMessage('✅ OTP verified');
      setSuccess(true);
      setStep(3);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Invalid OTP'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/reset/reset-password', { email, password });
      setMessage('✅ Password reset successful. Redirecting to login...');
      setSuccess(true);
      setStep(1);
      setEmail('');
      setOtp('');
      setPassword('');
      setTimeout(() => navigate('/'), 2000); // redirect after 2 seconds
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Reset failed'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔒 Reset Password</h2>
      {message && (
        <p style={{ ...styles.message, color: success ? '#16a34a' : '#dc2626' }}>
          {message}
        </p>
      )}

      {step === 1 && (
        <>
          <input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={sendOtp} style={styles.button} disabled={loading}>
            {loading ? '🔄 Sending OTP...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />
          <button onClick={verifyOtp} style={styles.button} disabled={loading}>
            {loading ? '🔄 Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={resetPassword} style={styles.button} disabled={loading}>
            {loading ? '🔄 Resetting...' : 'Reset Password'}
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#1e3a8a',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  message: {
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
};

export default ResetPassword;
