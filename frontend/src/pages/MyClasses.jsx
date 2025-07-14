import React, { useEffect, useState } from 'react';
import axios from 'axios';

const periodTimes = [
  '8:40–9:40',
  '9:40–10:40',
  '11:00–12:00',
  '12:00–1:00',
  '2:00–3:00',
  '3:00–4:00',
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function MyClasses() {
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState('');
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!email) throw new Error('No email found in localStorage.');

        const profRes = await axios.get(`http://localhost:5000/api/lecturer/profile/${email}`);
        const lecturer = profRes.data;

        if (!lecturer.subjects || lecturer.subjects.length === 0) return;

        const subjectResponses = await Promise.all(
          lecturer.subjects.map((id) =>
            axios.get(`http://localhost:5000/api/subjects/${id}`).catch(() => null)
          )
        );

        const validSubjects = subjectResponses.filter((res) => res && res.data);
        const subjectList = validSubjects.map((res) => res.data);
        setSubjects(subjectList);

        if (subjectList.length === 0) throw new Error('No valid subject details found.');

        const sem = subjectList[0].sem;
        const timetableRes = await axios.get(`http://localhost:5000/api/timetable/${sem}`);
        const entries = timetableRes.data.entries;

        const myEntries = entries.filter(
          (entry) => entry.lecturer._id === lecturer._id
        );
        setTimetable(myEntries);
      } catch (err) {
        console.error('❌ Error loading classes:', err.message);
        setError('Failed to load classes. Please try again.');
      }
    };

    fetchData();
  }, [email]);

  const getCell = (day, periodIndex) => {
    const entry = timetable.find(
      (item) => item.day === day && item.periodIndex === periodIndex
    );
    return entry ? entry.subject?.name || 'Unknown' : '';
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>📚 My Subjects</h2>
      {subjects.length > 0 ? (
        <div style={subjectContainerStyle}>
          {subjects.map((sub) => (
            <div key={sub._id} style={subjectCardStyle}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{sub.name}</div>
              <div style={{ color: '#555' }}>{sub.code}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No subjects assigned.</p>
      )}

      <h2 style={{ fontSize: '24px', marginTop: '2rem' }}>🗓️ My Timetable</h2>
      {timetable.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Day</th>
              {periodTimes.map((time, idx) => (
                <th key={idx} style={cellStyle}>
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekDays.map((day) => (
              <tr key={day}>
                <td style={cellStyle}>{day}</td>
                {periodTimes.map((_, periodIdx) => (
                  <td key={periodIdx} style={cellStyle}>
                    {getCell(day, periodIdx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No timetable entries found.</p>
      )}

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center',
  fontSize: '14px',
  minWidth: '100px',
};

const subjectContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
};

const subjectCardStyle = {
  padding: '1rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  minWidth: '180px',
};

export default MyClasses;
