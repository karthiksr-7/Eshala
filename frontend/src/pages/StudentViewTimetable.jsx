import React, { useEffect, useState } from 'react';
import axios from 'axios';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = ['8:40 - 9:40', '9:40 - 10:40', '11:00 - 12:00', '12:00 - 1:00', '2:00 - 3:00', '3:00 - 4:00'];

function StudentViewTimetable() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [sem, setSem] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const studentRes = await axios.get(`http://localhost:5000/api/student/profile/${email}`);
        const semester = studentRes.data.sem;
        setSem(semester);

        const timetableRes = await axios.get(`http://localhost:5000/api/timetable/${semester}`);
        setEntries(timetableRes.data.entries);
      } catch (err) {
        setError('Time Table not Assigned ');
      }
    };

    fetchTimetable();
  }, []);

  const getCellContent = (day, periodIndex) => {
    const entry = entries.find(e => e.day === day && e.periodIndex === periodIndex);
    return entry ? `${entry.subject.name} (${entry.subject.code})` : '';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Semester {sem} Timetable</h2>

      {error && <div style={styles.error}>{error}</div>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Day / Period</th>
            {periods.map((p, i) => (
              <th style={styles.th} key={i}>{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, i) => (
            <tr key={i}>
              <td style={styles.tdBold}>{day}</td>
              {periods.map((_, periodIndex) => (
                <td style={styles.td} key={periodIndex}>
                  {getCellContent(day, periodIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: '2rem',
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '1rem auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  },
  th: {
    border: '1px solid #e2e8f0',
    padding: '12px',
    textAlign: 'center',
    fontSize: '0.95rem',
    backgroundColor: '#1e40af',
    color: 'white',
  },
  td: {
    border: '1px solid #e2e8f0',
    padding: '12px',
    textAlign: 'center',
    fontSize: '0.95rem',
    backgroundColor: '#ffffff',
  },
  tdBold: {
    border: '1px solid #e2e8f0',
    padding: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
  },
};

export default StudentViewTimetable;
