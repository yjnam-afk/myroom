import SheetView from "./SheetView";

/** 토픽 정리표 — 암기 카드 보기(정적). 펼친 표는 /sheet/full */
export const metadata = { title: "토픽 정리표 — 나의 공간" };
export const dynamic = "force-static";

export default function SheetPage() {
  return <SheetView full={false} />;
}
