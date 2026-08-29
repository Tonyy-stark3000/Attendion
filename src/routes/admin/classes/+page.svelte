<script>
    import { academicYears, initialSubjectsByYear } from '$lib/data/mockSubjects.js';

    // ── State ────────────────────────────────────────────────────────────

    let selectedYear = $state(null);
    let subjectsByYear = $state(JSON.parse(JSON.stringify(initialSubjectsByYear)));

    // Add-subject inline state   (null = closed)
    let addingTo = $state(null);          // 'sem1' | 'sem2' | null
    let newSubjectName = $state('');
    let addError = $state('');

    // Context-menu / actions
    let menuOpen = $state(null);          // subject id or null
    let renameTarget = $state(null);      // { yearId, sem, subject }
    let renameValue = $state('');
    let renameError = $state('');
    let deleteTarget = $state(null);      // { yearId, sem, subject }

    // ── Derived helpers ──────────────────────────────────────────────────

    let yearMeta = $derived(selectedYear ? academicYears.find(y => y.id === selectedYear) : null);
    let yearSubjects = $derived(selectedYear ? subjectsByYear[selectedYear] : null);

    // Color maps for the year cards
    const colorMap = {
        blue:    { bg: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-200 dark:border-blue-800/60',    accent: 'text-blue-600 dark:text-blue-400',   hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
        purple:  { bg: 'bg-blue-50 dark:bg-blue-950/40',  border: 'border-blue-200 dark:border-blue-800/60',  accent: 'text-blue-600 dark:text-blue-400', hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
        amber:   { bg: 'bg-amber-50 dark:bg-amber-950/40',   border: 'border-amber-200 dark:border-amber-800/60',   accent: 'text-amber-600 dark:text-amber-400',  hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
        emerald: { bg: 'bg-blue-50 dark:bgblue-950/40', border: 'border-blue-200 dark:border-blue-800/60', accent: 'text-blue-600 dark:text-blue-400', hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' }
    };

    // ── Handlers ─────────────────────────────────────────────────────────

    function selectYear(id) {
        selectedYear = id;
        closeAll();
    }

    function goBack() {
        selectedYear = null;
        closeAll();
    }

    function closeAll() {
        addingTo = null;
        newSubjectName = '';
        addError = '';
        menuOpen = null;
        renameTarget = null;
        deleteTarget = null;
    }

    // Add
    function startAdding(sem) {
        addingTo = sem;
        newSubjectName = '';
        addError = '';
        menuOpen = null;
    }

    function cancelAdd() {
        addingTo = null;
        newSubjectName = '';
        addError = '';
    }

    function confirmAdd() {
        const name = newSubjectName.trim();
        if (!name) { addError = 'Subject name is required.'; return; }

        // duplicate check within same year
        const allInYear = [...subjectsByYear[selectedYear].sem1, ...subjectsByYear[selectedYear].sem2];
        if (allInYear.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            addError = 'This subject already exists in this year.';
            return;
        }

        const newSub = { id: `${selectedYear}-${addingTo}-${Date.now()}`, name };
        subjectsByYear[selectedYear][addingTo] = [...subjectsByYear[selectedYear][addingTo], newSub];
        cancelAdd();
    }

    // Rename
    function startRename(sem, subject) {
        renameTarget = { yearId: selectedYear, sem, subject };
        renameValue = subject.name;
        renameError = '';
        menuOpen = null;
    }

    function cancelRename() {
        renameTarget = null;
        renameValue = '';
        renameError = '';
    }

    function confirmRename() {
        const name = renameValue.trim();
        if (!name) { renameError = 'Subject name is required.'; return; }

        const allInYear = [...subjectsByYear[renameTarget.yearId].sem1, ...subjectsByYear[renameTarget.yearId].sem2];
        if (allInYear.some(s => s.id !== renameTarget.subject.id && s.name.toLowerCase() === name.toLowerCase())) {
            renameError = 'This subject already exists in this year.';
            return;
        }

        const sem = renameTarget.sem;
        const idx = subjectsByYear[renameTarget.yearId][sem].findIndex(s => s.id === renameTarget.subject.id);
        if (idx !== -1) {
            subjectsByYear[renameTarget.yearId][sem][idx].name = name;
        }
        cancelRename();
    }

    // Delete
    function startDelete(sem, subject) {
        deleteTarget = { yearId: selectedYear, sem, subject };
        menuOpen = null;
    }

    function cancelDelete() { deleteTarget = null; }

    function confirmDelete() {
        const { yearId, sem, subject } = deleteTarget;
        subjectsByYear[yearId][sem] = subjectsByYear[yearId][sem].filter(s => s.id !== subject.id);
        deleteTarget = null;
    }

    // Menu toggle
    function toggleMenu(subjectId) {
        menuOpen = menuOpen === subjectId ? null : subjectId;
    }

    // Close menu on outside click
    function handleBodyClick(e) {
        if (menuOpen && !e.target.closest('[data-menu]')) {
            menuOpen = null;
        }
    }
</script>

<svelte:head>
    <title>Classes & Subjects | Attendion</title>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="px-6 py-8 max-w-6xl mx-auto space-y-8" onclick={handleBodyClick}>

    <!-- ─── OVERVIEW: Academic Year Cards ────────────────────────────── -->
    {#if !selectedYear}
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Classes & Subjects</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Select an academic year to view and manage its subjects.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {#each academicYears as year}
                {@const c = colorMap[year.color]}
                {@const totalSubjects = subjectsByYear[year.id].sem1.length + subjectsByYear[year.id].sem2.length}
                <button
    type="button"
    class="group relative flex flex-col p-6 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    onclick={() => selectYear(year.id)}
>
                    <!-- Year badge -->
                    <span class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-widest {c.badge}">
                        {year.shortLabel}
                    </span>

                    <h2 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{year.label}</h2>
                    <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{year.description}</p>

                    <!-- Stats row -->
                    <div class="mt-5 flex items-center gap-6 text-sm">
                        <div>
                            <span class="font-semibold text-gray-900 dark:text-white">{totalSubjects}</span>
                            <span class="ml-1 text-gray-500 dark:text-gray-400">subjects</span>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-900 dark:text-white">2</span>
                            <span class="ml-1 text-gray-500 dark:text-gray-400">semesters</span>
                        </div>
                    </div>

                    <!-- Arrow indicator -->
                    <div class="absolute top-7 right-7 {c.accent} opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </div>
                </button>
            {/each}
        </div>

    <!-- ─── YEAR DETAIL: Semester 1 & 2 ─────────────────────────────── -->
    {:else}
        <!-- Back + heading -->
        <div class="flex items-center gap-4">
            <button
                type="button"
                class="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                onclick={goBack}
                aria-label="Back to all years"
            >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            </button>
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{yearMeta.label}</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{yearMeta.description}</p>
            </div>
        </div>

        <!-- Semesters -->
        {#each ['sem1', 'sem2'] as sem}
            {@const semLabel = sem === 'sem1' ? 'Semester 1' : 'Semester 2'}
            {@const subjects = yearSubjects[sem]}

            <section class="space-y-4">
                <!-- Semester header -->
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{semLabel}</h2>
                    <button
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-950"
                        onclick={() => startAdding(sem)}
                    >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Add Subject
                    </button>
                </div>

                <!-- Subject cards grid -->
                {#if subjects.length > 0 || addingTo === sem}
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {#each subjects as subject (subject.id)}
                            <!-- Rename inline -->
                            {#if renameTarget && renameTarget.subject.id === subject.id}
                                <div class="rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Rename Subject</label>
                                    <input
                                        type="text"
                                        bind:value={renameValue}
                                        class="block w-full rounded-lg border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                        onkeydown={(e) => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') cancelRename(); }}
                                    />
                                    {#if renameError}
                                        <p class="mt-1.5 text-xs text-red-600 dark:text-red-400">{renameError}</p>
                                    {/if}
                                    <div class="flex gap-2 mt-3">
                                        <button class="flex-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors" onclick={confirmRename}>Save</button>
                                        <button class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onclick={cancelRename}>Cancel</button>
                                    </div>
                                </div>
                            {:else}
                                <!-- Normal subject card -->
                                <div class="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white pr-7 leading-snug">{subject.name}</p>

                                    <!-- Dots menu button -->
                                    <div class="absolute top-3.5 right-3" data-menu>
                                        <button
                                            type="button"
                                            class="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-all"
                                            onclick={(e) => { e.stopPropagation(); toggleMenu(subject.id); }}
                                            aria-label="Subject actions"
                                        >
                                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                        </button>

                                        <!-- Dropdown -->
                                        {#if menuOpen === subject.id}
                                            <div class="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-lg z-10 py-1 text-sm">
                                                <button
                                                    class="w-full text-left px-3.5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                    onclick={() => startRename(sem, subject)}
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    class="w-full text-left px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                    onclick={() => startDelete(sem, subject)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}
                        {/each}

                        <!-- Inline add card -->
                        {#if addingTo === sem}
                            <div class="rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20 p-4">
                                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">New Subject</label>
                                <input
                                    type="text"
                                    bind:value={newSubjectName}
                                    class="block w-full rounded-lg border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    placeholder="e.g. Analog Circuits"
                                    onkeydown={(e) => { if (e.key === 'Enter') confirmAdd(); if (e.key === 'Escape') cancelAdd(); }}
                                />
                                {#if addError}
                                    <p class="mt-1.5 text-xs text-red-600 dark:text-red-400">{addError}</p>
                                {/if}
                                <div class="flex gap-2 mt-3">
                                    <button class="flex-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors" onclick={confirmAdd}>Add</button>
                                    <button class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onclick={cancelAdd}>Cancel</button>
                                </div>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <!-- Empty semester -->
                    <div class="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 py-10 flex flex-col items-center justify-center">
                        <div class="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" /></svg>
                        </div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">No subjects in {semLabel}</p>
                        <button
                            class="mt-3 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                            onclick={() => startAdding(sem)}
                        >
                            Add your first subject
                        </button>
                    </div>
                {/if}
            </section>
        {/each}
    {/if}
</div>

<!-- ─── Delete Confirmation Modal ───────────────────────────────────── -->
{#if deleteTarget}
    <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onclick={cancelDelete}></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full border border-gray-200 dark:border-gray-800">
                <div class="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                Remove Subject
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to remove <span class="font-semibold text-gray-900 dark:text-white">{deleteTarget.subject.name}</span>? This cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-800">
                    <button type="button" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors" onclick={confirmDelete}>
                        Remove
                    </button>
                    <button type="button" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" onclick={cancelDelete}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
