"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { Eye, Lock, Mail, Menu, ShoppingCart, Smartphone, UserRound } from "lucide-react";

type AuthMode = "login" | "register";

const navItems = ["Combos", "Offer Zone", "Mango", "Honey", "Oil & Ghee", "Dates", "Spices", "Nuts & Seeds", "Beverage", "Rice", "Flours & Lentils", "Certified", "Pickle", "Tabaya"];

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function getFirebaseAuth() {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
      throw new Error("Firebase env vars Vercel-e set korte hobe.");
    }

    const [{ initializeApp, getApps }, { getAuth }] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
    ]);
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    return getAuth(app);
  }

  async function googleLogin() {
    setMessage("");
    setLoading(true);
    try {
      const auth = await getFirebaseAuth();
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      setMessage(`Google login successful: ${result.user.email ?? result.user.displayName ?? "account connected"}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Google login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function credentialAuth() {
    setMessage("");

    if (!email.includes("@")) {
      setMessage("Please valid Gmail/email address din.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password minimum 6 character hote hobe.");
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setMessage("Password and confirm password match korche na.");
      return;
    }

    setLoading(true);
    try {
      const auth = await getFirebaseAuth();
      const { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } = await import("firebase/auth");

      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) await updateProfile(result.user, { displayName: name.trim() });
        await sendEmailVerification(result.user);
        setMessage("Registration successful. Apnar Gmail inbox-e verification email pathano hoyeche. Email verify kore login korun.");
        return;
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user);
        await signOut(auth);
        setMessage("Email ekhono verified na. Verification email abar pathano hoyeche, Gmail inbox/spam check korun.");
        return;
      }

      setMessage(`Login successful: ${result.user.email ?? "account verified"}`);
    } catch (error) {
      setMessage(formatFirebaseError(error));
    } finally {
      setLoading(false);
    }
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

      <section className="mx-auto max-w-[1300px] px-5 pb-20 pt-[120px] max-lg:pt-16">
        <div className="rounded-[20px] bg-white p-10 shadow-[0_20px_40px_rgba(0,0,0,0.10)] max-md:p-6">
          <div className="mb-10 flex justify-center">
            <div className="grid grid-cols-[68px_1fr] items-center gap-4 max-md:grid-cols-[60px_1fr]">
              <span className="grid h-[68px] w-[68px] place-items-center rounded-[16px] bg-brand-orange text-white max-md:h-[60px] max-md:w-[60px]">
                <UserKeyIcon />
              </span>
              <div>
                <h1 className="text-[24px] font-bold leading-[1.2] max-md:text-[18px]">{isRegister ? "Signup" : "Signin"}</h1>
                <p className="mt-1.5 text-[15px] leading-[1.2] text-brand-ink">{isRegister ? "Create your account securely" : "Access your account securely"}</p>
              </div>
            </div>
          </div>

          <div className="mb-10 grid items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr]">
            <AuthPanel title="Login With Mobile Number">
              <InputShell icon={<Smartphone className="h-[18px] w-[18px]" />} placeholder="01*********" />
              <button type="button" onClick={() => setMessage("Mobile OTP login Firebase paid/SMS provider chara active kora hoyni.")} className="h-12 rounded-[8px] bg-brand-orange text-[14px] font-medium text-white max-md:h-10">Send OTP</button>
            </AuthPanel>

            <div className="relative grid min-h-[300px] place-items-center max-lg:min-h-14">
              <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e1e5e9] to-transparent max-lg:inset-x-0 max-lg:inset-y-auto max-lg:top-1/2 max-lg:h-0.5 max-lg:w-full max-lg:-translate-y-1/2" />
              <span className="relative grid h-14 w-14 place-items-center rounded-full border-2 border-[#e1e5e9] bg-white text-[14px] font-medium text-[#666]">OR</span>
            </div>

            <AuthPanel title={isRegister ? "Signup With Credentials" : "Login With Credentials"}>
              {isRegister ? <InputShell icon={<UserRound className="h-[18px] w-[18px]" />} placeholder="Full name" value={name} onChange={setName} /> : null}
              <InputShell icon={<Mail className="h-[18px] w-[18px]" />} placeholder={isRegister ? "Gmail or email address" : "Email or phone number"} value={email} onChange={setEmail} type="email" />
              <InputShell icon={<Lock className="h-[18px] w-[18px]" />} placeholder="Password" rightIcon={<Eye className="h-[18px] w-[18px]" />} value={password} onChange={setPassword} type="password" />
              {isRegister ? <InputShell icon={<Lock className="h-[18px] w-[18px]" />} placeholder="Confirm password" value={confirmPassword} onChange={setConfirmPassword} type="password" /> : null}
              {!isRegister ? (
                <div className="flex items-center justify-between gap-4 text-[15px] text-[#666]">
                  <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 rounded border-[#a3a3a3]" /> Remember me</label>
                  <button type="button" className="text-brand-orange underline">Forgotten password?</button>
                </div>
              ) : null}
              <button type="button" onClick={credentialAuth} disabled={loading} className="h-12 rounded-[8px] bg-brand-orange text-[14px] font-medium text-white disabled:bg-[#9ca3af] max-md:h-10">
                {loading ? "Please wait..." : isRegister ? "Signup" : "Login"}
              </button>
            </AuthPanel>
          </div>

          <div className="mx-auto max-w-[390px]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 text-[14px]">
              <span className="h-px bg-[#e0e0e0]" />
              <span>{isRegister ? "or signup with" : "or signin with"}</span>
              <span className="h-px bg-[#e0e0e0]" />
            </div>
            <button type="button" onClick={googleLogin} disabled={loading} className="mx-auto mt-9 grid h-14 w-14 place-items-center rounded-full bg-white shadow-[0_2px_2px_rgba(32,38,46,0.08)] disabled:opacity-60" aria-label="Continue with Google">
              <GoogleIcon />
            </button>
            {message ? <p className="mt-6 rounded bg-[#fff2e7] p-4 text-center font-semibold text-brand-ink">{message}</p> : null}
            <p className="mt-7 text-center text-[16px]">
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
  return <section className="grid gap-4 rounded-[15px] bg-[#f5f5f5] p-[30px] max-md:p-6"><h2 className="mb-0 text-[16px] font-semibold">{title}</h2>{children}</section>;
}

function InputShell({
  icon,
  placeholder,
  rightIcon,
  type = "text",
  value,
  onChange,
}: {
  icon: ReactNode;
  placeholder: string;
  rightIcon?: ReactNode;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="grid h-[52px] grid-cols-[24px_1fr_auto] items-center gap-[5px] rounded-[8px] bg-white px-[15px] text-brand-orange shadow-[0_2px_2px_rgba(32,38,46,0.08)] max-md:h-10">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="min-w-0 bg-transparent text-[15px] text-brand-ink outline-none placeholder:text-[#bdc3c7]"
        placeholder={placeholder}
      />
      {rightIcon ? <span className="text-[#9ca3af]">{rightIcon}</span> : null}
    </label>
  );
}

function formatFirebaseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("auth/email-already-in-use")) return "Ei email diye already account ache. Login korun.";
  if (message.includes("auth/invalid-credential")) return "Email or password vul.";
  if (message.includes("auth/user-not-found")) return "Ei email diye kono account nei.";
  if (message.includes("auth/wrong-password")) return "Password vul.";
  if (message.includes("auth/too-many-requests")) return "Too many attempts. Kichu khon pore try korun.";
  if (message.includes("auth/popup-closed-by-user")) return "Google popup close korechen.";
  if (message.includes("auth/unauthorized-domain")) return "Firebase authorized domains-e ei domain add korte hobe.";

  return message || "Authentication failed.";
}

function GoogleIcon() {
  return <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4 5.5l6.2 5.2C37.1 39 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>;
}

function UserKeyIcon() {
  return <svg width="32" height="32" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="24" cy="18" r="11" /><path d="M8 52c1.5-13 8.8-20 20-20 4.4 0 8.1 1.1 11 3.2" /><circle cx="45" cy="41" r="7" /><path d="m50 46 8 8M56 52l-4 4M52 48l-3 3" /></svg>;
}

function MapIcon() {
  return <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l12-5 14 5 12-5v29l-12 5-14-5-12 5z" /><path d="M17 7v29M31 12v29" /><path d="M24 25s7-6.2 7-13a7 7 0 0 0-14 0c0 6.8 7 13 7 13z" /><circle cx="24" cy="12" r="2" /></svg>;
}

function HeartIcon() {
  return <svg width="38" height="38" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2"><path d="M24 40S8 30 8 17a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 13-16 23-16 23z" /></svg>;
}
