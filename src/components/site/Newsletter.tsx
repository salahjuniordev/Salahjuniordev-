import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";

export function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("busy");
    setErrorMsg("");
    const { error } = await (supabase.from("newsletter_subscribers" as any) as any)
      .insert({ email: email.trim().toLowerCase(), source: "landing" });
    if (error) {
      // Unique violation = already subscribed — treat as success.
      if ((error as any).code === "23505") {
        setStatus("done");
        setEmail("");
        return;
      }
      setErrorMsg(error.message || "Something went wrong");
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  };

  return (
    <section className="newsletter-section">
      <div className="container-sj newsletter-inner">
        <div>
          <h2 className="newsletter-title">{t("Stay in the loop", "Restez informé")}</h2>
          <p className="newsletter-sub">
            {t(
              "Get new articles, ebooks and project breakdowns in your inbox. No spam — unsubscribe anytime.",
              "Recevez mes nouveaux articles, ebooks et études de cas par email. Pas de spam — désinscription à tout moment.",
            )}
          </p>
        </div>
        {status === "done" ? (
          <div className="newsletter-success">
            <i className="fa-solid fa-circle-check" />
            {t("You're in! Check your inbox soon.", "C'est fait ! À très vite dans votre boîte mail.")}
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={submit}>
            <input
              type="email"
              required
              placeholder={t("your@email.com", "votre@email.com")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              aria-label={t("Email address", "Adresse email")}
            />
            <button type="submit" disabled={status === "busy"} className="newsletter-btn">
              <i className={`fa-solid ${status === "busy" ? "fa-spinner fa-spin" : "fa-paper-plane"}`} />
              {t("Subscribe", "S'abonner")}
            </button>
          </form>
        )}
      </div>
      {status === "error" && <p className="newsletter-error">{errorMsg}</p>}
    </section>
  );
}
