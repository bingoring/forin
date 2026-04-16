# forin — 핵심 기능 상세 스펙

**버전**: 1.0.0 | **작성일**: 2026-04-17

---

## 목차
1. 온보딩 플로우
2. 학습 구조 및 잠금 해제 로직
3. 4가지 문제 유형 상세
4. XP / 레벨 시스템
5. 목숨(하트) 시스템
6. 스트릭 시스템
7. 게임화: 고양이 & 선물 상자
8. 업적 시스템
9. 알림 시스템
10. 소셜 기능 (Phase 2)

---

## 1. 온보딩 플로우

온보딩은 5단계로 구성되며, 마지막에 강제 튜토리얼 스테이지를 포함한다. 전체 흐름은 5분 이내 완료를 목표로 한다.

### Step 1: 직업 선택
- 일러스트 카드 3장 표시: 간호사 / 의사 / 약사
- 한 번 탭하면 다음 단계로 이동 (확인 버튼 없음)
- 선택이 이후 커리큘럼 전체를 결정

### Step 2: 목표 국가 선택
- 직업별 국가 목록 필터링

| 직업 | 선택 가능 국가 |
|------|--------------|
| 간호사 | 호주, 영국, 미국, 캐나다, 뉴질랜드 |
| 의사 | 영국(PLAB), 호주(AMC), 미국(USMLE), 캐나다 |
| 약사 | 캐나다, 미국, 호주 |

- 국가 선택은 억양 오디오, 철자(colour vs color), 시나리오 맥락을 결정

### Step 3: 현재 레벨 평가
- 10문항 적응형 퀴즈
- 4가지 문제 유형 혼합 (각 유형 미리보기 겸용)
- 결과: 4단계 레벨 배정
  - Beginner (0-3점)
  - Pre-Intermediate (4-5점)
  - Intermediate (6-8점)
  - Upper-Intermediate (9-10점)
- 이미 알고 있는 콘텐츠는 자동 스킵하여 시작점 설정

### Step 4: 일일 목표 설정
| 목표 | 일일 스테이지 수 | XP 목표 |
|------|---------------|---------|
| Casual | 1스테이지 | 50 XP |
| Regular | 2스테이지 | 100 XP |
| Intensive | 4스테이지 | 200 XP |

- 설정 후 언제든 변경 가능

### Step 5: 고양이 소개 + 강제 튜토리얼

**고양이 소개**:
- 기본 고양이(회색 줄무늬) 등장 애니메이션
- 이름 입력 (기본값: "Mittens" / 한국어 사용자: "나비")
- 게임화 메커니즘 간단 설명: "스테이지 클리어 → 선물 상자 → 고양이 꾸미기"

**강제 튜토리얼 스테이지**:
- 난이도 조정된 1스테이지 (실패 불가 구조)
- 각 문제 유형마다 툴팁 오버레이 설명
- 첫 완료 시 반드시 Uncommon 아이템 보장 (첫 인상 = 성공 경험)
- 상자 개봉 애니메이션 즉시 실행

---

## 2. 학습 구조 및 잠금 해제 로직

### 계층 구조
```
직업
  └── 모듈 (Module)
        └── 유닛 (Unit)
              └── 스테이지 (Stage)
                    └── 문제세트 (4-6개 문제)
```

### 잠금 해제 조건
| 단위 | 해제 조건 |
|------|---------|
| 스테이지 | 이전 스테이지 완료 |
| 유닛 | 이전 유닛 80% 이상 완료 (별 2개 이상 기준) |
| 모듈 | 이전 모듈 100% 완료 |

### 별점(Stars) 시스템
| 별 | 조건 |
|----|------|
| 1별 | 완료 (오답 수 무관) |
| 2별 | 완료 + 전체 오답 2회 미만 |
| 3별 | 완료 + 오답 0회 + 제한 시간 내 완료 |

### 재도전 정책
- 이미 완료한 스테이지는 언제든 재도전 가능
- 재도전 XP: 첫 완료 대비 50% 지급
- 최고 별점 기록 보존 (재도전으로 별점 낮아지지 않음)

