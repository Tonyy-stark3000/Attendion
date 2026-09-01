<script>
    import { mockStudents, mockFaculty } from '$lib/data/mockUsers.js';

    let activeTab = $state('students'); // 'students' | 'faculty'

    // Students state
    let students = $state([...mockStudents]);
    let studentSearch = $state('');
    let studentYearFilter = $state('all');
    let studentDivFilter = $state('all');
    let studentStatusFilter = $state('all');

    // Faculty state
    let facultyList = $state([...mockFaculty]);
    let facultySearch = $state('');
    let facultyStatusFilter = $state('all');

    // Modals
    let selectedUser = $state(null);
    let viewModalOpen = $state(false);
    let confirmActionOpen = $state(false);
    let actionUser = $state(null);
    let actionType = $state(''); // 'activate' | 'deactivate'

    // Derived filtered lists
    let filteredStudents = $derived(
        students.filter((s) => {
            const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                  s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                  s.roll.toLowerCase().includes(studentSearch.toLowerCase());
            const matchesYear = studentYearFilter === 'all' || s.year === studentYearFilter;
            const matchesDiv = studentDivFilter === 'all' || s.division === studentDivFilter;
            const matchesStatus = studentStatusFilter === 'all' || s.status.toLowerCase() === studentStatusFilter.toLowerCase();
            return matchesSearch && matchesYear && matchesDiv && matchesStatus;
        })
    );

    let filteredFaculty = $derived(
        facultyList.filter((f) => {
            const matchesSearch = f.name.toLowerCase().includes(facultySearch.toLowerCase()) || 
                                  f.id.toLowerCase().includes(facultySearch.toLowerCase());
            const matchesStatus = facultyStatusFilter === 'all' || f.status.toLowerCase() === facultyStatusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        })
    );

    // Handlers
    function openViewModal(user) {
        selectedUser = user;
        viewModalOpen = true;
    }

    function openConfirmAction(user, type) {
        actionUser = user;
        actionType = type;
        confirmActionOpen = true;
    }

    function executeAction() {
        if (!actionUser) return;

        if (activeTab === 'students') {
            const idx = students.findIndex(s => s.id === actionUser.id);
            if (idx !== -1) {
                students[idx].status = actionType === 'activate' ? 'Active' : 'Inactive';
                students = [...students];
            }
        } else {
            const idx = facultyList.findIndex(f => f.id === actionUser.id);
            if (idx !== -1) {
                facultyList[idx].status = actionType === 'activate' ? 'Active' : 'Inactive';
                facultyList = [...facultyList];
            }
        }
        
        // Update selectedUser if it's the same one open in the view modal
        if (selectedUser && selectedUser.id === actionUser.id) {
            selectedUser.status = actionType === 'activate' ? 'Active' : 'Inactive';
        }

        confirmActionOpen = false;
        actionUser = null;
    }
</script>

<svelte:head>
    <title>Users | Attendion</title>
</svelte:head>

