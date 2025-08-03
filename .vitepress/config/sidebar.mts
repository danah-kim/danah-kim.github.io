import type { DefaultTheme } from 'vitepress';

const reactPosts = {
  text: 'React',
  items: [],
  collapsed: true,
};

const flutterPosts = {
  text: 'Flutter',
  items: [],
  collapsed: true,
};

const etcPosts = {
  text: 'ETC',
  items: [
    {
      text: 'Python 3.10.x 설치하기',
      link: '/posts/etc/setting-python',
    },
    {
      text: 'Renovate 설정하기',
      link: '/posts/etc/setting-renovate',
    },
  ],
  collapsed: true,
};

export default function sidebar(): DefaultTheme.Sidebar {
  return {
    '/posts/': [
      {
        items: [reactPosts, flutterPosts, etcPosts],
      },
    ],
  };
}
