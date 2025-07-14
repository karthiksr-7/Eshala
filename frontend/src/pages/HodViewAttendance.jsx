import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HodViewAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lecturer-attendance/all');
        setAttendance(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch attendance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Group attendance by date
  const groupedByDate = attendance.reduce((acc, record) => {
    const dateKey = new Date(record.date).toISOString().split('T')[0]; // yyyy-mm-dd
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  const filteredDates = selectedDate
    ? dates.filter((d) => d === selectedDate)
    : dates;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Lecturer Attendance Records</h2>

      {/* 🔎 Date Filter */}
      <div style={styles.filterBox}>
        <label htmlFor="dateFilter" style={styles.filterLabel}>
          <strong>Filter by Date:</strong>
        </label>
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />
        {selectedDate && (
          <button onClick={() => setSelectedDate('')} style={styles.clearButton}>
            ❌ Clear
          </button>
        )}
      </div>

      {loading ? (
        <p style={styles.loading}>⏳ Loading attendance...</p>
      ) : filteredDates.length === 0 ? (
        <p style={styles.noData}>No attendance found for selected date.</p>
      ) : (
        filteredDates.map((date) => (
          <div key={date} style={styles.dateSection}>
            <h3 style={styles.dateTitle}>🗓️ {new Date(date).toLocaleDateString()}</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Lecturer</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Designation</th>
                </tr>
              </thead>
              <tbody>
                {groupedByDate[date].map((record) => (
                  <tr key={record._id} style={styles.row}>
                    <td style={styles.td}>{record.lecturer?.name || 'N/A'}</td>
                    <td style={styles.td}>{record.lecturer?.email || 'N/A'}</td>
                    <td style={styles.td}>{record.lecturer?.designation || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
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
  title: {
    fontSize: '1.8rem',
    color: '#1e3a8a',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  filterBox: {
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  filterLabel: {
    fontSize: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  clearButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#555',
  },
  noData: {
    textAlign: 'center',
    color: '#b91c1c',
    fontSize: '1rem',
  },
  dateSection: {
    marginBottom: '2rem',
  },
  dateTitle: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#2563eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  },
  tableHeadRow: {
    backgroundColor: '#f1f5f9',
  },
  th: {
    padding: '12px',
    borderBottom: '2px solid #e5e7eb',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
  },
  row: {
    backgroundColor: '#fff',
  },
};

export default HodViewAttendance;
