import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lecturer/list');
        setLecturers(res.data);
        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch lecturers:', error.message);
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📚 Registered Lecturers</h2>
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Designation</th>
                <th style={styles.th}>PhD</th>
                <th style={styles.th}>Experience</th>
                <th style={styles.th}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map((l, index) => (
                <tr key={l._id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.td}>{l.name}</td>
                  <td style={styles.td}>{l.email}</td>
                  <td style={styles.td}>{l.designation}</td>
                  <td style={styles.td}>{l.isPhD ? 'Yes' : 'No'}</td>
                  <td style={styles.td}>
                    {l.experience === 'fresher' ? 'Fresher' : `${l.experience} years`}
                  </td>
                  <td style={styles.td}>{new Date(l.joinedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '2rem',
    color: '#1e3a8a',
  },
  loading: {
    textAlign: 'center',
    color: '#555',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px',
  },
  th: {
    backgroundColor: '#dbeafe',
    color: '#1e3a8a',
    fontWeight: '600',
    padding: '12px',
    border: '1px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    border: '1px solid #ddd',
    color: '#333',
  },
  evenRow: {
    backgroundColor: '#f1f5f9',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
};

export default LecturerList;
