import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaChalkboardTeacher, FaUserCheck, FaCalendarAlt,
  FaClipboardList, FaBullhorn, FaChartBar, FaUserClock,
  FaEnvelopeOpenText, FaIdBadge, FaPlus
} from 'react-icons/fa';

const features = [
  { title: 'List of Students', icon: <FaUsers />, route: '/hod/students' },
  { title: 'List of Lecturers', icon: <FaChalkboardTeacher />, route: '/hod/lecturers' },
  { title: 'Assign Mentors', icon: <FaUserCheck />, route: '/hod/assign-mentors' },
  { title: 'Publish Timetable', icon: <FaCalendarAlt />, route: '/hod/timetable' },
  { title: 'Arrange Internals', icon: <FaClipboardList />, route: '/hod/internals' },
  { title: 'Publish Results', icon: <FaBullhorn />, route: '/hod/results' },
  { title: 'Student Attendance', icon: <FaChartBar />, route: '/hod/attendance/students' },
  { title: 'Lecturer Attendance', icon: <FaUserClock />, route: '/hod/attendance/lecturers' },
  { title: 'View Leave Letters', icon: <FaEnvelopeOpenText />, route: '/hod/leave-letters' },
  { title: 'Generate Hall Tickets', icon: <FaIdBadge />, route: '/hod/halltickets' },
];

function HODDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <header style={styles.header}>
  <div style={styles.headerTop}>
    <div>
      <h1 style={styles.heading}>🎓 HOD Dashboard</h1>
      <p style={styles.subheading}>Manage all your academic and administrative tasks from one place.</p>
    </div>

    <div style={styles.headerActions}>
      <button
        style={{ ...styles.headerBtn, backgroundColor: '#22c55e' }}
        onClick={() => navigate('/reset-password')}
      >
        🔐 Reset Password
      </button>
      <button
        style={{ ...styles.headerBtn, backgroundColor: '#ef4444' }}
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        🚪 Logout
      </button>
    </div>
  </div>

  <div style={styles.actions}>
    <button style={styles.actionBtn} onClick={() => navigate('/register-student')}>
      <FaPlus style={{ marginRight: '8px' }} /> Add Student
    </button>
    <button style={styles.actionBtn} onClick={() => navigate('/register-lecturer')}>
      <FaPlus style={{ marginRight: '8px' }} /> Add Lecturer
    </button>
  </div>
</header>


      <main style={styles.grid}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => navigate(feature.route)}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
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
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '0.3rem',
  },
  subheading: {
    fontSize: '1rem',
    color: '#c7d2fe',
  },
  headerActions: {
    display: 'flex',
    gap: '0.7rem',
    marginTop: '0.3rem',
  },
  headerBtn: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'opacity 0.3s',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '1.5rem',
  },
  actionBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '0.6rem 1.4rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.2s',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  icon: {
    fontSize: '2.5rem',
    color: '#1d4ed8',
    marginBottom: '1rem',
  },
  cardText: {
    fontSize: '1.1rem',
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


export default HODDashboard;
