import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HodManageLeave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lecturer-leave/all');
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to fetch leaves:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/lecturer-leave/update-status/${leaveId}`, { status: newStatus });
      setMessage(res.data.message);
      // Refresh list
      setLeaves((prev) =>
        prev.map((l) => (l._id === leaveId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error('Status update error:', err);
      setMessage('Error updating status');
    }
  };

  return (
    <div style={styles.container}>
      <h2>📋 Manage Lecturer Leaves</h2>
      {message && <p style={styles.message}>{message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Lecturer</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td style={styles.td}>{leave.lecturer?.name || 'Unknown'}</td>
                <td style={styles.td}>{new Date(leave.fromDate).toLocaleDateString()}</td>
                <td style={styles.td}>{new Date(leave.toDate).toLocaleDateString()}</td>
                <td style={styles.td}>{leave.reason}</td>
                <td style={styles.td}>{leave.status}</td>
                <td style={styles.td}>
                  {leave.status === 'Pending' && (
                    <>
                      <button style={styles.approveBtn} onClick={() => handleStatusChange(leave._id, 'Approved')}>Approve</button>
                      <button style={styles.rejectBtn} onClick={() => handleStatusChange(leave._id, 'Rejected')}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Segoe UI' },
  message: { color: 'green', fontWeight: 'bold', marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: {
    backgroundColor: '#f3f4f6',
    padding: '0.5rem',
    textAlign: 'left',
    border: '1px solid #ccc',
  },
  td: { padding: '0.5rem', border: '1px solid #ccc' },
  approveBtn: {
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '0.3rem 0.6rem',
    marginRight: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectBtn: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default HodManageLeave;
