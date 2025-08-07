---
title: Flutter 프로젝트에 GCP Secret Manager을 사용해서 환경변수 관리하기
tags: [flutter, gcp, secret-manager]
---

# Flutter 프로젝트에 GCP Secret Manager을 사용해서 환경변수 관리하기

## GCP Secret Manager 설정

### 1. GCP 콘솔에서 Secret Manager API 활성화 (빌링 계정 등록되어 있어야 함)

### 2. Flutter 프로젝트에서 사용할 서비스 계정 생성 및 키 발급 (키 파일 다운로드)

2-1. IAM 및 관리자 -> 서비스 계정 -> 서비스 계정 만들기
2-2. roles/secretmanager.secretAccessor(보안 비밀 관리자 보안 비밀 접근자) 권한만 부여
2-3. 키 만들기 -> 키 유형: JSON -> 키 만들기
2-4. 키 파일 다운로드
2-5. 키 파일 이름을 google-service-account-key.json 로 변경

### 3. Secret 생성

3-1. 보안 -> Secret Manager -> 보안 비밀 만들기
3-2. 보안 비밀 이름 입력
3-3. 보안 비밀 값 입력
3-6. 보안 비밀 버전 만들기
3-8. 만들어진 보안 비밀 더보기를 클릭하여 리소스 이름 복사

### 4. Flutter에서 Secret Manager 호출 (직접 호출 예제)

1. pubspec.yaml 파일에 아래 내용 추가

pubspec.yaml

```yaml
dependencies:
  googleapis: ^13.0.0
  googleapis_auth: ^1.4.1

flutter:
  assets:
    - assets/json/
```

2. 다운로드 받은 키 파일을 /assets/json/ 폴더에 위치

3. 아래 코드를 프로젝트에 추가

secret_manager_service.dart

```dart
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:googleapis_auth/auth_io.dart';
import 'package:googleapis/secretmanager/v1.dart';

class SecretManagerService {
  static Future<String> getSecretValue({
    required String projectId,
    required String secretId,
  }) async {
    // 1. 로컬의 service account key.json 로드
    final jsonKey = json.decode(
      await rootBundle.loadString('assets/json/google-service-account-key.json'),
    );

    // 2. 인증 생성
    final accountCredentials = ServiceAccountCredentials.fromJson(jsonKey);
    final scopes = [SecretManagerApi.cloudPlatformScope];
    final client = await clientViaServiceAccount(accountCredentials, scopes);

    // 3. Secret Manager API 호출
    final api = SecretManagerApi(client);
    final name = 'projects/$projectId/secrets/$secretId/versions/latest';
    final response = await api.projects.secrets.versions.access(name);

    // 4. base64 디코딩
    final payload = response.payload?.data;
    if (payload == null) throw Exception('Secret not found');
    final decoded = utf8.decode(base64.decode(payload));

    client.close();
    return decoded;
  }
}
```

## 사용 예제

```dart
void main() async {
  final secretValue = await SecretManagerService.getSecretValue(
    projectId: 'my-gcp-project-id',
    secretId: 'MY_API_KEY',
  );

  print('API Key: $secretValue');
}
```
