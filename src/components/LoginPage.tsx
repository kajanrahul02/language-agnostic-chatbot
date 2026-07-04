import React, { useState } from "react";
import { Globe, Sparkles, LogIn, UserPlus, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously 
} from "../lib/firebase";

interface LoginPageProps {
  darkMode: boolean;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ darkMode, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "Authentication failed. Please try again.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "Email is already registered. Try logging in.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setError("Google sign-in failed. If in preview, try opening in a new tab or use Guest Access.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      onLoginSuccess();
    } catch (err: any) {
      console.error("Guest Auth error:", err);
      setError("Guest sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 select-none">
      {/* Dynamic Frosted Background Mesh */}
      <div className={darkMode ? "mesh-bg" : "light-mesh-bg"}></div>

      {/* Main Frosted Glass Login Card */}
      <div className="glass-card w-full max-w-md p-6 sm:p-8 relative z-10 text-slate-100 flex flex-col items-center shadow-2xl border border-white/20 animate-fade-in">
        
        {/* Brand Header */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-4">
          <Globe className="w-10 h-10 animate-spin-slow" />
        </div>
        
        <h1 className="font-bold text-2xl sm:text-3xl tracking-tight text-white dark:text-white light-mode:text-slate-900 text-center">
          Polyglot AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 light-mode:text-slate-600 text-center mt-1 mb-6 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          Universal Instant AI Translation & Chat
        </p>

        {/* Error Notice */}
        {error && (
          <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 dark:text-rose-300 light-mode:text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-3 transition-all active:scale-98 shadow-lg mb-4 disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
          </svg>
          Continue with Google
        </button>

        <div className="w-full flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/15"></div>
          <span className="text-[11px] font-mono uppercase text-slate-400 light-mode:text-slate-500">or email</span>
          <div className="flex-1 h-px bg-white/15"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-3 mb-4">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 light-mode:bg-white border border-white/15 light-mode:border-slate-300 rounded-xl py-3 pl-10 pr-4 text-sm text-white light-mode:text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white/10 light-mode:bg-white border border-white/15 light-mode:border-slate-300 rounded-xl py-3 pl-10 pr-4 text-sm text-white light-mode:text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 font-semibold py-3 px-4 rounded-xl text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" /> Create Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-xs text-slate-300 light-mode:text-slate-600 mb-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="font-bold text-indigo-400 hover:underline ml-1 cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>

        {/* Guest Instant Access */}
        <div className="w-full pt-4 border-t border-white/15 text-center">
          <button
            type="button"
            onClick={handleGuestSignIn}
            disabled={loading}
            className="text-xs text-slate-300 light-mode:text-slate-600 hover:text-white font-medium flex items-center justify-center gap-1.5 mx-auto transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <span>Continue as Guest (No account required)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
