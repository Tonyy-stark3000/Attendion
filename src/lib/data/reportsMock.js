export const mockStudents = [
    { id: 'ATD001', name: 'Aarav Sharma', year: 'SY', division: 'A' },
    { id: 'ATD002', name: 'Riya Patil', year: 'SY', division: 'A' },
    { id: 'ATD003', name: 'Aditya Joshi', year: 'SY', division: 'A' },
    { id: 'ATD009', name: 'Kiran Desai', year: 'SY', division: 'B' },
];

export const mockSubjects = [
    { id: 'S1', name: 'Digital System Design', year: 'SY', division: 'A' },
    { id: 'S2', name: 'Mathematics', year: 'SY', division: 'A' },
    { id: 'S3', name: 'Data Structures', year: 'SY', division: 'B' },
];

export const mockStudentAttendance = [
    { id: 'ATD001', name: 'Aarav Sharma', subject: 'Digital System Design', present: 18, absent: 2, total: 20, pct: 90 },
    { id: 'ATD001', name: 'Aarav Sharma', subject: 'Mathematics', present: 15, absent: 5, total: 20, pct: 75 },
    { id: 'ATD002', name: 'Riya Patil', subject: 'Digital System Design', present: 20, absent: 0, total: 20, pct: 100 },
];

export const mockSubjectSummary = {
    subject: 'Digital System Design', totalClasses: 20, presentCount: 38, absentCount: 2, pct: 95
};

export const mockSubjectBreakdown = [
    { id: 'ATD001', name: 'Aarav Sharma', present: 18, absent: 2, total: 20, pct: 90 },
    { id: 'ATD002', name: 'Riya Patil', present: 20, absent: 0, total: 20, pct: 100 },
    { id: 'ATD003', name: 'Aditya Joshi', present: 14, absent: 6, total: 20, pct: 70 },
];

export const mockSessions = [
    { id: 'SESS1', date: '2026-08-28', time: '10:00 AM - 11:00 AM', subject: 'Digital System Design', faculty: 'Dr. Ananya Iyer', venue: 'Room 401', totalStudents: 3, present: 2, absent: 1, pct: 66 },
    { id: 'SESS2', date: '2026-08-27', time: '14:00 PM - 15:00 PM', subject: 'Mathematics', faculty: 'Prof. Meera Krishnan', venue: 'Room 402', totalStudents: 3, present: 3, absent: 0, pct: 100 },
];

export const mockSessionDetails = [
    { id: 'ATD001', name: 'Aarav Sharma', status: 'Present' },
    { id: 'ATD002', name: 'Riya Patil', status: 'Present' },
    { id: 'ATD003', name: 'Aditya Joshi', status: 'Absent' },
];

export const mockDivisionMatrix = [
    { id: 'ATD001', name: 'Aarav Sharma', subjects: { 'Digital System Design': 90, 'Mathematics': 75, 'Subject 3': 80, 'Subject 4': 95, 'Subject 5': 100 }, overall: 88 },
    { id: 'ATD002', name: 'Riya Patil', subjects: { 'Digital System Design': 100, 'Mathematics': 85, 'Subject 3': 90, 'Subject 4': 85, 'Subject 5': 90 }, overall: 90 },
    { id: 'ATD003', name: 'Aditya Joshi', subjects: { 'Digital System Design': 70, 'Mathematics': 65, 'Subject 3': 60, 'Subject 4': 75, 'Subject 5': 80 }, overall: 70 },
];

export const mockDivSubjects = ['Digital System Design', 'Mathematics', 'Subject 3', 'Subject 4', 'Subject 5'];
