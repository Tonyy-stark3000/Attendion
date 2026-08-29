<script>
	import { initialSchedule, currentDay } from '$lib/data/facultyScheduleMock.js';
	import LectureDetailPanel from '$lib/components/faculty/schedule/LectureDetailPanel.svelte';
	
	let schedule = $state([...initialSchedule]);
	let selectedLecture = $state(null);
	let activeDay = $state(currentDay);

	const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	// Format time
	function fmtTime(t) {
		if (!t) return '';
		const [h, m] = t.split(':');
		const hh = parseInt(h, 10);
		const ampm = hh >= 12 ? 'PM' : 'AM';
		const h12 = hh % 12 || 12;
		return `${h12}:${m} ${ampm}`;
	}

	function getCurrentTimeFormatted() {
		const now = new Date();
		const h = now.getHours().toString().padStart(2, '0');
		const m = now.getMinutes().toString().padStart(2, '0');
		return `${h}:${m}`;
	}

	function activateLecture(id) {
		const idx = schedule.findIndex(l => l.id === id);
		if (idx !== -1) {
			schedule[idx].status = 'Active';
			schedule[idx].activatedAt = getCurrentTimeFormatted();
			if (selectedLecture && selectedLecture.id === id) {
				selectedLecture = schedule[idx];
			}
		}
	}

	function closeLecture(id, method) {
		const idx = schedule.findIndex(l => l.id === id);
		if (idx !== -1) {
			schedule[idx].status = 'Completed';
			schedule[idx].closedAt = getCurrentTimeFormatted();
			schedule[idx].closureMethod = method;
			if (selectedLecture && selectedLecture.id === id) {
				selectedLecture = schedule[idx];
			}
		}
	}

	// Auto-close simulation (triggered randomly or by some logic for demonstration)
	// For mock purposes, let's just create a button to simulate auto-close for the active lecture.
	function simulateAutoClose() {
		const activeLec = schedule.find(l => l.status === 'Active');
		if (activeLec) {
			closeLecture(activeLec.id, 'Auto-closed');
		}
	}

	// Derived Views
	const todaysLectures = $derived(schedule.filter(l => l.day === currentDay).sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart)));
	
	// Group for weekly timetable
	const weeklySchedule = $derived.by(() => {
		const map = {};
		daysOfWeek.forEach(d => map[d] = []);
		schedule.forEach(l => {
			if (map[l.day]) map[l.day].push(l);
		});
		Object.values(map).forEach(dayList => dayList.sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart)));
		return map;
	});

</script>

<svelte:head>
	<title>Schedule | Faculty Portal</title>
</svelte:head>

