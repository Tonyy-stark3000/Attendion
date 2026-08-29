 <!-- <script>
    let clicked = $state(false);

    function test() {
        clicked = !clicked;
        console.log('BUTTON CLICKED');
        document.documentElement.classList.toggle('dark');
    }
</script>

<header
    class="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4"
>
    Left: Attendion Branding
    <div class="flex items-center gap-2.5">
        Purple Tick Logo
        <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                class="h-5 w-5"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m5 12 4 4L19 6"
                />
            </svg>
        </div>

        <span class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            Attendion
        </span>
    </div>

    Right: Theme + Profile
    <div class="flex items-center gap-3">
        Theme Toggle
        <button
            type="button"
            onclick={test}
            aria-label="Toggle theme"
            class="rounded-xl border border-gray-300 bg-white p-2.5 text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
            {#if clicked}
                Sun
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.8"
                    stroke="currentColor"
                    class="h-5 w-5"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    />
                </svg>
            {:else}
                Moon
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.8"
                    stroke="currentColor"
                    class="h-5 w-5"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                    />
                </svg>
            {/if}
        </button>

        Profile
        <button
            type="button"
            aria-label="Profile"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="h-5 w-5"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                />
            </svg>
        </button>
    </div>
</header> -->

<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    let clicked = $state(false);

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

    function test() {
        clicked = !clicked;

        document.documentElement.classList.toggle('dark');

        localStorage.setItem('theme', clicked ? 'dark' : 'light');
    }
</script>

{#if page.status < 400}
    <header
        class="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/60 dark:bg-gray-950/80 dark:border-gray-800/60"
    >
        <!-- Left: Attendion Branding -->
        <div class="flex items-center gap-2.5">
            <!-- Purple Tick Logo -->
            <div
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    class="h-5 w-5"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m5 12 4 4L19 6"
                    />
                </svg>
            </div>

            <span
                class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
            >
                Attendion
            </span>
        </div>

        <!-- Right: Theme + Profile -->
        <div class="flex items-center gap-3">

            <!-- Theme Toggle -->
            <button
                type="button"
                onclick={test}
                aria-label="Toggle theme"
                class="rounded-xl border border-gray-300 bg-white p-2.5 text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
                {#if clicked}
                    <!-- Moon - Dark Mode -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.8"
                        stroke="currentColor"
                        class="h-5 w-5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                        />
                    </svg>
                {:else}
                    <!-- Sun - Light Mode -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.8"
                        stroke="currentColor"
                        class="h-5 w-5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                        />
                    </svg>
                {/if}
            </button>

            <!-- Profile: Portal pages only -->
            {#if page.url.pathname !== '/'}
                <button
                    type="button"
                    aria-label="Profile"
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.8"
                        stroke="currentColor"
                        class="h-5 w-5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                        />
                    </svg>
                </button>
            {/if}

        </div>
    </header>
{/if}