# 작업 규칙

## 푸시 전에 반드시 빌드를 돌린다

```bash
npm ci          # node_modules 가 없으면 한 번만
npm run build   # prebuild(플래시카드·genAnswers) + next build + 타입검사
```

`npm run build` 가 통과하지 않으면 **배포가 통째로 멈춘다.** 화면은 마지막으로
성공한 빌드에 머물러 있고, 그 뒤에 올린 커밋은 하나도 반영되지 않는다.
커밋이 쌓여 있어도 사용자는 옛 화면을 보게 되므로 "왜 안 고쳐졌냐"는 말이
나오기 전까지 아무도 모른다.

실제로 이런 일이 있었다. `src/app/plan/page.tsx` 에서 렌더 조건을
`day.kind === "study"` 에서 `topics.length > 0` 으로 바꿨더니 else 가지의
타입 좁히기가 풀려 `day.note` 접근이 타입 오류가 됐다. 데이터만 고치는
커밋이라고 생각해 빌드를 안 돌렸고, 학습계획 개편 여러 건이 배포되지
않은 채 며칠 묵었다.

데이터(JSON·ts 상수)만 바꾼 커밋도 예외가 아니다. `prebuild` 가 데이터를
읽어 플래시카드와 genAnswers 를 다시 만들기 때문에 데이터가 깨지면 여기서
멈춘다.

## 답안 형식 검사

```bash
python3 scripts/check-answer-format.py <회차>   # 140, ns1-, yc1-30 …
```

규격은 `docs/ANSWER_SPEC.md` 와 `src/lib/prompts.ts` 에 있다.

## 교재 자료를 옮길 때

- 교재 정의에서 색으로 강조된 단어는 채점 키워드다. 34~35자로 줄일 때
  **그 단어를 빼지 않는다** — 줄이는 대상은 조사·수식어다.
- 커리큘럼(`src/data/curriculum.ts`)의 과목 토픽 목록은 교재 CONTENTS 의
  순서·Priority 를 그대로 따른다. ★=하, ★★=중, ★★★=상.
