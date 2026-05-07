"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

export type ChatGPTHomeHandle = {
  textarea: HTMLTextAreaElement | null;
  sendButton: HTMLButtonElement | null;
  setValue: (next: string) => void;
  submit: () => void;
};

type Props = {
  initialValue?: string;
  readOnly?: boolean;
  onSubmit?: (value: string) => void;
  belowComposer?: React.ReactNode;
};

const ChatGPTHome = forwardRef<ChatGPTHomeHandle, Props>(function ChatGPTHome(
  { initialValue = "", readOnly = false, onSubmit, belowComposer },
  ref,
) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sendBtnRef = useRef<HTMLButtonElement | null>(null);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
  }, [value, onSubmit]);

  useImperativeHandle(
    ref,
    () => ({
      get textarea() {
        return textareaRef.current;
      },
      get sendButton() {
        return sendBtnRef.current;
      },
      setValue: (next: string) => setValue(next),
      submit,
    }),
    [submit],
  );

  const autosize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, []);

  useEffect(() => {
    autosize();
  }, [value, autosize]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-[var(--cg-bg)] text-[var(--cg-text)]">
      <header className="flex h-14 items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[15px] font-semibold hover:bg-[var(--cg-hover)]"
            aria-label="ChatGPT"
          >
            <ChatGPTLogo className="h-7 w-7" />
            <span className="ml-0.5">ChatGPT</span>
            <ChevronDown className="h-4 w-4 text-[var(--cg-muted)]" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://chatgpt.com/auth/login"
            className="hidden h-9 items-center rounded-full px-4 text-sm font-medium hover:bg-[var(--cg-hover)] sm:flex"
          >
            Log in
          </a>
          <a
            href="https://chatgpt.com/auth/login?sso=true"
            className="flex h-9 items-center rounded-full bg-[var(--cg-text)] px-4 text-sm font-medium text-[var(--cg-bg)] hover:opacity-90"
          >
            Sign up for free
          </a>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-3 sm:px-4">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <h1 className="mb-7 text-center text-[28px] font-semibold tracking-tight sm:text-[32px]">
            What are you working on?
          </h1>

          <form
            onSubmit={handleFormSubmit}
            className="w-full"
            aria-label="Send a message"
          >
            <div
              className="flex w-full flex-col rounded-[28px] border border-[var(--cg-composer-border)] bg-[var(--cg-composer-bg)] px-2.5 py-2.5 shadow-[var(--cg-composer-shadow)] focus-within:border-[var(--cg-composer-border-focus)]"
            >
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                readOnly={readOnly}
                placeholder="Ask anything"
                rows={1}
                className="max-h-[200px] min-h-[28px] w-full resize-none border-0 bg-transparent px-3 py-2 text-[16px] leading-6 outline-none placeholder:text-[var(--cg-muted)]"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <IconButton aria-label="Add photos and files">
                    <PlusIcon className="h-5 w-5" />
                  </IconButton>
                  <PillButton aria-label="Tools">
                    <ToolsIcon className="h-[18px] w-[18px]" />
                    <span>Tools</span>
                  </PillButton>
                </div>

                <div className="flex items-center gap-1">
                  <IconButton aria-label="Dictate">
                    <MicIcon className="h-5 w-5" />
                  </IconButton>
                  <button
                    ref={sendBtnRef}
                    type="submit"
                    aria-label="Send prompt"
                    disabled={!hasValue}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cg-text)] text-[var(--cg-bg)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[var(--cg-disabled)] disabled:text-[var(--cg-disabled-fg)]"
                  >
                    <ArrowUpIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>

          {belowComposer ? (
            <div className="mt-3 w-full">{belowComposer}</div>
          ) : null}
        </div>
      </main>

      <footer className="px-4 pb-3 text-center text-[12px] leading-5 text-[var(--cg-muted)]">
        By messaging ChatGPT, an AI chatbot, you agree to our{" "}
        <a
          href="https://openai.com/terms"
          className="underline underline-offset-2"
        >
          Terms
        </a>{" "}
        and have read our{" "}
        <a
          href="https://openai.com/privacy"
          className="underline underline-offset-2"
        >
          Privacy Policy
        </a>
        . See{" "}
        <a
          href="https://openai.com/policies/california-privacy-notice/"
          className="underline underline-offset-2"
        >
          Your privacy choices
        </a>
        .
      </footer>
    </div>
  );
});

export default ChatGPTHome;

function IconButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--cg-text)] hover:bg-[var(--cg-hover)]"
    >
      {children}
    </button>
  );
}

function PillButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] text-[var(--cg-text)] hover:bg-[var(--cg-hover)]"
    >
      {children}
    </button>
  );
}

function ChatGPTLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 41 41"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M37.532 16.87a9.96 9.96 0 0 0-.856-8.184 10.08 10.08 0 0 0-10.85-4.832A9.99 9.99 0 0 0 18.518 0a10.06 10.06 0 0 0-9.601 6.978 9.99 9.99 0 0 0-6.679 4.844 10.08 10.08 0 0 0 1.24 11.817A9.96 9.96 0 0 0 4.34 31.823a10.08 10.08 0 0 0 10.853 4.832A9.99 9.99 0 0 0 22.55 40a10.06 10.06 0 0 0 9.605-6.984 9.99 9.99 0 0 0 6.679-4.844 10.08 10.08 0 0 0-1.243-11.804zM22.55 37.49a7.46 7.46 0 0 1-4.79-1.732l.236-.134 7.951-4.59a1.3 1.3 0 0 0 .655-1.135V18.75l3.36 1.945a.12.12 0 0 1 .066.092v9.282a7.5 7.5 0 0 1-7.478 7.42zM6.466 30.622a7.46 7.46 0 0 1-.894-5.018l.236.143 7.96 4.591a1.3 1.3 0 0 0 1.308 0l9.717-5.61v3.88a.12.12 0 0 1-.048.103L16.7 33.36a7.49 7.49 0 0 1-10.234-2.738M4.371 13.296A7.47 7.47 0 0 1 8.275 10v9.452a1.29 1.29 0 0 0 .649 1.13l9.668 5.581-3.36 1.945a.12.12 0 0 1-.114 0l-8.04-4.64a7.49 7.49 0 0 1-2.737-10.226zm27.612 6.42-9.668-5.622 3.36-1.94a.12.12 0 0 1 .113 0l8.04 4.635a7.49 7.49 0 0 1-1.158 13.514V19.39a1.32 1.32 0 0 0-.687-1.151zm3.344-5.032-.236-.144-7.948-4.628a1.3 1.3 0 0 0-1.308 0l-9.713 5.61v-3.88a.12.12 0 0 1 .048-.103l8.04-4.638a7.48 7.48 0 0 1 11.117 7.745zM14.842 21.802l-3.36-1.95a.12.12 0 0 1-.066-.094v-9.279a7.49 7.49 0 0 1 12.282-5.756l-.236.135-7.95 4.59a1.3 1.3 0 0 0-.656 1.135zm1.825-3.937 4.328-2.501 4.341 2.5v5l-4.324 2.5-4.341-2.5z" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ToolsIcon({ className }: { className?: string }) {
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
      <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
      <path d="m15 3 6 6-9.5 9.5a2.12 2.12 0 0 1-3-3L18 6" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
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
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M19 10a7 7 0 0 1-14 0" />
      <path d="M12 19v3" />
    </svg>
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
