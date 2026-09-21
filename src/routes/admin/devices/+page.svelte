<script>
    import { mockDevices, mockDeviceActivity } from '$lib/data/deviceMock.js';

    let devices = $state([...mockDevices]);
    
    // Modals state
    let isAddEditModalOpen = $state(false);
    let modalMode = $state('add'); // 'add' | 'edit'
    let currentDevice = $state(null);
    let isViewModalOpen = $state(false);
    let viewDevice = $state(null);
    
    // Form state
    let formId = $state('');
    let formName = $state('');
    let formVenue = $state('');
    let formStatus = $state('Active');
    let formError = $state('');

    const venues = [
        'Room 401 (Classroom)', 'Room 402 (Classroom)', 'Room 403 (Classroom)',
        'Room 404 (Classroom)', 'Room 405 (Classroom)', 'Room 406 (Classroom)',
        'Room 407 (Classroom)', 'Room 408 (Classroom)', 'Room 409 (Classroom)',
        'Room 410 (Lab)', 'Room 411 (Lab)', 'Room 412 (Lab)'
    ];

    function openAddModal() {
        modalMode = 'add';
        currentDevice = null;
        formId = 'DEV-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        formName = '';
        formVenue = venues[0];
        formStatus = 'Active';
        formError = '';
        isAddEditModalOpen = true;
    }

    function openEditModal(device) {
        modalMode = 'edit';
        currentDevice = device;
        formId = device.id;
        formName = device.name;
        formVenue = device.venue;
        formStatus = device.status;
        formError = '';
        isAddEditModalOpen = true;
    }

    function closeAddEditModal() {
        isAddEditModalOpen = false;
    }

    function saveDevice() {
        if (!formName.trim()) {
            formError = 'Device Name is required.';
            return;
        }
        
        const deviceData = {
            id: formId,
            name: formName.trim(),
            venue: formVenue,
            status: formStatus,
            isOnline: currentDevice ? currentDevice.isOnline : false,
            lastSeen: currentDevice ? currentDevice.lastSeen : 'Never',
            readerStatus: currentDevice ? currentDevice.readerStatus : 'Offline',
            currentSession: currentDevice ? currentDevice.currentSession : null
        };

        if (modalMode === 'add') {
            devices = [...devices, deviceData];
        } else {
            devices = devices.map(d => d.id === formId ? deviceData : d);
        }
        closeAddEditModal();
    }

    function deactivateDevice(device) {
        devices = devices.map(d => d.id === device.id ? { ...d, status: 'Inactive' } : d);
    }

    function openViewModal(device) {
        viewDevice = device;
        isViewModalOpen = true;
    }

    function closeViewModal() {
        isViewModalOpen = false;
        viewDevice = null;
    }
</script>

<svelte:head>
    <title>RFID / Devices | Attendion</title>
</svelte:head>