<div class="px-6 py-8 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Users</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage registered students and faculty within your department.</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'students' ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}"
                onclick={() => activeTab = 'students'}
            >
                Students
            </button>
            <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'faculty' ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}"
                onclick={() => activeTab = 'faculty'}
            >
                Faculty
            </button>
        </nav>
    </div>

    {#if activeTab === 'students'}
        <!-- Students Filters & Search -->
        <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div class="relative max-w-sm w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    bind:value={studentSearch}
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Search by name, ID, or roll no..."
                />
            </div>
            
            <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <select bind:value={studentYearFilter} class="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <option value="all">All Years</option>
                    <option value="SY">SY</option>
                    <option value="TY">TY</option>
                    <option value="B.Tech">B.Tech</option>
                </select>
                <select bind:value={studentDivFilter} class="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <option value="all">All Divs</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
                <select bind:value={studentStatusFilter} class="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </div>

        <!-- Students Table -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID / Roll No</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year & Div</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {#each filteredStudents as student (student.id)}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">{student.id}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">Roll: {student.roll}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">{student.year}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">Div {student.division}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {student.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
                                        {student.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <button 
                                            type="button"
                                            onclick={() => openViewModal(student)} 
                                            class="inline-flex items-center justify-center p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                                            title="View Details"
                                        >
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                        {#if student.status === 'Active'}
                                            <button 
                                                type="button"
                                                onclick={() => openConfirmAction(student, 'deactivate')} 
                                                class="inline-flex items-center justify-center p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                title="Deactivate User"
                                            >
                                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                            </button>
                                        {:else}
                                            <button 
                                                type="button"
                                                onclick={() => openConfirmAction(student, 'activate')} 
                                                class="inline-flex items-center justify-center p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 rounded-md transition-colors"
                                                title="Activate User"
                                            >
                                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </button>
                                        {/if}
                                    </div>
                                </td>
                            </tr>
                        {:else}
                            <tr>
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <svg class="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p class="text-sm font-medium text-gray-900 dark:text-white">No students found</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination (Mocked structure) -->
            {#if filteredStudents.length > 0}
                <div class="bg-white dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between sm:px-6">
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span class="font-medium">1</span> to <span class="font-medium">{filteredStudents.length}</span> of <span class="font-medium">{filteredStudents.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800" disabled>
                                    <span class="sr-only">Previous</span>
                                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                                </button>
                                <button class="relative inline-flex items-center px-4 py-2 border border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-sm font-medium text-purple-600 dark:text-purple-400">1</button>
                                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800" disabled>
                                    <span class="sr-only">Next</span>
                                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    {#if activeTab === 'faculty'}
        <!-- Faculty Filters & Search -->
        <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div class="relative max-w-sm w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    bind:value={facultySearch}
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Search by name or ID..."
                />
            </div>
            
            <div class="flex gap-2">
                <select bind:value={facultyStatusFilter} class="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </div>

        <!-- Faculty Table -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faculty Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faculty ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {#each filteredFaculty as faculty (faculty.id)}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                                            {faculty.name.split(' ').pop().charAt(0)}
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">{faculty.name}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">{faculty.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">{faculty.id}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">{faculty.department}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {faculty.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
                                        {faculty.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <button 
                                            type="button"
                                            onclick={() => openViewModal(faculty)} 
                                            class="inline-flex items-center justify-center p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                                            title="View Details"
                                        >
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                        {#if faculty.status === 'Active'}
                                            <button 
                                                type="button"
                                                onclick={() => openConfirmAction(faculty, 'deactivate')} 
                                                class="inline-flex items-center justify-center p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                title="Deactivate User"
                                            >
                                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                            </button>
                                        {:else}
                                            <button 
                                                type="button"
                                                onclick={() => openConfirmAction(faculty, 'activate')} 
                                                class="inline-flex items-center justify-center p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 rounded-md transition-colors"
                                                title="Activate User"
                                            >
                                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </button>
                                        {/if}
                                    </div>
                                </td>
                            </tr>
                        {:else}
                            <tr>
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <svg class="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p class="text-sm font-medium text-gray-900 dark:text-white">No faculty found</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            
             <!-- Pagination (Mocked structure) -->
             {#if filteredFaculty.length > 0}
             <div class="bg-white dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between sm:px-6">
                 <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                     <div>
                         <p class="text-sm text-gray-700 dark:text-gray-300">
                             Showing <span class="font-medium">1</span> to <span class="font-medium">{filteredFaculty.length}</span> of <span class="font-medium">{filteredFaculty.length}</span> results
                         </p>
                     </div>
                     <div>
                         <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                             <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800" disabled>
                                 <span class="sr-only">Previous</span>
                                 <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                             </button>
                             <button class="relative inline-flex items-center px-4 py-2 border border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-sm font-medium text-purple-600 dark:text-purple-400">1</button>
                             <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800" disabled>
                                 <span class="sr-only">Next</span>
                                 <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                             </button>
                         </nav>
                     </div>
                 </div>
             </div>
         {/if}
        </div>
    {/if}
</div>

<!-- View Profile Modal -->
{#if viewModalOpen && selectedUser}
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onclick={() => viewModalOpen = false}></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-200 dark:border-gray-800">
                <div class="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between items-start mb-5">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
                                    {selectedUser.name}
                                </h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                            </div>
                        </div>
                        <button type="button" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onclick={() => viewModalOpen = false}>
                            <span class="sr-only">Close</span>
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <div class="sm:col-span-1">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ID / Reference</dt>
                                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{selectedUser.id}</dd>
                            </div>
                            {#if selectedUser.roll}
                                <div class="sm:col-span-1">
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Roll Number</dt>
                                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{selectedUser.roll}</dd>
                                </div>
                            {/if}
                            <div class="sm:col-span-1">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{selectedUser.department}</dd>
                            </div>
                            {#if selectedUser.year}
                                <div class="sm:col-span-1">
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Year & Div</dt>
                                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{selectedUser.year} - Div {selectedUser.division}</dd>
                                </div>
                            {/if}
                            <div class="sm:col-span-1">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</dt>
                                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                                    <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full {selectedUser.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
                                        {selectedUser.status}
                                    </span>
                                </dd>
                            </div>
                            <div class="sm:col-span-1">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">RFID Card</dt>
                                <dd class="mt-1 text-sm text-gray-900 dark:text-white font-mono">{selectedUser.rfid}</dd>
                            </div>
                            
                            {#if selectedUser.subjects}
                                <div class="sm:col-span-2">
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Teaching Assignments (Read-only)</dt>
                                    <dd class="mt-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                                        {selectedUser.subjects}
                                    </dd>
                                </div>
                            {/if}
                        </dl>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" onclick={() => viewModalOpen = false}>
                        Close
                    </button>
                    {#if selectedUser.status === 'Active'}
                        <button type="button" class="mt-3 sm:mr-3 w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" onclick={() => { viewModalOpen = false; openConfirmAction(selectedUser, 'deactivate'); }}>
                            Deactivate User
                        </button>
                    {:else}
                        <button type="button" class="mt-3 sm:mr-3 w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" onclick={() => { viewModalOpen = false; openConfirmAction(selectedUser, 'activate'); }}>
                            Activate User
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Confirmation Dialog -->
{#if confirmActionOpen && actionUser}
    <div class="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onclick={() => confirmActionOpen = false}></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full border border-gray-200 dark:border-gray-800">
                <div class="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        {#if actionType === 'deactivate'}
                            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        {:else}
                            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        {/if}
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                {actionType === 'deactivate' ? 'Deactivate User' : 'Activate User'}
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to {actionType} <span class="font-semibold text-gray-800 dark:text-gray-200">{actionUser.name}</span>? 
                                    {#if actionType === 'deactivate'}
                                        They will no longer be able to log in or access the portal.
                                    {:else}
                                        They will regain full access to the portal.
                                    {/if}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 {actionType === 'deactivate' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors" onclick={executeAction}>
                        {actionType === 'deactivate' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" onclick={() => confirmActionOpen = false}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
