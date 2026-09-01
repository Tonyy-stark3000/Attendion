<script>
	import { students, lectures, initialAttendance, initialModifications } from '$lib/data/facultyMock.js';
	import { facultyAttendanceSessions, facultyList } from '$lib/data/adminMock.js';
	import LectureDetailPanel from '$lib/components/faculty/history/LectureDetailPanel.svelte';
	import StudentAnalyticsPanel from '$lib/components/faculty/history/StudentAnalyticsPanel.svelte';

	// ──── Page-level tab ────────────────────────────────────────────────────────
	let activeTab = $state('students'); // 'students' | 'faculty'

	// ──── STUDENT ATTENDANCE (reuse Faculty history logic) ───────────────────────

	let filterYear = $state('');
	let filterDivision = $state('');
	let filterSubject = $state('');
	let filterDate = $state('');
	let filterSearch = $state('');

	let selectedLecture = $state(null);
	let selectedStudent = $state(null);

	const years = [...new Set(lectures.map((l) => l.year))];
	const divisions = [...new Set(lectures.map((l) => l.division))];
	const subjects = [...new Set(lectures.map((l) => l.subject))];

	const filteredLectures = $derived(
		lectures.filter((l) => {
			if (filterYear && l.year !== filterYear) return false;
			if (filterDivision && l.division !== filterDivision) return false;
			if (filterSubject && l.subject !== filterSubject) return false;
			if (filterDate && l.date !== filterDate) return false;
			return true;
		})
	);

	function getLectureStats(lectureId) {
		const att = initialAttendance[lectureId] || {};
		const vals = Object.values(att);
		const total = vals.length;
		const present = vals.filter((s) => s === 'Present').length;
		const absent = vals.filter((s) => s === 'Absent').length;
		const pct = total === 0 ? 0 : Math.round((present / total) * 100);
		return { total, present, absent, pct };
	}

	const summary = $derived.by(() => {
		let totalLectures = filteredLectures.length;
		let totalStudents = 0;
		let totalPresent = 0;
		let sumPct = 0;
		filteredLectures.forEach((l) => {
			const stats = getLectureStats(l.id);
			totalStudents += stats.total;
			totalPresent += stats.present;
			sumPct += stats.pct;
		});
		const avgAttendance = totalLectures === 0 ? 0 : Math.round(sumPct / totalLectures);
		let below75Count = 0;
		if (totalLectures > 0) {
			const studentStats = {};
			filteredLectures.forEach((l) => {
				const att = initialAttendance[l.id] || {};
				Object.entries(att).forEach(([sId, status]) => {
					if (!studentStats[sId]) studentStats[sId] = { t: 0, p: 0 };
					studentStats[sId].t++;
					if (status === 'Present') studentStats[sId].p++;
				});
			});
			below75Count = Object.values(studentStats).filter(s => (s.p / s.t) < 0.75).length;
		}
		return { totalLectures, avgAttendance, totalPresent, below75Count };
	});

	function fmtDate(d) {
		return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
	}
	function fmtTime(t) {
		const [h, m] = t.split(':');
		const hh = parseInt(h, 10);
		const ampm = hh >= 12 ? 'PM' : 'AM';
		const h12 = hh % 12 || 12;
		return `${h12}:${m} ${ampm}`;
	}

	const searchResults = $derived(
		filterSearch.trim() === ''
			? []
			: students.filter((s) =>
					s.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
					s.id.toLowerCase().includes(filterSearch.toLowerCase())
				).slice(0, 5)
	);

	function selectStudent(student) {
		filterSearch = '';
		let totalLectures = 0, attended = 0, missed = 0;
		const history = [];
		lectures.forEach(l => {
			if (initialAttendance[l.id] && initialAttendance[l.id][student.id]) {
				const status = initialAttendance[l.id][student.id];
				totalLectures++;
				if (status === 'Present') attended++;
				else missed++;
				history.push({ date: l.date, subject: l.subject, topic: l.topic, startTime: l.startTime, endTime: l.endTime, status });
			}
		});
		history.sort((a, b) => new Date(b.date) - new Date(a.date));
		selectedStudent = { ...student, totalLectures, attended, missed, pct: totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100), history };
		selectedLecture = null;
	}

	function clearStudentFilters() {
		filterYear = ''; filterDivision = ''; filterSubject = ''; filterDate = ''; filterSearch = '';
	}

	// ──── FACULTY ATTENDANCE ─────────────────────────────────────────────────────

	let fFilterFaculty = $state('');
	let fFilterDate = $state('');
	let fFilterStatus = $state('');
	let fFilterSubject = $state('');

	const fSubjects = [...new Set(facultyAttendanceSessions.map(s => s.subject))];

	const filteredFacultySessions = $derived(
		facultyAttendanceSessions.filter(s => {
			if (fFilterFaculty && s.facultyId !== fFilterFaculty) return false;
			if (fFilterDate && s.date !== fFilterDate) return false;
			if (fFilterStatus && s.status !== fFilterStatus) return false;
			if (fFilterSubject && s.subject !== fFilterSubject) return false;
			return true;
		}).sort((a, b) => new Date(b.date) - new Date(a.date))
	);

	const fSummary = $derived.by(() => {
		const total = filteredFacultySessions.length;
		const present = filteredFacultySessions.filter(s => s.status === 'Present').length;
		const absent = filteredFacultySessions.filter(s => s.status === 'Absent').length;
		const late = filteredFacultySessions.filter(s => s.status === 'Late').length;
		const rate = total === 0 ? 0 : Math.round((present / total) * 100);
		return { total, present, absent, late, rate };
	});

	function clearFacultyFilters() {
		fFilterFaculty = ''; fFilterDate = ''; fFilterStatus = ''; fFilterSubject = '';
	}
