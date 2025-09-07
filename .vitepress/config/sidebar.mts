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
    {
      text: 'Flutter 환경 별 Firebase 프로젝트 설정하기',
      link: '/posts/flutter/setup-multiple-firebase-environments',
    },
    {
      text: 'Flutter 프로젝트에 GCP Secret Manager을 사용해서 환경변수 관리하기',
      link: '/posts/flutter/setup-gcp-secret-manager',
    },
    {
      text: 'Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Firebase App Distribution 배포하기',
      link: '/posts/flutter/setup-deploy-flutter-android-to-app-distribution',
    },
    {
      text: 'Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Play Store 배포하기',
      link: '/posts/flutter/setup-deploy-flutter-android-to-play-store',
    },
    {
      text: 'Flutter iOS 프로젝트 Fastlane과 GitHub Actions를 사용해서 Firebase App Distribution 배포하기',
      link: '/posts/flutter/setup-deploy-flutter-ios-to-app-distribution',
    },
    {
      text: 'Flutter iOS 프로젝트 Fastlane과 GitHub Actions를 사용해서 Apple App Store 배포하기',
      link: '/posts/flutter/setup-deploy-flutter-ios-to-app-app-store',
    },
  ],
  collapsed: true,
};

const gcpPosts = {
  text: 'GCP',
  items: [
    {
      text: 'GCP Cloud Storage와 Cloud CDN을 통해서 정적 에셋 관리하기',
      link: '/posts/gcp/setup-assets-cloud-storage',
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
        items: [reactPosts, flutterPosts, gcpPosts, etcPosts],
      },
    ],
  };
}
