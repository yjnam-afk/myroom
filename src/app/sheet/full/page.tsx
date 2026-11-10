import SheetView from "../SheetView";

/** 토픽 정리표 — 펼친 표 보기(본론 3단표 전체, 정적) */
export const metadata = { title: "토픽 정리표(펼친 표) — 나의 공간" };
export const dynamic = "force-static";

export default function SheetFullPage() {
  return <SheetView full />;
}
