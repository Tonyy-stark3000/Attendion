<script>
    import { page } from '$app/state';

    // Constants
    const MIN_ATTENDANCE = 75;

    // Helper functions for risk colors/logic
    function getRisk(pct) {
        if (pct < MIN_ATTENDANCE) return 'danger';
        if (pct < 80) return 'warning';
        return 'safe';
    }

    function riskColor(risk) {
        if (risk === 'danger') return '#ef4444';
        if (risk === 'warning') return '#eab308';
        return '#10b981';
    }

    function riskTextClass(risk) {
        if (risk === 'danger') return 'text-red-600 dark:text-red-400';
        if (risk === 'warning') return 'text-yellow-600 dark:text-yellow-400';
        return 'text-emerald-600 dark:text-emerald-400';
    }

    function riskBadgeClass(risk) {
        if (risk === 'danger') return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20';
        if (risk === 'warning') return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20';
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20';
    }

    function riskMessage(pct) {
        if (pct < MIN_ATTENDANCE) return 'Your attendance is below the 75% requirement.';
        if (pct < 80) return 'Near the minimum requirement.';
        return 'Attendance is in the safe zone.';
    }

    // Mock Data
    const overallStats = {
        percentage: 82.4,
        present: 47,
        absent: 10,
        total: 57
    };

    const overallRisk = getRisk(overallStats.percentage);

    const subjects = [
        { name: 'Digital System Design', short: 'DSD', percent: 90, present: 18, total: 20 },
        { name: 'EDC', short: 'EDC', percent: 78, present: 16, total: 20 },
        { name: 'Mathematics', short: 'Mathematics', percent: 72, present: 13, total: 18 },
        { name: 'Engineering Mechanics', short: 'EM', percent: 86, present: 17, total: 19 }
    ];

    const rawRecords = [
        { id: 1, date: '2026-08-28', subject: 'Digital System Design', type: 'Lecture', startTime: '09:00', endTime: '10:00', venue: 'A-204', status: 'Present', year: 'SY' },
        { id: 2, date: '2026-08-27', subject: 'EDC', type: 'Practical', startTime: '11:00', endTime: '13:00', venue: 'Lab 2', status: 'Present', year: 'SY' },
        { id: 3, date: '2026-08-26', subject: 'Mathematics', type: 'Lecture', startTime: '10:00', endTime: '11:00', venue: 'A-204', status: 'Absent', year: 'SY' },
        { id: 4, date: '2026-08-25', subject: 'Digital System Design', type: 'Lecture', startTime: '09:00', endTime: '10:00', venue: 'A-204', status: 'Present', year: 'SY' },
        { id: 5, date: '2026-08-25', subject: 'Engineering Mechanics', type: 'Lecture', startTime: '14:00', endTime: '15:00', venue: 'A-201', status: 'Present', year: 'SY' },
        { id: 6, date: '2026-08-24', subject: 'EDC', type: 'Lecture', startTime: '10:00', endTime: '11:00', venue: 'A-204', status: 'Absent', year: 'SY' },
        { id: 7, date: '2026-08-23', subject: 'Mathematics', type: 'Practical', startTime: '11:00', endTime: '13:00', venue: 'Lab 1', status: 'Present', year: 'SY' },
    ];

    let filters = $state({
        year: 'SY',
        subject: 'All Subjects',
        type: 'All',
        venue: 'All Venues',
        status: 'All',
        dateFrom: '',
        dateTo: '',
        sort: 'Newest First'
    });

    const uniqueSubjects = ['All Subjects', ...new Set(rawRecords.map(r => r.subject))].sort();
    const uniqueVenues = ['All Venues', ...new Set(rawRecords.map(r => r.venue))].sort();
    const types = ['All', 'Lecture', 'Practical'];
    const statuses = ['All', 'Present', 'Absent'];
    const years = ['FY', 'SY', 'TY'];
    const sorts = ['Newest First', 'Oldest First'];

    function resetFilters() {
        filters.year = 'SY';
        filters.subject = 'All Subjects';
        filters.type = 'All';
        filters.venue = 'All Venues';
        filters.status = 'All';
        filters.dateFrom = '';
        filters.dateTo = '';
        filters.sort = 'Newest First';
    }

    let filteredRecords = $derived.by(() => {
        let result = rawRecords.filter(r => {
            if (filters.year !== 'All' && r.year !== filters.year) return false;
            if (filters.subject !== 'All Subjects' && r.subject !== filters.subject) return false;
            if (filters.type !== 'All' && r.type !== filters.type) return false;
            if (filters.venue !== 'All Venues' && r.venue !== filters.venue) return false;
            if (filters.status !== 'All' && r.status !== filters.status) return false;
            if (filters.dateFrom && r.date < filters.dateFrom) return false;
            if (filters.dateTo && r.date > filters.dateTo) return false;
            return true;
        });

        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (filters.sort === 'Newest First') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });

        return result;
    });

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
</script>

