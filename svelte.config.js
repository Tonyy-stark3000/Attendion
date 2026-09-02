// import adapter from '@sveltejs/adapter-static';

// const config = {
// 	kit: {
// 		paths: {
// 			base: '/Attendion'
// 		},
// 		adapter: adapter({
// 			fallback: 'index.html'
// 		})
// 	}
// };

// export default config;

import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		paths: {
			base: '/Attendion'
		},
		adapter: adapter({
			fallback: 'index.html'
		})
	}
};

export default config;