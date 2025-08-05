import type { DefaultTheme } from 'vitepress';

const reactPosts = {
  text: 'React',
  items: [],
  collapsed: true,
};

const flutterPosts = {
  text: 'Flutter',
  items: [
    {
      text: 'Flutter 설치하기',
      link: '/posts/flutter/install-flutter',
    },
    {
      text: 'Flavor로 Flutter 빌드 환경 분리하기',
      link: '/posts/flutter/setup-flutter-flavors',
    },
  ],
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
    {
      text: 'GitHub Actions를 활용하여 Slack App(Bot)에 메시지 전송하기',
      link: '/posts/etc/making-slack-bot',
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
