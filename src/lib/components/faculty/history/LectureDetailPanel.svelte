<script>
	import { initialAttendance } from '$lib/data/facultyMock.js';

	let { lecture, students, initialModifications, onClose } = $props();

	let attendance = $state({});
	let modifications = $state([]);

	$effect(() => {
		if (lecture) {
			attendance = { ...initialAttendance[lecture.id] };
			modifications = [
				...initialModifications.filter((m) => m.lectureId === lecture.id)
			];
		}
	});

	function fmtDate(d) {
		return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function fmtTime(t) {
		const [h, m] = t.split(':');
		const hh = parseInt(h, 10);
		const ampm = hh >= 12 ? 'PM' : 'AM';
		const h12 = hh % 12 || 12;
		return `${h12}:${m} ${ampm}`;
	}

	function handleModify(studentId, newStatus) {
		const prevStatus = attendance[studentId];
		if (prevStatus === newStatus) return;

		attendance[studentId] = newStatus;
		
		modifications = [
			{
				id: 'M' + Date.now(),
				lectureId: lecture.id,
				studentId,
				previousStatus: prevStatus,
				newStatus: newStatus,
				modifiedBy: 'Faculty',
				timestamp: new Date().toISOString()
			},
			...modifications
		];
	}

	// Reactive counts
	const presentCount = $derived(Object.values(attendance).filter((s) => s === 'Present').length);
	const absentCount = $derived(Object.values(attendance).filter((s) => s === 'Absent').length);
	const totalCount = $derived(Object.values(attendance).length);
	const pct = $derived(totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100));

	let activeTab = $state('attendance'); // 'attendance' | 'modifications'
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
	<!-- Header -->
	<div class="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 shrink-0">
		<div>
			<p class="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">Lecture Details</p>
			<h3 class="text-lg font-bold text-gray-900 dark:text-white">{lecture.subject}</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{lecture.topic} &middot; {lecture.year} / Div {lecture.division} &middot; {fmtDate(lecture.date)}</p>
		</div>
		<button onclick={onClose} class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors mt-0.5" aria-label="Close details">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
		</button>
	</div>

	<!-- Stats Row -->
	<div class="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700/60 border-b border-gray-100 dark:border-gray-700/60 shrink-0">
		<div class="px-4 py-3 text-center">
			<p class="text-xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
			<p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">Total</p>
		</div>
		<div class="px-4 py-3 text-center">
			<p class="text-xl font-bold text-green-600 dark:text-green-400">{presentCount}</p>
			<p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">Present</p>
		</div>
		<div class="px-4 py-3 text-center">
			<p class="text-xl font-bold text-red-500 dark:text-red-400">{absentCount}</p>
			<p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">Absent</p>
		</div>
		<div class="px-4 py-3 text-center">
			<p class="text-xl font-bold text-gray-900 dark:text-white">{pct}%</p>
			<p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">Attendance</p>
		</div>
	</div>

	<!-- Times -->
	<div class="px-5 py-3 border-b border-gray-100 dark:border-gray-700/60 flex justify-between text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 shrink-0">
		<div>
			<span class="font-medium">Scheduled:</span> {fmtTime(lecture.startTime)} – {fmtTime(lecture.endTime)}
		</div>
		<div>
			<span class="font-medium">Actual:</span> {fmtTime(lecture.activatedAt)} – {fmtTime(lecture.closedAt)}
		</div>
	</div>

	<!-- Tabs -->
	<div class="flex border-b border-gray-100 dark:border-gray-700/60 px-2 shrink-0">
		<button 
			class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors {activeTab === 'attendance' ? 'border-purple-500 text-purple-700 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
			onclick={() => activeTab = 'attendance'}
		>
			Student Attendance
		</button>
		<button 
			class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 {activeTab === 'modifications' ? 'border-purple-500 text-purple-700 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
			onclick={() => activeTab = 'modifications'}
		>
			Modification History
			{#if modifications.length > 0}
				<span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded text-[10px]">{modifications.length}</span>
			{/if}
		</button>
	</div>

	<!-- Content Area -->
	<div class="flex-1 overflow-y-auto">
		{#if activeTab === 'attendance'}
			<div class="divide-y divide-gray-100 dark:divide-gray-700/40">
				{#each students as student}
					{@const status = attendance[student.id]}
					{#if status}
						<div class="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">{student.id}</p>
							</div>
							
							<div class="flex items-center gap-3">
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold {status === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}">
									{status}
								</span>
								
								<div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
									<button 
										onclick={() => handleModify(student.id, 'Present')}
										class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors {status === 'Present' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}"
									>
										Present
									</button>
									<button 
										onclick={() => handleModify(student.id, 'Absent')}
										class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors {status === 'Absent' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}"
									>
										Absent
									</button>
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else if activeTab === 'modifications'}
			{#if modifications.length === 0}
				<div class="px-5 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
					No attendance modifications recorded for this lecture.
				</div>
			{:else}
				<div class="p-4 space-y-4">
					{#each modifications as mod}
						{@const student = students.find(s => s.id === mod.studentId)}
						<div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/60 text-sm">
							<div class="flex justify-between items-start mb-2">
								<div>
									<span class="font-medium text-gray-900 dark:text-white">{student?.name || mod.studentId}</span>
									<span class="text-xs text-gray-500 dark:text-gray-400 ml-1">({mod.studentId})</span>
								</div>
								<span class="text-xs text-gray-400 dark:text-gray-500">
									{new Date(mod.timestamp).toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, day: 'numeric', month: 'short' })}
								</span>
							</div>
							
							<div class="flex items-center gap-2 mt-1">
								<span class="text-xs font-medium px-1.5 py-0.5 rounded {mod.previousStatus === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">{mod.previousStatus}</span>
								<svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
								<span class="text-xs font-medium px-1.5 py-0.5 rounded {mod.newStatus === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">{mod.newStatus}</span>
							</div>
							<div class="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
								Modified by {mod.modifiedBy}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
