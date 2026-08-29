/**
 * Mock data for the Classes & Subjects page.
 *
 * Structure:
 *   academicYears  — the four year-levels the admin manages
 *   subjectsByYear — keyed by year id, contains sem1 and sem2 subject arrays
 *
 * Each subject only needs { id, name } at this stage.
 * Division, faculty, timetable data lives elsewhere.
 */

export const academicYears = [
    {
        id: 'FY',
        label: 'First Year',
        shortLabel: 'FY',
        description: 'Foundation courses for all ENTC students',
        color: 'blue'
    },
    {
        id: 'SY',
        label: 'Second Year',
        shortLabel: 'SY',
        description: 'Core electronics and engineering fundamentals',
        color: 'purple'
    },
    {
        id: 'TY',
        label: 'Third Year',
        shortLabel: 'TY',
        description: 'Advanced specialization and electives',
        color: 'amber'
    },
    {
        id: 'FourthYear',
        label: 'Fourth Year',
        shortLabel: 'BE',
        description: 'Final year projects and professional electives',
        color: 'emerald'
    }
];

export const initialSubjectsByYear = {
    FY: {
        sem1: [
            { id: 'FY-S1-1', name: 'Engineering Mathematics I' },
            { id: 'FY-S1-2', name: 'Engineering Physics' },
            { id: 'FY-S1-3', name: 'Basic Electrical Engineering' },
            { id: 'FY-S1-4', name: 'Engineering Mechanics' },
            { id: 'FY-S1-5', name: 'Engineering Graphics' }
        ],
        sem2: [
            { id: 'FY-S2-1', name: 'Engineering Mathematics II' },
            { id: 'FY-S2-2', name: 'Engineering Chemistry' },
            { id: 'FY-S2-3', name: 'Basic Electronics Engineering' },
            { id: 'FY-S2-4', name: 'Programming & Problem Solving' },
            { id: 'FY-S2-5', name: 'Workshop Practice' }
        ]
    },
    SY: {
        sem1: [
            { id: 'SY-S1-1', name: 'Electronic Devices & Circuits' },
            { id: 'SY-S1-2', name: 'Digital System Design' },
            { id: 'SY-S1-3', name: 'Signals & Systems' },
            { id: 'SY-S1-4', name: 'Network Analysis' },
            { id: 'SY-S1-5', name: 'Engineering Mathematics III' }
        ],
        sem2: [
            { id: 'SY-S2-1', name: 'Analog Circuits' },
            { id: 'SY-S2-2', name: 'Microprocessor & Peripherals' },
            { id: 'SY-S2-3', name: 'Control Systems' },
            { id: 'SY-S2-4', name: 'Electromagnetic Engineering' },
            { id: 'SY-S2-5', name: 'Data Structures & Algorithms' }
        ]
    },
    TY: {
        sem1: [
            { id: 'TY-S1-1', name: 'Microcontrollers & Applications' },
            { id: 'TY-S1-2', name: 'Digital Communication' },
            { id: 'TY-S1-3', name: 'VLSI Design' },
            { id: 'TY-S1-4', name: 'Power Electronics' },
            { id: 'TY-S1-5', name: 'Digital Signal Processing' }
        ],
        sem2: [
            { id: 'TY-S2-1', name: 'Computer Communication Networks' },
            { id: 'TY-S2-2', name: 'Embedded Systems' },
            { id: 'TY-S2-3', name: 'Antenna & Wave Propagation' },
            { id: 'TY-S2-4', name: 'Image Processing' },
            { id: 'TY-S2-5', name: 'Operating Systems' }
        ]
    },
    FourthYear: {
        sem1: [
            { id: 'BE-S1-1', name: 'Wireless Communication' },
            { id: 'BE-S1-2', name: 'Optical Communication' },
            { id: 'BE-S1-3', name: 'Machine Learning' },
            { id: 'BE-S1-4', name: 'Project Phase I' }
        ],
        sem2: [
            { id: 'BE-S2-1', name: 'Internet of Things' },
            { id: 'BE-S2-2', name: 'Robotics & Automation' },
            { id: 'BE-S2-3', name: 'Professional Elective' },
            { id: 'BE-S2-4', name: 'Project Phase II' }
        ]
    }
};
