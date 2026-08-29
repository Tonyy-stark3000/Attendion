<script>
    // Mock Data Constants
    const currentDay = 'Wed';
    const weekSelectorText = '26 Aug – 1 Sep 2026';

    const days = [
        { short: 'Mon', full: 'Monday', date: '26 Aug' },
        { short: 'Tue', full: 'Tuesday', date: '27 Aug' },
        { short: 'Wed', full: 'Wednesday', date: '28 Aug' },
        { short: 'Thu', full: 'Thursday', date: '29 Aug' },
        { short: 'Fri', full: 'Friday', date: '30 Aug' }
    ];

    const timeSlots = [
        { label: '09:00 - 10:00', short: '09:00' },
        { label: '10:00 - 11:00', short: '10:00' },
        { label: '11:15 - 12:15', short: '11:15' },
        { label: '12:15 - 13:15', short: '12:15', isBreak: true },
        { label: '14:00 - 16:00', short: '14:00' }
    ];

    const scheduleData = [
        { day: 'Mon', time: '09:00 - 10:00', subject: 'Digital System Design', short: 'DSD', type: 'Lecture', venue: 'A-204' },
        { day: 'Mon', time: '10:00 - 11:00', subject: 'EDC', short: 'EDC', type: 'Lecture', venue: 'A-204' },
        { day: 'Mon', time: '11:15 - 12:15', subject: 'Mathematics', short: 'Maths', type: 'Lecture', venue: 'A-204' },
        
        { day: 'Tue', time: '09:00 - 10:00', subject: 'Mathematics', short: 'Maths', type: 'Lecture', venue: 'A-204' },
        { day: 'Tue', time: '10:00 - 11:00', subject: 'EDC', short: 'EDC', type: 'Lecture', venue: 'A-204' },
        { day: 'Tue', time: '11:15 - 12:15', subject: 'Digital System Design', short: 'DSD', type: 'Lecture', venue: 'A-204' },

        { day: 'Wed', time: '09:00 - 10:00', subject: 'Digital System Design', short: 'DSD', type: 'Lecture', venue: 'A-204' },
        { day: 'Wed', time: '10:00 - 11:00', subject: 'EDC', short: 'EDC', type: 'Lecture', venue: 'A-204' },
        { day: 'Wed', time: '11:15 - 12:15', subject: 'Mathematics', short: 'Maths', type: 'Lecture', venue: 'A-204' },
        { day: 'Wed', time: '14:00 - 16:00', subject: 'Electronics Lab', short: 'Elec Lab', type: 'Practical', venue: 'Lab 2' },

        { day: 'Thu', time: '09:00 - 10:00', subject: 'EDC', short: 'EDC', type: 'Lecture', venue: 'A-204' },
        { day: 'Thu', time: '10:00 - 11:00', subject: 'Digital System Design', short: 'DSD', type: 'Lecture', venue: 'A-204' },
        { day: 'Thu', time: '11:15 - 12:15', subject: 'Mathematics', short: 'Maths', type: 'Lecture', venue: 'A-204' },
        { day: 'Thu', time: '14:00 - 16:00', subject: 'Physics Lab', short: 'Phy Lab', type: 'Practical', venue: 'Lab 1' },

        { day: 'Fri', time: '09:00 - 10:00', subject: 'Mathematics', short: 'Maths', type: 'Lecture', venue: 'A-204' },
        { day: 'Fri', time: '10:00 - 11:00', subject: 'Digital System Design', short: 'DSD', type: 'Lecture', venue: 'A-204' },
        { day: 'Fri', time: '11:15 - 12:15', subject: 'EDC', short: 'EDC', type: 'Lecture', venue: 'A-204' }
    ];

    function getClass(dayShort, timeLabel) {
        return scheduleData.find(c => c.day === dayShort && c.time === timeLabel);
    }

    // Mobile day selection
    let selectedDay = $state(currentDay);
</script>

