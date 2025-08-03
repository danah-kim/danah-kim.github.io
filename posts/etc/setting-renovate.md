---
title: Renovate 설정하기
description: Renovate 설정하는 방법
---

# Renovate 설정하기

Renovate는 의존성 업데이트를 자동화해주는 오픈소스 봇

## 1. GitHub 앱으로 설치하기 (공식 방식)

🔗 [Renovate GitHub 앱 링크](https://github.com/apps/renovate)

1. 위 링크로 이동해 "Install it for free" 클릭

2. 설치할 GitHub 계정 또는 Organization 선택

3. 특정 저장소 또는 전체 저장소 중 설치 범위 선택

4. 설치 완료되면 Renovate가 자동으로 PR을 생성하려 시도함

## 2. 저장소에 설정 파일 추가

`.github/renovate.json` 또는 `renovate.json` 파일 생성

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "baseBranches": ["develop"]
}
```

필요시 [Renovate preset 목록](https://docs.renovatebot.com/presets-config/)을 추가할 수 있음

## 3. Renovate가 PR을 보내는지 확인

앱 설치 후 일정 시간이 지나면 `Configure Renovate`라는 제목의 PR이 자동 생성됨

이 PR에서 Renovate가 어떤 설정을 적용할지 확인하고 머지하면, 본격적으로 자동 PR이 시작 됨

## 참고 링크

- [Renovate 공식 문서](https://docs.renovatebot.com/)
- [Mend](https://developer.mend.io)
