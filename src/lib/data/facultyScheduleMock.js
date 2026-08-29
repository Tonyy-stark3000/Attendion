/**
 * Faculty Portal — Schedule Mock Data
 * Represents scheduled lectures and practicals across a week.
 */

// Today is set to 'Wednesday' for the mock scenario
export const currentDay = 'Wednesday';

export const initialSchedule = [
	// MONDAY
	{
		id: 'S001',
		day: 'Monday',
		type: 'Lecture',
		subject: 'Digital System Design',
		topic: 'Flip Flops',
		year: 'SY',
		division: 'A',
		venue: 'Room 204',
		scheduledStart: '10:00',
		scheduledEnd: '11:00',
		status: 'Completed',
		activatedAt: '10:02',
		closedAt: '11:03',
		closureMethod: 'RFID'
	},
	{
		id: 'S002',
		day: 'Monday',
		type: 'Lecture',
		subject: 'Data Structures',
		topic: 'Trees',
		year: 'SY',
		division: 'B',
		venue: 'Room 302',
		scheduledStart: '12:00',
		scheduledEnd: '13:00',
		status: 'Completed',
		activatedAt: '12:00',
		closedAt: '13:00',
		closureMethod: 'Auto-closed'
	},
	
	// TUESDAY
	{
		id: 'S003',
		day: 'Tuesday',
		type: 'Practical',
		subject: 'Electronics Devices & Circuits',
		topic: 'BJT Biasing Exp',
		year: 'SY',
		division: 'A',
		venue: 'Lab 1',
		scheduledStart: '09:00',
		scheduledEnd: '11:00',
		status: 'Completed',
		activatedAt: '08:58',
		closedAt: '10:45',
		closureMethod: 'Manual'
	},
	{
		id: 'S004',
		day: 'Tuesday',
		type: 'Lecture',
		subject: 'Mathematics',
		topic: 'Laplace Transforms',
		year: 'SY',
		division: 'A',
		venue: 'Room 204',
		scheduledStart: '14:00',
		scheduledEnd: '15:00',
		status: 'Completed',
		activatedAt: '14:05',
		closedAt: '15:00',
		closureMethod: 'Auto-closed'
	},

	// WEDNESDAY (Today)
	{
		id: 'S005',
		day: 'Wednesday',
		type: 'Lecture',
		subject: 'Data Structures',
		topic: 'Graphs',
		year: 'SY',
		division: 'B',
		venue: 'Room 302',
		scheduledStart: '09:00',
		scheduledEnd: '10:00',
		status: 'Completed',
		activatedAt: '09:01',
		closedAt: '10:02',
		closureMethod: 'RFID'
	},
	{
		id: 'S006',
		day: 'Wednesday',
		type: 'Lecture',
		subject: 'Digital System Design',
		topic: 'Multiplexers',
		year: 'SY',
		division: 'A',
		venue: 'Room 204',
		scheduledStart: '11:00',
		scheduledEnd: '12:00',
		status: 'Active',
		activatedAt: '10:58',
		closedAt: null,
		closureMethod: null
	},
	{
		id: 'S007',
		day: 'Wednesday',
		type: 'Practical',
		subject: 'Data Structures',
		topic: 'Graph Implementations',
		year: 'TY',
		division: 'A',
		venue: 'Lab 2',
		scheduledStart: '14:00',
		scheduledEnd: '16:00',
		status: 'Upcoming',
		activatedAt: null,
		closedAt: null,
		closureMethod: null
	},

	// THURSDAY
	{
		id: 'S008',
		day: 'Thursday',
		type: 'Lecture',
		subject: 'Mathematics',
		topic: 'Integration',
		year: 'FY',
		division: 'A',
		venue: 'Room 101',
		scheduledStart: '09:00',
		scheduledEnd: '10:00',
		status: 'Upcoming',
		activatedAt: null,
		closedAt: null,
		closureMethod: null
	},
	{
		id: 'S009',
		day: 'Thursday',
		type: 'Lecture',
		subject: 'Digital System Design',
		topic: 'Logic Gates',
		year: 'SY',
		division: 'A',
		venue: 'Room 204',
		scheduledStart: '10:00',
		scheduledEnd: '11:00',
		status: 'Upcoming',
		activatedAt: null,
		closedAt: null,
		closureMethod: null
	},
	
	// FRIDAY
	{
		id: 'S010',
		day: 'Friday',
		type: 'Lecture',
		subject: 'Electronics Devices & Circuits',
		topic: 'Diodes',
		year: 'SY',
		division: 'A',
		venue: 'Room 205',
		scheduledStart: '11:30',
		scheduledEnd: '12:30',
		status: 'Upcoming',
		activatedAt: null,
		closedAt: null,
		closureMethod: null
	}
];
