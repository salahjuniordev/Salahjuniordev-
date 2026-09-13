import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { optimizedImage } from "@/lib/img";

export function Portfolio({ initial }: { initial?: Tables<"projects">[] }) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Tables<"projects">[]>(initial ?? []);

  useEffect(() => {
    if (initial) return;
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setProjects(data ?? []));
  }, [initial]);

  return (
    <section id="portfolio" className="projects-section">
      <div className="container-sj">
        <div className="services-head">
          <h2 className="services-title">{t("My Projects", "Mes Projets")}</h2>
          <div className="services-underline">
            <span />
            <i className="dot" />
            <i className="dot" />
            <span />
          </div>
          <p className="projects-sub">
            {t("A selection of work I'm proud of", "Une sélection de travaux dont je suis fier")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((raw) => {
            const p = raw as Tables<"projects"> & { case_study?: string | null };
            // Projects with case-study content get an internal detail page;
            // others keep their external link.
            const inner = (
              <>
                <div className="proj-card-media">
                  {p.image_url && (
                    <img
                      src={optimizedImage(p.image_url, 640)}
                      alt={p.title}
                      width={640}
                      height={400}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <div className="proj-card-body">
                  <span className="proj-card-pill">{p.category}</span>
                  <h3 className="proj-card-title">{p.title}</h3>
                  {p.case_study && (
                    <span className="proj-card-cta">
                      {t("Read Case Study", "Lire l'Étude de Cas")}
                      <i className="fa-solid fa-arrow-right" />
                    </span>
                  )}
                </div>
              </>
            );
            const shared = { className: "proj-card" } as const;
            return p.case_study && p.slug ? (
              <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} {...shared}>
                {inner}
              </Link>
            ) : (
              <a key={p.id} href={p.link_url ?? "#"} target="_blank" rel="noreferrer" {...shared}>
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