---

## 3. 4가지 문제 유형 상세

### 3.1 문장 배열 (Sentence Arrangement)

**목적**: 올바른 임상 문장 구조 학습

**작동 방식**:
1. 상단에 시나리오 설명 표시
2. 단어 타일 6-14개 무작위 배열 표시 (방해 타일 포함)
3. 타일 드래그 → 정답 슬롯에 배치
4. "확인" 버튼 탭 또는 모든 슬롯 채워지면 자동 제출

**판정**:
- 정규화(소문자 변환, 구두점 제거) 후 완전 일치 판정
- 정답: 타일 녹색 하이라이트 + 긍정 사운드 + XP 지급
- 오답: 타일 빨간 흔들림 + 정답 2초 표시 + 목숨 1개 차감

**힌트**: 5젬 소모 → 방해 타일 2개 제거

**난이도별 문장 복잡도**:
| 난이도 | 단어 수 | 문장 구조 |
|--------|---------|---------|
| 초급(1-2) | 6-7개 | 단순 SVO |
| 중급(3) | 8-10개 | 복합문, 조동사 포함 |
| 고급(4-5) | 11-14개 | 담화 표지어, 헤징 표현 ("I understand your concern, however...") |

**문제 데이터 구조** (exercises.content JSONB):
```json
{
  "target_sentence": "I completely understand that you're feeling better, Mr. Johnson.",
  "word_tiles": ["I", "completely", "understand", "that", "you're", "feeling", "better,", "Mr.", "Johnson.", "totally", "great"],
  "distractor_indices": [9, 10],
  "hint_remove_count": 2
}
```

---

### 3.2 단어 퍼즐 (Word Puzzle / Fill-in-the-Blank)

**목적**: 도메인 특화 어휘를 임상 맥락 속에서 강화

**작동 방식**:
1. 임상 대화 지문 표시 (빈칸 1-3개)
2. 각 빈칸마다 4-6개 보기 옵션 제공
3. 옵션 탭 → 빈칸 채워짐 (채워진 빈칸 재탭 → 초기화)
4. 모든 빈칸 채운 후 "확인" 제출

**예시**:
```
간호사: "Mr. Johnson, we're still waiting for your ______ results,
         which specifically check for heart ______."
         
보기①: [blood test] [troponin] [urine] [MRI]
보기②: [damage] [pressure] [rate] [rhythm]
```

**판정**:
- 빈칸별 독립 판정
- 정답 빈칸: 녹색 유지 + 해당 빈칸 XP 지급 (10 XP/빈칸)
- 오답 빈칸: 빨간 표시 + 정답 보여줌
- 목숨 차감: 전체 제출에서 50% 이상 오답 시만

**문제 데이터 구조**:
```json
{
  "dialogue_template": "We are waiting for your {{0}} results, which check for heart {{1}}.",
  "blanks": [
    {
      "index": 0,
      "correct_answer": "troponin",
      "options": ["troponin", "urine", "blood sugar", "X-ray"]
    },
    {
      "index": 1,
      "correct_answer": "damage",
      "options": ["damage", "pressure", "rate", "rhythm"]
    }
  ]
}
```

---

### 3.3 의미 매칭 / 플립 카드 (Meaning Match)

**목적**: 의학 용어 ↔ 평이한 표현, 공식 ↔ 비공식 임상 언어 연결

**작동 방식**:
1. 카드 그리드 표시 (모두 뒷면)
2. 카드 탭 → 앞면 공개 (단어/표현)
3. 두 번째 카드 탭 → 매칭 판정
   - 쌍 일치: 두 카드 녹색 유지 (매칭 완료)
   - 불일치: 1초 후 두 카드 뒤집힘
4. 모든 쌍 매칭 시 완료