</script>

<svelte:head>
	<title>Attendance | Admin Portal</title>
</svelte:head>

<div class="px-6 py-8 max-w-7xl mx-auto space-y-6">

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Attendance</h1>
		<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage attendance across your department.</p>
	</div>

	<!-- Page-level Tabs -->
	<div class="border-b border-gray-200 dark:border-gray-800">
		<nav class="-mb-px flex space-x-8" aria-label="Attendance Tabs">
			<button
				class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'students' ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
				onclick={() => activeTab = 'students'}
			>
				Student Attendance
			</button>
			<button
				class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'faculty' ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
				onclick={() => activeTab = 'faculty'}
			>
				Faculty Attendance
			</button>
		</nav>
	</div>

	<!-- ─── STUDENT ATTENDANCE ─── -->
	{#if activeTab === 'students'}
		<div class="space-y-6">

			<!-- Filters & Summary Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

				<!-- Filters -->
				<div class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
					<div class="flex items-center justify-between">
						<h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Filters</h3>
						<button onclick={clearStudentFilters} class="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">Clear all</button>
					</div>

					<div class="flex flex-wrap gap-4">
						<div class="w-full sm:w-auto flex-1 min-w-[150px]">
							<label for="sFilterDate" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
							<input type="date" id="sFilterDate" bind:value={filterDate} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 px-3 shadow-sm transition-colors"/>
						</div>
						<div class="w-full sm:w-auto min-w-[120px]">
							<label for="sFilterYear" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
							<select id="sFilterYear" bind:value={filterYear} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 pl-3 pr-8 shadow-sm transition-colors">
								<option value="">All</option>
								{#each years as y}<option value={y}>{y}</option>{/each}
							</select>
						</div>
						<div class="w-full sm:w-auto min-w-[120px]">
							<label for="sFilterDiv" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Division</label>
							<select id="sFilterDiv" bind:value={filterDivision} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 pl-3 pr-8 shadow-sm transition-colors">
								<option value="">All</option>
								{#each divisions as d}<option value={d}>{d}</option>{/each}
							</select>
						</div>
						<div class="w-full sm:w-auto flex-[2] min-w-[200px]">
							<label for="sFilterSubj" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
							<select id="sFilterSubj" bind:value={filterSubject} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 pl-3 pr-8 shadow-sm transition-colors">
								<option value="">All Subjects</option>
								{#each subjects as s}<option value={s}>{s}</option>{/each}
							</select>
						</div>
					</div>

					<!-- Student Search -->
					<div class="relative">
						<label for="sFilterSearch" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search Student Analytics</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
							</div>
							<input type="text" id="sFilterSearch" bind:value={filterSearch} placeholder="Search by name or ID..." class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 pl-10 pr-3 shadow-sm transition-colors" autocomplete="off"/>
						</div>
						{#if searchResults.length > 0}
							<div class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
								<ul class="py-1">
									{#each searchResults as s}
										<li>
											<button onclick={() => selectStudent(s)} class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
												<span class="text-sm font-medium text-gray-900 dark:text-white">{s.name}</span>
												<span class="text-xs text-gray-500 dark:text-gray-400">{s.id}</span>
											</button>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</div>

				<!-- Summary Stats -->
				<div class="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/40 p-5 flex flex-col justify-center">
					<h3 class="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">View Summary</h3>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalLectures}</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Lectures</p>
						</div>
						<div>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{summary.avgAttendance}%</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Avg. Attendance</p>
						</div>
						<div>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalPresent}</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Total Present</p>
						</div>
						<div>
							<p class="text-2xl font-bold text-amber-600 dark:text-amber-500">{summary.below75Count}</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Below 75%</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Lecture Table + Side Panel -->
			<div class="flex flex-col lg:flex-row gap-6 items-start">

				<!-- Lecture Table -->
				<div class="flex-1 w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
					<div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
						<h3 class="text-base font-semibold text-gray-900 dark:text-white">Lecture History</h3>
						{#if filterDate}
							<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
								Viewing: {fmtDate(filterDate)}
							</span>
						{/if}
					</div>

					{#if filteredLectures.length === 0}
						<div class="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
							No lectures found matching the current filters.
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-left text-sm min-w-[800px]">
								<thead class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
									<tr>
										<th class="px-5 py-3 font-medium">Date</th>
										<th class="px-5 py-3 font-medium">Class</th>
										<th class="px-5 py-3 font-medium">Subject / Topic</th>
										<th class="px-5 py-3 font-medium">Time</th>
										<th class="px-5 py-3 font-medium text-center">Attendance</th>
										<th class="px-5 py-3 font-medium"></th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-100 dark:divide-gray-700/40">
									{#each filteredLectures.sort((a, b) => new Date(b.date) - new Date(a.date)) as lecture}
										{@const stats = getLectureStats(lecture.id)}
										<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors {selectedLecture?.id === lecture.id ? 'bg-purple-50 dark:bg-purple-900/10' : ''}">
											<td class="px-5 py-4 text-gray-900 dark:text-white whitespace-nowrap">{fmtDate(lecture.date)}</td>
											<td class="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{lecture.year} &middot; Div {lecture.division}</td>
											<td class="px-5 py-4">
												<p class="font-medium text-gray-900 dark:text-white">{lecture.subject}</p>
												<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lecture.topic}</p>
											</td>
											<td class="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtTime(lecture.startTime)} – {fmtTime(lecture.endTime)}</td>
											<td class="px-5 py-4 text-center">
												<div class="flex items-center justify-center gap-2">
													<span class="font-bold {stats.pct < 75 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}">{stats.pct}%</span>
													<span class="text-xs text-gray-500 dark:text-gray-400">({stats.present}/{stats.total})</span>
												</div>
											</td>
											<td class="px-5 py-4 text-right">
												<button
													onclick={() => { selectedLecture = lecture; selectedStudent = null; }}
													class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors"
												>
													View Details
												</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>

				<!-- Side Panels -->
				{#if selectedLecture}
					<div class="w-full lg:w-[380px] shrink-0">
						<LectureDetailPanel
							lecture={selectedLecture}
							students={students.filter(s => s.year === selectedLecture.year && s.division === selectedLecture.division)}
							initialModifications={initialModifications}
							onClose={() => selectedLecture = null}
						/>
					</div>
				{/if}

				{#if selectedStudent}
					<div class="w-full lg:w-[380px] shrink-0">
						<StudentAnalyticsPanel
							summary={selectedStudent}
							onClose={() => selectedStudent = null}
						/>
					</div>
				{/if}

			</div>
		</div>
	{/if}

	<!-- ─── FACULTY ATTENDANCE ─── -->
	{#if activeTab === 'faculty'}
		<div class="space-y-6">

			<!-- Filters & Summary Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

				<!-- Filters -->
				<div class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
					<div class="flex items-center justify-between">
						<h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Filters</h3>
						<button onclick={clearFacultyFilters} class="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">Clear all</button>
					</div>

					<div class="flex flex-wrap gap-4">
						<div class="w-full sm:w-auto flex-1 min-w-[150px]">
							<label for="fFilterDate" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
							<input type="date" id="fFilterDate" bind:value={fFilterDate} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 px-3 shadow-sm transition-colors"/>
						</div>
						<div class="w-full sm:w-auto min-w-[160px]">
							<label for="fFilterFaculty" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
							<select id="fFilterFaculty" bind:value={fFilterFaculty} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 pl-3 pr-8 shadow-sm transition-colors">
								<option value="">All Faculty</option>
								{#each facultyList as f}<option value={f.id}>{f.name}</option>{/each}
							</select>
						</div>
						<div class="w-full sm:w-auto flex-[2] min-w-[180px]">
							<label for="fFilterSubj" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
							<select id="fFilterSubj" bind:value={fFilterSubject} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 pl-3 pr-8 shadow-sm transition-colors">
								<option value="">All Subjects</option>
								{#each fSubjects as s}<option value={s}>{s}</option>{/each}
							</select>
						</div>
						<div class="w-full sm:w-auto min-w-[130px]">
							<label for="fFilterStatus" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
							<select id="fFilterStatus" bind:value={fFilterStatus} class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 py-2 pl-3 pr-8 shadow-sm transition-colors">
								<option value="">All Statuses</option>
								<option value="Present">Present</option>
								<option value="Late">Late</option>
								<option value="Absent">Absent</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Summary Stats -->
				<div class="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/40 p-5 flex flex-col justify-center">
					<h3 class="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">View Summary</h3>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{fSummary.total}</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Sessions</p>
						</div>
						<div>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{fSummary.rate}%</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Present Rate</p>
						</div>
						<div>
							<p class="text-2xl font-bold text-amber-600 dark:text-amber-500">{fSummary.late}</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Late</p>
						</div>
						<div>
							<p class="text-2xl font-bold text-red-500 dark:text-red-400">{fSummary.absent}</p>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Absent</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Faculty Sessions Table -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
				<div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
					<h3 class="text-base font-semibold text-gray-900 dark:text-white">Faculty Session Log</h3>
					{#if fFilterDate}
						<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
							Viewing: {fmtDate(fFilterDate)}
						</span>
					{/if}
				</div>

				{#if filteredFacultySessions.length === 0}
					<div class="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
						No sessions found matching the current filters.
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm min-w-[700px]">
							<thead class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
								<tr>
									<th class="px-5 py-3 font-medium">Date</th>
									<th class="px-5 py-3 font-medium">Faculty</th>
									<th class="px-5 py-3 font-medium">Subject</th>
									<th class="px-5 py-3 font-medium">Class</th>
									<th class="px-5 py-3 font-medium">Time</th>
									<th class="px-5 py-3 font-medium text-center">Status</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100 dark:divide-gray-700/40">
								{#each filteredFacultySessions as session}
									{@const statusColors = session.status === 'Present'
										? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
										: session.status === 'Late'
										? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
										: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}
									<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
										<td class="px-5 py-4 text-gray-900 dark:text-white whitespace-nowrap">{fmtDate(session.date)}</td>
										<td class="px-5 py-4">
											<div class="flex items-center gap-3">
												<div class="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
													{session.name.split(' ').pop().charAt(0)}
												</div>
												<span class="font-medium text-gray-900 dark:text-white">{session.name}</span>
											</div>
										</td>
										<td class="px-5 py-4 text-gray-700 dark:text-gray-300">{session.subject}</td>
										<td class="px-5 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{session.year} &middot; Div {session.division}</td>
										<td class="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtTime(session.startTime)} – {fmtTime(session.endTime)}</td>
										<td class="px-5 py-4 text-center">
											<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold {statusColors}">
												{session.status}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>

		</div>
	{/if}

</div>
