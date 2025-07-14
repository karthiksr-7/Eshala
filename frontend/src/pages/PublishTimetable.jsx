import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
const BACKEND_URL = 'http://localhost:5000';

const PublishTimetable = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    sem: '',
    isLab: false,
  });

  const [selectedSem, setSelectedSem] = useState('');
  const [semSubjects, setSemSubjects] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [timetable, setTimetable] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchLecturers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/subjects`);
      setSubjects(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch subjects:', err);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lecturer/list`);
      setLecturers(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch lecturers:', err);
    }
  };

 const fetchTimetable = async (sem) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/timetable/${sem}`);
    setTimetable(res.data);
  } catch (err) {
    console.error('❌ Failed to fetch timetable:', err);
    setTimetable(null);
  }
};

const handleDownloadPDF = () => {
  if (!timetable || !Array.isArray(timetable.entries)) {
    alert("❌ No timetable available to download.");
    return;
  }

  const doc = new jsPDF('landscape', 'pt', 'a3'); // A3 gives us more width
  doc.setFontSize(16);
  doc.text(`Class Timetable - Semester ${selectedSem}`, 40, 40);

  const periods = [
    '8:40–9:40',
    '9:40–10:40',
    '11:00–12:00',
    '12:00–1:00',
    '2:00–3:00',
    '3:00–4:00',
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const startX = 40;
  const startY = 60;
  const cellWidth = 140; // Slightly smaller width to fit all
  const cellHeight = 40;

  // Header Row
  doc.setFontSize(12);
  doc.rect(startX, startY, cellWidth, cellHeight);
  doc.text("Day / Period", startX + 5, startY + 25);
  periods.forEach((time, i) => {
    const x = startX + cellWidth * (i + 1);
    doc.rect(x, startY, cellWidth, cellHeight);
    doc.text(time, x + 5, startY + 25);
  });

  // Timetable Rows
  days.forEach((day, rowIndex) => {
    const y = startY + cellHeight * (rowIndex + 1);
    doc.rect(startX, y, cellWidth, cellHeight);
    doc.text(day, startX + 5, y + 25);

    for (let periodIndex = 0; periodIndex < periods.length; periodIndex++) {
      const x = startX + cellWidth * (periodIndex + 1);
      const entry = timetable.entries.find(
        (e) => e.day === day && e.periodIndex === periodIndex
      );

      doc.rect(x, y, cellWidth, cellHeight);
      if (entry) {
        const subject = entry.subject?.name || 'Sub';
        const lecturer = entry.lecturer?.name || 'Lec';
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(`${subject} (${lecturer})`, cellWidth - 10);
        doc.text(lines, x + 5, y + 20);
        doc.setFontSize(12);
      }
    }
  });

  // Footer
  doc.text("Signature of HOD", startX + 700, startY + cellHeight * (days.length + 2));

  doc.save(`Timetable_Sem${selectedSem}.pdf`);
};


  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/subjects/add`, newSubject);
      alert('✅ Subject added successfully!');
      setNewSubject({ name: '', code: '', sem: '', isLab: false });
      fetchSubjects();
    } catch (err) {
      console.error('❌ Failed to add subject:', err);
      alert(err.response?.data?.message || '❌ Failed to add subject');
    }
  };

  const handleSemChange = async (e) => {
    const sem = e.target.value;
    setSelectedSem(sem);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/subjects/by-sem/${sem}`);
      setSemSubjects(res.data);
      setAssignments({});
      fetchTimetable(sem);
    } catch (err) {
      console.error('❌ Failed to fetch semester subjects:', err);
    }
  };

  const handleLecturerAssign = (subjectId, lecturerId) => {
    setAssignments((prev) => ({
      ...prev,
      [subjectId]: lecturerId,
    }));
  };

  const handleGenerate = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/assign-subjects`, {
        semester: selectedSem,
        assignments,
      });

     await axios.post(`${BACKEND_URL}/api/timetable`,  {
        semester: selectedSem,
        assignments,
      });

      await fetchTimetable(selectedSem);

      alert('✅ Timetable generated successfully!');
    } catch (err) {
      console.error('❌ Failed to generate timetable:', err.message);
      alert('❌ Failed to generate timetable. Check console for details.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>📚 Add New Subject</h2>
      <form onSubmit={handleSubjectSubmit} style={styles.form}>
        <input
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          placeholder="Subject Name"
          required
          style={styles.input}
        />
        <input
          value={newSubject.code}
          onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
          placeholder="Subject Code"
          required
          style={styles.input}
        />
        <input
          type="number"
          value={newSubject.sem}
          onChange={(e) => setNewSubject({ ...newSubject, sem: e.target.value })}
          placeholder="Semester"
          required
          min="1"
          max="4"
          style={styles.input}
        />
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={newSubject.isLab}
            onChange={(e) => setNewSubject({ ...newSubject, isLab: e.target.checked })}
          />
          Is Lab
        </label>
        <button type="submit" style={styles.addButton}>➕ Add Subject</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <h2>📖 All Subjects</h2>
      {subjects.length === 0 ? (
        <p>No subjects added yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Semester</th>
              <th style={styles.th}>Is Lab</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => (
              <tr key={sub._id}>
                <td style={styles.td}>{sub.name}</td>
                <td style={styles.td}>{sub.code}</td>
                <td style={styles.td}>{sub.sem}</td>
                <td style={styles.td}>{sub.isLab ? 'Yes 🧪' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <h2>🗂️ Assign Lecturers to Subjects</h2>
      <select value={selectedSem} onChange={handleSemChange} style={styles.input}>
        <option value="">Select Semester</option>
        {[1, 2, 3, 4].map((sem) => (
          <option key={sem} value={sem}>{`Semester ${sem}`}</option>
        ))}
      </select>

      {semSubjects.length > 0 && (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Is Lab</th>
                <th style={styles.th}>Assign Lecturer</th>
              </tr>
            </thead>
            <tbody>
              {semSubjects.map((sub) => (
                <tr key={sub._id}>
                  <td style={styles.td}>{sub.name}</td>
                  <td style={styles.td}>{sub.isLab ? 'Yes 🧪' : 'No'}</td>
                  <td style={styles.td}>
                    <select
                      onChange={(e) => handleLecturerAssign(sub._id, e.target.value)}
                      value={assignments[sub._id] || ''}
                      style={styles.input}
                    >
                      <option value="">-- Select Lecturer --</option>
                      {lecturers.map((lec) => (
                        <option key={lec._id} value={lec._id}>
                          {lec.isPhD ? '' : ''}{lec.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleGenerate} style={{ ...styles.addButton, marginTop: '1rem' }}>
            🚀 Generate Timetable
          </button>
        </>
      )}
{timetable && (
  <>
    <hr style={{ margin: '2rem 0' }} />
    <h2>📅 Timetable</h2>

    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Day / Period</th>
          {[
            '8:40–9:40',
            '9:40–10:40',
            '11:00–12:00',
            '12:00–1:00',
            '2:00–3:00',
            '3:00–4:00',
          ].map((time, index) => (
            <th key={index} style={styles.th}>{time}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
          <tr key={day}>
            <td style={styles.td}>{day}</td>
            {[0, 1, 2, 3, 4, 5].map((periodIndex) => {
              const entry = timetable.entries.find(
                (e) => e.day === day && e.periodIndex === periodIndex
              );
              return (
                <td key={periodIndex} style={styles.td}>
                  {entry
                    ? (
                        <>
                          {entry.subject?.name}<br />
                          <span style={{ fontSize: '12px' }}>
                            ({entry.lecturer?.name})
                          </span>
                        </>
                      )
                    : '—'}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>

    <button
      onClick={handleDownloadPDF}
      style={{
        ...styles.addButton,
        marginTop: '1rem',
        backgroundColor: '#059669'
      }}
    >
      ⬇️ Download PDF
    </button>
  </>
)}


    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
  },
  input: {
    flex: '1 1 200px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    borderBottom: '2px solid #ccc',
    textAlign: 'left',
    padding: '8px',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '8px',
  },
};

export default PublishTimetable;
