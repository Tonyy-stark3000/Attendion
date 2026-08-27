 <!-- <script>
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="w-full flex items-center justify-between py-6 px-8 max-w-7xl mx-auto absolute top-0 left-0 right-0">
	<div class="flex items-center gap-2">
		Minimal purple check/tick logo
		<div class="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="20 6 9 17 4 12"></polyline>
			</svg>
		</div>
		<span class="font-semibold text-xl tracking-tight text-gray-900 dark:text-white">Attendion</span>
	</div>

	<nav class="flex items-center gap-4">
		<ThemeToggle />
	</nav>
</header>  -->

<script>
	let clicked = $state(false);

	function test() {
		clicked = !clicked;
		console.log('BUTTON CLICKED');
		document.documentElement.classList.toggle('dark');
	}
</script>

<header>
	<button type="button" onclick={test}>
		CLICK ME
	</button>

	<p>Clicked: {clicked}</p>
</header>
