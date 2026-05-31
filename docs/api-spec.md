# API Specification — 서울 대기질 야외운동 추천 서비스

> 최종 수정: 2026-05-31  
> 대상: 백엔드 개발자  
> 프론트엔드 연동 소스: `js/main.js`, `js/result.js`

---

## 1. 기본 정보

| 항목 | 내용 |
|---|---|
| Base URL | `https://bigdata.studylink.click` |
| 프로토콜 | HTTP/1.1 이상 |
| 데이터 형식 | `application/json` (요청·응답 모두) |
| 인증 | 없음 |
| CORS | 필수 — 프론트가 다른 포트(`localhost:3000` 등)에서 `fetch` 호출 |

### CORS 설정 요건

프론트엔드가 `fetch`로 직접 호출하므로, 백엔드는 아래 헤더를 응답에 포함해야 한다.

```
Access-Control-Allow-Origin: *          # 개발 환경
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

운영 환경에서는 `*` 대신 실제 프론트엔드 도메인으로 제한할 것.

---

## 2. 엔드포인트 목록

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/recommend` | 시간대별 운동 추천 조회 |

---

## 3. GET `/api/recommend`

### 3.1 Request

```
GET /api/recommend?exercise=jogging&date=2026-05-31
```

#### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `exercise` | string | ✅ | 운동 종류 코드 (아래 허용값 참고) |
| `date` | string | ✅ | 예측 날짜 (`YYYY-MM-DD`) |

> 서울시 전체를 단일 기준으로 예측하므로 `district` 파라미터 없음.

#### `exercise` 허용값

| 코드 | 표시명 |
|---|---|
| `walking` | 걷기 |
| `jogging` | 조깅 |
| `cycling` | 자전거 |
| `hiking` | 등산 |
| `ball` | 구기운동 |

이 목록 외의 값은 `400 INVALID_EXERCISE` 반환.

#### `date` 유효성 규칙

- 형식: `YYYY-MM-DD`
- 허용 범위: **오늘 또는 내일** (서버 시각 기준, KST)
- 과거 날짜 및 모레 이후는 `400 INVALID_DATE` 반환

---

### 3.2 Response (200 OK)

#### 예시

```json
{
  "exercise": "jogging",
  "date": "2026-05-19",
  "generated_at": "2026-05-19T08:30:00+09:00",
  "timeline": [
    { "hour": 0,  "level": "green",  "pm10": 22.0, "pm25": 12.0, "o3": 0.01 },
    { "hour": 1,  "level": "green",  "pm10": 20.5, "pm25": 11.0, "o3": 0.01 },
    { "hour": 2,  "level": "green",  "pm10": 19.0, "pm25": 10.5, "o3": 0.01 },
    { "hour": 3,  "level": "green",  "pm10": 18.5, "pm25": 10.0, "o3": 0.01 },
    { "hour": 4,  "level": "green",  "pm10": 20.0, "pm25": 11.0, "o3": 0.01 },
    { "hour": 5,  "level": "green",  "pm10": 23.0, "pm25": 12.5, "o3": 0.02 },
    { "hour": 6,  "level": "green",  "pm10": 27.0, "pm25": 14.0, "o3": 0.02 },
    { "hour": 7,  "level": "green",  "pm10": 28.0, "pm25": 15.0, "o3": 0.02 },
    { "hour": 8,  "level": "green",  "pm10": 31.0, "pm25": 17.0, "o3": 0.02 },
    { "hour": 9,  "level": "yellow", "pm10": 52.0, "pm25": 29.0, "o3": 0.04 },
    { "hour": 10, "level": "yellow", "pm10": 55.0, "pm25": 31.0, "o3": 0.05 },
    { "hour": 11, "level": "red",    "pm10": 82.0, "pm25": 48.0, "o3": 0.07 },
    { "hour": 12, "level": "red",    "pm10": 85.0, "pm25": 50.0, "o3": 0.07 },
    { "hour": 13, "level": "red",    "pm10": 88.0, "pm25": 52.0, "o3": 0.09 },
    { "hour": 14, "level": "yellow", "pm10": 60.0, "pm25": 35.0, "o3": 0.07 },
    { "hour": 15, "level": "yellow", "pm10": 58.0, "pm25": 33.0, "o3": 0.06 },
    { "hour": 16, "level": "yellow", "pm10": 55.0, "pm25": 30.0, "o3": 0.05 },
    { "hour": 17, "level": "green",  "pm10": 40.0, "pm25": 22.0, "o3": 0.04 },
    { "hour": 18, "level": "green",  "pm10": 35.0, "pm25": 19.0, "o3": 0.03 },
    { "hour": 19, "level": "green",  "pm10": 30.0, "pm25": 16.0, "o3": 0.02 },
    { "hour": 20, "level": "green",  "pm10": 28.0, "pm25": 15.0, "o3": 0.02 },
    { "hour": 21, "level": "green",  "pm10": 26.0, "pm25": 14.0, "o3": 0.02 },
    { "hour": 22, "level": "green",  "pm10": 24.0, "pm25": 13.0, "o3": 0.01 },
    { "hour": 23, "level": "green",  "pm10": 22.0, "pm25": 12.0, "o3": 0.01 }
  ],
  "recommended_hours": [7, 8, 20],
  "best_hour": 7,
  "summary": "오전 7~8시 운동을 추천합니다. 이 시간대 PM2.5 농도가 가장 낮습니다.",
  "recommended_duration_min": 40
}
```

