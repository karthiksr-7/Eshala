import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentNotes() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setError('❌ Student not logged in');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/student/profile/${email}`)
      .then(res => {
        const sem = res.data.sem;
        return axios.get(`http://localhost:5000/api/notes/student/${sem}`);
      })
      .then(res => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch notes');
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Notes & Question Papers</h2>

      {loading && <div style={styles.loading}>Loading notes...</div>}
      {error && <div style={styles.error}>{error}</div>}

      {!loading && !error && notes.length === 0 && (
        <div style={styles.empty}>📭 No notes or question papers uploaded yet.</div>
      )}

      <div style={styles.grid}>
        {notes.map(note => (
          <div key={note._id} style={styles.card}>
            <h3 style={styles.title}>{note.title}</h3>
            <div style={styles.chip}>
              {note.subject?.name} ({note.subject?.code})
            </div>
            <p><strong>Uploaded by:</strong> {note.uploadedBy?.name}</p>
            <p style={styles.date}>
              <strong>Date:</strong> {new Date(note.uploadedAt).toLocaleDateString()}
            </p>
            <a
              href={`http://localhost:5000${note.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              style={styles.downloadLink}
            >
              📥 Download File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: '2rem',
    fontSize: '1.8rem',
  },
  loading: {
    textAlign: 'center',
    color: '#475569',
    fontSize: '1rem',
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1rem',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  chip: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '0.3rem 0.7rem',
    borderRadius: '999px',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  date: {
    color: '#6b7280',
    fontSize: '0.85rem',
  },
  downloadLink: {
    marginTop: '0.8rem',
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default StudentNotes;
