"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      const ok = document.execCommand("copy");
      return ok;
    } catch {
      return false;
    } finally {
      document.body.removeChild(ta);
    }
  }
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  const handleCreateLink = async () => {
    const value = prompt.trim();
    if (!value) return;
    const url = `${window.location.origin}/q/${encodeURIComponent(value)}`;
    setLink(url);
    const ok = await copyText(url);
    setCopied(ok);
    setToast(ok ? "Link copied" : "Copy failed");
  };

  const handleCopy = async () => {
    if (!link) return;
    const ok = await copyText(link);
    setCopied(ok);
    setToast(ok ? "Link copied" : "Copy failed");
  };

  return (
    <>
      <div className="flex min-h-dvh flex-1 flex-col bg-[var(--cg-bg)] text-[var(--cg-text)]">
        <header className="flex h-14 items-center justify-between px-3 sm:px-4">
          <div className="px-2 text-[20px] font-semibold">Ask AI</div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center rounded-full px-4 text-sm font-medium hover:bg-[var(--cg-hover)] sm:flex"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center rounded-full bg-[var(--cg-text)] px-4 text-sm font-medium text-[var(--cg-bg)] hover:opacity-90"
            >
              Connect me on LinkedIn
            </a>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-3 sm:px-4">
          <div className="flex w-full max-w-3xl flex-col items-center">
            <h1 className="mb-7 text-center text-[28px] font-semibold tracking-tight sm:text-[32px]">
              Create sharable link
            </h1>

            <form
              className="w-full"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                void handleCreateLink();
              }}
            >
              <div className="flex w-full flex-col rounded-[28px] border border-[var(--cg-composer-border)] bg-[var(--cg-composer-bg)] px-2.5 py-2.5 shadow-[var(--cg-composer-shadow)]">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleCreateLink();
                    }
                  }}
                  placeholder="Ask anything"
                  rows={1}
                  className="max-h-[200px] min-h-[28px] w-full resize-none border-0 bg-transparent px-3 py-2 text-[16px] leading-6 outline-none placeholder:text-[var(--cg-muted)]"
                />

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="submit"
                    aria-label="Create shareable link"
                    disabled={!prompt.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cg-text)] text-[var(--cg-bg)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[var(--cg-disabled)] disabled:text-[var(--cg-disabled-fg)]"
                  >
                    <ArrowUpIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </form>

            {link ? (
              <div className="mt-3 w-full">
                <LinkBox
                  link={link}
                  copied={copied}
                  onCopy={handleCopy}
                />
              </div>
            ) : null}
          </div>
        </main>

        <footer className="px-4 pb-3 text-center text-[12px] leading-5 text-[var(--cg-muted)]">
          Disclaimer: this is a fun project.
        </footer>
      </div>
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-16 z-50 flex justify-center"
      >
        <div
          className={`rounded-full bg-[var(--cg-text)] px-4 py-2 text-sm font-medium text-[var(--cg-bg)] shadow-lg transition-opacity duration-200 ${
            toast ? "opacity-100" : "opacity-0"
          }`}
        >
          {toast ?? ""}
        </div>
      </div>
    </>
  );
}

function LinkBox({
  link,
  copied,
  onCopy,
}: {
  link: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--cg-composer-border)] bg-[var(--cg-composer-bg)] py-1.5 pl-4 pr-1.5 shadow-[var(--cg-composer-shadow)]">
      <input
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 truncate bg-transparent text-[14px] outline-none"
        aria-label="Shareable link"
      />
      <button
        type="button"
        onClick={onCopy}
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[var(--cg-text)] px-3 text-[13px] font-medium text-[var(--cg-bg)] hover:opacity-90"
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4" />
            Copied
          </>
        ) : (
          <>
            <CopyIcon className="h-4 w-4" />
            Copy
          </>
        )}
      </button>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[var(--cg-composer-border)] px-3 text-[13px] font-medium hover:bg-[var(--cg-hover)]"
      >
        <OpenIcon className="h-4 w-4" />
        Open
      </a>
    </div>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function OpenIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}
