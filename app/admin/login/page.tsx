"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@grihobazar.local");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      setMessage(error.message ?? "Login failed");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f6f8] px-4 text-brand-ink">
      <form onSubmit={login} className="w-full max-w-[420px] rounded-lg border bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded bg-brand-orange text-white">
            <LockKeyhole className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">Admin Login</h1>
            <p className="text-sm text-[#666]">Ghorer Bazar control panel</p>
          </div>
        </div>

        {message ? <p className="mb-3 rounded bg-[#fee2e2] p-3 text-sm font-semibold text-[#991b1b]">{message}</p> : null}

        <label className="mb-3 grid gap-1 text-sm font-semibold">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded border px-4 font-normal outline-none focus:border-brand-orange" />
        </label>
        <label className="mb-5 grid gap-1 text-sm font-semibold">
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="h-12 rounded border px-4 font-normal outline-none focus:border-brand-orange" />
        </label>
        <button disabled={loading} className="h-12 w-full rounded bg-brand-orange font-bold text-white disabled:bg-[#9ca3af]">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-4 text-xs leading-5 text-[#777]">Demo default: admin@grihobazar.local / admin123. Production-এ env দিয়ে বদলাবে।</p>
      </form>
    </main>
  );
}
