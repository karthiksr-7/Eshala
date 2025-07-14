import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentInternalMarks() {
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setError('User not logged in');
      return;
    }

    axios.get(`http://localhost:5000/api/student/profile/${email}`)
      .then(res => {
        setProfile(res.data);
        return axios.get(`http://localhost:5000/api/subjects/by-sem/${res.data.sem}`);
      })
      .then(subjectRes => {
        setSubjects(subjectRes.data);
        const studentId = localStorage.getItem('studentId');
        return axios.get(`http://localhost:5000/api/internal-marks/student/${studentId}`);
      })
      .then(marksRes => {
        setMarks(marksRes.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load data');
      });
  }, []);

  const getMarksForSubject = (subjectId) => {
    const markEntry = marks.find(m => m.subject === subjectId);
    return markEntry ? markEntry.internalMarks : 'Not Assigned';
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📘 Internal Marks</h1>

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
                <th style={styles.th}>Internal Marks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan="3" style={styles.empty}>No subjects found</td></tr>
              ) : (
                subjects.map((subject, index) => (
                  <tr key={subject._id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{subject.name}</td>
                    <td style={styles.td}>{subject.code}</td>
                    <td style={styles.td}>
                      {getMarksForSubject(subject._id) === 'Not Assigned' ? (
                        <span style={styles.notAssigned}>Not Assigned</span>
                      ) : (
                        <span style={styles.marks}>{getMarksForSubject(subject._id)}</span>
                      )}
                    </td>
                  </tr>
                ))
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
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    fontSize: '2rem',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflowX: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
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
  marks: {
    color: '#059669',
    fontWeight: '600',
  },
  empty: {
    padding: '1rem',
    textAlign: 'center',
    color: '#6b7280',
  },
};

export default StudentInternalMarks;
