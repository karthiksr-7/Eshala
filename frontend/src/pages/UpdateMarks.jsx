import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UpdateMarks() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loadingMarks, setLoadingMarks] = useState(false);

  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [lecturerRes, studentsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/lecturer/profile/${email}`),
          axios.get(`http://localhost:5000/api/student`)
        ]);

        const lecturer = lecturerRes.data;
        const studentList = studentsRes.data;
        setStudents(studentList);

        const subjectResponses = await Promise.all(
          lecturer.subjects.map(id =>
            axios.get(`http://localhost:5000/api/subjects/${id}`)
          )
        );

        const subjectList = subjectResponses.map(res => res.data);
        setSubjects(subjectList);
      } catch (err) {
        console.error('❌ Failed to load data:', err);
      }
    };

    if (email) fetchInitialData();
  }, [email]);

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    const subject = subjects.find(s => s._id === subjectId);
    setSelectedSubject(subject);
    setLoadingMarks(true);

    try {
      const marksRes = await axios.get(`http://localhost:5000/api/internal-marks/${subjectId}`);
      const existingMarks = marksRes.data;

      const markMap = {};
      existingMarks.forEach(entry => {
        markMap[entry.student] = entry.internalMarks;
      });

      setMarks(markMap);
    } catch (err) {
      console.error('❌ Failed to load marks:', err);
      setMarks({});
    }

    setLoadingMarks(false);
  };

  const handleMarkChange = (studentId, value) => {
    const numeric = parseInt(value);
    if (!isNaN(numeric) && numeric >= 0 && numeric <= 50) {
      setMarks((prev) => ({ ...prev, [studentId]: numeric }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubject) return alert("❌ Please select a subject first");

    const payload = {
      lecturerEmail: email,
      subjectId: selectedSubject._id,
      marks: Object.entries(marks).map(([studentId, internalMarks]) => ({
        studentId,
        internalMarks,
      })),
    };

    try {
      await axios.post('http://localhost:5000/api/internal-marks/update', payload);
      alert('✅ Internal marks updated successfully!');
    } catch (err) {
      console.error('❌ Failed to submit marks:', err);
      alert('❌ Failed to update marks');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Update Internal Marks</h2>

      <select onChange={handleSubjectChange} style={{ padding: '0.5rem', marginBottom: '1rem' }}>
        <option value="">-- Select Subject --</option>
        {subjects.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name} ({sub.code})
          </option>
        ))}
      </select>

      {loadingMarks && <p>⏳ Loading marks...</p>}

      {students.length > 0 && (
        <div>
          <h3 style={{ marginTop: '1rem' }}>All Students</h3>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1rem',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>USN</th>
                <th style={tableHeaderStyle}>Marks (0–50)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td style={tableCellStyle}>{student.name}</td>
                  <td style={tableCellStyle}>{student.usn}</td>
                  <td style={tableCellStyle}>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={marks[student._id] || ''}
                      onChange={(e) => handleMarkChange(student._id, e.target.value)}
                      disabled={!selectedSubject}
                      style={{
                        width: '80px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: selectedSubject ? '#fff' : '#f0f0f0'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSubmit}
            style={{
              marginTop: '1.5rem',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            disabled={!selectedSubject}
          >
            Submit Marks
          </button>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle = {
  padding: '10px',
  border: '1px solid #dee2e6',
  textAlign: 'left'
};

const tableCellStyle = {
  padding: '10px',
  border: '1px solid #eaeaea'
};

export default UpdateMarks;
