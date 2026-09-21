<script>
    import { page } from '$app/state';
    import { base } from '$app/paths';

    let { isCollapsed = $bindable() } = $props();

    const navItems = [
        {
            label: 'Dashboard',
            href: '/faculty',
            exact: true,
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        },
        {
            label: 'Attendance History',
            href: '/faculty/history',
            exact: false,
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
        },
        {
            label: 'Schedule',
            href: '/faculty/schedule',
            exact: false,
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        },
        {
            label: 'Settings',
            href: '/faculty/settings',
            exact: false,
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
        }
    ];

    function isActive(item) {
        const path = page.url.pathname;
        const fullPath = `${base}${item.href}`;
        return item.exact ? path === fullPath : path.startsWith(fullPath);
    }
</script>

<aside
    class="fixed left-0 top-[72px] z-40 hidden h-[calc(100vh-72px)]
           flex-col border-r border-gray-200/80 bg-white/80 backdrop-blur-xl
           dark:border-gray-800 dark:bg-gray-950/80
           lg:flex transition-all duration-300 {isCollapsed ? 'w-[72px]' : 'w-64'}"
>
    <div class="flex items-center {isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'} border-b border-gray-100 dark:border-gray-800/50">
        {#if !isCollapsed}
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Menu</span>
        {/if}
        <button
            onclick={() => isCollapsed = !isCollapsed}
            class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                {#if isCollapsed}
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                {/if}
            </svg>
        </button>
    </div>

    <nav class="flex-1 overflow-y-auto {isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-1">
        {#each navItems as item}
            {@const active = isActive(item)}
            <a
                href="{base}{item.href}"
                class="group flex items-center {isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all duration-150
                    {active
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'}"
                title={isCollapsed ? item.label : ''}
            >
                <svg
                    class="h-[18px] w-[18px] shrink-0 transition-colors
                        {active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    viewBox="0 0 24 24"
                >
                    <path d={item.icon} />
                </svg>

                {#if !isCollapsed}
                    <span class="truncate">{item.label}</span>
                    {#if active}
                        <span class="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>
                    {/if}
                {/if}
            </a>
        {/each}
    </nav>

    {#if !isCollapsed}
        <div class="px-4 pb-5">
            <p class="text-[11px] text-gray-400 dark:text-gray-600 truncate">Faculty - Session Manager</p>
        </div>
    {/if}
</aside>

<nav
    class="fixed bottom-0 left-0 z-40 flex w-full border-t border-gray-200 bg-white/90 backdrop-blur-xl
           dark:border-gray-800 dark:bg-gray-950/90
           lg:hidden overflow-x-auto"
>
    {#each navItems as item}
        {@const active = isActive(item)}
        <a
            href="{base}{item.href}"
            class="flex flex-1 min-w-[72px] flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors
                {active ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}"
        >
            <svg
                class="h-5 w-5 {active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
            >
                <path d={item.icon} />
            </svg>
            <span class="truncate w-full text-center px-1">{item.label}</span>
        </a>
    {/each}
</nav>
