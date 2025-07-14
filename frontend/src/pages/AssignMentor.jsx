import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignMentor = () => {
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [mentorWithMentees, setMentorWithMentees] = useState([]);

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchLecturers();
    fetchMentorsWithMentees();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/student/unassigned');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lecturer/available');
      setLecturers(res.data);
    } catch (err) {
      console.error('Failed to fetch lecturers:', err);
    }
  };

  const fetchMentorsWithMentees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lecturer/with-mentees');
      setMentorWithMentees(res.data);
    } catch (err) {
      console.error('Failed to fetch mentor-mentee list:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedStudentId || !selectedMentorId) {
      alert('Please select both student and mentor.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/student/assign-mentor', {
        studentId: selectedStudentId,
        mentorId: selectedMentorId,
      });

      alert(res.data.message);
      fetchStudents();
      fetchLecturers();
      fetchMentorsWithMentees();
      setSelectedStudentId('');
      setSelectedMentorId('');
    } catch (err) {
      console.error('Assignment failed:', err);
      alert('Assignment failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👨‍🏫 Assign Mentor to Student</h2>

      <div style={styles.selectorGroup}>
        <label style={styles.label}>
          Select Student:
          <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} style={styles.select}>
            <option value="">-- Select Student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Select Mentor:
          <select value={selectedMentorId} onChange={(e) => setSelectedMentorId(e.target.value)} style={styles.select}>
            <option value="">-- Select Mentor --</option>
            {lecturers.map((lecturer) => (
              <option key={lecturer._id} value={lecturer._id}>
                {lecturer.name} ({lecturer.mentees.length}/10)
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={handleAssign} style={styles.button}>Assign Mentor</button>

      <hr style={{ margin: '2rem 0' }} />

      <h3 style={styles.subTitle}>📋 Mentor - Mentee Tables</h3>
      {mentorWithMentees.map((mentor) => (
        <div key={mentor._id} style={styles.mentorBlock}>
          <h4 style={styles.mentorName}>{mentor.name}</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>USN</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Sem</th>
              </tr>
            </thead>
            <tbody>
              {mentor.mentees.length === 0 ? (
                <tr>
                  <td colSpan="4" style={styles.noMentee}>No mentees assigned</td>
                </tr>
              ) : (
                mentor.mentees.map((student) => (
                  <tr key={student._id}>
                    <td style={styles.td}>{student.usn}</td>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.course}</td>
                    <td style={styles.td}>{student.sem}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '3rem auto',
    padding: '2rem',
    background: '#f9fafb',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI',
  },
  title: {
    fontSize: '1.6rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#1e3a8a',
  },
  subTitle: {
    fontSize: '1.4rem',
    marginBottom: '1rem',
    color: '#374151',
  },
  selectorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  label: {
    fontWeight: '600',
    color: '#1f2937',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '6px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  mentorBlock: {
    marginBottom: '2rem',
    padding: '1rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  mentorName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#111827',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    fontSize: '0.95rem',
  },
  td: {
    padding: '10px',
    fontSize: '0.95rem',
    borderBottom: '1px solid #e5e7eb',
    color: '#1f2937',
  },
  noMentee: {
    textAlign: 'center',
    padding: '1rem',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
};

export default AssignMentor;
