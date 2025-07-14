import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaChalkboard,
  FaClipboardCheck,
  FaFileUpload,
  FaEnvelope,
  FaPenFancy,
  FaClipboardList
} from 'react-icons/fa';

const features = [
  { title: 'Mark Student Attendance', icon: <FaClipboardList />, route: '/lecturer/student-attendance' },
  { title: 'My Classes', icon: <FaChalkboard />, route: '/lecturer/classes' },
  { title: 'Mark Attendance', icon: <FaClipboardCheck />, route: '/lecturer/attendance' },
  { title: 'Upload Notes & QP', icon: <FaFileUpload />, route: '/lecturer/upload' },
  { title: 'Upload Internals Marks', icon: <FaPenFancy />, route: '/lecturer/internals' },
  { title: 'Apply Leave', icon: <FaEnvelope />, route: '/lecturer/leave' },
   { title: 'View Leave', icon: <FaEnvelope />, route: '/lecturer/leave-view' },
];

function LecturerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const rawEmail = localStorage.getItem('userEmail');
      const email = rawEmail?.trim().toLowerCase();
      if (!email) {
        setError('No user email found. Please log in again.');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/lecturer/profile/${email}`);
        setProfile(res.data);

        if (res.data._id && !localStorage.getItem('lecturerId')) {
          localStorage.setItem('lecturerId', res.data._id);
        }
      } catch (err) {
        console.error('❌ Failed to fetch lecturer profile:', err);
        setError('⚠️ Failed to load profile. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={styles.page}>
     <header style={styles.header}>
  <div style={styles.headerTop}>
    <div style={styles.headerButtons}>
      <button style={styles.headerButton} onClick={() => navigate('/reset-password')}>
        🔒 Reset Password
      </button>
      <button
        style={{ ...styles.headerButton, backgroundColor: '#ef4444' }}
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        🚪 Logout
      </button>
    </div>
  </div>
  <div style={styles.headerText}>
    <h1 style={styles.heading}>👨‍🏫 Lecturer Dashboard</h1>
    <p style={styles.subheading}>Manage your teaching and academic tasks efficiently.</p>
  </div>
</header>


      {error && <div style={styles.errorBox}>{error}</div>}
      {!profile && !error && <div style={styles.loadingText}>Loading profile...</div>}

      {profile && (
        <section style={styles.profileCard}>
          <h2 style={styles.profileHeading}>👤 My Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Designation:</strong> {profile.designation}</p>
          <p><strong>PhD:</strong> {profile.isPhD ? 'Completed' : 'Not Completed'}</p>
          <p><strong>Experience:</strong> {profile.experience === 'fresher' ? 'Fresher' : `${profile.experience} years`}</p>
          <p><strong>Joined:</strong> {new Date(profile.joinedDate).toLocaleDateString()}</p>
        </section>
      )}

      <main style={styles.grid}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => navigate(feature.route)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={styles.icon}>{feature.icon}</div>
            <p style={styles.cardText}>{feature.title}</p>
          </div>
        ))}
      </main>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Eshala College • All rights reserved.
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #e0f2fe, #f8fafc)',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '2rem',
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  headerText: {
    textAlign: 'center',
    width: '100%',
    marginTop: '1rem',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  subheading: {
    fontSize: '1rem',
    color: '#c7d2fe',
    marginBottom: '1rem',
  },
  headerButtons: {
    position: 'absolute',
    top: '1rem',
    right: '2rem',
    display: 'flex',
    gap: '0.8rem',
  },
  headerButton: {
    backgroundColor: '#2563eb',
    border: 'none',
    color: '#fff',
    padding: '0.5rem 0.9rem',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'background-color 0.3s',
  },
  errorBox: {
    margin: '1rem auto',
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    padding: '1rem',
    borderRadius: '0.5rem',
    maxWidth: '600px',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    padding: '1rem',
    color: '#475569',
    fontSize: '1rem',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    margin: '1.5rem auto',
    padding: '1.5rem 2rem',
    borderRadius: '1rem',
    width: '90%',
    maxWidth: '700px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    color: '#1e293b',
    lineHeight: '1.6rem',
  },
  profileHeading: {
    fontSize: '1.4rem',
    marginBottom: '1rem',
    color: '#1d4ed8',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.2rem',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.5rem 1rem',
    borderRadius: '0.8rem',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    height: '130px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '1.8rem',
    color: '#1d4ed8',
    marginBottom: '0.6rem',
  },
  cardText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.85rem',
    backgroundColor: '#f1f5f9',
    color: '#6b7280',
  },
};


export default LecturerDashboard;
