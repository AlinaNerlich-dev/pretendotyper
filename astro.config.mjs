import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Baby Products',
			social: {
				github: 'https://github.com/withastro/starlight',
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