<div class="px-6 py-8 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">RFID / Devices</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage ESP32 hardware and venue associations.</p>
        </div>
        <button
            type="button"
            onclick={openAddModal}
            class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none transition-colors"
        >
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Device
        </button>
    </div>

    <!-- Devices Table -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead class="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Connection</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {#each devices as device (device.id)}
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">{device.name}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">{device.id}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">{device.venue}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <span class="h-2.5 w-2.5 rounded-full mr-2 {device.isOnline ? 'bg-green-500' : 'bg-gray-400'}"></span>
                                    <span class="text-sm text-gray-900 dark:text-white">{device.isOnline ? 'Online' : 'Offline'}</span>
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Last seen: {device.lastSeen}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {device.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
                                    {device.status}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <button 
                                        type="button"
                                        onclick={() => openViewModal(device)}
                                        class="inline-flex items-center justify-center p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                                        title="View Details"
                                    >
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                    <button 
                                        type="button"
                                        onclick={() => openEditModal(device)}
                                        class="inline-flex items-center justify-center p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                        title="Edit Device"
                                    >
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    {#if device.status === 'Active'}
                                        <button 
                                            type="button"
                                            onclick={() => deactivateDevice(device)}
                                            class="inline-flex items-center justify-center p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                            title="Deactivate Device"
                                        >
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                        </button>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                No devices registered yet.
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add/Edit Device Modal -->
{#if isAddEditModalOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4" role="dialog" onclick={closeAddEditModal}>
        <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col" onclick={(e) => e.stopPropagation()}>
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h3 class="font-bold text-gray-900 dark:text-white text-lg">
                    {modalMode === 'add' ? 'Add New Device' : 'Edit Device'}
                </h3>
                <button type="button" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" onclick={closeAddEditModal}>
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div class="p-5 space-y-4">
                {#if formError}
                    <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/50">
                        {formError}
                    </div>
                {/if}

                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Device ID</label>
                    <input type="text" bind:value={formId} disabled class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm py-2 px-3" />
                </div>
                
                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Device Name</label>
                    <input type="text" bind:value={formName} placeholder="e.g. ESP32-R1" class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Assigned Venue</label>
                    <select bind:value={formVenue} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        {#each venues as v}
                            <option value={v}>{v}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Status</label>
                    <select bind:value={formStatus} class="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div class="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-end gap-3">
                <button type="button" class="px-5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm" onclick={closeAddEditModal}>
                    Cancel
                </button>
                <button type="button" class="px-5 py-2 rounded-lg bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-sm" onclick={saveDevice}>
                    {modalMode === 'add' ? 'Save Device' : 'Update Device'}
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- View Device Modal -->
{#if isViewModalOpen && viewDevice}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4" role="dialog" onclick={closeViewModal}>
        <div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]" onclick={(e) => e.stopPropagation()}>
            <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50/50 dark:bg-gray-800/30">
                <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl shrink-0">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                            {viewDevice.name}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{viewDevice.id} &middot; {viewDevice.venue}</p>
                    </div>
                </div>
                <button type="button" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" onclick={closeViewModal}>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Status Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/60">
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Network</p>
                        <div class="flex items-center">
                            <span class="h-2.5 w-2.5 rounded-full mr-2 {viewDevice.isOnline ? 'bg-green-500' : 'bg-red-500'}"></span>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{viewDevice.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/60">
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Last Seen</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{viewDevice.lastSeen}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/60">
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Reader</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{viewDevice.readerStatus}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/60">
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">State</p>
                        <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full {viewDevice.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
                            {viewDevice.status}
                        </span>
                    </div>
                </div>

                <!-- Current Session -->
                <div class="mb-8">
                    <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Current Attendance Session</h4>
                    {#if viewDevice.currentSession}
                        <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 rounded-lg p-4 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                                    <span class="w-2.5 h-2.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></span>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-purple-900 dark:text-purple-100">{viewDevice.currentSession}</p>
                                    <p class="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Session is active and accepting scans</p>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400">
                            No active session running on this device.
                        </div>
                    {/if}
                </div>

                <!-- Recent Activity -->
                <div>
                    <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Recent Scan Activity</h4>
                    {#if mockDeviceActivity[viewDevice.id] && mockDeviceActivity[viewDevice.id].length > 0}
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead class="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                                        <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">UID</th>
                                        <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Result</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {#each mockDeviceActivity[viewDevice.id] as activity (activity.id)}
                                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{activity.time}</td>
                                            <td class="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-300">{activity.uid}</td>
                                            <td class="px-4 py-3 whitespace-nowrap">
                                                {#if activity.result === 'Accepted'}
                                                    <span class="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                                                        <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                                        Accepted
                                                    </span>
                                                {:else if activity.result === 'Rejected'}
                                                    <span class="inline-flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                                                        <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                                        Rejected
                                                    </span>
                                                {:else}
                                                    <span class="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
                                                        <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                        Unknown
                                                    </span>
                                                {/if}
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {:else}
                        <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400">
                            No recent activity recorded for this device.
                        </div>
                    {/if}
                </div>
            </div>
            
            <div class="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-end">
                <button type="button" class="px-5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm" onclick={closeViewModal}>
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}