#### 필드 상세

| 필드 | 타입 | 설명 |
|---|---|---|
| `exercise` | string | 요청 파라미터 echo |
| `date` | string | 요청 파라미터 echo (`YYYY-MM-DD`) |
| `generated_at` | string | 예측 생성 시각 (ISO 8601, **반드시 KST `+09:00` 포함**) |
| `timeline` | array | **반드시 24개** — `hour` 0부터 23까지 순서대로, 빠짐없이 |
| `timeline[].hour` | integer | 시간 (0~23) |
| `timeline[].level` | string | `"green"` / `"yellow"` / `"red"` 셋 중 하나만 허용 |
| `timeline[].pm10` | float | PM10 예측 농도 (㎍/㎥), 소수점 1자리 권장 |
| `timeline[].pm25` | float | PM2.5 예측 농도 (㎍/㎥), 소수점 1자리 권장 |
| `timeline[].o3` | float | 오존 예측 농도 (ppm), 소수점 2자리 권장 |
| `recommended_hours` | integer[] | 추천 시간대 목록, **1~3개**, `level == "green"` 시간대 중에서 선정 |
| `best_hour` | integer | 단일 최적 시간 (0~23), `recommended_hours[0]`과 동일해도 무방 |
| `summary` | string | 한 줄 추천 텍스트, UI에 그대로 노출됨 |
| `recommended_duration_min` | integer | 권장 운동 지속시간 (분), 운동 종류 기반 |

> **주의**: `timeline`이 24개 미만이거나 순서가 다르면 프론트 차트가 깨집니다. `hour` 기준 오름차순 정렬 필수.

---

## 4. 비즈니스 로직 명세

### 4.1 신호등 등급 (`level`) 산정 기준

프론트엔드는 `level` 문자열만 받아 색을 입히므로, **등급 판정은 전적으로 백엔드 책임**이다.  
아래는 환경부 대기환경기준 및 운동 강도를 반영한 권장 기준이며, 팀 내 조율 후 확정할 것.

#### PM10 (㎍/㎥) 기준

| level | 범위 |
|---|---|
| `green` | 0 이상 ~ 50 미만 |
| `yellow` | 50 이상 ~ 80 미만 |
| `red` | 80 이상 |

#### PM2.5 (㎍/㎥) 기준

| level | 범위 |
|---|---|
| `green` | 0 이상 ~ 25 미만 |
| `yellow` | 25 이상 ~ 37 미만 |
| `red` | 37 이상 |

#### 복합 판정 규칙

PM10과 PM2.5를 **각각 판정한 뒤 더 나쁜 등급을 채택**한다.

```
level = worst(pm10_level, pm25_level)
우선순위: red > yellow > green
```

오존(`o3`)은 현재 AI 모델 예측 대상 미포함이므로 level 산정에서 제외하되, 응답 필드에는 포함한다 (미래 확장 대비).

#### 운동 종류별 level 보정 (미결정 — 팀 논의 필요)

호흡량이 많은 운동(조깅, 등산)은 동일 농도에서도 노출량이 높으므로, 기준을 강화하는 방향을 고려할 수 있다.

| 운동 | 호흡량 배율 (참고) | 기준 강화 여부 |
|---|---|---|
| `walking` | 1.0x | 기본 기준 적용 |
| `jogging` | 2.0x | green 기준 강화 검토 |
| `cycling` | 1.5x | green 기준 강화 검토 |
| `hiking` | 2.5x | green 기준 강화 검토 |
| `ball` | 2.0x | green 기준 강화 검토 |

---

### 4.2 `recommended_hours` 선정 규칙

1. `level == "green"`인 시간대만 후보로 삼는다.
2. PM2.5 농도 오름차순으로 정렬한다.
3. 상위 **최대 3개**를 반환한다.
4. `green`이 0개인 경우: 빈 배열 `[]` 반환.

