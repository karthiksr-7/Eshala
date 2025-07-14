import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HodGenerateExamAndHallTicket() {
  const [sem, setSem] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [examCenter, setExamCenter] = useState('');
  const [message, setMessage] = useState('');
  const [timetableExists, setTimetableExists] = useState(false);
  const [hallTicketGenerated, setHallTicketGenerated] = useState([]); // ✅ new state

  // Fetch subjects
  useEffect(() => {
    if (!sem) return;
    axios.get(`http://localhost:5000/api/subjects/by-sem/${sem}`)
      .then(res => setSubjects(res.data))
      .catch(err => console.error('Error fetching subjects:', err));
  }, [sem]);

  // Fetch students
  useEffect(() => {
    if (!sem) return;
    axios.get(`http://localhost:5000/api/student/by-sem/${sem}`)
      .then(res => setStudents(res.data))
      .catch(err => console.error('Error fetching students:', err));
  }, [sem]);

  // Fetch timetable
  useEffect(() => {
    if (!sem) return;
    axios.get(`http://localhost:5000/api/exam-timetable/${sem}`)
      .then(res => {
        if (res.data) {
          const mapped = res.data.schedule.map(entry => ({
            subject: entry.subject._id,
            subjectName: entry.subject.name,
            code: entry.subject.code,
            date: entry.date?.split('T')[0] || '',
            session: entry.session || ''
          }));
          setTimetable(mapped);
          setTimetableExists(true);
        }
      })
      .catch(() => {
        setTimetable([]);
        setTimetableExists(false);
      });
  }, [sem]);

  // ✅ Fetch already generated hall tickets
  useEffect(() => {
    if (!sem) return;
    axios.get(`http://localhost:5000/api/hall-ticket/generated/${sem}`)
      .then(res => {
        const ids = res.data.map(ht => ht.student._id);
        setHallTicketGenerated(ids);
      })
      .catch(() => {
        setHallTicketGenerated([]);
      });
  }, [sem]);

  const generateTimetableFields = () => {
    const entries = subjects.map(sub => ({
      subject: sub._id,
      subjectName: sub.name,
      code: sub.code,
      date: '',
      session: ''
    }));
    setTimetable(entries);
  };

  const handleTimetableChange = (subjectId, key, value) => {
    setTimetable(prev =>
      prev.map(entry =>
        entry.subject === subjectId ? { ...entry, [key]: value } : entry
      )
    );
  };

  const submitTimetable = async () => {
    try {
      const payload = {
        sem,
        schedule: timetable.map(({ subject, date, session }) => ({
          subject,
          date,
          session
        }))
      };
      await axios.post('http://localhost:5000/api/exam-timetable/generate', payload);
      setMessage(timetableExists ? '✅ Timetable updated' : '✅ Timetable created');
      setTimetableExists(true);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit timetable');
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const generateHallTickets = async () => {
    try {
      const payload = { sem, studentIds: selectedStudents, examCenter };
      await axios.post('http://localhost:5000/api/hall-ticket/generate', payload);
      setMessage('✅ Hall tickets generated');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to generate hall tickets');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎓 HOD Exam Management</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Semester:</label>
        <select value={sem} onChange={(e) => setSem(e.target.value)} style={styles.select}>
          <option value="">Select</option>
          {[1, 2, 3, 4].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Timetable Section */}
      {sem && subjects.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.subHeading}>
            🗓️ {timetableExists ? 'Update Exam Timetable' : 'Generate Exam Timetable'}
          </h3>

          {!timetableExists && (
            <button onClick={generateTimetableFields} style={styles.button}>📋 Load Subjects</button>
          )}

          {timetable.length > 0 && (
            <>
              {timetable.map((entry) => (
                <div key={`${entry.subject}-${entry.code}`} style={styles.timetableRow}>
                  <strong>{entry.subjectName} ({entry.code})</strong><br />
                  <label>Date:</label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleTimetableChange(entry.subject, 'date', e.target.value)}
                    style={styles.input}
                  />
                  <label style={{ marginLeft: '1rem' }}>Session:</label>
                  <select
                    value={entry.session}
                    onChange={(e) => handleTimetableChange(entry.subject, 'session', e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Select</option>
                    <option value="morning">Morning (10:00 - 1:00)</option>
                    <option value="afternoon">Afternoon (2:00 - 5:00)</option>
                  </select>
                </div>
              ))}
              <button onClick={submitTimetable} style={{ ...styles.button, marginTop: '1rem' }}>
                {timetableExists ? 'Update Timetable' : 'Submit Timetable'}
              </button>
            </>
          )}
        </div>
      )}

      <hr style={{ margin: '3rem 0' }} />

      {/* Hall Ticket Section */}
      {sem && students.length > 0 && (
        <div style={styles.card}>
          <h3>🎟️ Generate Hall Tickets</h3>
          <label>Exam Center:</label>
          <input
            type="text"
            value={examCenter}
            onChange={(e) => setExamCenter(e.target.value)}
            placeholder="Enter exam center"
            style={styles.input}
          />

          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Select</th>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>USN</th>
                <th style={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => {
                const isGenerated = hallTicketGenerated.includes(stu._id);
                return (
                  <tr key={stu._id} style={styles.tableRow}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(stu._id)}
                        onChange={() => handleCheckboxChange(stu._id)}
                        disabled={isGenerated}
                      />
                    </td>
                    <td>{stu.name}</td>
                    <td>{stu.usn}</td>
                    <td style={{ color: isGenerated ? 'green' : 'black' }}>
                      {isGenerated ? 'Already generated' : 'Pending'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button onClick={generateHallTickets} style={{ ...styles.button, marginTop: '1rem' }}>
            Generate Hall Tickets
          </button>
        </div>
      )}

      {message && (
        <p style={{ marginTop: '2rem', fontWeight: 'bold', color: message.startsWith('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI',
    background: '#f5f6fa',
    minHeight: '100vh',
  },
  heading: {
    color: '#2c3e50',
    borderBottom: '2px solid #ccc',
    paddingBottom: '0.5rem',
  },
  subHeading: {
    color: '#444',
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    fontWeight: 'bold',
    marginRight: '0.5rem',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  card: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.4rem',
    borderRadius: '4px',
    marginLeft: '0.5rem',
    border: '1px solid #ccc',
    minWidth: '200px',
  },
  button: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    marginTop: '1rem',
    borderCollapse: 'collapse',
    background: '#f9f9f9',
  },
  tableHeader: {
    padding: '0.75rem',
    borderBottom: '2px solid #ddd',
  },
  tableHeaderRow: {
    backgroundColor: '#e9ecef',
  },
  tableRow: {
    textAlign: 'center',
    background: '#fff',
    borderBottom: '1px solid #eee',
  },
  timetableRow: {
    marginBottom: '1.2rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem',
  },
};

export default HodGenerateExamAndHallTicket;
