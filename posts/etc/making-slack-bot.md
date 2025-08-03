---
title: GitHub Actions를 활용하여 Slack App(Bot)에 메시지 전송하기
description: GitHub Actions를 활용하여 Slack App(Bot)에 메시지 전송하는 방법
---

# GitHub Actions를 활용하여 Slack App(Bot)에 메시지 전송하기

GitHub Actions가 특정 이벤트(예: push, PR 등) 발생 시 Slack으로 메시지를 자동 전송하도록 Slack App(Bot) 을 설정함

## 1. Slack App 생성

1-1. Slack API 페이지로 이동

1-2. `Create New App` → `From scratch` 선택

1-3. App 이름과 사용할 워크스페이스 설정 후 생성

## 2. Bot 권한 설정

2-1. 왼쪽 메뉴에서 `OAuth & Permissions` 이동

2-2. `Bot Token Scopes` 에 다음 권한 추가:

- `chat:write` → 메시지 보내기

2-3. 상단의 `Install to Workspace` 버튼 클릭 → 권한 허용

2-4. Bot User OAuth Token (xoxb-...) 복사 → 나중에 GitHub에 저장

## 3. GitHub Secrets 설정

GitHub 저장소로 가서 아래와 같이 Secrets 등록함

- SLACK_BOT_TOKEN: 위에서 복사한 xoxb-... 토큰

- SLACK_CHANNEL: 메시지를 보낼 채널 ID (#channel-name이 아니라 CXXXXXX 형식)

채널 ID는 브라우저에서 채널 열고 주소창에서 확인하거나 Slack API tester로 확인 가능

## 4. GitHub Actions Workflow 생성

`.github/workflows/slack-notify.yml` 파일 생성:

```yaml
name: Notify Slack

on:
  push:
    branches: - main

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Slack 메시지 전송
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "channel": "${{ secrets.SLACK_CHANNEL }}",
              "text": "✅ 새로운 커밋이 main 브랜치에 반영되었습니다!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "저장소 : '"$GITHUB_REPOSITORY"'\n브랜치 : '"$GITHUB_REF"'\n이벤트 : '"$GITHUB_EVENT_NAME"'\n커밋 : '"$GITHUB_SHA"'"
                  }
                },
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "커밋 확인",
                    "emoji": true
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "배포 현황",
                        "emoji": true
                      },
                      "url": "https://github.com/'"$GITHUB_REPOSITORY"'/commit/'"$GITHUB_SHA"'/checks/?check_suite_id='"$GITHUB_RUN_ID"'"
                    },
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "커밋 정보",
                        "emoji": true
                      },
                      "url": "https://github.com/'"$GITHUB_REPOSITORY"'/commit/'"$GITHUB_SHA"'"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```