**매칭 쌍 유형**:
| 유형 | 예시 |
|------|------|
| 의학 용어 ↔ 평어 | "Myocardial infarction" ↔ "Heart attack" |
| 공식 ↔ 비공식 표현 | "The patient is febrile" ↔ "The patient has a fever" |
| 약어 ↔ 전체 표현 | "PRN" ↔ "As needed" |
| 표현 ↔ 의미 | "NPO" ↔ "Nothing by mouth" |

**그리드 크기**:
| 난이도 | 그리드 | 쌍 수 |
|--------|-------|-------|
| 초급 | 3×4 | 6쌍 |
| 중급 | 4×4 | 8쌍 |
| 고급 | 4×5 | 10쌍 |

**보너스 XP**:
- 60초 내 완료: +20 XP
- 오매칭 0회: +15 XP

**문제 데이터 구조**:
```json
{
  "pairs": [
    {"term": "NPO", "definition": "Nothing by mouth"},
    {"term": "PRN", "definition": "As needed"},
    {"term": "AMA", "definition": "Against medical advice"},
    {"term": "Troponin", "definition": "Protein released when heart muscle is damaged"}
  ]
}
```

---

### 3.4 대화 연습 (Conversation Practice)

**목적**: 실제 환자/동료 상호작용 시뮬레이션 및 자유 발화 훈련

**작동 방식**:
1. 시나리오 설정 표시 (등장인물, 상황 배경)
2. AI 캐릭터의 발화 텍스트 표시 + 오디오 재생
3. 사용자 텍스트 입력 (또는 음성 입력 — Phase 2)
4. 제출 → LLM 기반 채점 및 피드백

**채점 기준** (0-100점):
| 항목 | 비중 | 평가 내용 |
|------|------|---------|
| 어휘 (Vocabulary) | 30% | 적절한 임상 용어 사용 |
| 어조 (Tone) | 30% | 공감적, 전문적 레지스터 |
| 내용 완성도 (Completeness) | 40% | 핵심 포인트 커버 여부 |

**XP 지급**:
| 점수 | XP |
|------|-----|
| 80-100점 | +25 XP |
| 60-79점 | +15 XP |
| 40-59점 | +8 XP |
| 40점 미만 | +0 XP |

**목숨 차감 없음** — 대화 연습은 생산 연습이므로 실수 패널티 없음

**피드백 표시**:
- 사용자 답변에 인라인 어노테이션
- 이상적 답변 전체 표시 (하이라이트 포함)
- 구체적 팁: "공감 표현은 좋았습니다. 다음에는 구체적 리스크(심근 손상 가능성)를 언급해 보세요."

**AI 백엔드**:
- LLM API (Claude API 또는 OpenAI) 연동
- 프롬프트: 이상적 답변 + 평가 루브릭 + 사용자 답변
- 응답 JSON 형식:
```json
{
  "vocabulary_score": 80,
  "tone_score": 85,
  "completeness_score": 65,
  "overall_score": 76,
  "feedback_text": "Great empathetic opening. Try to mention the specific risk more explicitly.",
  "ideal_response": "You're absolutely right that I can't stop you, Mr. Johnson..."
}
```
- **폴백**: LLM API 불가 시 → 키워드 매칭 방식 (이상적 답변 키워드 목록과 비교)

**보안**: 사용자 입력은 시스템 프롬프트와 분리 처리 (프롬프트 인젝션 방지)

**문제 데이터 구조**:
```json
{
  "ai_character_name": "Mr. Johnson",
  "ai_character_role": "patient",
  "opening_line": "I feel fine and I'm going home now. You can't stop me.",
  "opening_audio_url": "/audio/conv_001_opening.mp3",
  "ideal_responses": [
    "You're absolutely right that I can't stop you, Mr. Johnson. But I want to make sure you have all the information..."
  ],
  "evaluation_rubric": {
    "vocabulary_keywords": ["troponin", "pending", "heart muscle", "at risk"],
    "tone_keywords": ["understand", "concern", "appreciate", "right"],
    "required_content_points": ["acknowledge patient autonomy", "explain pending test", "state specific risk", "offer timeline"]
  },
  "min_passing_score": 40
}
```

---

## 4. XP / 레벨 시스템

