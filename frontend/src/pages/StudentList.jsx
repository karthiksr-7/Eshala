import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/student/list');
        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch students', err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Registered Students</h2>
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>USN</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>DOB</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Degree</th>
                <th style={styles.th}>Percentage</th>
                <th style={styles.th}>Year Passed</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Semester</th>
              </tr>
            </thead>
            <tbody>
  {students.map((s, index) => (
    <tr key={s._id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
       <td style={styles.td}>{s.usn}</td>
      <td style={styles.td}>{s.name}</td>
      <td style={styles.td}>{new Date(s.dob).toLocaleDateString()}</td>
      <td style={styles.td}>{s.email}</td>
      <td style={styles.td}>{s.phoneNumber}</td>
      <td style={styles.td}>{s.previousDegree}</td>
      <td style={styles.td}>{s.percentage}%</td>
      <td style={styles.td}>{s.yearPassed}</td>
      <td style={styles.td}>{s.course}</td> {/* ✅ from DB */}
      <td style={styles.td}>{s.sem}</td>     {/* ✅ from DB */}
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
    minWidth: '1000px',
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

export default StudentList;
