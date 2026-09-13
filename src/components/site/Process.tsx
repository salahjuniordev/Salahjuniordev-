import { useLanguage } from "@/lib/language";

const steps = [
  {
    icon: "fa-comments",
    en: "Discovery",
    fr: "Découverte",
    dEn: "A clarity call to understand your goal, users and definition of success.",
    dFr: "Un appel pour comprendre votre objectif, vos utilisateurs et vos critères de réussite.",
  },
  {
    icon: "fa-file-signature",
    en: "Proposal",
    fr: "Proposition",
    dEn: "A clear scope, timeline and fixed quote — no surprises, no scope creep.",
    dFr: "Un périmètre clair, un délai et un devis fixe — sans surprises.",
  },
  {
    icon: "fa-code",
    en: "Build",
    fr: "Construction",
    dEn: "Weekly demos with milestone check-ins so you see progress as it happens.",
    dFr: "Des démos hebdomadaires avec points d'étape pour suivre l'avancement.",
  },
  {
    icon: "fa-rocket",
    en: "Launch",
    fr: "Lancement",
    dEn: "Deployment, handoff of all files, and post-launch support included.",
    dFr: "Déploiement, remise de tous les fichiers et support après lancement inclus.",
  },
];

export function Process() {
  const { t, lang } = useLanguage();
  return (
    <section id="process" className="section-padding bg-[#05090f]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <p className="eyebrow">{t("Process", "Processus")}</p>
          <h2>{t("How We'll Work Together", "Comment Nous Allons Travailler")}</h2>
          <div className="underline" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.en} className="process-step">
              <div className="process-step-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="process-step-icon">
                <i className={`fa-solid ${s.icon}`} />
              </div>
              <h3 className="process-step-title">{t(s.en, s.fr)}</h3>
              <p className="process-step-desc">{lang === "fr" ? s.dFr : s.dEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
