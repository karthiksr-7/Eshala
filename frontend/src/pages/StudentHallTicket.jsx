import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function StudentHallTicket() {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      setError('Student not logged in');
      return;
    }

    axios.get(`http://localhost:5000/api/hall-ticket/student/${studentId}`)
      .then(res => setTicket(res.data))
      .catch(err => {
        console.error(err);
        setError('Hall ticket not available');
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!ticket) {
    return <div style={styles.loading}>Loading hall ticket...</div>;
  }

  const { student, examCenter, sem, timetable } = ticket;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
       
        <div ref={printRef} style={styles.ticketBox}>
          {/* Institution Header */}
          <div style={styles.header}>
            <h1 style={styles.institute}>EShala Institute of Technology</h1>
            <h3 style={styles.subheading}>Semester Examination Hall Ticket</h3>
          </div>

          {/* Student Info */}
          <div style={styles.infoBox}>
            <p><strong>Name:</strong> {student?.name}</p>
            <p><strong>USN:</strong> {student?.usn}</p>
            <p><strong>Semester:</strong> {sem}</p>
            <p><strong>Exam Center:</strong> {examCenter}</p>
          </div>

          {/* Exam Table */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Session</th>
                <th style={styles.th}>Invigilator Sign</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((item, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{item.subject?.name}</td>
                  <td style={styles.td}>{item.subject?.code}</td>
                  <td style={styles.td}>{new Date(item.date).toLocaleDateString()}</td>
                  <td style={styles.td}>{item.session}</td>
                  <td style={styles.td}></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.signature}>
              <p>_____________________</p>
              <p>Student Signature</p>
            </div>
            <div style={styles.signature}>
              <p>_____________________</p>
              <p>HOD Signature</p>
            </div>
          </div>
        </div>

        <button style={styles.printBtn} onClick={handlePrint}>🖨️ Print</button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.8rem',
    color: '#1e3a8a',
    marginBottom: '1.5rem',
  },
  ticketBox: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.05)',
    textAlign: 'left',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  institute: {
    fontSize: '2rem',
    color: '#0f172a',
    marginBottom: '0.2rem',
  },
  subheading: {
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#334155',
  },
  infoBox: {
    fontSize: '1rem',
    lineHeight: '1.8',
    marginBottom: '2rem',
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '6px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '2rem',
    fontSize: '1rem',
  },
  th: {
    border: '1px solid #cbd5e1',
    padding: '0.75rem',
    backgroundColor: '#e2e8f0',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #e5e7eb',
    padding: '0.75rem',
    backgroundColor: '#ffffff',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
    fontStyle: 'italic',
  },
  signature: {
    textAlign: 'center',
    width: '45%',
  },
  printBtn: {
    marginTop: '1.5rem',
    padding: '0.6rem 1.4rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  loading: {
    fontSize: '1rem',
    color: '#555',
    marginTop: '2rem',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '1rem',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '2rem auto',
  },
};

export default StudentHallTicket;
