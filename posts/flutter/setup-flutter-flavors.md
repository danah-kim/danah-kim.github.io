---
title: Flavor로 Flutter 빌드 환경 분리하기
description: Flavor로 Flutter 빌드 환경 분리하는 방법
---

# Flavor로 Flutter 빌드 환경 분리하기

## 프로젝트 구조 설정

### 1. env 설정

1-1. dotenv 설치

```bash
flutter pub add flutter_dotenv
```

1-2. 최상위 root 폴더에 .env 파일 생성

1-3. pubspec.yaml 파일에 .env 파일 경로 추가

```yaml
assets:
  - .env.development
  - .env.production
```

### 2. 환경별 진입점 설정

환경에 맞는 env 설정 호출하기 위해 진입점을 분리

```text
lib/
  main_dev.dart
  main_prod.dart
  main.dart

```

2-1. main.dart 파일 수정

```dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(body: Center(child: Text('env: ${dotenv.env['ENV']}'))),
    );
```

2-2. main_dev.dart 파일 생성

```dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'core/config.dart';
import 'main.dart';

void main() async {
  await dotenv.load(fileName: '.env.${Env.development}');

  runApp(MainApp());
}
```

2-3. main_prod.dart 파일 생성

```dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'core/config.dart';
import 'main.dart';

void main() async {
  await dotenv.load(fileName: '.env.${Env.production}');

  runApp(MainApp());
}
```

## 안드로이드 설정

### 1. android/app/build.gradle.kts 수정

```gradle
android {
    ...

    buildTypes {
      getByName("debug") {...}
      getByName("release") {...}
    }

    ...

    flavorDimensions += "default"

    productFlavors {
        create("dev") {
            dimension = "default"
            resValue(
                type = "string",
                name = "app_name",
                value = "App Name DEV"
            )
            applicationIdSuffix = ".dev"
        }
        create("prod") {
            dimension = "default"
            resValue(
                type = "string",
                name = "app_name",
                value = "App Name"
            )
        }
    }
}
```

### 2. android/app/src/main/AndroidManifest.xml 수정

```xml
android:label="@string/app_name"
```

## iOS 설정

### 1. Xcode에서 Scheme 생성

Product > Scheme > Manage Schemes → + 버튼으로 dev, prod 스킴 생성

<img src="https://docs.flutter.dev/assets/images/docs/flavors/flavors-ios-schemes.png" width="60%" alt="Xcode Scheme"></img>

### 2. 각 스킴에 대응되는 Build Configuration 생성 (Debug-dev, Release-prod 등)

<img src="https://docs.flutter.dev/assets/images/docs/flavors/flavors-ios-scheme-configurations.png" width="60%" alt="Build Configuration Setting"></img>

### 3. Product > Scheme > Manage Schemes를 선택하여 각 스킴에 대응되는 build schemes 설정

<img src="/assets/images/flutter/setup-flutter-flavors-0.png" width="60%" alt="Build Scheme Setting"></img>

### 4. Bundle Identifier 추가하기

<img src="/assets/images/flutter/setup-flutter-flavors-1.png" width="60%" alt="Build Scheme Setting"></img>

### 5. 빌드 별 앱 이름 설정

5-1. Editor > Add Build Setting > Add User-defined setting → FLAVOR_APP_NAME으로 추가

<img src="/assets/images/flutter/setup-flutter-flavors-2.png" width="60%" alt="Build Scheme Setting"></img>

5-2. info.plist 파일에 앱 이름 설정 추가

<img src="/assets/images/flutter/setup-flutter-flavors-3.png" width="60%" alt="Build Scheme Setting"></img>

### 6. Podfile 수정

```ruby
project 'Runner', {
  ...
  'Debug-dev' => :debug,
  'Debug-prod' => :debug,
  'Profile-dev' => :release,
  'Profile-prod' => :release,
  'Release-dev' => :release,
  'Release-prod' => :release,
  ...
```

## VSCode 설정

.vscode/launch.json 파일 수정

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "development",
      "request": "launch",
      "type": "dart",
      "flutterMode": "debug",
      "program": "lib/main_dev.dart",
      "args": ["--flavor", "dev"]
    },
    {
      "name": "production",
      "request": "launch",
      "type": "dart",
      "flutterMode": "release",
      "program": "lib/main_prod.dart",
      "args": ["--flavor", "prod"]
    }
  ]
}
```

## 실행 명령어

```bash
flutter run --flavor dev -t lib/main_dev.dart
flutter run --flavor prod -t lib/main_prod.dart
```

## 참고 문서

- [Set up Flutter flavors for Android](https://docs.flutter.dev/deployment/flavors)
- [Set up Flutter flavors for iOS and macOS](https://docs.flutter.dev/deployment/flavors-ios)

```

```
