/**
 * Faculty Portal — Local Mock Data
 * Replace each export with a real API/Supabase call in a later step.
 */

/** @type {{ id: string, name: string, year: 'FY'|'SY'|'TY', division: 'A'|'B'|'C' }[]} */
export const students = [
	// SY / Division A — 8 students
	{ id: 'ATD001', name: 'Aarav Sharma',   year: 'SY', division: 'A' },
	{ id: 'ATD002', name: 'Riya Patil',     year: 'SY', division: 'A' },
	{ id: 'ATD003', name: 'Aditya Joshi',   year: 'SY', division: 'A' },
	{ id: 'ATD004', name: 'Priya Mehta',    year: 'SY', division: 'A' },
	{ id: 'ATD005', name: 'Rohan Gupta',    year: 'SY', division: 'A' },
	{ id: 'ATD006', name: 'Neha Singh',     year: 'SY', division: 'A' },
	{ id: 'ATD007', name: 'Vivek Kumar',    year: 'SY', division: 'A' },
	{ id: 'ATD008', name: 'Anjali Rao',     year: 'SY', division: 'A' },
	// SY / Division B — 4 students
	{ id: 'ATD009', name: 'Kiran Desai',    year: 'SY', division: 'B' },
	{ id: 'ATD010', name: 'Pooja Nair',     year: 'SY', division: 'B' },
	{ id: 'ATD011', name: 'Siddharth Iyer', year: 'SY', division: 'B' },
	{ id: 'ATD012', name: 'Meera Pillai',   year: 'SY', division: 'B' },
	// TY / Division A — 4 students
	{ id: 'ATD013', name: 'Arjun Tiwari',   year: 'TY', division: 'A' },
	{ id: 'ATD014', name: 'Sneha Reddy',    year: 'TY', division: 'A' },
	{ id: 'ATD015', name: 'Dev Patel',      year: 'TY', division: 'A' },
	{ id: 'ATD016', name: 'Kavya Sharma',   year: 'TY', division: 'A' },
	// FY / Division A — 4 students
	{ id: 'ATD017', name: 'Rahul Verma',    year: 'FY', division: 'A' },
	{ id: 'ATD018', name: 'Ishaan Modi',    year: 'FY', division: 'A' },
	{ id: 'ATD019', name: 'Tanvi Shah',     year: 'FY', division: 'A' },
	{ id: 'ATD020', name: 'Raj Kapoor',     year: 'FY', division: 'A' },
];

export const lectures = [
	// SY / A
	{ id: 'L001', subject: 'Digital System Design',          topic: 'Flip Flops',        year: 'SY', division: 'A', date: '2026-08-28', startTime: '10:00', endTime: '11:00', activatedAt: '10:02', closedAt: '11:03' },
	{ id: 'L003', subject: 'Electronics Devices & Circuits', topic: 'BJT Biasing',       year: 'SY', division: 'A', date: '2026-08-28', startTime: '11:30', endTime: '12:30', activatedAt: '11:32', closedAt: '12:31' },
	{ id: 'L002', subject: 'Digital System Design',          topic: 'Counters',           year: 'SY', division: 'A', date: '2026-08-27', startTime: '10:00', endTime: '11:00', activatedAt: '10:01', closedAt: '11:00' },
	{ id: 'L005', subject: 'Mathematics',                    topic: 'Laplace Transforms', year: 'SY', division: 'A', date: '2026-08-27', startTime: '14:00', endTime: '15:00', activatedAt: '14:03', closedAt: '15:01' },
	{ id: 'L006', subject: 'Digital System Design',          topic: 'Multiplexers',       year: 'SY', division: 'A', date: '2026-08-26', startTime: '10:00', endTime: '11:00', activatedAt: '10:00', closedAt: '11:00' },
	{ id: 'L009', subject: 'Digital System Design',          topic: 'Logic Gates',        year: 'SY', division: 'A', date: '2026-08-25', startTime: '10:00', endTime: '11:00', activatedAt: '10:00', closedAt: '11:01' },
	{ id: 'L010', subject: 'Electronics Devices & Circuits', topic: 'Diodes',             year: 'SY', division: 'A', date: '2026-08-25', startTime: '11:30', endTime: '12:30', activatedAt: '11:30', closedAt: '12:30' },
	// SY / B
	{ id: 'L004', subject: 'Data Structures',                topic: 'Binary Trees',       year: 'SY', division: 'B', date: '2026-08-28', startTime: '09:00', endTime: '10:00', activatedAt: '09:01', closedAt: '10:02' },
	// TY / A
	{ id: 'L007', subject: 'Data Structures',                topic: 'Linked Lists',       year: 'TY', division: 'A', date: '2026-08-26', startTime: '11:00', endTime: '12:00', activatedAt: '11:01', closedAt: '12:00' },
	// FY / A
	{ id: 'L008', subject: 'Mathematics',                    topic: 'Integration',        year: 'FY', division: 'A', date: '2026-08-25', startTime: '09:00', endTime: '10:00', activatedAt: '09:02', closedAt: '10:00' },
];

