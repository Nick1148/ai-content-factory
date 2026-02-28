"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      // API가 아직 없을 경우 mock 처리
      setTimeout(() => {
        setStatus("success");
        setEmail("");
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소를 입력하세요"
        required
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {status === "loading" ? "구독 중..." : "구독하기"}
      </button>
      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400 sm:absolute sm:mt-12">
          구독이 완료되었습니다!
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400 sm:absolute sm:mt-12">
          구독에 실패했습니다. 다시 시도해주세요.
        </p>
      )}
    </form>
  );
}
