export const divisions = [
    { id: 'FY-A', yearId: 'FY', yearLabel: 'FY', division: 'A', color: 'blue' },
    { id: 'FY-B', yearId: 'FY', yearLabel: 'FY', division: 'B', color: 'blue' },
    { id: 'SY-A', yearId: 'SY', yearLabel: 'SY', division: 'A', color: 'purple' },
    { id: 'SY-B', yearId: 'SY', yearLabel: 'SY', division: 'B', color: 'purple' },
    { id: 'TY-A', yearId: 'TY', yearLabel: 'TY', division: 'A', color: 'amber' },
    { id: 'TY-B', yearId: 'TY', yearLabel: 'TY', division: 'B', color: 'amber' },
    { id: 'BE-A', yearId: 'FourthYear', yearLabel: 'Fourth Year', division: 'A', color: 'emerald' },
    { id: 'BE-B', yearId: 'FourthYear', yearLabel: 'Fourth Year', division: 'B', color: 'emerald' }
];

export const mockLectures = [
    // SY-A Mock Data
    {
        id: 'LEC-1',
        divisionId: 'SY-A',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        subject: 'SY-S1-1', // Electronic Devices & Circuits
        facultyId: 'FAC001',
        venue: 'Room 201',
        type: 'Lecture'
    },
    {
        id: 'LEC-2',
        divisionId: 'SY-A',
        day: 'Monday',
        startTime: '10:00',
        endTime: '11:00',
        subject: 'SY-S1-2', // Digital System Design
        facultyId: 'FAC002',
        venue: 'Room 201',
        type: 'Lecture'
    },
    {
        id: 'LEC-3',
        divisionId: 'SY-A',
        day: 'Monday',
        startTime: '11:15',
        endTime: '13:15',
        subject: 'SY-S1-2',
        facultyId: 'FAC002',
        venue: 'Digital Lab 1',
        type: 'Practical'
    },
    {
        id: 'LEC-4',
        divisionId: 'SY-A',
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '11:00',
        subject: 'SY-S1-1',
        facultyId: 'FAC001',
        venue: 'Analog Lab 2',
        type: 'Practical'
    },
    {
        id: 'LEC-5',
        divisionId: 'SY-A',
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '10:00',
        subject: 'SY-S1-3', // Signals & Systems
        facultyId: 'FAC003',
        venue: 'Room 201',
        type: 'Lecture'
    },
    {
        id: 'LEC-6',
        divisionId: 'SY-A',
        day: 'Thursday',
        startTime: '14:00',
        endTime: '16:00',
        subject: 'SY-S1-4', // Network Analysis
        facultyId: 'FAC005',
        venue: 'Room 201',
        type: 'Lecture'
    },
    
    // TY-A Mock Data
    {
        id: 'LEC-7',
        divisionId: 'TY-A',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        subject: 'TY-S1-3', // VLSI Design
        facultyId: 'FAC001',
        venue: 'Room 305',
        type: 'Lecture'
    }
];