<svelte:head>
    <title>Attendance | Attendion</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-5 py-7 lg:px-8 lg:py-8 space-y-8">

    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Attendance
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track your attendance across all subjects.
            </p>
        </div>
        <div class="text-right">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Minimum Required</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{MIN_ATTENDANCE}%</p>
        </div>
    </header>

    <!-- Overall Summary -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
            <div class="relative flex h-16 w-16 items-center justify-center">
                <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90 transform">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" stroke-width="8" class="dark:opacity-20" />
                    <circle
                        cx="50" cy="50" r="42" fill="none" stroke="{riskColor(overallRisk)}" stroke-width="8"
                        stroke-linecap="round" stroke-dasharray="{2 * Math.PI * 42}"
                        stroke-dashoffset="{2 * Math.PI * 42 - (overallStats.percentage / 100) * 2 * Math.PI * 42}"
                        style="transition: stroke-dashoffset 1s ease-out;"
                    />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{overallStats.percentage}%</span>
                </div>
            </div>
            <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">Overall Attendance</p>
                <div class="mt-1 flex items-center gap-2">
                    <span class="relative flex h-2 w-2 shrink-0">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 bg-{overallRisk === 'danger' ? 'red' : overallRisk === 'warning' ? 'yellow' : 'emerald'}-500"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-{overallRisk === 'danger' ? 'red' : overallRisk === 'warning' ? 'yellow' : 'emerald'}-500"></span>
                    </span>
                    <span class="text-xs font-medium {riskTextClass(overallRisk)}">{riskMessage(overallStats.percentage)}</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-8 text-center sm:text-right">
            <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Present</p>
                <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{overallStats.present}</p>
            </div>
            <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Absent</p>
                <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{overallStats.absent}</p>
            </div>
            <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p class="mt-1 text-xl font-semibold text-purple-600 dark:text-purple-400">{overallStats.total}</p>
            </div>
        </div>
    </div>

    <!-- Subject-wise Attendance -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each subjects as sub}
            {@const subRisk = getRisk(sub.percent)}
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 flex flex-col justify-between">
                <div class="mb-4">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1" title="{sub.name}">{sub.short}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub.present} / {sub.total} Present</p>
                </div>
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs font-medium {riskTextClass(subRisk)}">{riskMessage(sub.percent)}</span>
                        <span class="text-sm font-semibold {riskTextClass(subRisk)}">{sub.percent}%</span>
                    </div>
                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div class="h-full rounded-full" style="width: {sub.percent}%; background-color: {riskColor(subRisk)}; transition: width 1s ease-out;"></div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Attendance Records Section -->
    <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Attendance Records</h2>

        <!-- Filters -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                
                <div class="space-y-1">
                    <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" for="filter-year">Academic Year</label>
                    <select id="filter-year" bind:value={filters.year} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                        {#each years as year}
                            <option value={year}>{year}</option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-1 lg:col-span-2">
                    <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" for="filter-subject">Subject</label>
                    <select id="filter-subject" bind:value={filters.subject} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                        {#each uniqueSubjects as subject}
                            <option value={subject}>{subject}</option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-1">
                    <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" for="filter-type">Type</label>
                    <select id="filter-type" bind:value={filters.type} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                        {#each types as type}
                            <option value={type}>{type}</option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-1">
                    <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" for="filter-status">Status</label>
                    <select id="filter-status" bind:value={filters.status} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                        {#each statuses as status}
                            <option value={status}>{status}</option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-1">
                    <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" for="filter-venue">Venue</label>
                    <select id="filter-venue" bind:value={filters.venue} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                        {#each uniqueVenues as venue}
                            <option value={venue}>{venue}</option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-1 lg:col-span-2">
                    <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Range</label>
                    <div class="flex items-center gap-2">
                        <input type="date" bind:value={filters.dateFrom} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                        <span class="text-gray-500">-</span>
                        <input type="date" bind:value={filters.dateTo} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" for="filter-sort">Sort</label>
                    <select id="filter-sort" bind:value={filters.sort} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                        {#each sorts as sort}
                            <option value={sort}>{sort}</option>
                        {/each}
                    </select>
                </div>

                <div class="col-span-2 md:col-span-3 lg:col-span-3 flex items-end justify-end">
                    <button onclick={resetFilters} class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Records Table/List -->
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/60 overflow-hidden">
            {#if filteredRecords.length > 0}
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead class="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-4">Date</th>
                                <th scope="col" class="px-6 py-4">Subject</th>
                                <th scope="col" class="px-6 py-4">Type</th>
                                <th scope="col" class="px-6 py-4">Time</th>
                                <th scope="col" class="px-6 py-4">Venue</th>
                                <th scope="col" class="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                            {#each filteredRecords as record (record.id)}
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {formatDate(record.date)}
                                    </td>
                                    <td class="whitespace-nowrap px-6 py-4">
                                        {record.subject}
                                    </td>
                                    <td class="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {record.type}
                                    </td>
                                    <td class="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {record.startTime}–{record.endTime}
                                    </td>
                                    <td class="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {record.venue}
                                    </td>
                                    <td class="whitespace-nowrap px-6 py-4">
                                        <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset {record.status === 'Present' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20' : 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20'}">
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">No attendance records found</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">Try adjusting your filters to find the records you're looking for.</p>
                    <button onclick={resetFilters} class="mt-6 inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all">
                        Reset Filters
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>
