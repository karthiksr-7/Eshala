import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LecturerLeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/leave/all')
      .then(res => setLeaves(res.data))
      .catch(err => {
        console.error('Failed to fetch leaves');
        setMessage('❌ Could not load leave data');
      });
  }, []);

  const updateStatus = async (leaveId, status) => {
    try {
      await axios.post('http://localhost:5000/api/leave/update-status', { leaveId, status });
      setLeaves(leaves.map(leave => leave._id === leaveId ? { ...leave, status } : leave));
      setMessage(`✅ Leave ${status}`);
    } catch {
      setMessage('❌ Error updating status');
    }
  };

  const statusBadge = (status) => {
    const color = {
      approved: '#16a34a',
      rejected: '#dc2626',
      pending: '#f59e0b',
    };
    return {
      backgroundColor: color[status] || '#9ca3af',
      color: '#fff',
      padding: '0.4rem 0.7rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      textTransform: 'capitalize',
      fontWeight: 'bold',
    };
  };

  const buttonStyle = {
    padding: '0.4rem 0.8rem',
    border: 'none',
    borderRadius: '6px',
    marginRight: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📩 Student Leave Applications</h2>
      {message && <p style={styles.message}>{message}</p>}

      {leaves.length === 0 ? (
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>No leave applications available.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>USN</th>
                <th style={styles.th}>Semester</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, idx) => (
                <tr key={leave._id} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.td}>{leave.student?.name}</td>
                  <td style={styles.td}>{leave.student?.usn}</td>
                  <td style={styles.td}>{leave.student?.sem}</td>
                  <td style={styles.td}>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td style={styles.td}>{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td style={styles.td}>{leave.reason}</td>
                  <td style={styles.td}>
                    <span style={statusBadge(leave.status)}>{leave.status}</span>
                  </td>
                  <td style={styles.td}>
                    {leave.status === 'pending' && (
                      <>
                        <button
                          style={{ ...buttonStyle, backgroundColor: '#22c55e', color: 'white' }}
                          onClick={() => updateStatus(leave._id, 'approved')}
                        >
                          ✅ Approve
                        </button>
                        <button
                          style={{ ...buttonStyle, backgroundColor: '#ef4444', color: 'white' }}
                          onClick={() => updateStatus(leave._id, 'rejected')}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    fontSize: '1.6rem',
    marginBottom: '1.5rem',
    color: '#1e3a8a',
  },
  message: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'green',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '0.75rem',
    fontSize: '0.95rem',
  },
  td: {
    padding: '0.75rem',
    textAlign: 'left',
    fontSize: '0.9rem',
    color: '#334155',
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f1f5f9',
  },
};

export default LecturerLeaveApproval;
