import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LecturerApplyLeave() {
  const lecturerId = localStorage.getItem('lecturerId');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lecturer-leave/my-leaves/${lecturerId}`);
        setLeaves(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch leave history:', err);
      }
    };

    if (lecturerId) {
      fetchLeaves();
    }
  }, [lecturerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason) {
      setMessage('❌ Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/lecturer-leave/apply', {
        lecturerId,
        fromDate,
        toDate,
        reason,
      });
      setMessage(res.data.message || '✅ Leave applied');
      setFromDate('');
      setToDate('');
      setReason('');

      // Refresh leave list
      const updated = await axios.get(`http://localhost:5000/api/lecturer-leave/my-leaves/${lecturerId}`);
      setLeaves(updated.data);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error applying for leave');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Apply for Leave</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <button type="submit" style={styles.button}>Submit Leave</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <h3 style={{ marginTop: '2rem' }}>📋 Leave History</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td style={styles.td}>{new Date(leave.fromDate).toLocaleDateString()}</td>
                <td style={styles.td}>{new Date(leave.toDate).toLocaleDateString()}</td>
                <td style={styles.td}>{leave.reason}</td>
                <td style={{ ...styles.td, color: getStatusColor(leave.status), fontWeight: 'bold' }}>
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Approved':
      return 'green';
    case 'Rejected':
      return 'red';
    default:
      return 'orange';
  }
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI',
    maxWidth: '900px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '1.8rem',
    color: '#1e40af',
    marginBottom: '1.5rem',
  },
  form: {
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.3rem',
    fontWeight: '600',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    minHeight: '80px',
  },
  button: {
    marginTop: '1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.6rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  },
  message: {
    marginTop: '1rem',
    fontWeight: 'bold',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #10b981',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    border: '1px solid #e5e7eb',
  },
  th: {
    backgroundColor: '#f3f4f6',
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.95rem',
  },
};

export default LecturerApplyLeave;
