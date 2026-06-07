"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { Eye, Lock, Mail, Menu, Phone, ShoppingCart, Smartphone, UserRound } from "lucide-react";

type AuthMode = "login" | "register";

const navItems = ["Combos", "Offer Zone", "Mango", "Honey", "Oil & Ghee", "Dates", "Spices", "Nuts & Seeds", "Beverage", "Rice", "Flours & Lentils", "Certified", "Pickle", "Tabaya"];

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";

  async function googleLogin() {
    setMessage("");
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
      setMessage("Google login active korte Firebase web config env vars Vercel-e set korte hobe.");
      return;
    }

    const [{ initializeApp, getApps }, { GoogleAuthProvider, getAuth, signInWithPopup }] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
    ]);
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    const auth = getAuth(app);
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    setMessage(`Google login successful: ${result.user.email ?? result.user.displayName ?? "account connected"}`);
  }

  return (
    <main className="min-h-screen bg-white text-brand-ink">
      <header className="border-b bg-white">
        <div className="mx-auto grid max-w-[1760px] grid-cols-[180px_1fr_520px] items-center gap-8 px-16 py-7 max-xl:grid-cols-[150px_1fr_420px] max-lg:hidden">
          <Link href="/" aria-label="Ghorer Bazar home">
            <img className="w-[150px]" src="https://backoffice.ghorerbazar.com/company_logo/qJaKf1768887846.png" alt="Ghorer Bazar" />
          </Link>
          <form className="relative">
            <input className="h-[70px] w-full rounded-[10px] bg-[#f3f3f3] px-6 pr-16 text-xl outline-none" placeholder="Search in..." />
            <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2" aria-label="Search">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
          </form>
          <div className="flex items-center justify-between gap-5">
            <HeaderAction icon={<MapIcon />} label="Track Order" />
            <HeaderAction icon={<UserRound />} label="Sign In" active />
            <HeaderAction icon={<HeartIcon />} label="Wishlist" />
            <HeaderAction icon={<ShoppingCart />} label="Cart" badge="0" />
            <HeaderAction icon={<Menu />} label="More" />
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 lg:hidden">
          <Link href="/"><img className="w-28" src="https://backoffice.ghorerbazar.com/company_logo/qJaKf1768887846.png" alt="Ghorer Bazar" /></Link>
          <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-brand-orange">{isRegister ? "Sign In" : "Register"}</Link>
        </div>
      </header>

      <nav className="hidden bg-[#052925] text-white lg:block">
        <div className="mx-auto flex h-[99px] max-w-[1760px] items-center justify-between px-16 text-[22px] font-medium">
          {navItems.map((item) => <Link key={item} href="/" className="leading-tight hover:text-brand-orange">{item}</Link>)}
        </div>
      </nav>

      <section className="mx-auto max-w-[1300px] px-5 pb-20 pt-24 lg:pt-28">
        <div className="rounded-[28px] bg-white px-8 py-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)] lg:px-14 lg:py-16">
          <div className="mb-14 flex justify-center">
            <div className="grid grid-cols-[104px_1fr] items-center gap-6">
              <span className="grid h-[104px] w-[104px] place-items-center rounded-[22px] bg-brand-orange text-white">
                <UserKeyIcon />
              </span>
              <div>
                <h1 className="text-[36px] font-extrabold leading-none lg:text-[38px]">{isRegister ? "Signup" : "Signin"}</h1>
                <p className="mt-3 text-xl">{isRegister ? "Create your account securely" : "Access your account securely"}</p>
              </div>
            </div>
          </div>

          <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_120px_1fr]">
            <AuthPanel title="Login With Mobile Number">
              <InputShell icon={<Smartphone className="h-6 w-6" />} placeholder="01*********" />
              <button type="button" onClick={() => setMessage("Mobile OTP login Firebase paid/SMS provider chara active kora hoyni.")} className="h-[72px] rounded-[10px] bg-brand-orange text-xl font-semibold text-white">Send OTP</button>
            </AuthPanel>

            <div className="relative hidden place-items-center lg:grid">
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#e5e8eb]" />
              <span className="relative grid h-[82px] w-[82px] place-items-center rounded-full border-4 border-[#e5e8eb] bg-white px-6 py-7 text-xl font-semibold text-[#6b7280]">OR</span>
            </div>

            <AuthPanel title={isRegister ? "Signup With Credentials" : "Login With Credentials"}>
              {isRegister ? <InputShell icon={<UserRound className="h-6 w-6" />} placeholder="Full name" /> : null}
              <InputShell icon={<UserRound className="h-6 w-6" />} placeholder="Email or phone number" />
              <InputShell icon={<Lock className="h-6 w-6" />} placeholder="Password" rightIcon={<Eye className="h-6 w-6" />} type="password" />
              {isRegister ? <InputShell icon={<Lock className="h-6 w-6" />} placeholder="Confirm password" type="password" /> : null}
              {!isRegister ? (
                <div className="flex items-center justify-between text-lg text-[#6b7280]">
                  <label className="flex items-center gap-3"><input type="checkbox" className="h-6 w-6 rounded border-[#a3a3a3]" /> Remember me</label>
                  <button type="button" className="text-brand-orange underline">Forgotten password?</button>
                </div>
              ) : null}
              <button type="button" onClick={() => setMessage("Credential login backend connect korle active hobe. Google login button use korte paren.")} className="h-[72px] rounded-[10px] bg-brand-orange text-xl font-semibold text-white">
                {isRegister ? "Signup" : "Login"}
              </button>
            </AuthPanel>
          </div>

          <div className="mx-auto mt-16 max-w-[590px]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 text-xl">
              <span className="h-px bg-[#e0e0e0]" />
              <span>{isRegister ? "or signup with" : "or signin with"}</span>
              <span className="h-px bg-[#e0e0e0]" />
            </div>
            <button type="button" onClick={googleLogin} className="mx-auto mt-9 grid h-[82px] w-[82px] place-items-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]" aria-label="Continue with Google">
              <GoogleIcon />
            </button>
            {message ? <p className="mt-6 rounded bg-[#fff2e7] p-4 text-center font-semibold text-brand-ink">{message}</p> : null}
            <p className="mt-7 text-center text-xl">
              {isRegister ? "Already have an account?" : "Don't have any account?"}{" "}
              <Link href={isRegister ? "/login" : "/register"} className="font-medium text-brand-orange underline">
                {isRegister ? "Signin account" : "Register account"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeaderAction({ icon, label, badge, active }: { icon: ReactNode; label: string; badge?: string; active?: boolean }) {
  return <span className={`relative grid justify-items-center text-xl ${active ? "text-brand-orange" : ""}`}><span className="[&>svg]:h-9 [&>svg]:w-9">{icon}</span>{badge ? <span className="absolute right-1 top-0 grid h-6 w-6 place-items-center rounded-full bg-brand-orange text-xs text-white">{badge}</span> : null}<span>{label}</span></span>;
}

function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="grid gap-6 rounded-[22px] bg-[#f3f3f3] p-8 lg:min-h-[360px] lg:p-12"><h2 className="text-2xl font-semibold">{title}</h2>{children}</section>;
}

