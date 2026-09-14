import { answerRows } from "@/lib/answerIndex";
import AnswersClient from "./AnswersClient";

export const metadata = { title: "모범답안 — 나의 공간" };

export default function AnswersPage() {
  return <AnswersClient rows={answerRows()} />;
}
