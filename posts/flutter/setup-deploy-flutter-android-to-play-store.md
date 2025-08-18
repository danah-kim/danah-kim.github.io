---
title: Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Play Store 배포하기
description: Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Play Store 배포하는 방법
tags: [flutter, android, ci/cd]
---

# Flutter Android 프로젝트 Fastlane과 GitHub Actions를 사용해서 Play Store 배포하기

- fastlane: iOS 및 Android 앱의 빌드와 출시를 자동화하는 오픈소스 플랫폼
- GitHub Actions: CI/CD 파이프라인을 자동화하는 플랫폼
- Play Store: 안드로이드 앱 배포 서비스

**최초 1번 이상은 서명된 릴리스 파일이 플레이 스토어에 수동으로 배포를 해서 서명이 등록되어야 이후 자동 배포가 가능함**

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

3-3 `Download existing metadata and setup metadata management? (y/n)`에서 Play Store에 앱을 배포한 적이 있다면 `y`, 아니라면 `n` 입력

Appfile

```ruby
json_key_file("fastlane/google-service-account.json")

for_platform :android do
  for_lane :development do
    package_name("com.example.app.dev")
  end

  for_lane :production do
    package_name("com.example.app")
  end
end
```

## 4. GCP에서 `Google Play Android Developer API` 사용 설정

## 5. Firebase App Distribution 업로드용 GCP Account 생성

5-1. Firebase Console에서 `프로젝트 설정` → `서비스 계정` 이동

5-2. `서비스 계정 만들기` 버튼 클릭

5-3. `서비스 계정 이름` 입력 후 `만들고 계속하기` 버튼 클릭

5-4. 역할 선택하지 않음

5-5. `완료` 버튼 클릭

5-6. `서비스 계정` 선택 후 `키` 탭 클릭

5-7. `키 추가` 버튼 클릭 후 `키 유형 JSON` 선택 후 `만들기` 버튼 클릭

5-8. `서비스 계정 키`를 다운받아 `/android/fastlane` 경로에 저장 후 파일 이름을 `google-service-account.json` 으로 변경(로컬 환경에서 fastlane 실행 시 사용하기 위함)

5-9. gitignore 파일에 `google-service-account.json` 추가 (깃허브 레포지토리에 올리지 않기 위함)

5-10. `GitHub secrets`에 Google Service Account JSON 파일 값을 `GOOGLE_SERVICE_ACCOUNT` 이름으로 추가

## 6. Google Play Console에서 GCP 서비스 계정 추가

6-1. Google Play Console에서 `사용자 및 권한` 이동하여 아까 생성한 서비스 계정의 이메일을 신규 사용자로 초대

6-2. 초대된 사용자에게 관리자 권한 부여(혹은 출시 관련 된 권한만 선택)

6-3. API 연결 테스트

```bash
fastlane run validate_play_store_json_key
```

## 7. Android app signing 설정

7-1. keystore 파일 생성

```bash
keytool -genkey -v -keystore ~/release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

7-2. `GitHub secrets`에 `release.jks` 파일 내용을 base64 인코딩 후 `RELEASE_SIGNING_KEY` 이름으로 추가

```bash
base64 -i release.jks | pbcopy
```

7-3. `key.properties` 파일을 `/android` 경로에 생성

```properties
storePassword=이전 단계에서 입력한 비밀번호
keyPassword=이전 단계에서 입력한 비밀번호
keyAlias=upload
storeFile=release.keystore
```

local에서 실행시에는 `storeFile=/Users/USER_NAME/release.jks` 로 설정

7-4. `GitHub secrets`에 `key.properties` 파일 내용을 `RELEASE_KEYSTORE_PROPERTIES` 이름으로 추가

7-5. `android/app/build.gradle.kts` 파일 수정

```kotlin
import java.util.Properties
import java.io.FileInputStream

plugins {
    // ...
}

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    // ...

    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as? String
            keyPassword = keystoreProperties["keyPassword"] as? String
            storeFile = keystoreProperties["storeFile"]?.let { file(it) }
            storePassword = keystoreProperties["storePassword"] as? String
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName(project.property("target")?.toString()?.equals("lib/main_prod.dart") == true ? "release" : "debug")
        }
    }

    // ...
}

// ...
```

## 8. Fastfile 파일 수정

설정 매개변수는 [Fastlane Doc](https://docs.fastlane.tools/actions/upload_to_play_store/) 문서를 참고

```ruby
default_platform(:android)

platform :android do
  desc "운영 환경 Google Play Store 배포"
  lane :production do |options|
    sh "flutter clean"
    sh "flutter build appbundle --flavor prod --target lib/main_prod.dart"

    upload_to_play_store(
      aab: "../build/app/outputs/bundle/prodRelease/app-prod-release.aab",
      json_key: "fastlane/google-service-account.json",
      # metadata_path: "fastlane/metadata/android",
    )
  end
end
```

## 9. GitHub Actions 설정

```yaml
name: Deploy Production App to Google Play Store or App Store

on:
  pull_request:
    branches:
      - main
    types: [closed]

jobs:
  deploy-android:
    if: ${{ github.event.pull_request.merged == true }}

    runs-on: macos-latest

    env:
      GOOGLE_SERVICE_ACCOUNT: ${{ secrets.GOOGLE_SERVICE_ACCOUNT }}
      RELEASE_SIGNING_KEY: ${{ secrets.RELEASE_SIGNING_KEY }}
      RELEASE_KEYSTORE_PROPERTIES: ${{ secrets.RELEASE_KEYSTORE_PROPERTIES }}

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
        run: echo '$GOOGLE_SERVICE_ACCOUNT' > google-service-account.json

      - name: ✍️ Keystore 파일 생성
        uses: timheuer/base64-to-file@v1
        id: upload-keystore
        with:
          fileName: 'release.keystore'
          fileDir: 'android/app'
          encodedString: $RELEASE_SIGNING_KEY

      - name: 📑 Store key properties 설정
        working-directory: android
        run: echo "$RELEASE_KEYSTORE_PROPERTIES" > key.properties

      - name: 🚀 Firebase App Distribution 배포
        working-directory: android
        run: |
          bundle exec fastlane android production
```

## 참고 문서

- [Firebase fastlane을 사용하여 테스터에 iOS 앱 배포](https://firebase.google.com/docs/app-distribution/ios/distribute-fastlane)
- [Flutter 프로젝트에서 Fastlane 사용하기](https://docs.flutter.dev/deployment/cd#fastlane)
