import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LecturerUploadNotes({ lecturerId: propLecturerId }) {
  const lecturerId = propLecturerId || localStorage.getItem('lecturerId');

  const [sem, setSem] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!sem) return;
    axios
      .get(`http://localhost:5000/api/subjects/by-sem/${sem}`)
      .then(res => setSubjects(res.data))
      .catch(err => console.error('Error fetching subjects:', err));
  }, [sem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lecturerId) {
      setMessage('❌ Lecturer not logged in.');
      return;
    }

    if (!title || !subject || !file || !sem) {
      setMessage('❌ Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('semester', sem);
    formData.append('file', file);
    formData.append('uploadedBy', lecturerId);

    try {
      await axios.post('http://localhost:5000/api/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✅ Notes uploaded successfully');

      setTitle('');
      setSubject('');
      setSem('');
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📤 Upload Lecture Notes</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Semester</label>
            <select value={sem} onChange={e => setSem(e.target.value)} style={styles.select}>
              <option value="">Select</option>
              {[1, 2, 3, 4].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} style={styles.select}>
              <option value="">Select</option>
              {subjects.map(sub => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter title"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>File</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} style={styles.fileInput} />
          </div>

          <button type="submit" style={styles.button}>Upload</button>
        </form>

        {message && (
          <p style={{
            marginTop: '1rem',
            fontWeight: 'bold',
            color: message.startsWith('✅') ? 'green' : 'red'
          }}>{message}</p>
        )}
      </div>
    </div>
  );
}

// 🎨 Stylish Inline Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  heading: {
    marginBottom: '1.5rem',
    color: '#2c3e50',
    borderBottom: '2px solid #ccc',
    paddingBottom: '0.5rem',
    fontSize: '1.4rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.4rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  fileInput: {
    padding: '0.4rem 0',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.7rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
};

export default LecturerUploadNotes;
