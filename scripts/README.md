# scripts/

## 빌드 때 도는 것 (`npm run build` 의 prebuild, 순서대로)

| 스크립트 | 하는 일 |
|---|---|
| `test-question-text.ts` | 「같은 문제」 판정·회차 정렬 시험(사용자가 짚은 사례). 실패하면 빌드가 멈춘다 |
| `answers.ts check` | 답안 데이터 검사(id 중복·교시·빈 문제·이미지 파일·문제은행 id·점수) |
| `build-textbook-map.ts` · `build-flashcards.ts` · `build-genanswers.ts` | 교재 지도·플래시카드·조립 답안 |
| `build-question-freq.ts` | 문항 메타 — 빈출·토픽 중요도·내 정리(`questionFreq.json`) |
| `build-answer-index.ts` | 클로드/조립 답안이 「있는지」 표(`examAnswerIndex.json`) — 본문은 `/api/exam-answer` |

## 답안(모범답안·해설집) 고치기 — `src/data/peerAnswers/*.json`

**모든 고침은 `answers.ts` 를 거친다**(검사를 통과해야 저장). 파이썬 스크립트는 고침 목록(ops)을 만들어 `answers.ts apply` 로 넣는다.

```bash
npx tsx scripts/answers.ts show <id>
npx tsx scripts/answers.ts set <id> question "…"          # topicTitles 는 '["…","…"]'
npx tsx scripts/answers.ts add-qid <id> <문항id> / rm-qid <id> <문항id>
npx tsx scripts/answers.ts add entries.json 11.json
npx tsx scripts/suggest-topics.ts <id 또는 문구>           # 교재 토픽 추천
```

| 스크립트 | 하는 일 |
|---|---|
| `import-itpe-haesul.py` | ITPE 해설집 PDF → 문항별 webp + 답안 항목(기출·NS 주간, 암호 PDF 도) |
| `import-kpc-camp.py` → `camp-match.py` → `camp-to-entries.ts` | KPC 합숙훈련 해설집 |
| `link-kpc-mock.py` | KPC 모의고사 모범답안 ↔ 문제은행 KPC 회차 문항(날짜·교시·번호) |
| `link-similar.py` | 답안 ↔ 모의고사·파이널·셀테 문항을 문구 비슷도로(안전장치: 숫자·약어·뜻 바꾸는 낱말) |
| `fix-answer-titles.py` | OCR 로 깨진 제목·키워드만 적힌 제목을 문제은행 원문으로 |
| `audit-answer-links.py` | questionIds 가 다른 문제를 가리키는지 의심 목록(`--fix` 는 신중히 — 키워드 제목은 오탐이 많다) |
| `report-answer-gaps.ts` | 답안 0편 토픽, 같은 문제 답안이 없는 기출, 구분별 비율 |

공용: `lib/answers-store.ts`(TS 읽기·검사·쓰기), `lib/answers_py.py`(파이썬 읽기·정규화·후보 찾기·ops 적용).

## 문제은행 — `src/data/questions.json`

| 스크립트 | 하는 일 |
|---|---|
| `import-itpe-search-tool.py` → `classify-new-questions.ts` | ITPE 「문제검색 Tool」 엑셀 가져오기 → 과목 |
| `round-label.py` | 회차 이름(「ITPE 모의고사 2026.10」「KPC 70회 (2016.06)」), KPC 회차표 `kpc-rounds.json` |
| `import-ns-exams.py` | NS 주간 모의고사 |
