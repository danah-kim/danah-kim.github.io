---
title: Flutter 설치하기
description: Flutter 설치하는 방법
---

# MAC에서 플러터 설치

## 프로그램 설치

- xCode를 [Appstore](https://apps.apple.com/kr/app/xcode/id497799835)에서 다운로드 후 command-line tools 설치

  ```bash
  xcode-select --install
  ```

- [Android Studio](https://developer.android.com/studio?hl=ko) 설치

- Flutter SDK 설치
  ```bash
  brew install --cask flutter
  flutter --version # 설치 확인
  ```

## Flutter 설정

1. Cursor의 Extension 탭에서 Flutter 설치

2. Cursor에서 Shift + Cmd + P 단축키 입력 후 Run Flutter Doctor 명령어를 선택

   - Flutter SDK를 찾을 수 없다고 메세지가 출력되면 Flutter SDK 경로 설정

   ```bash
   which flutter
   ```

3. cocoapods 설치

   ```bash
   brew install cocoapods
   ```

4. Android Studio에서 Android SDK command-line Tools 설치  
   Android Studio의 Preference에서 `Languages & Flameworks` > `Android SDK` 로 이동 후 `SDK Tools` 탭에서 `Android SDK Command-line Tools` 체크 후 OK 버튼을 눌러주면 자동으로 설치

   <img src="/assets/images/flutter/create-flutter-project-0.png" width="60%" alt="Android Studio Setting"></img>

   - java 설치가 안되어 있으면 설치 후 Flutter JDK 경로 설정

     ```bash
     brew install openjdk@17

     # fish shell 사용 시
     fish_add_path /opt/homebrew/opt/openjdk@17/bin

     # zsh shell 사용 시
     echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
     source ~/.zshrc

     set -gx CPPFLAGS "-I/opt/homebrew/opt/openjdk@17/include"

     flutter config --jdk-dir="$(/usr/libexec/java_home -v 17)"

     ```

5. Android license 설치

   ```bash
   flutter doctor --android-licenses
   ```
