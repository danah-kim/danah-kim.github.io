---
title: Flutter 환경 별 Firebase 프로젝트 설정하기
tags: [flutter, firebase]
---

# Flutter 환경 별 Firebase 프로젝트 설정하기

## Firebase 프로젝트 별칭 추가

```bash
# 개발 환경
firebase use --add dev
firebase use dev

# 운영 환경
firebase use --add prod
firebase use prod
```

.firebaserc 파일에 프로젝트 별칭이 추가 되었는지 확인

```json
{
  "projects": {
    "dev": "PROJECT_ID-dev",
    "prod": "PROJECT_ID-prod"
  }
  ...
}
```

## Firebase 프로젝트 추가

### 1. 프로젝트 추가

```bash
# 개발 환경
flutterfire configure --output=firebase_options_dev.dart

# 운영 환경
flutterfire configure --output=firebase_options_prod.dart
```

### 2. Android 설정

google-services.json 파일 위치 변경

```text
android/
  app/
    src/
      dev/google-services.json
      prod/google-services.json
```

### 3. iOS firebase 설정 파일 위치 변경

<img src="/assets/images/flutter/setup-multiple-firebase-environments-0.png" alt="Setting GoogleService-Info.plist"></img>

1. finder에서 dev, prod 폴더 생성하여 각 환경에 맞는 GoogleService-Info.plist 파일 위치 변경후 xCode 실행하여 Runner 폴더 하위로 드래그 앤 드롭

   ```text
   ios/
     Runner/
       dev/GoogleService-Info.plist
       prod/GoogleService-Info.plist
   ```

2. 빌드 script 추가
   Runner -> Build Phases -> + 버튼 클릭하여 New Run Script Phase 추가 후 아래 내용 추가 및 "Run Script"와 "Compile Sources" 사이로 순서 이동

   Setup Firebase Environment GoogleService-Info.plist

   ```text
    # Name of the resource we're selectively copying
    GOOGLESERVICE_INFO_PLIST=GoogleService-Info.plist

    # Get references to dev and prod versions of the GoogleService-Info.plist
    # NOTE: These should only live on the file system and should NOT be part of the target (since we'll be adding them to the target manually)
    GOOGLESERVICE_INFO_DEV=${PROJECT_DIR}/${TARGET_NAME}/dev/${GOOGLESERVICE_INFO_PLIST}
    GOOGLESERVICE_INFO_PROD=${PROJECT_DIR}/${TARGET_NAME}/prod/${GOOGLESERVICE_INFO_PLIST}

    echo "Current configutaion: ${CONFIGURATION}"

    # Make sure the dev version of GoogleService-Info.plist exists
    echo "Looking for ${GOOGLESERVICE_INFO_PLIST} in ${GOOGLESERVICE_INFO_DEV}"

    if [ ! -f $GOOGLESERVICE_INFO_DEV ]
    then
        echo "No Development GoogleService-Info.plist found. Please ensure it's in the proper directory."
        exit 1
    fi

    # Make sure the prod version of GoogleService-Info.plist exists
    echo "Looking for ${GOOGLESERVICE_INFO_PLIST} in ${GOOGLESERVICE_INFO_PROD}"

    if [ ! -f $GOOGLESERVICE_INFO_PROD ]
    then
        echo "No Production GoogleService-Info.plist found. Please ensure it's in the proper directory."
        exit 1
    fi

    # Get a reference to the destination location for the GoogleService-Info.plist
    PLIST_DESTINATION=${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app
    echo "Will copy ${GOOGLESERVICE_INFO_PLIST} to final destination: ${PLIST_DESTINATION}"

    # Copy over the prod GoogleService-Info.plist for Release builds
    if [ "${CONFIGURATION}" == "Debug-prod" ] || [ "${CONFIGURATION}" == "Release-prod" ] || [ "${CONFIGURATION}" == "Profile-prod" ] || [ "${CONFIGURATION}" == "Release" ]
    then
        echo "Using ${GOOGLESERVICE_INFO_PROD}"
        cp "${GOOGLESERVICE_INFO_PROD}" "${PLIST_DESTINATION}"
    else
        echo "Using ${GOOGLESERVICE_INFO_DEV}"
        cp "${GOOGLESERVICE_INFO_DEV}" "${PLIST_DESTINATION}"
    fi

   ```

3. Runner -> Build Phases -> Copy Bundle Resources에서 `GoogleServices-Info.plist in Runner` 삭제

### 4. firebase.dart 파일 내용 수정

```dart
{
  "flutter": {
    "platforms": {
      "android": {
        "dev": {
          "projectId": "PROJECT_ID_DEV",
          "appId": "",
          "fileOutput": "android/app/dev/google-services.json"
        },
        "prod": {
          "projectId": "PROJECT_ID_PROD",
          "appId": "",
          "fileOutput": "android/app/prod/google-services.json"
        }
      },
      "ios": {
        "dev": {
          "projectId": "PROJECT_ID_DEV",
          "appId": "",
          "uploadDebugSymbols": false,
          "fileOutput": "ios/Runner/dev/GoogleService-Info.plist"
        },
        "prod": {
          "projectId": "PROJECT_ID_PROD",
          "appId": "",
          "uploadDebugSymbols": true,
          "fileOutput": "ios/Runner/prod/GoogleService-Info.plist"
        }
      },
      "dart": {
        "lib/firebase_options_dev.dart": {
          "projectId": "PROJECT_ID_DEV",
          "configurations": {
            "android": "",
            "ios": ""
          }
        },
        "lib/firebase_options_prod.dart": {
          "projectId": "PROJECT_ID_PROD",
          "configurations": {
            "android": "",
            "ios": ""
          }
        }
      }
    }
  }
}

```

## 참고 문서

- [Set up multiple Firebase environments](https://firebase.google.com/docs/projects/multiprojects?hl=ko&authuser=0&_gl=1*i5n0qf*_up*MQ..*_ga*MTg3MzYyMzQ4Ni4xNzU0NTI1NjMx*_ga_CW55HF8NVT*czE3NTQ1MjU2MzEkbzEkZzAkdDE3NTQ1MjU2MzEkajYwJGwwJGgw)
