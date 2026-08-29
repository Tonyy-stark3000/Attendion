<script>
    // ─── Mock data ───────────────────────────────────────────────
    const studentName = "Sujay";
    
    /** Minimum attendance threshold – fixed at 75% for now. */
    const MIN_ATTENDANCE = 75;

    const attendanceStats = {
        percentage: 82.4,
        present: 47,
        absent: 10,
        total: 57
    };

    const todaysClasses = [
        { time: '09:00 – 10:00', subject: 'Digital System Design', room: 'Room A-204', status: 'Present' },
        { time: '10:00 – 11:00', subject: 'EDC', room: 'Room A-204', status: 'Present' },
        { time: '11:15 – 12:15', subject: 'Mathematics', room: 'Room A-204', status: 'Upcoming' }
    ];

    const subjects = [
        { name: 'Digital System Design', short: 'DSD', percent: 90 },
        { name: 'EDC', short: 'EDC', percent: 78 },
        { name: 'Mathematics', short: 'Math', percent: 72 },
        { name: 'Engineering Mathematics', short: 'EM', percent: 86 }
    ];

    // ─── Risk logic ───────────────────────────────────────────────
    function getRisk(pct) {
        if (pct < MIN_ATTENDANCE) return 'danger';
        if (pct < 80) return 'warning';
        return 'safe';
    }

    const riskState = getRisk(attendanceStats.percentage);

    /** Returns the exact CSS colour value for a risk state — used directly on SVG stroke. */
    function riskColor(risk) {
        if (risk === 'danger')  return '#ef4444';   // red-500
        if (risk === 'warning') return '#eab308';   // yellow-500
        return '#10b981';                           // emerald-500
    }

    function riskLabel(risk) {
        if (risk === 'danger')  return 'At Risk';
        if (risk === 'warning') return 'Near Threshold';
        return 'Safe';
    }

    function riskBadgeClass(risk) {
        if (risk === 'danger')  return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20';
        if (risk === 'warning') return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20';
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20';
    }

    function riskTextClass(risk) {
        if (risk === 'danger')  return 'text-red-600 dark:text-red-400';
        if (risk === 'warning') return 'text-yellow-600 dark:text-yellow-400';
        return 'text-emerald-600 dark:text-emerald-400';
    }

    function riskPulseClass(risk) {
        if (risk === 'danger')  return 'bg-red-500';
        if (risk === 'warning') return 'bg-yellow-500';
        return 'bg-emerald-500';
    }

    function riskDescription(risk) {
        if (risk === 'danger')  return `Your attendance is below the ${MIN_ATTENDANCE}% requirement.`;
        if (risk === 'warning') return `You're close to the minimum ${MIN_ATTENDANCE}% requirement.`;
        return `You're comfortably above the ${MIN_ATTENDANCE}% requirement.`;
    }

    function insightTitle(risk) {
        if (risk === 'danger')  return 'Action Required';
        if (risk === 'warning') return 'Stay on Track';
        return "You're in the safe zone";
    }

    function insightMessage(risk) {
        if (risk === 'danger')  return 'You need to attend upcoming classes urgently to meet the minimum requirement.';
        if (risk === 'warning') return 'Avoid missing classes to stay safely above the minimum attendance threshold.';
        return 'Keep attending regularly to maintain a healthy attendance buffer.';
    }

    // ─── Circular ring maths ──────────────────────────────────────
    // SVG viewBox = 100×100, ring radius = 38 (leaving stroke room)
    const RADIUS = 38;
    const circumference = 2 * Math.PI * RADIUS;
    const strokeDashoffset = circumference - (attendanceStats.percentage / 100) * circumference;

    const arcColor   = riskColor(riskState);
    const trackColor = '#e5e7eb'; // gray-200 — track ring

    // Greeting based on hour
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
</script>

