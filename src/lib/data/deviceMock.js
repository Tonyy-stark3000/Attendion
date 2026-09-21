export const mockDevices = [
    {
        id: 'DEV-001',
        name: 'ESP32-R1',
        venue: 'Room 401 (Classroom)',
        isOnline: true,
        lastSeen: 'Just now',
        status: 'Active',
        readerStatus: 'Connected',
        currentSession: 'Digital System Design (SY - A)'
    },
    {
        id: 'DEV-002',
        name: 'ESP32-R2',
        venue: 'Room 402 (Classroom)',
        isOnline: false,
        lastSeen: '10 mins ago',
        status: 'Active',
        readerStatus: 'Disconnected',
        currentSession: null
    },
    {
        id: 'DEV-003',
        name: 'ESP32-L1',
        venue: 'Room 410 (Lab)',
        isOnline: true,
        lastSeen: 'Just now',
        status: 'Active',
        readerStatus: 'Connected',
        currentSession: 'Data Structures Lab (SY - B)'
    },
    {
        id: 'DEV-004',
        name: 'ESP32-R3',
        venue: 'Room 403 (Classroom)',
        isOnline: false,
        lastSeen: '2 days ago',
        status: 'Inactive',
        readerStatus: 'Offline',
        currentSession: null
    }
];

export const mockDeviceActivity = {
    'DEV-001': [
        { id: 1, uid: 'E3 4A 12 99', time: '10:05 AM', result: 'Accepted' },
        { id: 2, uid: '1A 2B 3C 4D', time: '10:06 AM', result: 'Rejected' },
        { id: 3, uid: 'F1 0A 9B 42', time: '10:10 AM', result: 'Accepted' }
    ],
    'DEV-003': [
        { id: 4, uid: 'AA BB CC DD', time: '09:02 AM', result: 'Accepted' },
        { id: 5, uid: '11 22 33 44', time: '09:05 AM', result: 'Unknown' }
    ]
};
