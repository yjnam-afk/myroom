# public/concept — 토픽 화면에 붙는 그림

| 폴더 | 무엇 | 어디서 읽나 |
|---|---|---|
| `book/{과목코드}/` | 교재 슬라이드 원본(13과목, 과목별 폴더 — 2026-11-03) | `src/data/subnoteExtras.ts` 의 `image` |
| `diagram/` | 슬라이드에서 잘라 낸 개념도·절차도 | `subnoteExtras.ts` 의 `images` |
| `extra/` | 사용자가 보내 준 캡처 | `subnoteExtras.ts` 의 `images` |
| `hand/` | 정리 노트에서 잘라 낸 손글씨 개념도 | `src/data/handDiagrams.ts` |
| `answer/` | 예전에 답안지 템플릿에 붙이던 교재 그림 조각 — 지금은 「📖 교재 그림」 단추로만 | `src/data/conceptDiagrams.ts` 주석 참고 |
| `haesul140/` | 140회 해설 그림 | 해당 데이터 파일 |

파일을 올리기만 해서는 화면에 뜨지 않는다 — 위 데이터 파일에 경로를 적어야 한다.
(2026-10-12 에 「`<토픽id>.svg` 를 올리면 자동으로 뜬다」는 방식으로 SVG 14장을 두었는데, 그 코드는 없어졌고
그림은 아무 데서도 쓰이지 않아 2026-11-03 에 지웠다.)
