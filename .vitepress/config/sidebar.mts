import type { DefaultTheme } from 'vitepress';

export default function sidebar(): DefaultTheme.Sidebar {
  return {
    '/posts/': [
      {
        items: [
          {
            text: 'React',
            items: [],
            collapsed: true,
          },
          {
            text: 'Flutter',
            items: [],
            collapsed: true,
          },
          {
            text: 'ETC',
            items: [],
            collapsed: true,
          },
        ],
      },
    ],
  };
}
