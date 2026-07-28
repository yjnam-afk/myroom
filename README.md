# 나의 공간 (My Room)

나만의 방을 꾸미고, 하루를 기록하는 개인 홈 웹앱입니다. Next.js(App Router) + TypeScript + Tailwind CSS로 만들어졌고, 모든 기록은 **브라우저(localStorage)에만 저장**됩니다 — 서버·계정이 필요 없어요.

학습 앱 [다 같이 스파르타](https://study-teal-eight.vercel.app)와 같은 기술 스택·디자인 감성을 공유합니다.

## 주요 기능 (4개 메뉴)

| 메뉴 | 경로 | 설명 |
| --- | --- | --- |
| 🛋️ 마이룸 | `/` | 인사 배너(이름·기분·오늘의 한 줄) + 디데이 카운터 + **이모지 스티커로 방 꾸미기** + 오늘 요약·바로가기 |
| 📔 다이어리 | `/diary` | 하루 한 줄 일기 + 기분 이모지 기록 |
| ✅ 할 일 | `/todo` | 할 일 체크리스트 + 진행률 바 |
| 🔖 즐겨찾기 | `/links` | 자주 가는 링크 모음 (홈 화면에도 노출) |

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 배포 (Vercel)

1. https://vercel.com 에 GitHub 계정으로 로그인
2. **"Add New… → Project"** → 이 저장소(`yjnam-afk/myroom`) 선택 → Import
3. 환경변수 없이 바로 **Deploy** — 1~2분 후 `https://....vercel.app` 주소 생성

## 구조

```
src/
├─ app/
│  ├─ page.tsx          # 마이룸 홈 (프로필·디데이·방 꾸미기·요약·바로가기)
│  ├─ diary/page.tsx    # 다이어리
│  ├─ todo/page.tsx     # 할 일
│  ├─ links/page.tsx    # 즐겨찾기
│  └─ layout.tsx        # 공통 헤더·네비게이션
└─ lib/
   └─ storage.ts        # localStorage 헬퍼 (프로필·디데이·방·일기·할일·링크)
```

## 참고

- 데이터는 이 브라우저에만 저장되므로, 다른 기기·시크릿 창에서는 보이지 않습니다.
- 브라우저 데이터를 지우면 기록도 사라져요.
