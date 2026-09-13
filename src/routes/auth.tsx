import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: () => (
    <LanguageProvider>
      <AuthPage />
    </LanguageProvider>
  ),
});

function AuthPage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) nav({ to: "/admin" });
  }, [loading, session, isAdmin, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success(t("Account created. You can sign in now.", "Compte créé. Vous pouvez vous connecter."));
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("Welcome back", "Bon retour"));
        nav({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message ?? t("Something went wrong", "Une erreur est survenue"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--ink)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 20% 20%, rgba(155,250,6,0.12), transparent 60%), radial-gradient(500px circle at 80% 80%, rgba(155,250,6,0.08), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
          <i className="fa-solid fa-arrow-left" /> {t("Back to site", "Retour au site")}
        </Link>
        <div className="card-dark !p-8 backdrop-blur-xl border-white/10">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand)] text-[var(--ink)] text-xl font-bold shadow-[0_10px_40px_rgba(155,250,6,0.35)] mb-4">
              SJ
            </div>
            <h1 className="text-2xl font-bold text-white">
              {mode === "login" ? t("Admin Sign In", "Connexion Admin") : t("Create Admin Account", "Créer un Compte Admin")}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {mode === "login"
                ? t("Access your dashboard", "Accédez à votre tableau de bord")
                : t("Use your registered admin email", "Utilisez votre email admin enregistré")}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="form-field-wrap">
              <i className="field-icon fa-regular fa-envelope" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-field"
                autoComplete="email"
              />
            </div>
            <div className="form-field-wrap">
              <i className="field-icon fa-solid fa-lock" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-field"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-brand w-full justify-center !py-3 disabled:opacity-60"
            >
              {busy ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : mode === "login" ? (
                <>{t("Sign In", "Se Connecter")} <i className="fa-solid fa-arrow-right" /></>
              ) : (
                <>{t("Create Account", "Créer un Compte")} <i className="fa-solid fa-user-plus" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {mode === "login" ? (
              <>
                {t("No account?", "Pas de compte ?")}{" "}
                <button onClick={() => setMode("signup")} className="text-[var(--brand)] hover:underline">
                  {t("Sign up", "S'inscrire")}
                </button>
              </>
            ) : (
              <>
                {t("Already have an account?", "Vous avez déjà un compte ?")}{" "}
                <button onClick={() => setMode("login")} className="text-[var(--brand)] hover:underline">
                  {t("Sign in", "Se connecter")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
