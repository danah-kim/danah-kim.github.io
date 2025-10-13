---
title: Flutter iOS 프로젝트 Fastlane과 GitHub Actions를 사용해서 Apple App Store 배포하기
description: Flutter iOS 프로젝트 Fastlane과 GitHub Actions를 사용해서 Apple App Store 배포하는 방법
tags: [flutter, ios, ci/cd]
---

# Flutter iOS 프로젝트 Fastlane과 GitHub Actions를 사용해서 Apple App Store 배포하기

- fastlane: iOS 및 Android 앱의 빌드와 출시를 자동화하는 오픈소스 플랫폼
- GitHub Actions: CI/CD 파이프라인을 자동화하는 플랫폼

## 1. MAC 환경에서 Ruby 설치

```bash
brew install ruby

# zsh 환경에서 설치한 Ruby 경로 추가
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# fish 환경에서 설치한 Ruby 경로 추가
echo 'set -gx PATH /usr/local/opt/ruby/bin $PATH' >> ~/.config/fish/config.fish
source ~/.config/fish/config.fish
```

## 2. Fastlane 설치

```bash
brew install fastlane
```

## 3. Flutter ios 프로젝트에서 Fastlane 초기화

```bash
cd ios
fastlane init
```

3-1. `4. Manual setup - manually setup your project to automate your tasks` 선택

itc_team_id는 App Store Connect에 로그인 상태에서 https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/user/detail 페이지에서 contentProviderId 값을 입력

Appfile

```ruby
apple_id("test@example.com") # Your Apple email address
team_id("TEAM_ID")  # Developer Portal Team ID
itc_team_id("ITC_TEAM_ID") # App Store Connect Team ID

for_platform :ios do
   for_lane :production do
    type("appstore")
    app_identifier("com.example.app")
  end
end
```

## 4. match 설정

4-1. Provisioning Profile을 저장할 깃허브 레포지토리 생성

```ruby
fastlane match init
```

4-2. `git` 선택 후 github 레포지토리 주소 입력

Matchfile

```ruby
git_url("https://github.com/your-github-username/your-repo-name")
storage_mode("git")
username("Apple ID")

for_platform :ios do
  for_lane :production do
    type("appstore")
    app_identifier("com.example.app")
  end
end
```

4-3. 프로비저닝 프로필 생성

이때 입력한 password 값을 Github Actions에서 사용할 수 있도록 Flutter 프로젝트 깃허브 레포지토리 `GitHub secrets`에 `MATCH_PASSWORD` 이름으로 추가
(이후 다른 개발자에게 프로비저닝 프로필 공유시에도 사용함으로 따로 기억해두어야함)

```bash
fastlane match development # 로컬에서 개발시 디버그 모드 사용
fastlane match appstore # App Store 배포 시 사용
```

4-4. Github Actions에서 Provisioning Profile이 저장된 깃허브 레포지토리에 접근할 수 있도록 개발용 공용 깃허브 계정에서 `github personal access Token` 생성

- 만료일 없는 workflow 권한을 체크하여 생성
- Flutter 프로젝트 깃허브 레포지토리 `GitHub secrets`에 아래 명령어를 사용해 GitHub authentication token을 Base64로 인코딩하여 `MATCH_GIT_BASIC_AUTHORIZATION` 이름으로 추가

```bash
echo -n your_github_username:your_personal_access_token | base64
```

