<script>
    import { page } from '$app/state';
    import { base } from '$app/paths';

    const navItems = [
        {
            name: 'Dashboard',
            href: '/student',
            icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
        },
        {
            name: 'Attendance',
            href: '/student/attendance',
            icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
        },
        {
            name: 'Schedule',
            href: '/student/schedule',
            icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
        },
        {
            name: 'Settings',
            href: '/student/settings',
            icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
        }
    ];

    /** Dashboard link is active on exactly /student */
    function isActive(href, pathname) {
        const fullPath = `${base}${href}`;
        if (href === '/student') return pathname === fullPath;
        return pathname.startsWith(fullPath);
    }
</script>

<!-- ─── Desktop sidebar ──────────────────────────────────────────────── -->
<!-- top-[72px] matches the Navbar height: py-4 (32px) + h-10 logo (40px) -->
<aside
    class="fixed left-0 top-[72px] z-40 hidden h-[calc(100vh-72px)] w-56
           flex-col border-r border-gray-200/80 bg-white/80 backdrop-blur-xl
           dark:border-gray-800 dark:bg-gray-950/80
           lg:flex"
>
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {#each navItems as item}
            {@const active = isActive(item.href, page.url.pathname)}
            <a
                href={`${base}${item.href}`}
                class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                    {active
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'}"
            >
                <!-- Icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-[18px] w-[18px] shrink-0 transition-colors
                        {active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}"
                >
                    <path d={item.icon} />
                </svg>
                {item.name}

                <!-- Active left-bar accent -->
                {#if active}
                    <span class="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>
                {/if}
            </a>
        {/each}
    </nav>

    <!-- Footer hint -->
    <div class="px-4 pb-5">
        <p class="text-[11px] text-gray-400 dark:text-gray-600">Student · Read-only view</p>
    </div>
</aside>

<!-- ─── Mobile bottom navigation ────────────────────────────────────── -->
<nav
    class="fixed bottom-0 left-0 z-40 flex w-full border-t border-gray-200 bg-white/90 backdrop-blur-xl
           dark:border-gray-800 dark:bg-gray-950/90
           lg:hidden"
>
    {#each navItems as item}
        {@const active = isActive(item.href, page.url.pathname)}
        <a
            href={`${base}${item.href}`}
            class="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors
                {active ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-5 w-5 {active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}"
            >
                <path d={item.icon} />
            </svg>
            {item.name}
        </a>
    {/each}
</nav>