<svelte:head>
    <title>Schedule | Attendion</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-5 py-7 lg:px-8 lg:py-8 space-y-8">

    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Schedule
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your weekly class timetable.
            </p>
        </div>
        <div class="text-right">
            <p class="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-300">
                SY • Division B
            </p>
        </div>
    </header>

    <!-- Week Selector -->
    <div class="flex items-center justify-between sm:justify-start gap-4">
        <button class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" aria-label="Previous week">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        
        <div class="flex items-center gap-2 font-semibold text-sm text-gray-900 dark:text-white px-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {weekSelectorText}
        </div>
        
        <button class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" aria-label="Next week">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>

    <!-- Desktop Weekly Timetable -->
    <div class="hidden lg:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
        <table class="w-full text-left border-collapse table-fixed">
            <thead>
                <tr>
                    <th class="w-32 border-b border-r border-gray-200 bg-gray-50/50 p-4 font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-400 text-[11px] uppercase tracking-wider text-center align-middle">Time</th>
                    {#each days as day}
                        <th class="border-b border-gray-200 p-4 dark:border-gray-800 {day.short === currentDay ? 'bg-purple-50/40 dark:bg-purple-900/10' : 'bg-white dark:bg-gray-900/60'} {day.short !== 'Fri' ? 'border-r' : ''}">
                            <div class="text-center">
                                <p class="text-[13px] font-bold uppercase tracking-wider {day.short === currentDay ? 'text-purple-700 dark:text-purple-400' : 'text-gray-900 dark:text-white'}">{day.short}</p>
                                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{day.date}</p>
                            </div>
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each timeSlots as slot, idx}
                    <tr>
                        <td class="w-32 border-r border-gray-200 bg-gray-50/50 p-3 text-center dark:border-gray-800 dark:bg-gray-900/30 {idx !== timeSlots.length - 1 ? 'border-b' : ''} align-middle">
                            <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{slot.label}</span>
                        </td>
                        {#each days as day, dIdx}
                            <td class="p-3 border-gray-200 dark:border-gray-800 {day.short === currentDay ? 'bg-purple-50/20 dark:bg-purple-900/5' : 'bg-white dark:bg-gray-900/60'} {idx !== timeSlots.length - 1 ? 'border-b' : ''} {dIdx !== days.length - 1 ? 'border-r' : ''} relative h-[100px] align-top">
                                {#if slot.isBreak}
                                    <div class="flex h-full items-center justify-center">
                                        <span class="text-gray-300 dark:text-gray-700">—</span>
                                    </div>
                                {:else}
                                    {@const cls = getClass(day.short, slot.label)}
                                    {#if cls}
                                        <div class="flex h-full flex-col justify-between rounded-xl p-3 border {cls.type === 'Practical' ? 'border-orange-100 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800/60' : 'border-purple-100 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-900/10 hover:border-purple-200 dark:hover:border-purple-800/60'} transition-colors hover:shadow-sm">
                                            <p class="text-[13px] font-bold leading-tight text-gray-900 dark:text-white line-clamp-2" title="{cls.subject}">{cls.subject}</p>
                                            <div class="flex items-center text-[10px] font-medium mt-2 gap-1.5 flex-wrap">
                                                <span class="px-1.5 py-0.5 rounded bg-white/80 dark:bg-gray-900/60 border {cls.type === 'Practical' ? 'border-orange-200/60 text-orange-700 dark:border-orange-800/60 dark:text-orange-400' : 'border-purple-200/60 text-purple-700 dark:border-purple-800/60 dark:text-purple-400'}">{cls.type}</span>
                                                <span class="text-gray-400 dark:text-gray-500">•</span>
                                                <span class="text-gray-600 dark:text-gray-400 truncate">{cls.venue}</span>
                                            </div>
                                        </div>
                                    {:else}
                                        <div class="flex h-full items-center justify-center rounded-xl border border-dashed border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
                                            <span class="text-gray-200 dark:text-gray-700">—</span>
                                        </div>
                                    {/if}
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
        
        <!-- Legend (Desktop) -->
        <div class="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-6 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-purple-50/50 border border-purple-100 dark:bg-purple-900/30 dark:border-purple-900/50"></div>
                    <span>Lecture</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-orange-50/50 border border-orange-100 dark:bg-orange-900/30 dark:border-orange-900/50"></div>
                    <span>Practical</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded border border-dashed border-gray-200 dark:border-gray-700"></div>
                    <span>No Class</span>
                </div>
            </div>
            <div class="text-[10px] text-gray-400 dark:text-gray-500">
                Timings are based on the college timetable.
            </div>
        </div>
    </div>

    <!-- Mobile/Tablet Schedule (Day Selector) -->
    <div class="lg:hidden space-y-6">
        
        <!-- Day Pills -->
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
            {#each days as day}
                <button 
                    onclick={() => selectedDay = day.short}
                    class="flex flex-col items-center min-w-[72px] px-4 py-2.5 rounded-xl transition-all border {selectedDay === day.short ? 'bg-purple-600 text-white shadow-md border-transparent' : 'bg-white text-gray-600 border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400'}"
                >
                    <span class="text-[10px] font-bold uppercase tracking-wider mb-1 {selectedDay === day.short ? 'text-purple-100' : 'text-gray-400 dark:text-gray-500'}">{day.short}</span>
                    <span class="text-sm font-semibold">{day.date.split(' ')[0]}</span>
                </button>
            {/each}
        </div>

        <!-- Vertical Timetable for Selected Day -->
        <div class="space-y-3">
            {#each timeSlots as slot}
                {#if slot.isBreak}
                    <div class="flex items-center justify-center py-4">
                        <div class="w-full border-t border-dashed border-gray-200 dark:border-gray-800"></div>
                        <span class="px-4 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap bg-white dark:bg-[#0c0c0c] absolute">Break</span>
                    </div>
                {:else}
                    {@const cls = getClass(selectedDay, slot.label)}
                    <div class="flex gap-4 items-start">
                        <!-- Time Column -->
                        <div class="w-[60px] shrink-0 pt-3 text-right">
                            <span class="block text-[13px] font-bold text-gray-900 dark:text-white leading-none">{slot.short}</span>
                            <span class="block text-[10px] text-gray-500 dark:text-gray-400 mt-1">{slot.label.split(' - ')[1]}</span>
                        </div>
                        
                        <!-- Class Card -->
                        <div class="flex-1">
                            {#if cls}
                                <div class="rounded-xl p-4 border {cls.type === 'Practical' ? 'border-orange-100 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-900/10' : 'border-purple-100 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-900/10'} shadow-sm">
                                    <p class="text-sm font-bold text-gray-900 dark:text-white mb-3 leading-tight">{cls.subject}</p>
                                    <div class="flex items-center text-[11px] font-medium text-gray-500 dark:text-gray-400 gap-2">
                                        <span class="px-2 py-0.5 rounded bg-white/80 dark:bg-gray-900/60 border {cls.type === 'Practical' ? 'border-orange-200/60 text-orange-700 dark:border-orange-800/60 dark:text-orange-400' : 'border-purple-200/60 text-purple-700 dark:border-purple-800/60 dark:text-purple-400'}">{cls.type}</span>
                                        <span class="text-gray-300 dark:text-gray-600">•</span>
                                        <span>{cls.venue}</span>
                                    </div>
                                </div>
                            {:else}
                                <div class="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center dark:border-gray-800 dark:bg-gray-900/30">
                                    <span class="text-xs text-gray-400 dark:text-gray-500">—</span>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
        
        <!-- Legend (Mobile) -->
        <div class="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
            <div class="flex items-center justify-center gap-6 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-purple-50/50 border border-purple-100 dark:bg-purple-900/30 dark:border-purple-900/50"></div>
                    <span>Lecture</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-orange-50/50 border border-orange-100 dark:bg-orange-900/30 dark:border-orange-900/50"></div>
                    <span>Practical</span>
                </div>
            </div>
            <div class="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                Timings based on college timetable.
            </div>
        </div>
    </div>

</div>

<style>
    /* Hide scrollbar for mobile day selector */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
