---
title: GCP Cloud Storage와 Cloud CDN을 통해서 정적 에셋 관리하기
description: GCP Cloud Storage와 Cloud CDN을 통해서 정적 에셋 관리하는 방법
tags: [gcp, cloud-storage]
---

# GCP Cloud Storage와 Cloud CDN을 통해서 정적 에셋 관리하기

## 1. GCP Cloud Storage 버킷 만들기

1. 사용할 도메인으로 이름을 설정 (ex. `static.example₩.com)
2. 원하는 위치(국내 서비스의 경우 `asia-northeast3` 리전)로 설정 _최초 버킷 생성시 위치 변경 불가_
3. `Standard` 저장 방식으로 선택
4. `이 버킷에 공개 액세스 방지 적용` 체크 해제
5. 소프트 삭제 정책 체크 해제
6. 버킷 만들기를 클릭하여 버킷 생성

## 2. Cloud Storage 버킷을 공개로 설정

<img src="/assets/images/gcp/setup-assets-cloud-storage-0.png" alt="Cloud Storage 버킷을 공개로 설정"></img>

## 3. Compute Engine API 활성화

## 4. Cloud CDN 만들기

<img src="/assets/images/gcp/setup-assets-cloud-storage-1.png" alt="Cloud CDN 만들기"></img>

### 출처 기본 사항

1. origin type: 백엔드 버킷
2. 백엔드 버킷 정의 - 새 백엔드 버킷(방금 전에 만든 버킷 선택)
3. 원본이름: static(아무거나 해도 됨)

### 호스트 및 경로 규칙

새 부하 분산기 만들기 클릭

### 캐시 성능

압축 모드 `자동` 으로 설정

## 5. 부하 분산기 설정

### 프론트엔드 구성

<img src="/assets/images/gcp/setup-assets-cloud-storage-4.png" alt="프론트엔드 구성"></img>

1. 프로토콜을 HTTP로 선택 -> IP 주소 클릭 -> IP 주소 만들기 (고정 IP 주소 생성)
   <img src="/assets/images/gcp/setup-assets-cloud-storage-2.png" alt="프론트엔드 구성"></img>

2. 프로토콜을 HTTPS로 선택 -> IP 주소를 아까 생성한 고정 IP 주소로 선택 -> 새 인증서 만들기 (생성모드: Google 관리 인증서 만들기)
   <img src="/assets/images/gcp/setup-assets-cloud-storage-3.png" alt="프론트엔드 구성"></img>

### 라우팅 규칙

<img src="/assets/images/gcp/setup-assets-cloud-storage-5.png" alt="라우팅 규칙"></img>

## 6. DNS Records 추가

고정 IP 주소를 static 서브 도메인으로 A Type 레코드에 추가
