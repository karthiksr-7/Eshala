import React, { useState } from 'react';
import axios from 'axios';

function HodUpdateResults() {
  const semesters = [1, 2, 3, 4];
  const [selectedSem, setSelectedSem] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [records, setRecords] = useState([]);
  const [externals, setExternals] = useState({});

  const handleSemChange = async (e) => {
    const sem = e.target.value;
    setSelectedSem(sem);
    setSelectedSubject('');
    setRecords([]);
    setExternals({});

    try {
      const res = await axios.get(`http://localhost:5000/api/subjects/by-sem/${sem}`);
      setSubjects(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch subjects by semester:', err);
      setSubjects([]);
    }
  };

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setRecords([]);
    setExternals({});

    try {
      const res = await axios.get(`http://localhost:5000/api/results/${subjectId}`);
      setRecords(res.data);

      const extMap = {};
      res.data.forEach((rec) => {
        extMap[rec.student._id] = rec.externalMarks ?? '';
      });
      setExternals(extMap);
    } catch (err) {
      console.error('❌ Failed to load marks:', err);
    }
  };

  const handleExternalChange = (studentId, value) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 50) {
      setExternals((prev) => ({ ...prev, [studentId]: num }));
    }
  };

  const handleSubmit = async () => {
    const updates = Object.entries(externals).map(([studentId, externalMarks]) => ({
      studentId,
      externalMarks,
    }));

    try {
      await axios.post('http://localhost:5000/api/results/update-externals', {
        subjectId: selectedSubject,
        updates,
      });
      alert('✅ External marks updated!');
    } catch (err) {
      console.error('❌ Submission failed:', err);
      alert('❌ Failed to update marks');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎓 HOD: Update External Marks</h2>

      <div style={styles.selectorRow}>
        <div style={styles.selectGroup}>
          <label>📘 Semester:</label>
          <select value={selectedSem} onChange={handleSemChange} style={styles.select}>
            <option value="">-- Select Semester --</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {subjects.length > 0 && (
          <div style={styles.selectGroup}>
            <label>📚 Subject:</label>
            <select value={selectedSubject} onChange={handleSubjectChange} style={styles.select}>
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {records.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
  <thead style={styles.tableHead}>
    <tr>
      <th style={styles.th}>Name</th>
      <th style={styles.th}>USN</th>
      <th style={styles.th}>Internal</th>
      <th style={styles.th}>External</th>
      <th style={styles.th}>Total</th>
      <th style={styles.th}>Status</th>
    </tr>
  </thead>
  <tbody>
    {records.map((rec) => {
  const internal = rec.internalMarks ?? 0;
  const external = externals[rec.student._id];
  const total = typeof external === 'number' ? internal + external : '-';
  const isPass = typeof external === 'number' && external >= 18 && total >= 40;
  const status = typeof external === 'number' ? (isPass ? '✅ Pass' : '❌ Fail') : '-';

  return (
    <tr key={rec._id}>
      <td style={styles.td}>{rec.student.name}</td>
      <td style={styles.td}>{rec.student.usn}</td>
      <td style={styles.td}>{internal}</td>
      <td style={styles.td}>
        <input
          type="number"
          min="0"
          max="50"
          value={externals[rec.student._id] ?? ''}
          onChange={(e) => handleExternalChange(rec.student._id, e.target.value)}
          style={styles.input}
        />
      </td>
      <td style={styles.td}>{typeof external === 'number' ? total : '-'}</td>
      <td style={styles.td}>{status}</td>
    </tr>
  );
})}

  </tbody>
</table>

        </div>
      )}

      {records.length > 0 && (
        <button onClick={handleSubmit} style={styles.button}>
          💾 Submit External Marks
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '1.5rem',
    color: '#2c3e50',
  },
  selectorRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  selectGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minWidth: '180px',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  input: {
    width: '70px',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #aaa',
    textAlign: 'center',
    fontSize: '15px',
  },
  button: {
    marginTop: '1.5rem',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  th: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center',
  },
};

export default HodUpdateResults;
