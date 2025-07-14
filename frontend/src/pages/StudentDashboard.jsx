import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaBookOpen,
  FaFileAlt,
  FaEnvelopeOpen,
  FaFileUpload,
  FaClipboardList,
  FaSignOutAlt,
  FaChartBar,
} from 'react-icons/fa';

const features = [
  { title: 'View Timetable', icon: <FaCalendarAlt />, route: '/student/timetable' },
  { title: 'Internal Marks', icon: <FaBookOpen />, route: '/student/internalmarks' },
  { title: 'Semester Result', icon: <FaFileAlt />, route: '/student/sem-result' },
  { title: 'View Attendance', icon: <FaChartBar />, route: '/student/attendance' },
  { title: 'Leave Letter', icon: <FaEnvelopeOpen />, route: '/student/leave' },
  { title: 'Notes & Question Papers', icon: <FaFileUpload />, route: '/student/notes' },
  { title: 'View Hall Ticket', icon: <FaClipboardList />, route: '/student/hall-ticket' },
];

function StudentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) return setError('User not logged in');

    axios.get(`http://localhost:5000/api/student/profile/${email}`)
      .then(res => {
        setProfile(res.data);
        localStorage.setItem('studentId', res.data._id);
        return axios.get(`http://localhost:5000/api/subjects/by-sem/${res.data.sem}`);
      })
      .then(subRes => {
        setSubjects(subRes.data);
      })
      .catch(() => setError('Failed to load data'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
  <h1 style={styles.title}>🎓 Student Dashboard</h1>
  <div style={styles.headerButtons}>
    <button onClick={() => navigate('/reset-password')} style={{ ...styles.headerBtn, backgroundColor: '#22c55e' }}>
      🔐 Reset Password
    </button>
    <button onClick={handleLogout} style={{ ...styles.headerBtn, backgroundColor: '#dc2626' }}>
      <FaSignOutAlt /> Logout
    </button>
  </div>
</header>


      {error && <div style={styles.error}>{error}</div>}

      {profile && (
        <div style={styles.infoWrapper}>
          <section style={styles.infoCard}>
            <h2 style={styles.cardTitle}>👤 Student Info</h2>
            <div style={styles.infoRow}><strong>Name:</strong> {profile.name}</div>
            <div style={styles.infoRow}><strong>USN:</strong> {profile.usn}</div>
            <div style={styles.infoRow}><strong>Semester:</strong> {profile.sem}</div>
            <div style={styles.infoRow}><strong>Mentor:</strong> {profile.mentor?.name || 'Not Assigned'}</div>
          </section>

          <section style={styles.infoCard}>
            <h2 style={styles.cardTitle}>📘 Subjects (Sem {profile.sem})</h2>
            <ul style={styles.subjectList}>
              {subjects.map((sub, i) => (
                <li key={i} style={styles.subjectItem}>
                  {sub.name} ({sub.code}) {sub.isLab ? '- Lab' : ''}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <section style={styles.grid}>
        {features.map((f, i) => (
          <div key={i} style={styles.card} onClick={() => navigate(f.route)}>
            <div style={styles.icon}>{f.icon}</div>
            <p style={styles.cardText}>{f.title}</p>
          </div>
        ))}
      </section>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Eshala College
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    padding: '1rem',
    background: '#f1f5f9',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
  },
  logout: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: '1rem',
    margin: '1rem 0',
    borderRadius: '8px',
    textAlign: 'center',
  },
  infoWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: '1 1 45%',
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    minWidth: '280px',
  },
  cardTitle: {
    marginBottom: '1rem',
    color: '#1e3a8a',
  },
  infoRow: {
    marginBottom: '0.5rem',
    color: '#374151',
  },
  subjectList: {
    listStyleType: 'disc',
    paddingLeft: '1.2rem',
    color: '#374151',
  },
  subjectItem: {
    marginBottom: '0.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '1rem',
    marginTop: '2rem',
  },
  card: {
    background: 'white',
    padding: '1.2rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
  },
  icon: {
    fontSize: '1.6rem',
    color: '#2563eb',
    marginBottom: '0.5rem',
  },
  cardText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    padding: '1rem',
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  headerButtons: {
  display: 'flex',
  gap: '0.8rem',
  alignItems: 'center',
},

headerBtn: {
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'background-color 0.2s ease',
},

};

export default StudentDashboard;
