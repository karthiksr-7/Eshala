import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const BACKEND_URL = 'http://localhost:5000';

const ArrangeInternals = () => {
  const [semester, setSemester] = useState('');
  const [startDate, setStartDate] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [exists, setExists] = useState(false);

  const fetchExistingSchedule = async (sem) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/internals/${sem}`);
      const internalExam = res.data.internalExam || res.data;
      if (internalExam?.schedule) {
        setSchedule(internalExam.schedule);
        setStartDate(internalExam.startDate || '');
        setExists(true);
        alert(`⚠️ Schedule already exists for Semester ${sem}`);
      } else {
        setSchedule([]);
        setStartDate('');
        setExists(false);
      }
    } catch {
      setSchedule([]);
      setStartDate('');
      setExists(false);
    }
  };

  const handleGenerate = async () => {
    if (!semester || !startDate) {
      alert('⚠️ Select both semester and start date');
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/api/internals`, {
        sem: semester,
        startDate,
      });
      setSchedule(res.data.internalExam?.schedule || []);
      setExists(true);
      alert('✅ Internal exam timetable generated!');
    } catch (err) {
      alert(err?.response?.data?.message || '❌ Generation failed');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${BACKEND_URL}/api/internals/${semester}`, {
        startDate,
      });
      setSchedule(res.data.internalExam?.schedule || []);
      alert('🔁 Schedule updated!');
    } catch (err) {
      alert(err?.response?.data?.message || '❌ Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete schedule for Semester ${semester}?`)) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/internals/${semester}`);
      setSchedule([]);
      setStartDate('');
      setExists(false);
      alert('🗑️ Schedule deleted');
    } catch (err) {
      alert(err?.response?.data?.message || '❌ Deletion failed');
    }
  };

 const handleDownloadPDF = () => {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    alert("❌ No schedule available to download.");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Internal Exam Timetable - Semester ${semester}`, 14, 20);

  // Table properties
  const startX = 14;
  const startY = 30;
  const colWidths = [50, 80, 40];
  const rowHeight = 10;

  // Header row
  const headers = ['Date', 'Subject', 'Time'];
  let currentY = startY;

  // Draw header row
  headers.forEach((text, i) => {
    doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY, colWidths[i], rowHeight);
    doc.text(text, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2, currentY + 7);
  });

  currentY += rowHeight;

  // Draw each row with lines
  schedule.forEach((day) => {
    day.subjects.forEach((exam) => {
      const rowData = [
        new Date(day.date).toLocaleDateString(),
        exam.subject,
        exam.time,
      ];

      rowData.forEach((text, i) => {
        doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY, colWidths[i], rowHeight);
        doc.text(text, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2, currentY + 7);
      });

      currentY += rowHeight;
    });
  });

  // Add HOD signature space
  doc.text("Signature of HOD", startX + 130, currentY + 20);

  // Save
  doc.save(`Internal_Exam_Sem${semester}.pdf`);
};


  useEffect(() => {
    if (semester) {
      fetchExistingSchedule(semester);
    } else {
      setSchedule([]);
      setStartDate('');
      setExists(false);
    }
  }, [semester]);

  return (
    <div style={styles.container}>
      <h2>📝 Arrange Internal Exams</h2>

      <div style={styles.form}>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Semester</option>
          {[1, 2, 3, 4].map((sem) => (
            <option key={sem} value={sem}>{`Semester ${sem}`}</option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
          disabled={!semester}
        />

        {!exists ? (
          <button onClick={handleGenerate} style={styles.button}>📅 Generate</button>
        ) : (
          <>
            <button onClick={handleUpdate} style={styles.button}>🔁 Update</button>
            <button onClick={handleDelete} style={{ ...styles.button, backgroundColor: '#ef4444' }}>🗑️ Delete</button>
            <button onClick={handleDownloadPDF} style={{ ...styles.button, backgroundColor: '#059669' }}>⬇️ PDF</button>
          </>
        )}
      </div>

      {schedule.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>📃 Internal Exam Timetable</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Time</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((entry, index) =>
                entry.subjects.map((exam, idx) => (
                  <tr key={`${index}-${idx}`}>
                    <td style={styles.td}>{new Date(entry.date).toLocaleDateString()}</td>
                    <td style={styles.td}>{exam.subject}</td>
                    <td style={styles.td}>{exam.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
    fontFamily: 'Segoe UI',
  },
  form: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minWidth: '160px',
  },
  button: {
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
    textAlign: 'left',
    padding: '8px',
    borderBottom: '2px solid #ccc',
  },
  td: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
};

export default ArrangeInternals;
