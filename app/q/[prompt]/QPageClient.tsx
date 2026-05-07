"use client";

import { useEffect, useRef } from "react";
import ChatGPTHome, {
  type ChatGPTHomeHandle,
} from "../../components/ChatGPTHome";
import FakeCursor, {
  type FakeCursorHandle,
} from "../../components/FakeCursor";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const centerOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export default function QPageClient({ prompt }: { prompt: string }) {
  const homeRef = useRef<ChatGPTHomeHandle>(null);
  const cursorRef = useRef<FakeCursorHandle>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const redirect = () => {
      window.location.href = `https://chatgpt.com/?model=gpt-4&prompt=${encodeURIComponent(prompt)}`;
    };

    const run = async () => {
      const home = homeRef.current;
      const cursor = cursorRef.current;
      if (!home || !cursor) return;

      if (reduceMotion) {
        home.setValue(prompt);
        await sleep(400);
        redirect();
        return;
      }

      await sleep(350);

      const ta = home.textarea;
      if (!ta) return;
      const taPoint = centerOf(ta);
      await cursor.moveTo(taPoint.x, taPoint.y, 750);
      await cursor.click();
      ta.focus();
      await sleep(120);

      const total = prompt.length;
      const maxDuration = 2500;
      const minPerChar = 18;
      const idealPerChar = 35;
      const perChar = Math.max(
        minPerChar,
        Math.min(idealPerChar, Math.floor(maxDuration / Math.max(1, total))),
      );
      const charsPerTick = Math.max(
        1,
        Math.ceil((total * perChar) / maxDuration),
      );

      let i = 0;
      while (i < total) {
        i = Math.min(total, i + charsPerTick);
        home.setValue(prompt.slice(0, i));
        await sleep(perChar);
      }

      await sleep(220);

      let sendBtn = home.sendButton;
      if (!sendBtn) return;
      const btnPoint = centerOf(sendBtn);
      await cursor.moveTo(btnPoint.x, btnPoint.y, 550);
      await cursor.click();
      await sleep(180);
      redirect();
    };

    run();
  }, [prompt]);

  return (
    <>
      <ChatGPTHome ref={homeRef} initialValue="" readOnly />
      <FakeCursor ref={cursorRef} />
    </>
  );
}
