<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';

    let clicked = $state(false);
    let profileMenuOpen = $state(false);
    let accountModalOpen = $state(false);

    onMount(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            clicked = true;
            document.documentElement.classList.add('dark');
        } else {
            clicked = false;
            document.documentElement.classList.remove('dark');
        }
    });

    function toggleTheme() {
        clicked = !clicked;
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', clicked ? 'dark' : 'light');
    }

    function toggleProfileMenu(e) {
        e.stopPropagation();
        profileMenuOpen = !profileMenuOpen;
    }

    function closeProfileMenu() {
        profileMenuOpen = false;
    }

    function openAccount() {
        accountModalOpen = true;
        profileMenuOpen = false;
    }

    function signOut() {
        profileMenuOpen = false;
        goto(`${base}/`);
    }

    // Derived portal info based on current path
    let portalLabel = $derived(
        page.url.pathname.startsWith(`${base}/admin`) ? 'Admin Portal' :
        page.url.pathname.startsWith(`${base}/faculty`) ? 'Faculty Portal' :
        page.url.pathname.startsWith(`${base}/student`) ? 'Student Portal' :
        ''
    );

    let userName = $derived(
        page.url.pathname.startsWith(`${base}/admin`) ? 'Sujay (Admin)' :
        page.url.pathname.startsWith(`${base}/faculty`) ? 'Dr. Ananya Iyer' :
        page.url.pathname.startsWith(`${base}/student`) ? 'Aarav Sharma' :
        ''
    );

    let userEmail = $derived(
        page.url.pathname.startsWith(`${base}/admin`) ? 'admin@attendion.edu' :
        page.url.pathname.startsWith(`${base}/faculty`) ? 'ananya.iyer@attendion.edu' :
        page.url.pathname.startsWith(`${base}/student`) ? 'aarav.sharma@student.edu' :
        'user@attendion.edu'
    );

    let userRole = $derived(
        page.url.pathname.startsWith(`${base}/admin`) ? 'Administrator' :
        page.url.pathname.startsWith(`${base}/faculty`) ? 'Faculty' :
        page.url.pathname.startsWith(`${base}/student`) ? 'Student' :
        'User'
    );

    let isPortalPage = $derived(
        page.url.pathname !== `${base}/` &&
        page.url.pathname !== base &&
        page.url.pathname !== '/'
    );
</script>

<svelte:window onclick={closeProfileMenu} />

{#if page.status < 400}

    <header
        class="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/60 dark:bg-gray-950/80 dark:border-gray-800/60"
    >
        <!-- Left: Attendion Branding + Portal Label -->
        <div class="flex items-center gap-2.5">
            <!-- Purple Tick Logo -->
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                </svg>
            </div>

            <span class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                Attendion
            </span>

            {#if portalLabel}
                <div class="hidden md:flex flex-col ml-4 pl-4 border-l border-gray-300 dark:border-gray-700 justify-center">
                    <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">{portalLabel}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">{userName}</span>
                </div>
            {/if}
        </div>

        <!-- Right: Theme + Profile -->
        <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button
                type="button"
                onclick={toggleTheme}
                aria-label="Toggle theme"
                class="rounded-xl border border-gray-300 bg-white p-2.5 text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
                {#if clicked}
                    <!-- Moon — Dark Mode active, click to go Light -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                    </svg>
                {:else}
                    <!-- Sun — Light Mode active, click to go Dark -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                    </svg>
                {/if}
            </button>

            <!-- Profile Menu: Portal pages only -->
            {#if isPortalPage}
                <div class="relative">
                    <button
                        type="button"
                        onclick={toggleProfileMenu}
                        aria-label="Profile menu"
                        class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                        </svg>
                    </button>

                    {#if profileMenuOpen}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <div
                            class="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl py-1.5 z-50"
                            onclick={(e) => e.stopPropagation()}
                        >
                            <!-- User info header in dropdown -->
                            <div class="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 mb-1">
                                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole}</p>
                            </div>
                            <button
                                onclick={openAccount}
                                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2.5"
                            >
                                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                                </svg>
                                Account
                            </button>
                            <button
                                onclick={signOut}
                                class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2.5"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </header>
{/if}

<!-- Account Modal -->
{#if accountModalOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
        role="dialog"
        onclick={() => accountModalOpen = false}
    >
        <div
            class="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onclick={(e) => e.stopPropagation()}
        >
            <!-- Modal Header -->
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h3 class="font-bold text-gray-900 dark:text-white text-lg">Account</h3>
                <button
                    type="button"
                    class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    onclick={() => accountModalOpen = false}
                >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Profile Card -->
            <div class="p-6 flex flex-col items-center">
                <div class="h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-sm border border-purple-200 dark:border-purple-800/50">
                    <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                    </svg>
                </div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">{userName}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{userEmail}</p>

                <div class="mt-6 w-full space-y-3">
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/60 flex justify-between text-sm">
                        <span class="text-gray-500 dark:text-gray-400">Portal</span>
                        <span class="font-medium text-gray-900 dark:text-white">{portalLabel || 'Landing'}</span>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/60 flex justify-between text-sm">
                        <span class="text-gray-500 dark:text-gray-400">Role</span>
                        <span class="font-medium text-gray-900 dark:text-white">{userRole}</span>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/60 flex justify-between text-sm">
                        <span class="text-gray-500 dark:text-gray-400">Status</span>
                        <span class="font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
                            <span class="h-2 w-2 rounded-full bg-green-500"></span>
                            Active Session
                        </span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
                <button
                    type="button"
                    onclick={signOut}
                    class="px-4 py-2 rounded-lg text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                    Sign out
                </button>
                <button
                    type="button"
                    class="px-5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                    onclick={() => accountModalOpen = false}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}

