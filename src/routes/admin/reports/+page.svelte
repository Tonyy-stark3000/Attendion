<script>
    import { 
        mockStudents, 
        mockSubjects, 
        mockStudentAttendance, 
        mockSubjectSummary, 
        mockSubjectBreakdown, 
        mockSessions, 
        mockSessionDetails, 
        mockDivisionMatrix, 
        mockDivSubjects 
    } from '$lib/data/reportsMock.js';

    let reportType = $state('student'); 
    // 'student', 'subject', 'session', 'division'
    
    let timePeriod = $state('last_week'); 
    // 'last_week', 'month', 'year', 'custom'

    let filterYear = $state('');
    let filterDivision = $state('');
    let filterSubject = $state('');
    let filterStudent = $state('');
    let filterVenue = $state('');

    // Specific time period states
    let selectedMonth = $state('');
    let selectedYear = $state('');
    let dateFrom = $state('');
    let dateTo = $state('');

    // Modal state for session drill-down
    let isSessionModalOpen = $state(false);
    let viewSession = $state(null);

    const years = ['FY', 'SY', 'TY', 'Fourth Year'];
    const divisions = ['A', 'B'];

    function openSessionDetails(session) {
        viewSession = session;
        isSessionModalOpen = true;
    }

    function closeSessionDetails() {
        isSessionModalOpen = false;
        viewSession = null;
    }

    function handleExport(format) {
        alert(`Exporting report as ${format}... (Mock action)`);
    }

    function resetFilters() {
        filterYear = '';
        filterDivision = '';
        filterSubject = '';
        filterStudent = '';
        filterVenue = '';
    }
</script>

<svelte:head>
    <title>Reports | Admin Portal</title>
</svelte:head>

