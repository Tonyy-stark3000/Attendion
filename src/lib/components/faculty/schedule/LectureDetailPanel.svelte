<script>
	let { lecture, onActivate, onClose, onManualClose, onClosePanel } = $props();

	function fmtTime(t) {
		if (!t) return 'Not started';
		const [h, m] = t.split(':');
		const hh = parseInt(h, 10);
		const ampm = hh >= 12 ? 'PM' : 'AM';
		const h12 = hh % 12 || 12;
		return `${h12}:${m} ${ampm}`;
	}

	let showCloseConfirm = $state(false);

	function handleClose(method) {
		if (method === 'Manual') {
			onManualClose(lecture.id);
		} else {
			onClose(lecture.id);
		}
		showCloseConfirm = false;
	}
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
	<!-- Header -->
	<div class="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 shrink-0">
		<div>
			<div class="flex items-center gap-2 mb-1">
				<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase {lecture.type === 'Practical' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}">
					{lecture.type}
				</span>
				<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase {lecture.status === 'Completed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : lecture.status === 'Active' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}">
					{#if lecture.status === 'Active'}
						<span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5 animate-pulse"></span>
						Attendance Active
					{:else}
						{lecture.status}
					{/if}
				</span>
			</div>
			<h3 class="text-lg font-bold text-gray-900 dark:text-white mt-2">{lecture.subject}</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{lecture.topic} &middot; {lecture.year} / Div {lecture.division}</p>
		</div>
		<button onclick={onClosePanel} class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors" aria-label="Close details">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
		</button>
	</div>

	<div class="px-5 py-4 space-y-4">
		<!-- Venue & Time -->
		<div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/60">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Venue</p>
					<p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{lecture.venue}</p>
				</div>
				<div>
					<p class="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Scheduled Time</p>
					<p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{fmtTime(lecture.scheduledStart)} – {fmtTime(lecture.scheduledEnd)}</p>
				</div>
			</div>
		</div>

		<!-- Session Timestamps -->
		<div>
			<h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Session Timestamps</h4>
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/60 overflow-hidden text-sm">
				<div class="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 dark:border-gray-700/60">
					<span class="text-gray-500 dark:text-gray-400">Activated At</span>
					<span class="font-medium text-gray-900 dark:text-white">{lecture.activatedAt ? fmtTime(lecture.activatedAt) : 'Not started'}</span>
				</div>
				<div class="flex justify-between items-center px-4 py-2.5">
					<span class="text-gray-500 dark:text-gray-400">Closed At</span>
					<div class="text-right">
						<p class="font-medium text-gray-900 dark:text-white">{lecture.closedAt ? fmtTime(lecture.closedAt) : 'Not finished'}</p>
						{#if lecture.closureMethod}
							<p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">({lecture.closureMethod})</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="pt-2">
			{#if lecture.status === 'Upcoming'}
				<button 
					onclick={() => onActivate(lecture.id)}
					class="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors shadow-sm"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
					Activate Attendance (RFID Simulate)
				</button>
			{:else if lecture.status === 'Active'}
				{#if !showCloseConfirm}
					<div class="flex flex-col gap-2">
						<button 
							onclick={() => handleClose('RFID')}
							class="w-full flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 py-2.5 px-4 rounded-xl font-medium transition-colors border border-purple-200 dark:border-purple-800"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
							Close Attendance (RFID Simulate)
						</button>
						<button 
							onclick={() => showCloseConfirm = true}
							class="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-2 transition-colors"
						>
							Close Attendance Manually
						</button>
					</div>
				{:else}
					<div class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl p-4">
						<p class="text-sm text-red-800 dark:text-red-300 font-medium mb-3">Are you sure you want to manually close this session?</p>
						<div class="flex gap-2">
							<button 
								onclick={() => handleClose('Manual')}
								class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
							>
								Yes, Close
							</button>
							<button 
								onclick={() => showCloseConfirm = false}
								class="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				{/if}
			{:else}
				<div class="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 py-2.5 px-4 rounded-xl text-sm font-medium border border-gray-100 dark:border-gray-700/60">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
					Session Completed
				</div>
			{/if}
		</div>
	</div>
</div>
