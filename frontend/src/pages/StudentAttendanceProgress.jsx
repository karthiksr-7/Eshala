import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentAttendanceProgress() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      setError('Student not logged in');
      return;
    }

    axios
      .get(`http://localhost:5000/api/student-attendance/percentage/${studentId}`)
      .then((res) => setAttendanceData(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch attendance data');
      });
  }, []);

  const getColor = (percentage, total) => {
    if (total > 0 && percentage === 0) return '#dc2626'; // 🔴 class held but no attendance
    if (percentage > 80) return '#16a34a'; // 🟢 green
    if (percentage >= 70) return '#facc15'; // 🟡 yellow
    return '#dc2626'; // 🔴 red
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🟢 Attendance Overview (Circular)</h2>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {attendanceData.map((item, index) => {
          const percentage = item.percentage;
          const color = getColor(percentage, item.totalClasses);
          const radius = 40;
          const stroke = 8;
          const normalizedRadius = radius - stroke / 2;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <div key={index} style={styles.card}>
              <svg height={radius * 2} width={radius * 2}>
                <circle
                  stroke="#e5e7eb"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke={color}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="16px"
                  fontWeight="bold"
                  fill={color}
                >
                  {percentage}%
                </text>
              </svg>

              <div style={styles.subjectInfo}>
                <strong>{item.subjectName}</strong> ({item.subjectCode})<br />
                <small>
                  Attended: {item.attended} / {item.totalClasses}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  heading: {
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: '2rem',
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
    justifyItems: 'center',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
    width: '220px',
  },
  subjectInfo: {
    marginTop: '1rem',
    fontSize: '14px',
    color: '#334155',
  },
};

export default StudentAttendanceProgress;
