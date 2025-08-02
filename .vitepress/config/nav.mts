import type { DefaultTheme } from 'vitepress';

export default function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    { text: 'Projects', link: '/projects' },
    { text: 'Posts', link: '/posts' },
  ];
}
