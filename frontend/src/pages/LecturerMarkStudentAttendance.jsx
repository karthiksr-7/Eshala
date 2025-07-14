import React, { useEffect, useState } from 'react';
import axios from 'axios';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function groupByDate(records) {
  const grouped = {};
  for (const rec of records) {
    const date = new Date(rec.date).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(rec);
  }
  return grouped;
}

function LecturerMarkStudentAttendance() {
  const [todaySubjects, setTodaySubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const lecturerId = localStorage.getItem('lecturerId');
  const today = days[new Date().getDay()];
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!lecturerId) {
      setMessage('Lecturer not logged in.');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/timetable/lecturer/${lecturerId}/today`);
        const timetable = res.data.classes || [];

        const updatedSubjects = await Promise.all(
          timetable.map(async (cls) => {
            const { subjectId, sem } = cls;
            const check = await axios.get(`http://localhost:5000/api/student-attendance/check/${subjectId}`);

            if (check.data?.alreadyMarked) {
              const historyRes = await axios.get(`http://localhost:5000/api/student-attendance/subject/${subjectId}`);
              const groupedHistory = groupByDate(historyRes.data);
              return {
                ...cls,
                type: 'history',
                history: groupedHistory,
              };
            } else {
              const studentRes = await axios.get(`http://localhost:5000/api/student/by-sem/${sem}`);
              const studentList = studentRes.data || [];
              const attendance = {};
              studentList.forEach((s) => (attendance[s._id] = 'present'));

              return {
                ...cls,
                type: 'form',
                students: studentList,
                attendance,
                history: {},
              };
            }
          })
        );

        setTodaySubjects(updatedSubjects);
        setMessage('');
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setMessage("Failed to fetch today's data.");
      }
    };

    fetchData();
  }, [lecturerId, todayDate]);

 const handleSubjectSelect = (subject) => {
  if (subject.type === 'form' && (!subject.students || subject.students.length === 0)) {
    alert('❌ No students found for this subject.');
    return;
  }

  if (subject.type === 'history' && subject.history[todayDate]) {
    alert('⚠️ Attendance already marked for today.');
  }

  setSelectedSubject(subject);
};


  const handleStatusChange = (studentId, status) => {
    setSelectedSubject((prev) => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [studentId]: status,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject) return;
    const { subjectId, attendance } = selectedSubject;

    const attendanceList = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/student-attendance/mark', {
        subjectId,
        attendanceList,
      });

      alert(res.data.message || '✅ Attendance submitted successfully.');
      setSelectedSubject(null);

      // Refetch data to reflect update
      window.location.reload();
    } catch (err) {
      console.error('❌ Error submitting attendance:', err);
      alert(err.response?.data?.message || '❌ Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📅 Today's Classes: {today}</h2>

      {todaySubjects.length === 0 ? (
        <p style={styles.info}>No classes scheduled for today.</p>
      ) : (
        <>
          <div style={styles.buttonGroup}>
            {todaySubjects.map((subject) => (
              <button
                key={subject.subjectId}
                style={styles.subjectButton}
                onClick={() => handleSubjectSelect(subject)}
              >
                {subject.subjectName} ({subject.subjectCode})
              </button>
            ))}
          </div>

          {/* Form to mark attendance */}
          {selectedSubject && selectedSubject.type === 'form' && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={styles.subHeading}>
                {selectedSubject.subjectName} ({selectedSubject.subjectCode}) - Sem {selectedSubject.sem}
              </h3>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>USN</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSubject.students.map((student) => (
                    <tr key={student._id}>
                      <td style={styles.td}>{student.usn}</td>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>
                        <select
                          value={selectedSubject.attendance[student._id]}
                          onChange={(e) => handleStatusChange(student._id, e.target.value)}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={handleSubmit}
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </div>
          )}

          {/* Attendance History Always Displayed Below */}
          {todaySubjects.map((s) => (
            <div key={s.subjectId} style={{ marginTop: '3rem' }}>
              <h3 style={styles.subHeading}>
                🕘 Attendance History - {s.subjectName} ({s.subjectCode}) - Sem {s.sem}
              </h3>
              {Object.keys(s.history || {}).length === 0 ? (
                <p style={styles.info}>No attendance history found.</p>
              ) : (
                Object.entries(s.history).map(([date, records]) => (
                  <div key={date} style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📅 {date}</p>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>USN</th>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((rec) => (
                          <tr key={rec._id}>
                            <td style={styles.td}>{rec.student?.usn || 'N/A'}</td>
                            <td style={styles.td}>{rec.student?.name || 'N/A'}</td>
                            <td style={styles.td}>{rec.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          ))}
        </>
      )}

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Segoe UI, sans-serif' },
  heading: { fontSize: '24px', marginBottom: '1rem' },
  subHeading: { fontSize: '20px', fontWeight: '600', marginBottom: '1rem' },
  info: { fontStyle: 'italic', color: '#555' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '0.6rem',
    borderBottom: '2px solid #ccc',
    background: '#f1f5f9',
    textAlign: 'left',
  },
  td: { padding: '0.6rem', borderBottom: '1px solid #ddd' },
  submitButton: {
    marginTop: '1rem',
    backgroundColor: '#22c55e',
    color: '#fff',
    padding: '0.6rem 1.4rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  subjectButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1rem',
    margin: '0.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  buttonGroup: { marginBottom: '2rem' },
  message: { marginTop: '1rem', fontWeight: 'bold', color: '#0f5132' },
};

export default LecturerMarkStudentAttendance;
