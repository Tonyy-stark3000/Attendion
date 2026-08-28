<script>
	/** @type {{ id: string, name: string, year: string, division: string, totalLectures: number, attended: number, missed: number, pct: number, history: { date: string, subject: string, topic: string, startTime: string, endTime: string, status: string }[] }} */
	let { summary, onClose } = $props();

	function fmtDate(d) {
		return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	const isLow = $derived(summary.pct < 75);
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
	<!-- Header -->
	<div class="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
		<div>
			<p class="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">Student Analytics</p>
			<h3 class="text-lg font-bold text-gray-900 dark:text-white">{summary.name}</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{summary.id} &middot; {summary.year} / Div {summary.division}</p>
		</div>
		<button onclick={onClose} class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors mt-0.5" aria-label="Close student analytics">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
		</button>
	</div>

	<!-- Stats Row -->
	<div class="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700/60 border-b border-gray-100 dark:border-gray-700/60">
		<div class="px-4 py-4 text-center">
			<p class="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalLectures}</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
		</div>
		<div class="px-4 py-4 text-center">
			<p class="text-2xl font-bold text-green-600 dark:text-green-400">{summary.attended}</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Attended</p>
		</div>
		<div class="px-4 py-4 text-center">
			<p class="text-2xl font-bold text-red-500 dark:text-red-400">{summary.missed}</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Missed</p>
		</div>
		<div class="px-4 py-4 text-center">
			<p class="text-2xl font-bold {isLow ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}">{summary.pct}%</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Attendance</p>
			{#if isLow}
				<p class="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-0.5">Below 75%</p>
			{/if}
		</div>
	</div>

	<!-- Progress Bar -->
	<div class="px-5 py-3 border-b border-gray-100 dark:border-gray-700/60">
		<div class="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1.5">
			<span>Attendance rate</span>
			<span class="{isLow ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}">{summary.pct}%</span>
		</div>
		<div class="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
			<div class="h-full rounded-full transition-all {isLow ? 'bg-amber-500' : 'bg-green-500'}" style="width: {summary.pct}%"></div>
			<!-- 75% threshold marker -->
			<div class="absolute top-0 h-full border-l-2 border-amber-400/60 dark:border-amber-500/60 border-dashed" style="left: 75%"></div>
		</div>
		<div class="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
			<span>0%</span>
			<span class="text-amber-500 dark:text-amber-400">75% threshold</span>
			<span>100%</span>
		</div>
	</div>

	<!-- Lecture History -->
	<div class="px-5 py-4">
		<h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Lecture History</h4>
		{#if summary.history.length === 0}
			<p class="text-sm text-gray-400 dark:text-gray-500 italic">No lecture history available.</p>
		{:else}
			<div class="overflow-x-auto -mx-1">
				<table class="w-full text-sm min-w-[440px]">
					<thead>
						<tr class="text-left border-b border-gray-100 dark:border-gray-700/60">
							<th class="pb-2 pr-3 text-xs font-semibold text-gray-400 dark:text-gray-500 font-normal">Date</th>
							<th class="pb-2 pr-3 text-xs font-semibold text-gray-400 dark:text-gray-500 font-normal">Subject</th>
							<th class="pb-2 pr-3 text-xs font-semibold text-gray-400 dark:text-gray-500 font-normal">Topic</th>
							<th class="pb-2 pr-3 text-xs font-semibold text-gray-400 dark:text-gray-500 font-normal">Time</th>
							<th class="pb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 font-normal text-right">Status</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100 dark:divide-gray-700/40">
						{#each summary.history as entry}
							<tr class="group">
								<td class="py-2.5 pr-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmtDate(entry.date)}</td>
								<td class="py-2.5 pr-3 text-gray-900 dark:text-white font-medium text-xs leading-snug">{entry.subject}</td>
								<td class="py-2.5 pr-3 text-gray-500 dark:text-gray-400">{entry.topic}</td>
								<td class="py-2.5 pr-3 text-gray-400 dark:text-gray-500 whitespace-nowrap text-xs">{entry.startTime}–{entry.endTime}</td>
								<td class="py-2.5 text-right">
									<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold {entry.status === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}">
										{entry.status}
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
