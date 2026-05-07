"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type FakeCursorHandle = {
  moveTo: (x: number, y: number, durationMs?: number) => Promise<void>;
  click: () => Promise<void>;
};

const FakeCursor = forwardRef<FakeCursorHandle, { initial?: { x: number; y: number } }>(
  function FakeCursor({ initial }, ref) {
    const elRef = useRef<HTMLDivElement | null>(null);
    const [pressed, setPressed] = useState(false);
    const [ringKey, setRingKey] = useState(0);
    const posRef = useRef<{ x: number; y: number }>(
      initial ?? { x: -100, y: -100 },
    );

    useImperativeHandle(ref, () => ({
      moveTo: (x, y, durationMs = 700) =>
        new Promise<void>((resolve) => {
          const el = elRef.current;
          if (!el) return resolve();
          el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          posRef.current = { x, y };
          window.setTimeout(resolve, durationMs);
        }),
      click: () =>
        new Promise<void>((resolve) => {
          setPressed(true);
          setRingKey((k) => k + 1);
          window.setTimeout(() => {
            setPressed(false);
            window.setTimeout(resolve, 120);
          }, 140);
        }),
    }));

    const initialX = initial?.x ?? -100;
    const initialY = initial?.y ?? -100;

    return (
      <div
        ref={elRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50"
        style={{ transform: `translate3d(${initialX}px, ${initialY}px, 0)` }}
      >
        <div
          className="relative"
          style={{
            transform: pressed ? "scale(0.85)" : "scale(1)",
            transition: "transform 140ms ease-out",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
          >
            <path
              d="M5 3 L5 19 L9 15 L11.5 21 L14 20 L11.5 14 L17 14 Z"
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          <span
            key={ringKey}
            className="absolute left-1/2 top-1/2 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--cg-text)] opacity-0"
            style={{
              animation:
                ringKey > 0 ? "fakecursor-ring 420ms ease-out forwards" : "none",
            }}
          />
        </div>
        <style>{`
          @keyframes fakecursor-ring {
            0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
          }
        `}</style>
      </div>
    );
  },
);

export default FakeCursor;
