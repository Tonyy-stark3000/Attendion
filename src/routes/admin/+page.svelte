<script>
    // Mock Data
    const overviewStats = [
        { label: 'Total Students', value: '342', trend: '+12 this week' },
        { label: 'Total Faculty', value: '18', trend: 'All active' },
        { label: 'Active Divisions', value: '6', trend: 'SE, TE, BE' },
        { label: 'Subjects', value: '24', trend: '4 per division' },
        { label: 'RFID Devices', value: '12', trend: '11 online, 1 offline' }
    ];

    const alerts = [
        {
            title: 'Device Offline',
            description: 'Classroom 402 RFID device has been offline for 2 hours.',
            severity: 'high',
            action: 'View Device'
        },
        {
            title: 'Incomplete Timetable',
            description: 'SY ENTC Division A is missing lectures for Thursday afternoon.',
            severity: 'medium',
            action: 'Resolve'
        },
        {
            title: 'Faculty Assignment Missing',
            description: 'VLSI Design (TE) currently has no faculty assigned.',
            severity: 'medium',
            action: 'Assign'
        }
    ];
</script>

<svelte:head>
    <title>Admin Dashboard | Attendion</title>
</svelte:head>

<div class="px-6 py-8 max-w-7xl mx-auto space-y-8">
    
    <!-- Header area, optional since navbar has some context, but good for page title -->
    <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of the Electronics & Telecommunication Engineering department.</p>
    </div>

    <!-- Overview Stats -->
    <section>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {#each overviewStats as stat}
                <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        {stat.trend}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Attention Required -->
    <section>
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Attention Required</h2>
        </div>
        
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each alerts as alert}
                <div class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-shadow hover:shadow-md">
                    <div>
                        <div class="flex items-start justify-between">
                            <h3 class="font-medium text-gray-900 dark:text-white">{alert.title}</h3>
                            {#if alert.severity === 'high'}
                                <span class="flex h-2.5 w-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" aria-label="High severity"></span>
                            {:else if alert.severity === 'medium'}
                                <span class="flex h-2.5 w-2.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" aria-label="Medium severity"></span>
                            {:else}
                                <span class="flex h-2.5 w-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" aria-label="Low severity"></span>
                            {/if}
                        </div>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{alert.description}</p>
                    </div>
                    
                    <div class="mt-5">
                        <button class="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                            {alert.action} &rarr;
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </section>

</div>
