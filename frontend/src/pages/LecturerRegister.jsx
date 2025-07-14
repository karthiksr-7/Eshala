import React, { useState } from 'react';
import axios from 'axios';

const LecturerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    experienceType: 'fresher',
    experienceYears: '',
    hasPhD: false,
    designation: 'Associate Professor',
    joinedDate: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   const payload = {
  name: formData.name,
  email: formData.email,
  password: formData.password,
  experience: formData.experienceType === 'experienced' ? formData.experienceYears : 'fresher',
  isPhD: formData.hasPhD,
  designation: formData.designation,
  joinedDate: formData.joinedDate,
};


    try {
      const res = await axios.post('http://localhost:5000/api/lecturer/register', payload);
      alert(res.data.message);
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data?.message || error.message);
      alert('Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lecturer Registration</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Full Name
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
        </label>

        <label style={styles.label}>Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
        </label>

        <label style={styles.label}>Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
        </label>

        <div style={styles.radioGroup}>
          <span>Experience:</span>
          <label style={styles.radioLabel}>
            <input type="radio" name="experienceType" value="fresher" checked={formData.experienceType === 'fresher'} onChange={handleChange} />
            Fresher
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" name="experienceType" value="experienced" checked={formData.experienceType === 'experienced'} onChange={handleChange} />
            Experienced
          </label>
        </div>

        {formData.experienceType === 'experienced' && (
          <label style={styles.label}>Years of Experience
            <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} required style={styles.input} />
          </label>
        )}

        <label style={styles.checkboxLabel}>
          <input type="checkbox" name="hasPhD" checked={formData.hasPhD} onChange={handleChange} />
          PhD Completed
        </label>

        <label style={styles.label}>Designation
          <select name="designation" value={formData.designation} onChange={handleChange} style={styles.input}>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
          </select>
        </label>

        <label style={styles.label}>Joined Date
          <input type="date" name="joinedDate" value={formData.joinedDate} onChange={handleChange} required style={styles.input} />
        </label>

        <button type="submit" style={styles.button}>Register Lecturer</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    color: '#1f2937',
    fontWeight: '500',
  },
  input: {
    padding: '10px',
    marginTop: '6px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontWeight: '500',
    color: '#1f2937',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    color: '#1f2937',
  },
  button: {
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '1rem',
  }
};

export default LecturerRegister;
