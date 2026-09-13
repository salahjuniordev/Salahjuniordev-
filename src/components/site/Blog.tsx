import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { optimizedImage } from "@/lib/img";

export function Blog({ initial }: { initial?: Tables<"blog_posts">[] }) {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Tables<"blog_posts">[]>(initial ?? []);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(6)
      .then(({ data }) => setPosts(data ?? []));
  }, [initial]);

  const tags = Array.from(new Set(posts.map((p) => p.tag).filter((x): x is string => !!x)));
  const normalized = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const visible = posts.filter((p) => {
    if (tag && p.tag !== tag) return false;
    if (!query.trim()) return true;
    const q = normalized(query.trim());
    return normalized(`${p.title} ${p.excerpt ?? ""} ${p.tag ?? ""}`).includes(q);
  });

  return (
    <section id="blog" className="section-padding bg-[#07101f]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <p className="eyebrow">{t("Blog", "Blog")}</p>
          <h2>{t("Latest Articles", "Derniers Articles")}</h2>
          <div className="underline" />
          <p>{t("Thoughts on dev, design, and building products in Africa", "Réflexions sur le dev, le design et la construction de produits en Afrique")}</p>
        </div>

        {/* Search + tag filter */}
        {posts.length > 0 && (
          <div className="blog-filter mb-10">
            <div className="blog-filter-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Search articles…", "Rechercher des articles…")}
                aria-label={t("Search articles", "Rechercher des articles")}
              />
            </div>
            {tags.length > 0 && (
              <div className="blog-filter-tags">
                <button className={`blog-tag ${tag === null ? "on" : ""}`} onClick={() => setTag(null)}>
                  {t("All", "Tous")}
                </button>
                {tags.map((x) => (
                  <button key={x} className={`blog-tag ${tag === x ? "on" : ""}`} onClick={() => setTag(tag === x ? null : x)}>
                    {x}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.length === 0 ? (
            <div className="col-span-full py-14 text-center text-slate-400">
              <i className="fa-solid fa-magnifying-glass text-3xl mb-4 text-slate-600" />
              <p>{t("No articles match your search.", "Aucun article ne correspond à votre recherche.")}</p>
            </div>
          ) : (
            visible.map((p) => {
              const date = p.published_at
              ? new Date(p.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : "";
              return (
                <article key={p.id} className="card-dark !p-0 overflow-hidden flex flex-col">
                {p.cover_image_url && (
                  <img
                    src={optimizedImage(p.cover_image_url, 640)}
                    alt={p.title}
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-video object-cover"
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block text-xs text-[--brand] uppercase tracking-wider mb-3">{p.tag}</span>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">{p.title}</h3>
                  <p className="text-sm text-slate-400 mb-5 flex-1">{p.excerpt}</p>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mb-4">
                    {date && <span><i className="fa-regular fa-calendar mr-1" />{date}</span>}
                    <span><i className="fa-regular fa-clock mr-1" />{p.read_time}</span>
                  </div>
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="btn-brand !py-2.5 !px-5 text-sm self-start">
                    {t("Read Article", "Lire l'Article")} <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