<svelte:head>
    <title>Dashboard · Attendion</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-5 py-7 lg:px-8 lg:py-8 space-y-6">

    <!-- ── Welcome ───────────────────────────────────────────── -->
    <header class="space-y-0.5">
        <h1 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {greeting}, {studentName} 👋
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
            Here's your attendance overview for today.
        </p>
    </header>

    <!-- ── Overall Attendance Card ───────────────────────────── -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Overall Attendance</p>

        <div class="flex flex-col sm:flex-row items-center gap-6">

            <!-- Ring -->
            <div class="relative shrink-0" style="width:160px;height:160px;">
                <svg
                    viewBox="0 0 100 100"
                    width="160" height="160"
                    style="transform: rotate(-90deg);"
                >
                    <!-- Track -->
                    <circle
                        cx="50" cy="50"
                        r={RADIUS}
                        fill="none"
                        stroke={trackColor}
                        stroke-width="7"
                        class="dark:opacity-20"
                    />
                    <!-- Progress arc -->
                    <circle
                        cx="50" cy="50"
                        r={RADIUS}
                        fill="none"
                        stroke={arcColor}
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-dasharray={circumference}
                        stroke-dashoffset={strokeDashoffset}
                        style="transition: stroke-dashoffset 1s ease-out;"
                    />
                </svg>
                <!-- Centre label -->
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                        {attendanceStats.percentage}%
                    </span>
                    <span class="mt-1 text-[11px] font-medium {riskTextClass(riskState)}">
                        {riskLabel(riskState)}
                    </span>
                </div>
            </div>

            <!-- Right: stats + status -->
            <div class="flex flex-1 flex-col gap-5 w-full">

                <!-- Stat row -->
                <div class="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
                    <div class="pr-4 text-center sm:text-left">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Present</p>
                        <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{attendanceStats.present}</p>
                    </div>
                    <div class="px-4 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Absent</p>
                        <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{attendanceStats.absent}</p>
                    </div>
                    <div class="pl-4 text-center sm:text-right">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
                        <p class="mt-1 text-2xl font-semibold text-purple-600 dark:text-purple-400">{attendanceStats.total}</p>
                    </div>
                </div>

                <!-- Status message -->
                <div class="rounded-xl border px-4 py-3
                    {riskState === 'danger'  ? 'border-red-100 bg-red-50/60 dark:border-red-900/30 dark:bg-red-900/10' :
                     riskState === 'warning' ? 'border-yellow-100 bg-yellow-50/60 dark:border-yellow-900/30 dark:bg-yellow-900/10' :
                                              'border-emerald-100 bg-emerald-50/60 dark:border-emerald-900/30 dark:bg-emerald-900/10'}">
                    <div class="flex items-center gap-2 mb-1">
                        <!-- Pulse dot -->
                        <span class="relative flex h-2 w-2 shrink-0">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 {riskPulseClass(riskState)}"></span>
                            <span class="relative inline-flex h-2 w-2 rounded-full {riskPulseClass(riskState)}"></span>
                        </span>
                        <span class="text-sm font-semibold {riskTextClass(riskState)}">{riskLabel(riskState)}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 pl-4">{riskDescription(riskState)}</p>
                </div>

            </div>
        </div>
    </div>

    <!-- ── Bottom row: Today's Classes + Subject Attendance ──── -->
    <div class="grid gap-6 lg:grid-cols-2">

        <!-- Today's Classes -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Today's Classes</p>

            <ul class="space-y-1">
                {#each todaysClasses as cls, i}
                    <li class="flex items-start gap-3 {i < todaysClasses.length - 1 ? 'pb-4 mb-1 border-b border-gray-100 dark:border-gray-800/60' : ''}">
                        <!-- Timeline dot -->
                        <div class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                            {cls.status === 'Present' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
                             cls.status === 'Absent'  ? 'bg-red-100 dark:bg-red-900/40' :
                                                        'bg-gray-100 dark:bg-gray-800'}">
                            <span class="h-2 w-2 rounded-full
                                {cls.status === 'Present' ? 'bg-emerald-500' :
                                 cls.status === 'Absent'  ? 'bg-red-500' :
                                                            'bg-gray-400 dark:bg-gray-500'}">
                            </span>
                        </div>
                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-2">
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white leading-snug">{cls.subject}</p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{cls.time} · {cls.room}</p>
                                </div>
                                <span class="shrink-0 mt-0.5 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset {riskState === 'danger' && cls.status === 'Absent' ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20' : cls.status === 'Present' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20' : cls.status === 'Absent' ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20' : 'bg-gray-50 text-gray-500 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20'}">
                                    {cls.status}
                                </span>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Subject Attendance -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Subject Attendance</p>

            <ul class="space-y-4">
                {#each subjects as sub}
                    {@const subRisk = getRisk(sub.percent)}
                    <li>
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{sub.short}</span>
                            <span class="text-sm font-semibold {riskTextClass(subRisk)}">{sub.percent}%</span>
                        </div>
                        <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                                class="h-full rounded-full"
                                style="width: {sub.percent}%; background-color: {riskColor(subRisk)}; transition: width 1s ease-out;"
                            ></div>
                        </div>
                    </li>
                {/each}
            </ul>

            <!-- Insight -->
            <div class="mt-5 rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-3 dark:border-purple-900/20 dark:bg-purple-900/10">
                <p class="text-xs font-medium text-purple-700 dark:text-purple-400">{insightTitle(riskState)}</p>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{insightMessage(riskState)}</p>
            </div>
        </div>

    </div>
</div>
