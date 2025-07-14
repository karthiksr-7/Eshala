import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentResults() {
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const studentId = localStorage.getItem('studentId');

    if (!email || !studentId) {
      setError('User not logged in');
      return;
    }

    axios.get(`http://localhost:5000/api/student/profile/${email}`)
      .then(res => {
        setProfile(res.data);
        return axios.get(`http://localhost:5000/api/results/student/${studentId}`);
      })
      .then(resultRes => {
        setResults(resultRes.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load student results');
      });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>🎓 Semester Results</h1>

        {error && <div style={styles.error}>{error}</div>}

        {profile && (
          <div style={styles.profileCard}>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>USN:</strong> {profile.usn}</p>
            <p><strong>Semester:</strong> {profile.sem}</p>
          </div>
        )}

        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
  <tr style={styles.headerRow}>
    <th style={styles.th}>Subject</th>
    <th style={styles.th}>Code</th>
    <th style={styles.th}>Internal</th>
    <th style={styles.th}>External</th>
    <th style={styles.th}>Total</th>
    <th style={styles.th}>Result</th>
  </tr>
</thead>
<tbody>
  {results.length === 0 ? (
    <tr><td colSpan="6" style={styles.empty}>No marks available</td></tr>
  ) : (
    results.map((res, idx) => {
      const internal = res.internalMarks ?? 0;
      const external = res.externalMarks ?? null;
      const total = external != null ? internal + external : null;

      const resultStatus = external == null
        ? 'Pending'
        : total >= 20
          ? 'Pass'
          : 'Fail';

      const resultStyle = resultStatus === 'Pass'
        ? styles.pass
        : resultStatus === 'Fail'
          ? styles.fail
          : styles.pending;

      return (
        <tr key={res._id} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
          <td style={styles.td}>{res.subject?.name}</td>
          <td style={styles.td}>{res.subject?.code}</td>
          <td style={styles.td}>{internal}</td>
          <td style={styles.td}>
            {external != null
              ? <span style={styles.external}>{external}</span>
              : <span style={styles.notAssigned}>Not Assigned</span>}
          </td>
          <td style={styles.td}>{total != null ? <strong>{total}</strong> : '-'}</td>
          <td style={{ ...styles.td, ...resultStyle }}>{resultStatus}</td>
        </tr>
      );
    })
  )}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '2rem',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflowX: 'auto',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '1rem',
  },
  td: {
    padding: '0.9rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.95rem',
    color: '#111827',
  },
  rowEven: {
    backgroundColor: '#f9fafb',
  },
  rowOdd: {
    backgroundColor: '#ffffff',
  },
  notAssigned: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  external: {
    color: '#0f766e',
    fontWeight: '600',
  },
  empty: {
    padding: '1rem',
    textAlign: 'center',
    color: '#6b7280',
  },
};

export default StudentResults;
