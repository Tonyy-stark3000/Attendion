import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		paths: {
			base: dev ? '' : (process.env.BASE_PATH ?? '/Attendion')
		},
		adapter: adapter({
			fallback: 'index.html'
		})
	}
};

export default config;