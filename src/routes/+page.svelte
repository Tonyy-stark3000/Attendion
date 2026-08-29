<script>
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import PortalCard from '$lib/components/landing/PortalCard.svelte';
</script>

<svelte:head>
	<title>Attendion | Smart Attendance</title>
	<meta name="description" content="RFID-powered Attendance Software. Smart attendance. Connected classrooms." />
</svelte:head>

<div class="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-50 dark:bg-gray-950">
	<Navbar />
	
	<!-- Left Side: Branding and Intro -->
	<div class="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 pt-32 lg:pt-0 relative z-10">
		<div class="max-w-xl mx-auto lg:mx-0 w-full mt-10 lg:mt-0">
			<div class="inline-flex items-center rounded-full border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300 mb-8">
				<span class="flex h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 mr-2 animate-pulse"></span>
				RFID-powered Attendance Software
			</div>
			
			<h1 class="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.15]">
				Smart attendance.<br />
				<span class="text-purple-600 dark:text-purple-400">Connected classrooms.</span>
			</h1>
			
			<p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md leading-relaxed">
				Streamline your institution's attendance tracking with a modern, fast, and unified portal for faculty, students, and administration.
			</p>
			
			<a href="/login" class="inline-flex items-center justify-center rounded-xl bg-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all hover:scale-[1.02] active:scale-[0.98]">
				Get Started
				<svg class="ml-2 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
				</svg>
			</a>
		</div>
	</div>

	<!-- Right Side: Portal Cards -->
	<div class="flex-1 flex items-center justify-center p-8 lg:p-16 xl:p-24 relative z-10">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
			{#snippet facultyIcon()}
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
				</svg>
			{/snippet}
			
			{#snippet studentIcon()}
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
					<path d="M6 12v5c3 3 9 3 12 0v-5"></path>
				</svg>
			{/snippet}

			{#snippet adminIcon()}
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
					<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
				</svg>
			{/snippet}

			{#snippet classIcon()}
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
					<line x1="8" y1="21" x2="16" y2="21"></line>
					<line x1="12" y1="17" x2="12" y2="21"></line>
				</svg>
			{/snippet}

			<PortalCard
				title="Faculty Portal"
				description="Manage classes & attendance"
				href="/faculty"
				icon={facultyIcon}
			/>
			
			<PortalCard
				title="Student Portal"
				description="View your attendance"
				href="/student"
				icon={studentIcon}
			/>
			
			<PortalCard
				title="Admin Portal"
				description="Manage your institution"
				href="/admin"
				icon={adminIcon}
			/>
			
			<PortalCard
				title="Classroom Portal"
				description="Live classroom attendance"
				href="/classroom"
				icon={classIcon}
			/>
		</div>
	</div>
</div>