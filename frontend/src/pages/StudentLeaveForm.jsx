import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentLeaveForm() {
  const [form, setForm] = useState({ reason: '', fromDate: '', toDate: '' });
  const [message, setMessage] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) return;
    axios.get(`http://localhost:5000/api/leave/student/${studentId}`)
      .then(res => setLeaveHistory(res.data))
      .catch(err => console.error(err));
  }, [studentId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!studentId) return setMessage('Student not logged in');

    try {
      const res = await axios.post('http://localhost:5000/api/leave/submit', { ...form, studentId });
      setMessage(res.data.message);
      setForm({ reason: '', fromDate: '', toDate: '' });
      const updated = await axios.get(`http://localhost:5000/api/leave/student/${studentId}`);
      setLeaveHistory(updated.data);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit leave');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Submit Leave Letter</h2>
      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Reason:</label>
        <textarea name="reason" value={form.reason} onChange={handleChange} required style={styles.textarea} />

        <label style={styles.label}>From Date:</label>
        <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>To Date:</label>
        <input type="date" name="toDate" value={form.toDate} onChange={handleChange} required style={styles.input} />

        <button type="submit" style={styles.button}>Submit</button>
      </form>

      <h3 style={{ marginTop: '2.5rem', color: '#1e3a8a' }}>📅 Leave History</h3>
      <div style={styles.historyContainer}>
        {leaveHistory.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>No leave applications found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Reason</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, idx) => (
                <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td>{leave.reason}</td>
                  <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{ ...styles.status, ...statusColor(leave.status) }}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const statusColor = (status) => {
  switch (status) {
    case 'approved': return { backgroundColor: '#22c55e' };
    case 'rejected': return { backgroundColor: '#ef4444' };
    default: return { backgroundColor: '#facc15', color: '#000' };
  }
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  heading: {
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: '1.5rem',
  },
  message: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#334155',
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
  },
  textarea: {
    padding: '0.5rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    minHeight: '80px',
  },
  button: {
    padding: '0.7rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  historyContainer: {
    marginTop: '1rem',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#e2e8f0',
    textAlign: 'left',
  },
  evenRow: {
    backgroundColor: '#f9fafb',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  status: {
    display: 'inline-block',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    textTransform: 'capitalize',
  }
};

export default StudentLeaveForm;
