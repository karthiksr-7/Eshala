import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage.jsx';
import HODDashboard from './pages/HODDashboard.jsx';
import StudentRegistration from './pages/StudentRegistration';
import StudentList from './pages/StudentList';
import LecturerRegistration from './pages/LecturerRegister.jsx';
import LecturerList from './pages/LecturerList';
import AssignMentor from './pages/AssignMentor';
import PublishTimetable from './pages/PublishTimetable';
import ArrangeInternals from './pages/ArrangeInternals.jsx';
import HodViewAttendance from './pages/HodViewAttendance';
import LecturerDashboard from './pages/LecturerDashboard.jsx';
import MyClasses from './pages/MyClasses.jsx'; 
import UpdateMarks from './pages/UpdateMarks';
import UpdateResults from './pages/HodUpdateResults.jsx'; // ✅ Correct import
import LecturerAttendance from './pages/LecturerAttendance';
import LecturerUploadNotes from './pages/LecturerUploadNotes';
import LecturerMarkStudentAttendance from './pages/LecturerMarkStudentAttendance';
import HodViewStudentAttendance from './pages/HodViewStudentAttendance.jsx';
import LecturerApplyLeave from './pages/LecturerApplyLeave';
import HodManageLeave from './pages/HodManageLeave';
import StudentDashboard from './pages/StudentDashboard.jsx';
import HodGenerateExamAndHallTicket from './pages/HodGenerateExamAndHallTicket';
import StudentViewTimetable from './pages/StudentViewTimetable.jsx';
import StudentResults from './pages/StudentResults.jsx';
import StudentInternalMarks from './pages/StudentInternalMarks.jsx';
import StudentAttendanceProgress from './pages/StudentAttendanceProgress.jsx';
import StudentNotes from './pages/StudentNotes.jsx';
import StudentHallTicket from './pages/StudentHallTicket.jsx';
import StudentLeaveForm from './pages/StudentLeaveForm.jsx';
import LecturerLeaveApproval from './pages/LecturerLeaveApproval.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
function App() {
  return (
    <Router>
      <Routes>
        {/* HOD Section */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hod-dashboard" element={<HODDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register-student" element={<StudentRegistration />} />
        <Route path="/hod/students" element={<StudentList />} />
        <Route path="/register-lecturer" element={<LecturerRegistration />} />
        <Route path="/hod/lecturers" element={<LecturerList />} />
        <Route path="/hod/assign-mentors" element={<AssignMentor />} />
        <Route path="/hod/timetable" element={<PublishTimetable />} />
        <Route path="/hod/internals" element={<ArrangeInternals />} />
        <Route path="/hod/results" element={<UpdateResults />} /> {/* ✅ Fixed path */}
        <Route path="/hod/attendance/lecturers" element={<HodViewAttendance />} />
        <Route path="/hod/attendance/students" element={<HodViewStudentAttendance />} />
         <Route path="/hod/leave-letters" element={<HodManageLeave />} /> 
        <Route path="/hod/halltickets" element={<HodGenerateExamAndHallTicket />} />
        {/* Lecturer Section */}
        <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
        <Route path="/lecturer/classes" element={<MyClasses />} />
        <Route path="/lecturer/internals" element={<UpdateMarks />} />
        <Route path="/lecturer/attendance" element={<LecturerAttendance />} />
        <Route path="/lecturer/student-attendance" element={<LecturerMarkStudentAttendance />} />
        <Route path="/lecturer/leave" element={<LecturerApplyLeave />} />
        <Route path="/lecturer/upload" element={<LecturerUploadNotes/>} />

        <Route path="/student-dashboard" element={<StudentDashboard/>} />
        <Route path="/student/timetable" element={<StudentViewTimetable />} />
        <Route path="/student/internalmarks" element={<StudentInternalMarks />} />
         <Route path="/student/sem-result" element={<StudentResults />} />
     <Route path="/student/attendance" element={<StudentAttendanceProgress />} />
      <Route path="/student/notes" element={<StudentNotes />} />
      <Route path="/student/hall-ticket" element={<StudentHallTicket />} />
      <Route path="/student/leave" element={<StudentLeaveForm />} />
      <Route path="/lecturer/leave-view" element={<LecturerLeaveApproval />} />
      </Routes>
    </Router>
  );
}

export default App;
