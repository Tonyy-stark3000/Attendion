<script>
    import Sidebar from '$lib/components/student/Sidebar.svelte';
    let { children } = $props();
</script>

<!--
    Layout:
    ┌─────────────────────────────────────────┐
    │           Global Navbar (fixed, 72px)   │  ← from root +layout.svelte
    ├───────────┬─────────────────────────────┤
    │  Sidebar  │      Page content            │
    │  (fixed)  │      (scrollable)            │
    │   224px   │                              │
    └───────────┴─────────────────────────────┘
-->
<div class="flex min-h-screen bg-gray-50/40 dark:bg-gray-950">
    <Sidebar />

    <!-- Content area: offset top for Navbar, left for sidebar on lg screens, bottom for mobile nav -->
    <main
        class="flex-1 min-w-0 pt-[72px] pb-20 lg:pb-0 lg:pl-56"
        id="student-main"
    >
        {@render children()}
    </main>
</div>