### XP 지급 구조
| 이벤트 | XP |
|--------|-----|
| 문장 배열 정답 | +10 XP |
| 단어 퍼즐 빈칸 1개 정답 | +10 XP |
| 의미 매칭 쌍 1개 매칭 | +5 XP |
| 의미 매칭 속도 보너스 | +20 XP |
| 의미 매칭 완벽 보너스 | +15 XP |
| 대화 연습 (점수별) | +0~25 XP |
| 스테이지 완료 기본 | +50 XP |
| 3별 달성 보너스 | +25 XP |
| 일일 목표 달성 | +30 XP |
| 일일 목표 2배 초과 | 추가 +30 XP |

### 레벨 테이블 (간호사 트랙)

| 레벨 | 누적 필요 XP | 칭호 |
|------|------------|------|
| 1 | 0 | Student Nurse |
| 2 | 500 | Junior Nurse |
| 3 | 1,500 | Staff Nurse |
| 4 | 3,500 | Charge Nurse |
| 5 | 7,000 | Senior Nurse |
| 6 | 13,000 | Clinical Educator |
| 7 | 22,000 | Unit Manager |
| 8 | 35,000 | CNS (Clinical Nurse Specialist) |
| 9 | 55,000 | Nurse Practitioner |
| 10 | 85,000 | Expert Practitioner |

---

## 5. 목숨(하트) 시스템

| 항목 | 내용 |
|------|------|
| 기본 목숨 수 | 5개 |
| 차감 조건 | 문장 배열 오답, 단어 퍼즐 50% 이상 오답 |
| 충전 방식 | 30분마다 1개 자동 충전 |
| 목숨 0개 시 | 학습 불가, 충전 대기 또는 젬으로 즉시 충전 |
| 프리미엄 혜택 | 무제한 목숨 |
| 젬 즉시 충전 | 5젬 = 목숨 전체 충전 |

---

## 6. 스트릭 시스템

- **조건**: 해당 날짜에 스테이지 1개 이상 완료
- **타임존**: 사용자 기기 타임존 기준 자정 리셋
- **스트릭 방어막(Streak Shield)**: Phase 2에서 도입, 하루 학습 미완료 시 스트릭 보호

### 스트릭 마일스톤 보상
| 연속 일수 | 보상 |
|----------|------|
| 7일 | Common 선물 상자 |
| 30일 | Rare 선물 상자 |
| 100일 | Legendary 선물 상자 + 전용 고양이 아이템 |

---

## 7. 게임화: 고양이 & 선물 상자

### 고양이 캐릭터

**기본 고양이**: 회색 줄무늬, 앉은 자세, 둥근 눈

**커스터마이징 슬롯**:
| 슬롯 | 아이템 예시 |
|------|-----------|
| 모자 | 간호사 캡, 청진기 머리띠, 왕관, 마법사 모자 |
| 의상 | 스크럽, 가운, 기모노, 우주복 |
| 액세서리 | 청진기, 클립보드, 앞발 붕대 |
| 배경 | 병원 병실, 공원, 우주, 벚꽃 |
| 표정 | 행복, 집중, 졸린, 자랑스러운 |

**반응 애니메이션**:
- 스테이지 완료: 기쁨 점프
- 목숨 차감: 찡그림
- 새 아이템 장착: 패션쇼 스핀

### 선물 상자 시스템

**트리거**: 스테이지 첫 완료 시 Basic 상자 1개 지급

**상자별 드롭율**:
| 상자 | 획득 방법 | Common | Uncommon | Rare | Epic | Legendary |
|------|---------|--------|---------|------|------|-----------|
| Basic | 스테이지 첫 클리어 | 60% | 30% | 9% | 1% | 0% |
| Silver | 7일 스트릭, 모듈 완료 | 30% | 40% | 20% | 9% | 1% |
| Gold | 30일 스트릭, 퍼펙트 모듈 | 10% | 25% | 35% | 25% | 5% |
| Legendary | 100일 스트릭, 이벤트 | 0% | 5% | 20% | 45% | 30% |