> **프론트 처리**: `recommended_hours`가 빈 배열이어도 UI가 깨지지 않도록 구현되어 있음. 단, `best_hour`가 `null`이면 "—"로 표시됨.

---

### 4.3 `best_hour` 선정 규칙

`recommended_hours` 중 PM2.5가 가장 낮은 단일 시간.  
`recommended_hours`가 빈 배열이면 `null` 반환 (integer가 아닌 JSON `null`).

```json
"best_hour": null
```

---

### 4.4 `recommended_duration_min` — 운동 종류별 권장 시간

아래는 초안이며, 논문·공공 데이터 출처 확정 후 수정할 것.

| `exercise` | 권장 시간 (분) |
|---|---|
| `walking` | 60 |
| `jogging` | 40 |
| `cycling` | 45 |
| `hiking` | 90 |
| `ball` | 60 |

대기질이 나쁜 날(전체 시간대의 50% 이상이 `red`)에는 권장 시간을 일괄 30% 단축하는 로직 추가를 검토할 것.

---

### 4.5 `summary` 문자열 생성 규칙

UI에 그대로 노출되는 문장이므로 자연스러운 한국어 문장으로 생성한다.

**권장 패턴:**

```
{best_hour_str} 운동을 추천합니다. 이 시간대 PM2.5 농도가 가장 낮습니다.
```

`best_hour`가 `null`인 경우:

```
오늘은 모든 시간대에 걸쳐 대기질이 나쁩니다. 실내 운동을 권장합니다.
```

---

## 5. 에러 응답

### 5.1 에러 응답 형식

모든 에러 응답은 아래 구조를 동일하게 사용한다.

```json
{
  "error": {
    "code": "INVALID_DISTRICT",
    "message": "유효하지 않은 자치구입니다."
  }
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `error.code` | string | 프론트에서 분기 처리에 사용하는 고정 코드 |
| `error.message` | string | 디버깅용 설명 (UI에 직접 노출하지 않음) |

### 5.2 에러 코드 목록

| HTTP 상태 | `error.code` | 발생 조건 | 프론트 표시 문구 |
|---|---|---|---|
| 400 | `INVALID_EXERCISE` | `exercise` 파라미터가 허용 목록에 없음 | "Please select a valid exercise type." |
| 400 | `INVALID_DATE` | 날짜가 오늘·내일이 아니거나 형식 오류 | "Only today or tomorrow can be selected." |
| 400 | `MISSING_PARAM` | 필수 파라미터 누락 | "An error occurred. Please try again." |
| 503 | `MODEL_UNAVAILABLE` | AI 모델 추론 실패 또는 타임아웃 | "Service temporarily unavailable. Please try again later." |
| 500 | `INTERNAL_ERROR` | 그 외 서버 내부 오류 | "A server error occurred. Please try again." |

> `MISSING_PARAM`은 README 원안에 없으나 방어적 처리를 위해 추가. 프론트는 제출 전 클라이언트 유효성 검사를 수행하므로 정상 흐름에서는 발생하지 않음.

---

## 6. 프론트엔드 연동 메모

백엔드 개발 시 참고할 프론트 동작 상세.

### 전환 방법

`js/main.js` 상단의 플래그로 mock ↔ 실제 API 전환:

```javascript
const USE_MOCK = false;  // true 로 변경하면 mock 데이터 사용
const API_BASE = 'https://bigdata.studylink.click';
```

### 프론트가 응답을 처리하는 방식

```
fetch('/api/recommend?...')
  → 200: JSON 전체를 sessionStorage에 저장 → result.html 이동
  → 4xx/5xx: error.code로 분기 → 한국어 알림 표시
```

### 프론트가 민감하게 반응하는 필드

| 필드 | 잘못됐을 때 증상 |
|---|---|
| `timeline` 24개 미만 | 타임라인 그리드 칸 수 부족, 차트 x축 불일치 |
| `timeline[].level` 오탈자 | 해당 칸 색상 없음 (CSS 클래스 미적용) |
| `best_hour: null` | "Best time: —" 표시 (정상 처리) |
| `recommended_hours: []` | 타임라인에 ★ 없음 (정상 처리) |
| `generated_at` timezone 누락 | 표시 안 함, 에러 없음 |

---

## 7. curl 테스트 예시

```bash
# 정상 요청
curl -s "https://bigdata.studylink.click/api/recommend?exercise=jogging&date=2026-05-31" | jq .

# 허용되지 않는 날짜
curl -s "https://bigdata.studylink.click/api/recommend?exercise=jogging&date=2026-01-01" | jq .

# 파라미터 누락
curl -s "https://bigdata.studylink.click/api/recommend?exercise=jogging" | jq .
```
