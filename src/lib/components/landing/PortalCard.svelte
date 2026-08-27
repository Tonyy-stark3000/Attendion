<script>
	let {
		title = '',
		description = '',
		href = '#',
		icon = null
	} = $props();
</script>

<a
	{href}
	class="group relative flex flex-col p-6 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
>
	<div class="mb-4 text-purple-600 dark:text-purple-400">
		{@render icon?.()}
	</div>
	
	<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
	<p class="text-gray-500 dark:text-gray-400 text-sm flex-grow leading-relaxed">{description}</p>
	
	<div class="mt-6 flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
		Enter Portal
		<svg class="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="5" y1="12" x2="19" y2="12"></line>
			<polyline points="12 5 19 12 12 19"></polyline>
		</svg>
	</div>
</a>