**희귀도 색상 프레임**:
- Common: 흰색
- Uncommon: 초록색
- Rare: 파란색
- Epic: 보라색
- Legendary: 금색

**중복 아이템 처리**: 이미 보유한 아이템 획득 시 → Catnip으로 자동 전환

**개봉 애니메이션**:
1. 상자 흔들림 + 빛 효과
2. 상자 펑 터짐
3. 아이템 위로 부유 + 파티클 이펙트
4. 희귀도 프레임과 함께 아이템 이름 표시

### Cat Shop (고양이 상점)
- Catnip(소프트 재화)으로 특정 아이템 직접 구매
- 미보유 아이템은 실루엣으로 표시
- 주간 특집 아이템 로테이션
- 이벤트 기간 번들 할인 (명절, 의료인의 날 등)

**재화 체계**:
| 재화 | 획득 방법 | 사용처 |
|------|---------|-------|
| 젬(Gem) | 인앱 결제 | 목숨 충전, 힌트 |
| Catnip | 중복 아이템, 업적 보상 | Cat Shop 구매 |

---

## 8. 업적 시스템

### MVP 기본 업적 (5개)

| 업적 이름 | 조건 | 보상 |
|----------|------|------|
| First Steps | 첫 스테이지 완료 | Common 상자 |
| Week Warrior | 7일 연속 학습 | Silver 상자 |
| Perfect Unit | 유닛 내 전 스테이지 3별 달성 | Rare 상자 |
| Conversation Starter | 대화 연습 문제 10개 완료 | Uncommon 아이템: 청진기 |
| Night Shift Hero | 오후 11시 ~ 오전 5시 스테이지 완료 | Rare 아이템: 나이트시프트 스크럽 |

### 추가 업적 (Phase 2)

| 업적 이름 | 조건 | 보상 |
|----------|------|------|
| Perfectionist | 완벽 스테이지 5연속 | Epic 아이템 |
| Globe Trotter | 특정 국가 모듈 전체 완료 | Legendary 국가 테마 의상 |
| Century Streak | 100일 연속 학습 | Legendary 상자 + 전용 배경 |

---

## 9. 알림 시스템

### 알림 유형별 명세

| 유형 | 발송 조건 | 예시 메시지 | 기본 시간 |
|------|---------|-----------|---------|
| 일일 리마인더 | 당일 앱 미접속 | "나비가 기다리고 있어요! 14일 스트릭을 지키세요 🐱" | 사용자 설정 (기본 오후 8시) |
| 스트릭 위험 경고 | 22시간 무활동 | "스트릭 종료까지 2시간 남았습니다!" | 자동 |
| 레벨업 | 레벨업 발생 시 | "레벨 4 달성! 이제 Charge Nurse입니다" | 즉시 |
| 새 콘텐츠 | 새 유닛 발행 | "새 유닛 추가: 응급 상황 커뮤니케이션" | 오전 9시 |
| 업적 달성 | 업적 조건 충족 | "업적 달성: Week Warrior! Silver 상자를 받으세요" | 즉시 |
| 목숨 충전 완료 | 목숨 0→5 복구 | "하트가 가득 찼습니다. 다시 시작해 볼까요?" | 자동 |
| 주간 요약 | 매주 일요일 | "이번 주: 8스테이지, 450 XP. 호주 취업 준비 순조롭네요!" | 일요일 오후 7시 |

### 알림 설정 옵션
- 유형별 ON/OFF 토글
- 일일 리마인더 시간 설정
- 방해 금지 시간 (Quiet Hours) 설정

---

## 10. 소셜 기능 (Phase 2)

- 친구 시스템 (사용자명 또는 QR코드로 추가)
- 친구 그룹 내 주간 리더보드
- 스터디 버디: 친구와 같은 스테이지 도전 공유
- 익명 글로벌 리더보드 (직업 + 목표 국가 기준)
- 코호트 기능: 채용 에이전시가 후보자 그룹 생성 가능 (B2B 기능)
