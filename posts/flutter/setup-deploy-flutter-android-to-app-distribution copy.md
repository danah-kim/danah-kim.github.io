---
title: Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Firebase App Distribution 배포하기
description: Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Firebase App Distribution 배포하는 방법
tags: [flutter, android, ci/cd]
---

# Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Firebase App Distribution 배포하기

- fastlane: iOS 및 Android 앱의 빌드와 출시를 자동화하는 오픈소스 플랫폼
- GitHub Actions: CI/CD 파이프라인을 자동화하는 플랫폼
- Firebase App Distribution: 앱 배포 서비스

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

## 3. Flutter android 프로젝트에서 Fastlane 초기화

```bash
cd android
fastlane init
```

3-1. `Package Name (com.krausefx.app): `에서 `android/app/build.gradle.kts` 파일 내 `applicationId` 값 입력 (Flavors 사용시 applicationIdSuffix 값까지 포함)

3-2. `Path to the json secret file: `에서 `fastlane/google-service-account.json` 입력

3-3 `Download existing metadata and setup metadata management? (y/n)`에서 `n` 입력 (이후 별도 세팅)

Appfile

```ruby
json_key_file("fastlane/google-service-account.json")
package_name("com.example.app.dev")
```

## 4. Firebase App Distribution 업로드용 GCP Account 생성

4-1. Firebase Console에서 `프로젝트 설정` → `서비스 계정` 이동

4-2. `서비스 계정 만들기` 버튼 클릭

4-3. `서비스 계정 이름` 입력 후 `만들고 계속하기` 버튼 클릭

4-4. `Firebase 앱 배포 관리자` 역할 선택

4-5. `완료` 버튼 클릭

4-6. `서비스 계정` 선택 후 `키` 탭 클릭

4-7. `키 추가` 버튼 클릭 후 `키 유형 JSON` 선택 후 `만들기` 버튼 클릭

4-8. `서비스 계정 키`를 다운받아 `/android/fastlane` 경로에 저장 후 파일 이름을 `google-service-account.json` 으로 변경(로컬 환경에서 fastlane 실행 시 사용하기 위함)

4-9. `.gitignore` 파일에 `google-service-account.json` 추가 (깃허브 레포지토리에 올리지 않기 위함)

4-10. `GitHub secrets`에 Google Service Account JSON 파일 내용을 `GOOGLE_SERVICE_ACCOUNT_DEV` 이름으로 추가

## 5. Fastlane에서 firebase distribution plugin 설치

```bash
fastlane add_plugin firebase_app_distribution
```

## 6. Fastfile 파일 수정

설정 매개변수는 [Fastlane Firebase App Distribution Fastfile 설정](https://firebase.google.com/docs/app-distribution/ios/distribute-fastlane) 문서를 참고

```ruby
default_platform(:android)

platform :android do
  desc "개발 환경 Firebase App Distribution 배포"
  lane :development do
    sh "flutter clean"
    sh "flutter build apk --flavor dev --target lib/main_dev.dart"

    firebase_app_distribution(
      app: "FIREBASE_APP_ID",
      service_credentials_file: "fastlane/google-service-account.json",
      apk_path: "../build/app/outputs/flutter-apk/app-dev-release.apk",
      # release_notes: "./release-notes.txt",
      # testers: "qa@example.com",
      # groups: "TESTER_GROUP_NAME",
      debug: true,
    )
  end
end
```

## 7. GitHub Actions 설정

```yaml
name: Deploy Development App to Firebase App Distribution

on:
  push:
    branches:
      - develop

jobs:
  deploy-android:
    runs-on: macos-latest

    env:
      GOOGLE_SERVICE_ACCOUNT_DEV: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_DEV }}

    steps:
      - name: 📚 Git Checkout
        uses: actions/checkout@v4

      - name: 🐦 Flutter 설치
        uses: subosito/flutter-action@v2
        with:
          channel: stable
          flutter-version: 3.32.0

      - name: 📦 의존성 설치
        run: flutter pub get

      - name: 🔧 Ruby 설치
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2.0
          bundler-cache: true
          working-directory: android

      - name: 🔧 Fastlane 설치
        run: brew install fastlane

      - name: 🔑 서비스 계정 키 파일 생성
        working-directory: android/fastlane
        run: echo "$GOOGLE_SERVICE_ACCOUNT_DEV" > agoogle-service-account.json

      - name: 🚀 Firebase App Distribution 배포
        working-directory: android
        run: |
          bundle exec fastlane android development
```

## 참고 문서

- [Firebase fastlane을 사용하여 테스터에 iOS 앱 배포](https://firebase.google.com/docs/app-distribution/ios/distribute-fastlane)
- [Flutter 프로젝트에서 Fastlane 사용하기](https://docs.flutter.dev/deployment/cd#fastlane)
