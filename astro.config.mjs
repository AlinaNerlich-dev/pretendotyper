import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://AlinaNerlich-dev.github.io',
	base: '/pretendotyper', 
	integrations: [
		starlight({
			title: 'AI Baby Products',
			social: {
				github: 'https://github.com/AlinaNerlich-dev/pretendotyper',
				linkedin: 'https://www.linkedin.com/in/alina-nerlich/'
			},
			sidebar: [
				{
					label:"Product",
					autogenerate: { directory: "products"}
				},
			],
		}),
	],
});