<div class="px-6 py-8 max-w-7xl mx-auto space-y-6">
    <!-- Header & Export Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reports</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and export attendance analytics.</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">Export:</span>
            <button onclick={() => handleExport('CSV')} class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">CSV</button>
            <button onclick={() => handleExport('Excel')} class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Excel</button>
            <button onclick={() => handleExport('PDF')} class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">PDF</button>
        </div>
    </div>

    <!-- Main Report Configurator -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-5 space-y-5">
        
        <!-- Top row: Type & Time Period -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Report Type</label>
                <select bind:value={reportType} onchange={resetFilters} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="student">Student Attendance</option>
                    <option value="subject">Subject-wise Attendance</option>
                    <option value="session">Session Report</option>
                    <option value="division">Division-wise Attendance</option>
                </select>
            </div>
            
            <div class="flex gap-3">
                <div class="flex-1">
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Time Period</label>
                    <select bind:value={timePeriod} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="last_week">Last Week</option>
                        <option value="month">Select Month</option>
                        <option value="year">Academic Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                
                <!-- Time Period Conditional Inputs -->
                {#if timePeriod === 'month'}
                    <div class="flex-1">
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Month</label>
                        <input type="month" bind:value={selectedMonth} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                {:else if timePeriod === 'year'}
                    <div class="flex-1">
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Academic Year</label>
                        <select bind:value={selectedYear} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="2026-27">2026-27</option>
                            <option value="2025-26">2025-26</option>
                        </select>
                    </div>
                {:else if timePeriod === 'custom'}
                    <div class="flex-1">
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Start</label>
                        <input type="date" bind:value={dateFrom} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                    <div class="flex-1">
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">End</label>
                        <input type="date" bind:value={dateTo} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                {/if}
            </div>
        </div>

        <!-- Dynamic Filters -->
        <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
            <div class="flex flex-wrap gap-4">
                {#if ['student', 'subject', 'session', 'division'].includes(reportType)}
                    <div class="w-full sm:w-auto min-w-[120px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Year</label>
                        <select bind:value={filterYear} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-1.5 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">All Years</option>
                            {#each years as y}<option value={y}>{y}</option>{/each}
                        </select>
                    </div>
                    <div class="w-full sm:w-auto min-w-[120px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Division</label>
                        <select bind:value={filterDivision} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-1.5 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">All Divisions</option>
                            {#each divisions as d}<option value={d}>{d}</option>{/each}
                        </select>
                    </div>
                {/if}

                {#if ['student', 'subject', 'session'].includes(reportType)}
                    <div class="w-full sm:w-auto min-w-[160px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                        <select bind:value={filterSubject} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-1.5 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">All Subjects</option>
                            {#each mockSubjects as s}<option value={s.id}>{s.name}</option>{/each}
                        </select>
                    </div>
                {/if}

                {#if reportType === 'student'}
                    <div class="w-full sm:w-auto min-w-[200px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Student</label>
                        <select bind:value={filterStudent} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-1.5 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">All Students</option>
                            {#each mockStudents as s}<option value={s.id}>{s.name} ({s.id})</option>{/each}
                        </select>
                    </div>
                {/if}

                {#if reportType === 'session'}
                    <div class="w-full sm:w-auto min-w-[160px]">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Venue</label>
                        <select bind:value={filterVenue} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-1.5 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">All Venues</option>
                            <option value="Room 401">Room 401</option>
                            <option value="Room 402">Room 402</option>
                        </select>
                    </div>
                {/if}
                
                <div class="w-full sm:w-auto flex items-end ml-auto">
                    <button type="button" class="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Output Data Section -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        {#if reportType === 'student'}
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roll No.</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Present/Absent</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance %</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                        {#each mockStudentAttendance as row}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.id}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{row.subject}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span class="text-green-600 dark:text-green-400 font-medium">{row.present}</span>
                                    <span class="text-gray-400 mx-1">/</span>
                                    <span class="text-red-500 dark:text-red-400 font-medium">{row.absent}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold {row.pct >= 75 ? 'text-gray-900 dark:text-white' : 'text-amber-600 dark:text-amber-400'}">
                                    {row.pct}%
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

        {:else if reportType === 'subject'}
            <!-- Subject Summary -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{mockSubjectSummary.subject} - Summary</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p class="text-xs text-gray-500 uppercase tracking-wider">Total Classes</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockSubjectSummary.totalClasses}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p class="text-xs text-gray-500 uppercase tracking-wider">Total Present</p>
                        <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{mockSubjectSummary.presentCount}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p class="text-xs text-gray-500 uppercase tracking-wider">Total Absent</p>
                        <p class="text-2xl font-bold text-red-500 dark:text-red-400 mt-1">{mockSubjectSummary.absentCount}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p class="text-xs text-gray-500 uppercase tracking-wider">Avg Attendance</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockSubjectSummary.pct}%</p>
                    </div>
                </div>
            </div>
            
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h4 class="font-semibold text-gray-900 dark:text-white">Student Breakdown</h4>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roll No.</th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Present/Absent</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance %</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                        {#each mockSubjectBreakdown as row}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.id}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span class="text-green-600 dark:text-green-400 font-medium">{row.present}</span>
                                    <span class="text-gray-400 mx-1">/</span>
                                    <span class="text-red-500 dark:text-red-400 font-medium">{row.absent}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold {row.pct >= 75 ? 'text-gray-900 dark:text-white' : 'text-amber-600 dark:text-amber-400'}">
                                    {row.pct}%
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

        {:else if reportType === 'session'}
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject & Faculty</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Present/Total</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                        {#each mockSessions as session}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">{session.date}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">{session.time}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">{session.subject}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">{session.faculty}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{session.venue}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="text-sm">
                                        <span class="text-green-600 dark:text-green-400 font-medium">{session.present}</span>
                                        <span class="text-gray-400">/</span>
                                        <span class="text-gray-700 dark:text-gray-300">{session.totalStudents}</span>
                                    </div>
                                    <div class="text-xs text-gray-500 mt-0.5">{session.pct}%</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button onclick={() => openSessionDetails(session)} class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors">View Details</button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

        {:else if reportType === 'division'}
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-10">Roll No.</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-[100px] sm:left-[120px] bg-gray-50 dark:bg-gray-800/50 z-10">Student Name</th>
                            {#each mockDivSubjects as sub}
                                <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{sub}</th>
                            {/each}
                            <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Overall %</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                        {#each mockDivisionMatrix as row}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-900">{row.id}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white sticky left-[100px] sm:left-[120px] bg-white dark:bg-gray-900">{row.name}</td>
                                {#each mockDivSubjects as sub}
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium {row.subjects[sub] >= 75 ? 'text-gray-900 dark:text-white' : 'text-amber-600 dark:text-amber-400'}">
                                        {row.subjects[sub]}%
                                    </td>
                                {/each}
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold {row.overall >= 75 ? 'text-purple-700 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400'}">
                                    {row.overall}%
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>

<!-- Session Drill-down Modal -->
{#if isSessionModalOpen && viewSession}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4" role="dialog" onclick={closeSessionDetails}>
        <div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]" onclick={(e) => e.stopPropagation()}>
            <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50/50 dark:bg-gray-800/30">
                <div>
                    <h3 class="text-xl font-bold leading-6 text-gray-900 dark:text-white">Session Attendance</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{viewSession.subject} &middot; {viewSession.date} {viewSession.time}</p>
                </div>
                <button type="button" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" onclick={closeSessionDetails}>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6">
                <div class="mb-6 flex gap-4">
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/60">
                        <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Faculty</span>
                        <span class="block mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{viewSession.faculty}</span>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/60">
                        <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue</span>
                        <span class="block mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{viewSession.venue}</span>
                    </div>
                </div>

                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Roll No.</th>
                            <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Student Name</th>
                            <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                        {#each mockSessionDetails as student}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{student.id}</td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                <td class="px-4 py-3 text-right">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {student.status === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <div class="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-end">
                <button type="button" class="px-5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm" onclick={closeSessionDetails}>
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}
