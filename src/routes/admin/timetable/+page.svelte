<script>
    import { divisions, mockLectures as initialLectures } from '$lib/data/mockTimetable.js';
    import { academicYears, initialSubjectsByYear } from '$lib/data/mockSubjects.js';
    import { mockFaculty } from '$lib/data/mockUsers.js';

    let selectedDivisionId = $state(null);
    let lectures = $state([...initialLectures]);

    // Modal state
    let isModalOpen = $state(false);
    let modalMode = $state('add'); // 'add' | 'edit'
    let currentLecture = $state(null);

    // Form state
    let formDay = $state('Monday');
    let formStartTime = $state('09:00');
    let formEndTime = $state('10:00');
    let formSubjectId = $state('');
    let formFacultyId = $state('');
    let formVenue = $state('');
    let formType = $state('Lecture');

    let formError = $state('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Color maps for the division cards
    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800/60', hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800/60', hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800/60', hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800/60', hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' }
    };

    let selectedDivision = $derived(divisions.find(d => d.id === selectedDivisionId));
    
    // Get subjects for the selected division's year (assuming sem1 for simplicity in this mock, or combining both)
    let availableSubjects = $derived.by(() => {
        if (!selectedDivision) return [];
        const yearId = selectedDivision.yearId;
        const yearData = initialSubjectsByYear[yearId];
        return yearData ? [...yearData.sem1, ...yearData.sem2] : [];
    });

    let divisionLectures = $derived(lectures.filter(l => l.divisionId === selectedDivisionId));

    function openDivision(id) {
        selectedDivisionId = id;
    }

    function goBack() {
        selectedDivisionId = null;
    }

    function openAddModal(day = 'Monday') {
        modalMode = 'add';
        currentLecture = null;
        formDay = day;
        formStartTime = '09:00';
        formEndTime = '10:00';
        formSubjectId = availableSubjects.length > 0 ? availableSubjects[0].id : '';
        formFacultyId = mockFaculty.length > 0 ? mockFaculty[0].id : '';
        formVenue = '';
        formType = 'Lecture';
        formError = '';
        isModalOpen = true;
    }

    function openEditModal(lecture) {
        modalMode = 'edit';
        currentLecture = lecture;
        formDay = lecture.day;
        formStartTime = lecture.startTime;
        formEndTime = lecture.endTime;
        formSubjectId = lecture.subject;
        formFacultyId = lecture.facultyId;
        formVenue = lecture.venue;
        formType = lecture.type;
        formError = '';
        isModalOpen = true;
    }

    function closeModal() {
        isModalOpen = false;
    }

    function saveLecture() {
        if (!formSubjectId || !formFacultyId || !formVenue.trim()) {
            formError = 'Please fill in all fields.';
            return;
        }

        if (formStartTime >= formEndTime) {
            formError = 'End time must be after start time.';
            return;
        }

        const lectureData = {
            id: currentLecture ? currentLecture.id : `LEC-${Date.now()}`,
            divisionId: selectedDivisionId,
            day: formDay,
            startTime: formStartTime,
            endTime: formEndTime,
            subject: formSubjectId,
            facultyId: formFacultyId,
            venue: formVenue.trim(),
            type: formType
        };

        if (modalMode === 'add') {
            lectures = [...lectures, lectureData];
        } else {
            lectures = lectures.map(l => l.id === lectureData.id ? lectureData : l);
        }
        
        closeModal();
    }

    function deleteLecture() {
        if (currentLecture) {
            lectures = lectures.filter(l => l.id !== currentLecture.id);
            closeModal();
        }
    }

    // Helper to format time (e.g., 09:00 -> 9:00 AM)
    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${m} ${ampm}`;
    }

    // Helper to get subject name
    function getSubjectName(subjectId) {
        const sub = availableSubjects.find(s => s.id === subjectId);
        return sub ? sub.name : subjectId;
    }

    // Helper to get faculty name
    function getFacultyName(facultyId) {
        const fac = mockFaculty.find(f => f.id === facultyId);
        return fac ? fac.name : facultyId;
    }

    // Sort lectures by start time
    function getSortedLecturesForDay(day) {
        return divisionLectures
            .filter(l => l.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
</script>

<svelte:head>
    <title>Timetable | Attendion</title>
</svelte:head>

<div class="px-6 py-8 max-w-7xl mx-auto space-y-8">
    
    <!-- ─── OVERVIEW: Division Cards ────────────────────────────── -->
    {#if !selectedDivisionId}
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Timetable</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a division to view and manage its weekly schedule.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {#each divisions as div}
                {@const c = colorMap[div.color]}
                <button
                    type="button"
                    class="group relative flex flex-col p-6 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onclick={() => openDivision(div.id)}
                >
                    <div class="flex items-center justify-between mb-4">
                         <span class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-widest {c.badge}">
                            {div.yearLabel}
                        </span>
                        <div class="h-8 w-8 rounded-full bg-white/60 dark:bg-gray-900/50 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            {div.division}
                        </div>
                    </div>
                   
                    <h2 class="mt-auto text-xl font-bold text-gray-900 dark:text-white">{div.yearLabel} — Div {div.division}</h2>
                </button>
            {/each}
        </div>

    <!-- ─── DIVISION TIMETABLE VIEW ─────────────────────────────── -->
    {:else}
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div class="flex items-center gap-4">
                <button
                    type="button"
                    class="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                    onclick={goBack}
                    aria-label="Back to divisions"
                >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                </button>
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{selectedDivision.yearLabel} — Division {selectedDivision.division}</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Weekly Schedule</p>
                </div>
            </div>
            <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-950"
                onclick={() => openAddModal()}
            >
                <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add Lecture
            </button>
        </div>

        <!-- Weekly Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {#each days as day}
                {@const dayLectures = getSortedLecturesForDay(day)}
                <div class="flex flex-col bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div class="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 class="font-semibold text-gray-900 dark:text-white">{day}</h3>
                        <button 
                            class="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1"
                            onclick={() => openAddModal(day)}
                            aria-label={`Add lecture to ${day}`}
                        >
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        </button>
                    </div>
                    
                    <div class="p-3 flex-1 flex flex-col gap-3 min-h-[150px]">
                        {#each dayLectures as lecture}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div 
                                class="relative rounded-md p-2.5 border cursor-pointer transition-all hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm {lecture.type === 'Practical' ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50' : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800'}"
                                onclick={() => openEditModal(lecture)}
                            >
                                <div class="flex justify-between items-start mb-0.5">
                                    <span class="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                                        {formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}
                                    </span>
                                    <span class="text-[10px] font-bold {lecture.type === 'Practical' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}">
                                        {lecture.type === 'Practical' ? 'PR' : 'LE'}
                                    </span>
                                </div>
                                <div class="font-medium text-xs text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2">
                                    {getSubjectName(lecture.subject)}
                                </div>
                                <div class="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                                    <span class="truncate pr-2" title={getFacultyName(lecture.facultyId)}>{getFacultyName(lecture.facultyId)}</span>
                                    <span class="shrink-0 font-medium">{lecture.venue}</span>
                                </div>
                            </div>
                        {:else}
                            <div class="flex-1 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 py-4">
                                No classes
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- ─── Modal for Add/Edit Lecture ────────────────────────────── -->
{#if isModalOpen}
    <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <!-- The wrapper handles outside clicks (mousedown to avoid drag selections) -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0" onmousedown={closeModal}>
            <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!-- Prevent propagation so clicking inside doesn't close it -->
            <div class="inline-block align-bottom bg-white dark:bg-gray-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full border border-gray-200 dark:border-gray-800" onmousedown={(e) => e.stopPropagation()}>
                <div class="bg-white dark:bg-gray-900 px-4 pt-4 pb-3 sm:p-5 sm:pb-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            {modalMode === 'add' ? 'Add Lecture' : 'Edit Lecture'}
                        </h3>
                        <button type="button" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onclick={closeModal}>
                            <span class="sr-only">Close</span>
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div class="space-y-3">
                        {#if formError}
                            <div class="rounded-md bg-red-50 dark:bg-red-900/20 p-2.5 border border-red-200 dark:border-red-800/50 text-xs text-red-800 dark:text-red-300">
                                {formError}
                            </div>
                        {/if}

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
                                <select bind:value={formDay} class="block w-full rounded-md border-gray-300 py-1.5 px-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                    {#each days as d}
                                        <option value={d}>{d}</option>
                                    {/each}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select bind:value={formType} class="block w-full rounded-md border-gray-300 py-1.5 px-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                    <option value="Lecture">Lecture</option>
                                    <option value="Practical">Practical</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                <input type="time" bind:value={formStartTime} class="block w-full rounded-md border-gray-300 py-1.5 px-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                                <input type="time" bind:value={formEndTime} class="block w-full rounded-md border-gray-300 py-1.5 px-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                            <select bind:value={formSubjectId} class="block w-full rounded-md border-gray-300 py-1.5 px-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                {#each availableSubjects as sub}
                                    <option value={sub.id}>{sub.name}</option>
                                {/each}
                            </select>
                            {#if availableSubjects.length === 0}
                                <p class="text-xs text-red-500 mt-1">No subjects configured for this year.</p>
                            {/if}
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
                                <select bind:value={formFacultyId} class="block w-full rounded-md border-gray-300 py-1.5 px-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                    {#each mockFaculty as fac}
                                        <option value={fac.id}>{fac.name}</option>
                                    {/each}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Venue</label>
                                <input type="text" bind:value={formVenue} placeholder="Room 201" class="block w-full rounded-md border-gray-300 py-1.5 px-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-5 flex flex-row-reverse justify-between border-t border-gray-200 dark:border-gray-800">
                    <div class="flex gap-2">
                         <button type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none transition-colors" onclick={saveLecture}>
                            Save
                        </button>
                        <button type="button" class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-1.5 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors" onclick={closeModal}>
                            Cancel
                        </button>
                    </div>
                    {#if modalMode === 'edit'}
                        <button type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none transition-colors" onclick={deleteLecture}>
                            Remove
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
