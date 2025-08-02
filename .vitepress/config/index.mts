import { defineConfig } from 'vitepress';
import nav from './nav.mts';
import sidebar from './sidebar.mts';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Danah Dev Log',
  description: 'Record development history',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    sidebar: sidebar(),
    socialLinks: [{ icon: 'github', link: 'https://github.com/danah-kim' }],
  },
  sitemap: {
    hostname: 'https://danah-kim.github.io/',
  },
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  transformPageData(pageData) {
    const canonicalUrl = `/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '.html');

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonicalUrl }]);
  },
});
