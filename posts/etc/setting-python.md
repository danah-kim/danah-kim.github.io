---
title: Python 3.10.x 설치하기
description: MAC에서 Python 특정버전 설치하는 방법
---

# Python 3.10.x 설치하기

1. homebrew를 통해서 파이선 특정 버전 설치

```shell
brew install python@3.10
```

2. 환경변수 추가

```shell
vi ~/.zshrc

export PATH="/opt/homebrew/opt/python@3.10/bin:$PATH"
alias python=/usr/bin/python3

source ~/.zshrc
```

3. 버전 확인

```shell
python --version
```
