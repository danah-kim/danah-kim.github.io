import { defineConfig } from 'vitepress';
import nav from './nav.mts';
import sidebar from './sidebar.mts';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Danah Dev Log',
  lang: 'ko-KR',
  description: 'Record development history',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    sidebar: sidebar(),
    docFooter: {
      prev: '이전 페이지',
      next: '다음 페이지',
    },
    lastUpdated: {
      text: '마지막 업데이트',
    },
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
