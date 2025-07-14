import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LecturerAttendance() {
  const [marked, setMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const userRole = localStorage.getItem('userRole');
  const lecturerId = userRole === 'lecturer' ? localStorage.getItem('lecturerId') : null;

  useEffect(() => {
    const checkAttendance = async () => {
      if (!lecturerId) {
        setError('⚠️ Lecturer not logged in.');
        setChecking(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/lecturer-attendance/status/${lecturerId}`);
        setMarked(res.data.marked);
      } catch (err) {
        console.error('❌ Error checking attendance:', err);
        setError('❌ Failed to check attendance status.');
      } finally {
        setChecking(false);
      }
    };

    checkAttendance();
  }, [lecturerId]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!lecturerId) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/lecturer-attendance/history/${lecturerId}`);
        setHistory(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch attendance history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [lecturerId]);

  const handleMark = async () => {
    if (!lecturerId) {
      alert('Lecturer ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/lecturer-attendance/mark', {
        lecturerId,
      });
      alert(res.data.message);
      setMarked(true);

      // Refresh history
      const historyRes = await axios.get(`http://localhost:5000/api/lecturer-attendance/history/${lecturerId}`);
      setHistory(historyRes.data);
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Failed to mark attendance';
      alert(msg);
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current month present count
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const presentThisMonth = history.filter(record => {
    const date = new Date(record.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📅 Lecturer Daily Attendance</h2>

      {checking ? (
        <p style={styles.status}>⏳ Checking attendance status...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : marked ? (
        <p style={styles.success}>✅ Attendance already marked for today</p>
      ) : (
        <button
          onClick={handleMark}
          style={loading ? styles.buttonDisabled : styles.button}
          disabled={loading}
        >
          {loading ? '⏳ Marking...' : 'Mark Today\'s Attendance'}
        </button>
      )}

      <hr style={styles.hr} />

      <h3 style={styles.subheading}>📖 Attendance History</h3>

      {historyLoading ? (
        <p style={styles.status}>⏳ Loading history...</p>
      ) : history.length === 0 ? (
        <p style={styles.noData}>No attendance records found.</p>
      ) : (
        <>
          <p style={styles.monthSummary}>
            ✅ Present Days in {new Date().toLocaleString('default', { month: 'long' })}:{' '}
            <strong>{presentThisMonth.length}</strong>
          </p>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((record, index) => (
                  <tr key={record._id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{new Date(record.date).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: '26px',
    marginBottom: '1.5rem',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '20px',
    margin: '1.5rem 0 0.5rem',
    color: '#0f172a',
  },
  monthSummary: {
    fontSize: '16px',
    color: '#334155',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#aaa',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
  },
  success: {
    fontSize: '18px',
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    fontSize: '16px',
    color: 'red',
    marginBottom: '1rem',
  },
  status: {
    fontSize: '16px',
    color: '#555',
  },
  noData: {
    color: '#6b7280',
    fontSize: '16px',
  },
  table: {
    marginTop: '1rem',
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    padding: '12px',
    backgroundColor: '#e2e8f0',
    borderBottom: '2px solid #cbd5e1',
    textAlign: 'left',
    fontSize: '15px',
    color: '#1e293b',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '15px',
    color: '#334155',
  },
  hr: {
    margin: '2rem auto 1rem',
    width: '60%',
    borderTop: '1px solid #e5e7eb',
  },
};

export default LecturerAttendance;