<div class="max-w-7xl mx-auto space-y-8 pb-12">
	
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">My Schedule</h2>
			<p class="text-base text-gray-500 dark:text-gray-400">Manage your lectures and attendance sessions.</p>
		</div>
		<button onclick={simulateAutoClose} class="text-xs font-medium text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
			Simulate Auto-close
		</button>
	</div>

	<!-- Main Content Grid -->
	<div class="flex flex-col xl:flex-row gap-6 items-start">
		
		<!-- Left Side: Today & Weekly Schedule -->
		<div class="flex-1 w-full space-y-8 min-w-0">
			
			<!-- Today's Schedule -->
			<section>
				<div class="flex items-center gap-3 mb-4">
					<h3 class="text-lg font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
					<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 uppercase tracking-wide">
						{currentDay}
					</span>
				</div>

				{#if todaysLectures.length === 0}
					<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
						You have no classes scheduled for today.
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each todaysLectures as lec}
							<button 
								class="text-left bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 p-4 relative overflow-hidden group {selectedLecture?.id === lec.id ? 'border-purple-500 ring-1 ring-purple-500 shadow-md' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:border-purple-300 dark:hover:border-purple-600/50 hover:shadow-md'}"
								onclick={() => selectedLecture = lec}
							>
								<!-- Active Indicator strip -->
								{#if lec.status === 'Active'}
									<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500"></div>
								{/if}

								<div class="flex justify-between items-start mb-3">
									<span class="text-xs font-bold text-gray-500 dark:text-gray-400">{fmtTime(lec.scheduledStart)} – {fmtTime(lec.scheduledEnd)}</span>
									<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase {lec.status === 'Completed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : lec.status === 'Active' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}">
										{#if lec.status === 'Active'}<span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5 animate-pulse"></span>{/if}
										{lec.status}
									</span>
								</div>
								
								<h4 class="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{lec.subject}</h4>
								
								<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
									<span class="font-medium text-gray-700 dark:text-gray-300">{lec.year} / Div {lec.division}</span>
									<span>&bull;</span>
									<span>{lec.type}</span>
								</div>

								<div class="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1.5 rounded-lg w-fit">
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
									{lec.venue}
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Weekly Timetable -->
			<section>
				<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Weekly Timetable</h3>
				
				<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
					
					<!-- Day Tabs for Mobile/Tablet -->
					<div class="flex lg:hidden overflow-x-auto border-b border-gray-100 dark:border-gray-700 hide-scrollbar">
						{#each daysOfWeek as day}
							<button 
								class="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors {activeDay === day ? 'border-purple-500 text-purple-700 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
								onclick={() => activeDay = day}
							>
								{day}
							</button>
						{/each}
					</div>

					<!-- Mobile View: Active Day Content -->
					<div class="block lg:hidden p-4">
						{#if weeklySchedule[activeDay].length === 0}
							<div class="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">No classes scheduled.</div>
						{:else}
							<div class="space-y-3">
								{#each weeklySchedule[activeDay] as lec}
									<button 
										class="w-full text-left bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/60 hover:border-purple-300 dark:hover:border-purple-500/50 transition-colors {selectedLecture?.id === lec.id ? 'ring-1 ring-purple-500 bg-purple-50 dark:bg-purple-900/10' : ''}"
										onclick={() => selectedLecture = lec}
									>
										<div class="flex justify-between items-center mb-1">
											<span class="text-xs font-bold text-gray-900 dark:text-white">{fmtTime(lec.scheduledStart)} – {fmtTime(lec.scheduledEnd)}</span>
											<span class="text-[10px] uppercase tracking-wider font-semibold text-gray-500">{lec.type}</span>
										</div>
										<p class="text-sm font-medium text-purple-700 dark:text-purple-400 truncate">{lec.subject}</p>
										<div class="flex justify-between items-end mt-2 text-xs text-gray-500 dark:text-gray-400">
											<span>{lec.year} {lec.division} &bull; {lec.venue}</span>
											<span class="font-medium {lec.status === 'Active' ? 'text-purple-600 dark:text-purple-400' : ''}">{lec.status}</span>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Desktop View: Full Horizontal Table -->
					<div class="hidden lg:block overflow-x-auto">
						<table class="w-full text-left text-sm min-w-[800px]">
							<thead class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
								<tr>
									<th class="px-5 py-3 w-32 border-b border-gray-200 dark:border-gray-700">Day</th>
									<th class="px-5 py-3 border-b border-gray-200 dark:border-gray-700">Classes</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
								{#each daysOfWeek as day}
									<tr>
										<td class="px-5 py-4 align-top font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/30">
											{day}
											{#if day === currentDay}
												<span class="block text-[10px] text-purple-600 dark:text-purple-400 uppercase mt-1 font-bold">Today</span>
											{/if}
										</td>
										<td class="px-5 py-4">
											{#if weeklySchedule[day].length === 0}
												<span class="text-gray-400 dark:text-gray-500 italic text-xs">No classes scheduled</span>
											{:else}
												<div class="flex flex-wrap gap-3">
													{#each weeklySchedule[day] as lec}
														<button 
															class="flex flex-col text-left bg-white dark:bg-gray-800 border rounded-xl p-3 w-[220px] transition-colors {selectedLecture?.id === lec.id ? 'border-purple-500 ring-1 ring-purple-500 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600/60'}"
															onclick={() => selectedLecture = lec}
														>
															<span class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{fmtTime(lec.scheduledStart)} – {fmtTime(lec.scheduledEnd)}</span>
															<span class="text-sm font-medium text-gray-900 dark:text-white truncate w-full mb-0.5 group-hover:text-purple-600">{lec.subject}</span>
															<div class="flex justify-between items-center w-full text-[11px] text-gray-500 dark:text-gray-400 mt-2">
																<span class="font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{lec.venue}</span>
																<span class="font-medium {lec.status === 'Active' ? 'text-purple-600 dark:text-purple-400' : ''}">{lec.status}</span>
															</div>
														</button>
													{/each}
												</div>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

				</div>
			</section>

		</div>

		<!-- Right Side: Side Panel -->
		{#if selectedLecture}
			<div class="w-full xl:w-[380px] shrink-0 sticky top-4">
				<LectureDetailPanel 
					lecture={selectedLecture} 
					onActivate={activateLecture}
					onClose={(id) => closeLecture(id, 'RFID')}
					onManualClose={(id) => closeLecture(id, 'Manual')}
					onClosePanel={() => selectedLecture = null}
				/>
			</div>
		{/if}

	</div>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