/**
 * Current attendance state (after all modifications applied).
 * Shape: { [lectureId]: { [studentId]: 'Present' | 'Absent' } }
 *
 * SY/A student attendance across 7 lectures (L001,L003,L002,L005,L006,L009,L010):
 *   ATD001 (Aarav):  7/7 = 100%
 *   ATD002 (Riya):   7/7 = 100%
 *   ATD003 (Aditya): 2/7 =  29%  ← below 75%
 *   ATD004 (Priya):  6/7 =  86%
 *   ATD005 (Rohan):  5/7 =  71%  ← below 75%
 *   ATD006 (Neha):   5/7 =  71%  ← below 75% (L002 was modified A→P, reflected here)
 *   ATD007 (Vivek):  7/7 = 100%
 *   ATD008 (Anjali): 7/7 = 100%
 */
export const initialAttendance = {
	L001: { ATD001: 'Present', ATD002: 'Present', ATD003: 'Absent',  ATD004: 'Present', ATD005: 'Present', ATD006: 'Absent',  ATD007: 'Present', ATD008: 'Present' },
	L002: { ATD001: 'Present', ATD002: 'Present', ATD003: 'Absent',  ATD004: 'Absent',  ATD005: 'Present', ATD006: 'Present', ATD007: 'Present', ATD008: 'Present' },
	L003: { ATD001: 'Present', ATD002: 'Present', ATD003: 'Present', ATD004: 'Present', ATD005: 'Present', ATD006: 'Absent',  ATD007: 'Present', ATD008: 'Present' },
	L004: { ATD009: 'Present', ATD010: 'Present', ATD011: 'Absent',  ATD012: 'Present' },
	L005: { ATD001: 'Present', ATD002: 'Present', ATD003: 'Absent',  ATD004: 'Present', ATD005: 'Present', ATD006: 'Present', ATD007: 'Present', ATD008: 'Present' },
	L006: { ATD001: 'Present', ATD002: 'Present', ATD003: 'Absent',  ATD004: 'Present', ATD005: 'Absent',  ATD006: 'Present', ATD007: 'Present', ATD008: 'Present' },
	L007: { ATD013: 'Present', ATD014: 'Present', ATD015: 'Absent',  ATD016: 'Present' },
	L008: { ATD017: 'Present', ATD018: 'Absent',  ATD019: 'Present', ATD020: 'Present' },
	L009: { ATD001: 'Present', ATD002: 'Present', ATD003: 'Present', ATD004: 'Present', ATD005: 'Absent',  ATD006: 'Present', ATD007: 'Present', ATD008: 'Present' },
	L010: { ATD001: 'Present', ATD002: 'Present', ATD003: 'Absent',  ATD004: 'Present', ATD005: 'Present', ATD006: 'Present', ATD007: 'Present', ATD008: 'Present' },
};

/**
 * Pre-existing modification audit trail.
 * L002 / ATD006 (Neha Singh): originally Absent, corrected to Present.
 */
export const initialModifications = [
	{
		id: 'M001',
		lectureId: 'L002',
		studentId: 'ATD006',
		previousStatus: 'Absent',
		newStatus: 'Present',
		modifiedBy: 'Faculty',
		timestamp: '2026-08-27T14:30:00',
	},
];
