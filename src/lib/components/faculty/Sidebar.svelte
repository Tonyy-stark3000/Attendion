<script>
	import { page } from '$app/stores';

	const navItems = [
		{
			label: 'Dashboard',
			href: '/faculty',
			exact: true,
			paths: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`
		},
		{
			label: 'Attendance History',
			href: '/faculty/history',
			exact: false,
			paths: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>`
		},
		{
			label: 'Schedule',
			href: '/faculty/schedule',
			exact: false,
			paths: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
		},
		{
			label: 'Settings',
			href: '/faculty/settings',
			exact: false,
			paths: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`
		}
	];

	function isActive(item) {
		const path = $page.url.pathname;
		return item.exact ? path === item.href : path.startsWith(item.href);
	}
</script>

<aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col h-full shrink-0">
	<div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
		<!-- <span class="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">Attendion</span> -->
	</div>

	<nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
		{#each navItems as item}
			{@const active = isActive(item)}
			<a
				href={item.href}
				class="flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors {active
					? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
					: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'}"
			>
				<svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{@html item.paths}
				</svg>
				{item.label}
			</a>
		{/each}
	</nav>
</aside>
