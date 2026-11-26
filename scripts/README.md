# scripts/

## 빌드 때 도는 것 (`npm run build` 의 prebuild, 순서대로)

| 스크립트 | 하는 일 |
|---|---|
| `test-question-text.ts` | 「같은 문제」 판정·회차 정렬 시험(사용자가 짚은 사례). 실패하면 빌드가 멈춘다 |
| `answers.ts check` | 답안 데이터 검사(id 중복·교시·빈 문제·이미지 파일·문제은행 id·점수) |
| `build-textbook-map.ts` · `build-flashcards.ts` · `build-genanswers.ts` | 교재 지도·플래시카드·조립 답안 |
| `import-artifact-sheet.py` | 아티팩트 답안지(22줄 괘선 HTML) → `customSheets.json` — 토픽 설명의 그 교시 탭이 이 답안지를 그대로 보인다 |
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
| `import-itpe-haesul.py` | ITPE 해설집 PDF → 문항별 webp + 답안 항목(기출·NS 주간, 암호 PDF 도) `--q-from-page` 는 문제 문구를 해설 첫 쪽 「문제」 칸에서 읽는다(Final Round 해설집) |
| `import-kpc-camp.py` → `camp-match.py` → `camp-to-entries.ts` | KPC 합숙훈련 해설집 |
| `link-kpc-mock.py` | KPC 모의고사 모범답안 ↔ 문제은행 KPC 회차 문항(날짜·교시·번호) |
| `link-similar.py` | 답안 ↔ 모의고사·파이널·셀테 문항을 문구 비슷도로(안전장치: 숫자·약어·뜻 바꾸는 낱말) |
| `fix-answer-titles.py` | OCR 로 깨진 제목·키워드만 적힌 제목을 문제은행 원문으로 |
| `audit-answer-links.py` | questionIds 가 다른 문제를 가리키는지 의심 목록(`--fix` 는 신중히 — 키워드 제목은 오탐이 많다) |
| `audit-links.ts` | **직접 연결(questionIds) 검수** — 답안 문제와 문항이 「같은 요구」인지(낱말 단위). `--ops <f>` 로 끊을 연결을 뽑아 `answers.ts apply`. 연결 스크립트를 돌린 뒤엔 꼭 돌린다 |
| `ocr-kpc-head.py` | KPC 모범답안 첫 쪽 머리(인쇄된 문제 줄) OCR — 제목이 실제 문제와 같은지 대조(tesseract 필요) |
| `report-answer-gaps.ts` | 답안 0편 토픽, 같은 문제 답안이 없는 기출, 구분별 비율 |
| `find-hidden-topics.ts` | **숨은 토픽 찾기** — 어느 토픽에도 안 걸리는 문항의 주제를 세고, 토픽 제목·교재 표·예전 토픽에 있는지 함께 찍는다(별칭·서브 토픽·새 토픽 후보) |
| `find-sub-topics.ts` | **서브 토픽 후보(교재 쪽에서)** — 교재 표의 이름 칸·키워드마다 그 이름을 주제로 물은 문항을 세고, 토픽·서브 토픽으로 안 걸리는 것을 찍는다 |
| `survey-topics.ts` | **토픽 조사** — 문제은행 전체를 문항마다 교재 토픽 · 서브 토픽 · 교재 밖(예전 토픽 화면 있음 / 화면 없음 / 주제 이름 없음)으로 나누고, 교재 밖 문항을 첫 줄 주제로 묶는다. `npx tsx scripts/survey-topics.ts src/data/topicSurvey.json` 이 `/survey` 화면 자료를 만든다(빌드 때 안 돌린다) |
| `check-exam-topics.ts` | **교재 밖 토픽 검사** — `src/data/examTopics.json`(토픽 지도에 놓는 기출·모의 주제)의 과목 코드·상위 토픽·이름 겹침. `--hits` 는 이름으로 걸리는 문항 0건·넓은 이름을 찍는다 |
| `trace-client-data.py` | **클라이언트 화면이 큰 자료를 끌어오는지** — "use client" 파일에서 값 import 를 따라가 150KB 넘는 파일에 닿는 경로를 찍는다(`python3 scripts/trace-client-data.py [파일…]`). 2026-11-24 토픽 설명이 한 줄짜리 함수 때문에 13MB 를 브라우저로 받고 있었다. 클라이언트 파일에서 `lib/` 를 새로 가져올 때 돌린다 |
| `export-topic-db.ts` | **토픽 DB 내보내기**(2026-11-23 두 번째 판) — 교재 토픽 712 + 기출 2회 이상 교재 밖 토픽을 `npx tsx scripts/export-topic-db.ts <폴더>` 로 `토픽DB_{코드}_{NN}.md`(토픽 15개·40KB 이하, 중요도 → 기출+NS+모의 합계 순) · `토픽DB_{코드}_목차.md` · `요약.json` 으로(전 도메인 합본은 만들지 않는다 — 사용자가 필요 없다고 했다). 토픽마다 중요도 + 14개 항목 + 기타 교재 표. 서브노트 칸을 빼지 않고 표 칸은 줄이지 않는다. 보조 자료: `export-topic-db.defkeys.json`(정의 속 글자 그대로인 1~4어절 키워드), `export-topic-db.figures.json`(교재 슬라이드 그림을 글로 — 줄마다 (교재)/(손글씨 정리)/(해설집)) |
| `check-topic-why.ts` | **「왜 있나」 검사** — `src/data/topicWhy/{과목}.json` 에 빠진 토픽·없는 제목·길이·금지어(비유·시험 요령). `--dump {과목}` 은 쓸 때 볼 자료(정의·특징·표 머리·키워드·등장배경) |
| `predict-week.ts` | **NS 주간 모의고사 출제 예상** — 인자 없이 돌리면 13~19기 시험 73개 백테스트(방식별 적중 문항 수), `19기 10 SE` 처럼 주면 그 주 토픽 40 · 다시 나올 문장 40 |
| `measure-ext-repeat.ts` | NS 주간 모의고사 문항이 **최근 12·24개월 기출·모의·파이널과 같은 문장**인 비율(시험별 · 후보 수 · NS 에 없던 문장 수) |

공용: `lib/answers-store.ts`(TS 읽기·검사·쓰기), `lib/answers_py.py`(파이썬 읽기·정규화·후보 찾기·ops 적용). `lib/ns-exams.ts`(NS 문항을 시험 단위로 묶기 · 과목 묶음 · 기출·모의 연월 — predict-week · measure-ext-repeat 공용).

## 문제은행 — `src/data/questions.json`

| 스크립트 | 하는 일 |
|---|---|
| `import-itpe-search-tool.py` → `classify-new-questions.ts` | ITPE 「문제검색 Tool」 엑셀 가져오기 → 과목 |
| `round-label.py` | 회차 이름(「ITPE 모의고사 2026.10」「KPC 70회 (2016.06)」), KPC 회차표 `kpc-rounds.json` |
| `import-ns-exams.py` | NS 주간 모의고사 |
