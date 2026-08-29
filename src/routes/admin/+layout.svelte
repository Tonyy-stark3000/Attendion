<script>
    import Sidebar from '$lib/components/admin/Sidebar.svelte';
    let { children } = $props();
</script>

<div class="flex min-h-screen bg-gray-50/40 dark:bg-gray-950">
    <Sidebar />

    <main
        class="flex-1 min-w-0 pt-[72px] pb-20 lg:pb-0 lg:pl-64"
        id="admin-main"
    >
        {@render children()}
    </main>
</div>
