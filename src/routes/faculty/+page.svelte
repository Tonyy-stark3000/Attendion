<script>
	const stats = [
		{
			label: 'Total Classes',
			value: '6',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
			accent: 'purple'
		},
		{
			label: 'Present Today',
			value: '5',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
			accent: 'green'
		},
		{
			label: 'Absent Today',
			value: '1',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
			accent: 'red'
		},
		{
			label: 'Attendance Rate',
			value: '83%',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
			accent: 'purple'
		}
	];

	const todaysClasses = [
		{
			subject: 'Digital System Design',
			time: '8:00 AM – 9:00 AM',
			room: 'Lab 3',
			status: 'Completed'
		},
		{
			subject: 'Data Structures',
			time: '10:00 AM – 11:00 AM',
			room: 'Room 204',
			status: 'Completed'
		},
		{
			subject: 'Electronics Devices & Circuits',
			time: '11:30 AM – 12:30 PM',
			room: 'Room 101',
			status: 'Ongoing'
		},
		{
			subject: 'Mathematics',
			time: '2:00 PM – 3:00 PM',
			room: 'Room 305',
			status: 'Upcoming'
		}
	];

	const accentMap = {
		purple: {
			bg: 'bg-purple-50 dark:bg-purple-900/20',
			icon: 'text-purple-600 dark:text-purple-400',
			iconBg: 'bg-purple-100 dark:bg-purple-900/40',
			border: 'border-purple-100 dark:border-purple-800/40'
		},
		green: {
			bg: 'bg-green-50 dark:bg-green-900/10',
			icon: 'text-green-600 dark:text-green-400',
			iconBg: 'bg-green-100 dark:bg-green-900/40',
			border: 'border-green-100 dark:border-green-800/40'
		},
		red: {
			bg: 'bg-red-50 dark:bg-red-900/10',
			icon: 'text-red-500 dark:text-red-400',
			iconBg: 'bg-red-100 dark:bg-red-900/40',
			border: 'border-red-100 dark:border-red-800/40'
		}
	};

	const statusMap = {
		Completed: {
			dot: 'bg-gray-400 dark:bg-gray-500',
			badge: 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400'
		},
		Ongoing: {
			dot: 'bg-green-500 animate-pulse',
			badge: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
		},
		Upcoming: {
			dot: 'bg-purple-500',
			badge: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
		}
	};
</script>

<svelte:head>
	<title>Faculty Dashboard | Attendion</title>
</svelte:head>

<div class="max-w-5xl space-y-8">

	<!-- Welcome -->
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Welcome back, Faculty</h2>
		<p class="text-base text-gray-500 dark:text-gray-400">Manage your attendance and classroom activities from here.</p>
	</div>

	<!-- Stat Cards -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		{#each stats as stat}
			{@const colors = accentMap[stat.accent]}
			<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{stat.label}</span>
					<div class="w-8 h-8 rounded-xl {colors.iconBg} flex items-center justify-center {colors.icon} shrink-0">
						{@html stat.icon}
					</div>
				</div>
				<span class="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
			</div>
		{/each}
	</div>

	<!-- Today's Overview -->
	<div>
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Today's Overview</h3>
			<span class="text-xs text-gray-400 dark:text-gray-500 font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/60">
			{#each todaysClasses as cls}
				{@const s = statusMap[cls.status]}
				<div class="flex items-center gap-4 px-5 py-4">
					<!-- Status dot -->
					<span class="w-2.5 h-2.5 rounded-full {s.dot} shrink-0 mt-0.5"></span>

					<!-- Class info -->
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{cls.subject}</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cls.time} &middot; {cls.room}</p>
					</div>

					<!-- Status badge -->
					<span class="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold {s.badge}">
						{cls.status}
					</span>
				</div>
			{/each}
		</div>
	</div>

</div>