function InputShell({ icon, placeholder, rightIcon, type = "text" }: { icon: ReactNode; placeholder: string; rightIcon?: ReactNode; type?: string }) {
  return <label className="grid h-[78px] grid-cols-[34px_1fr_auto] items-center gap-5 rounded-[10px] bg-white px-6 text-brand-orange shadow-[0_4px_12px_rgba(0,0,0,0.10)]">{icon}<input type={type} className="min-w-0 bg-transparent text-xl text-brand-ink outline-none placeholder:text-[#b8c0ca]" placeholder={placeholder} />{rightIcon ? <span className="text-[#9ca3af]">{rightIcon}</span> : null}</label>;
}

function GoogleIcon() {
  return <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4 5.5l6.2 5.2C37.1 39 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>;
}

function UserKeyIcon() {
  return <svg width="58" height="58" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="24" cy="18" r="11" /><path d="M8 52c1.5-13 8.8-20 20-20 4.4 0 8.1 1.1 11 3.2" /><circle cx="45" cy="41" r="7" /><path d="m50 46 8 8M56 52l-4 4M52 48l-3 3" /></svg>;
}

function MapIcon() {
  return <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l12-5 14 5 12-5v29l-12 5-14-5-12 5z" /><path d="M17 7v29M31 12v29" /><path d="M24 25s7-6.2 7-13a7 7 0 0 0-14 0c0 6.8 7 13 7 13z" /><circle cx="24" cy="12" r="2" /></svg>;
}

function HeartIcon() {
  return <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2"><path d="M24 40S8 30 8 17a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 13-16 23-16 23z" /></svg>;
}