- [personal access token (classic) 만들기](https://docs.github.com/ko/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-token-classic-%EB%A7%8C%EB%93%A4%EA%B8%B0)

4-5. Xcode에서 Provisioning Profile 설정

`Xcode > TARGETS - Runner > Signing & Capabilities` 에서 `Automatically manage signing` 체크 해제 후 `Provisioning Profile` 설정

<img src="/assets/images/flutter/setup-deploy-flutter-ios-to-app-distribution-0.png" alt="Setting Provisioning Profile"></img>

- Debug-prod -> match development com.example.app
- Release-prod -> match appstore com.example.app
- Profile-prod -> match appstore com.example.app

## 5. Firebase app distribution plugin 설치

```bash
fastlane add_plugin firebase_app_distribution
```

## 6. Firebase App Distribution 업로드용 GCP Account 생성

6-1. Firebase Console에서 `프로젝트 설정` → `서비스 계정` 이동

6-2. `서비스 계정 만들기` 버튼 클릭

6-3. `서비스 계정 이름` 입력 후 `만들고 계속하기` 버튼 클릭

6-4. `Firebase 앱 배포 관리자` 역할 선택

6-5. `완료` 버튼 클릭

6-6. `서비스 계정` 선택 후 `키` 탭 클릭

6-7. `키 추가` 버튼 클릭 후 `키 유형 JSON` 선택 후 `만들기` 버튼 클릭

6-8. `서비스 계정 키`를 다운받아 `/ios/fastlane` 경로에 저장 후 파일 이름을 `google-service-account.json` 으로 변경(로컬 환경에서 fastlane 실행 시 사용하기 위함)

6-9. `.gitignore` 파일에 `google-service-account.json` 추가 (깃허브 레포지토리에 올리지 않기 위함)

6-10. `GitHub secrets`에 Google Service Account JSON 파일 내용을 `GOOGLE_SERVICE_ACCOUNT` 이름으로 추가

## 7. App Store Connect API Key 생성

7-1. App Store Connect에서 `사용자 및 액세스` 이동

7-2. `통합` 탭 클릭

7-3. `팀 키` 탭에서 `플러스` 버튼 클릭 후 `제품 개발` 액세스 선택하여 생성

7-4. `API Key`를 다운받아 `/ios/fastlane` 경로에 저장 후 파일 이름을 `store.json` 으로 변경(로컬 환경에서 fastlane 실행 시 사용하기 위함)

7-5. `GitHub secrets`에 store JSON 파일 내용을 `APP_STORE_CONNECT_API_KEY` 이름으로 추가

store.json

```json
{
  "key_id": "<<KEY ID>>",
  "issuer_id": "<<ISSUER ID>>",
  "key": "-----BEGIN PRIVATE KEY-----\n<<REPLACE WITH YOUR KEY>>\n-----END PRIVATE KEY-----"
}
```

## 8. Fastfile 파일 수정

Fastfile

```ruby
default_platform(:ios)

platform :ios do
  desc "운영 환경 App Store 배포"
  lane :production do
    setup_ci()

    match(
      type: "appstore",
      app_identifier: "com.example.app",
    )

    build_app(
      workspace: "Runner.xcworkspace",
      scheme: "prod",
      export_method: "app-store",
    )

    pilot(
      api_key_path: "fastlane/store.json",
      skip_waiting_for_build_processing: true,
      # changelog: "fastlane/metadata/ios/ko-KR/changelogs/#{build_number}.txt",
      # groups: groups,
    )
  end
end
```

## 9. GitHub Actions 설정

```yaml
name: Deploy Production App to Play Store or App Store

on:
  pull_request:
    branches:
      - main
    types: [closed]

jobs:
  deploy-ios:
    if: ${{ github.event.pull_request.merged == true }}

    runs-on: macos-latest

    env:
      GOOGLE_SERVICE_ACCOUNT_DEV: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_DEV }}
      APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}

    steps:
      - name: 📚 Git Checkout
        uses: actions/checkout@v4

      - name: 🔧 Xcode 버전 설정
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: 16.2

      - name: 🐦 Flutter 설치
        uses: subosito/flutter-action@v2
        with:
          channel: stable
          flutter-version: 3.32.0

      - name: 📦 의존성 설치
        run: flutter pub get && cd ios && pod install

      - name: 🔧 Ruby 버전 설정
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.3.0
          bundler-cache: true
          working-directory: ios

      - name: 🔧 Fastlane 설치
        run: brew install fastlane

      - name: 🔑 서비스 계정 키 파일 생성
        working-directory: ios/fastlane
        run: echo "$GOOGLE_SERVICE_ACCOUNT_DEV" > google-service-account.json

      - name: 🔑 App Store Connect API Key 파일 생성
        working-directory: ios/fastlane
        run: echo "$APP_STORE_CONNECT_API_KEY" > google-service-account.json

      - name: 🚀 App Store Connect 배포
        working-directory: ios
        run: |
          bundle exec fastlane ios production
```

## 참고 문서

- [Flutter 프로젝트에서 Fastlane 사용하기](https://docs.flutter.dev/deployment/cd#fastlane)
