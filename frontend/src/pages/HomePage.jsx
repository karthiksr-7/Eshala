import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [activeLogin, setActiveLogin] = useState(''); // '', 'Student', 'Lecturer', 'HOD'

  const handleGetStarted = () => setActiveLogin('Student');
  const handleBack = () => setActiveLogin('');

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🎓 Eshala College Portal</h1>
        <p style={styles.subtext}>Your all-in-one campus management system</p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          {activeLogin === '' ? (
            <>
              <h2 style={styles.title}>Welcome to Eshala!</h2>
              <p style={styles.description}>
                A complete system for managing students, staff, and academics.
              </p>

              <button style={styles.getStarted} onClick={handleGetStarted}>
                Get Started
              </button>
            </>
          ) : (
            <>
              <h2 style={styles.title}>{activeLogin} Login</h2>
              <LoginForm role={activeLogin} />
              <div style={styles.switchButtons}>
                {['Student', 'Lecturer', 'HOD'].map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveLogin(role)}
                    style={styles.switchBtn}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button onClick={handleBack} style={styles.backButton}>⬅ Back</button>
            </>
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Eshala College. All rights reserved.
      </footer>
    </div>
  );
}

function LoginForm({ role }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
        role: role.toLowerCase(),
      });

      if (res.status === 200 && res.data.user) {
        const { id, name, email } = res.data.user;

        localStorage.setItem('userId', id);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role.toLowerCase());

        if (role === 'Lecturer') {
          const profileRes = await axios.get(`http://localhost:5000/api/lecturer/profile/${email}`);
          if (profileRes.data?._id) {
            localStorage.setItem('lecturerId', profileRes.data._id);
          }
        }

        if (role === 'HOD') navigate('/hod-dashboard');
        else if (role === 'Lecturer') navigate('/lecturer-dashboard');
        else if (role === 'Student') navigate('/student-dashboard');
      }
    } catch (err) {
      alert('❌ Login failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const handleForgotPassword = () => {
    navigate(`/reset-password`);
  };

  return (
    <div style={styles.loginCard}>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.loginButton}>
        Login as {role}
      </button>
      <p style={styles.forgotText} onClick={handleForgotPassword}>
        Forgot Password?
      </p>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to bottom right, #f0f4f8, #dbeafe)',
  },
  header: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#1e40af',
    color: '#fff',
  },
  logo: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 700,
  },
  subtext: {
    marginTop: '0.5rem',
    fontSize: '1rem',
    color: '#c7d2fe',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
  },
  title: {
    fontSize: '1.8rem',
    color: '#1e3a8a',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    color: '#4b5563',
    marginBottom: '2rem',
  },
  getStarted: {
    marginTop: '2rem',
    padding: '0.75rem 2rem',
    backgroundColor: '#1d4ed8',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  switchButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  switchBtn: {
    backgroundColor: '#e0e7ff',
    color: '#1e3a8a',
    padding: '0.5rem 1rem',
    border: '1px solid #c7d2fe',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
  backButton: {
    marginTop: '1rem',
    backgroundColor: '#f87171',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  loginCard: {
    marginTop: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    borderRadius: '0.4rem',
    border: '1px solid #ccc',
  },
  loginButton: {
    marginTop: '1rem',
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1e40af',
    color: '#fff',
    border: 'none',
    borderRadius: '0.4rem',
    cursor: 'pointer',
  },
  forgotText: {
    marginTop: '0.8rem',
    fontSize: '0.9rem',
    color: '#2563eb',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.9rem',
    color: '#6b7280',
  },
};

export default HomePage;
