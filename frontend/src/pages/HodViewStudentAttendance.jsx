import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HodViewStudentAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/student-attendance/all');
        setAttendanceData(res.data);
        setFilteredData(res.data);

        const uniqueSubjects = Array.from(
          new Map(
            res.data
              .filter((r) => r.subject && r.subject.name && r.subject.code)
              .map((r) => [r.subject._id, r.subject])
          ).values()
        );

        setSubjects(uniqueSubjects);
      } catch (err) {
        setError('❌ Failed to fetch attendance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...attendanceData];

    if (selectedSubject) {
      filtered = filtered.filter(
        (record) => record.subject?._id === selectedSubject
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date).toISOString().split('T')[0] === selectedDate
      );
    }

    setFilteredData(filtered);
  }, [selectedSubject, selectedDate, attendanceData]);

  // Group records by subject
  const groupedBySubject = filteredData.reduce((acc, curr) => {
    const key = curr.subject?._id;
    if (!acc[key]) acc[key] = { subject: curr.subject, records: [] };
    acc[key].records.push(curr);
    return acc;
  }, {});

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 All Attendance Records</h2>

      {/* Filters */}
      <div style={styles.filterContainer}>
  <label style={styles.label}>
    Filter by Subject:{' '}
    <select
      value={selectedSubject}
      onChange={(e) => setSelectedSubject(e.target.value)}
      style={styles.select}
    >
      <option value="">All Subjects</option>
      {subjects.map((subj) => (
        <option key={subj._id} value={subj._id}>
          {subj.name} ({subj.code})
        </option>
      ))}
    </select>
  </label>

  <label style={styles.label}>
    Filter by Date:{' '}
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      style={styles.dateInput}
    />
  </label>
</div>


      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && Object.keys(groupedBySubject).length === 0 && (
        <p>No attendance records found for selected filters.</p>
      )}

      {!loading &&
        Object.entries(groupedBySubject).map(([subjectId, group]) => (
          <div key={subjectId} style={{ marginTop: '2rem' }}>
            <h3>
              📘 {group.subject?.name || 'N/A'} ({group.subject?.code || 'N/A'})
            </h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>USN</th>
                  <th style={styles.th}>Semester</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {group.records.map((record) => (
                  <tr key={record._id}>
                    <td style={styles.td}>
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{record.student?.name || 'N/A'}</td>
                    <td style={styles.td}>{record.student?.usn || 'N/A'}</td>
                    <td style={styles.td}>{record.student?.sem || 'N/A'}</td>
                    <td style={styles.td}>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
const styles = {
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: {
    padding: '0.5rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: '0.5rem',
    border: '1px solid #ccc',
  },
  filterContainer: {
    display: 'flex',
    gap: '2rem',
    margin: '1rem 0',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '500',
    fontSize: '1rem',
  },
  select: {
    padding: '0.4rem 0.6rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  dateInput: {
    padding: '0.4rem 0.6rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
};


export default HodViewStudentAttendance;
