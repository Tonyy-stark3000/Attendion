<script>
    import Sidebar from '$lib/components/faculty/Sidebar.svelte';
    let { children } = $props();
    let isCollapsed = $state(false);
</script>

<div class="flex min-h-screen bg-gray-50/40 dark:bg-gray-950">
    <Sidebar bind:isCollapsed />

    <main
        class="flex-1 min-w-0 pt-[72px] pb-20 lg:pb-0 transition-all duration-300 {isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}"
        id="faculty-main"
    >
        {@render children()}
    </main>
</div>
