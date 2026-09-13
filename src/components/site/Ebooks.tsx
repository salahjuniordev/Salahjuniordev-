import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";

type Ebook = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  cover_url: string | null;
  buy_url: string;
  badge: string | null;
  order_index: number;
  published: boolean;
};

export function Ebooks() {
  const { t } = useLanguage();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await (supabase.from("ebooks" as any) as any)
          .select("*")
          .eq("published", true)
          .order("order_index", { ascending: true });
        setEbooks((data as Ebook[]) ?? []);
      } catch {
        /* table may not exist yet — section stays hidden */
      }
    })();
  }, []);

  // Hide the section entirely until the admin has published at least one ebook.
  if (ebooks.length === 0) return null;

  return (
    <section id="ebooks" className="section-padding bg-[#07101f]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <p className="eyebrow">{t("Resources", "Ressources")}</p>
          <h2>{t("Ebooks & Guides", "Ebooks & Guides")}</h2>
          <div className="underline" />
          <p>
            {t(
              "Practical guides and resources I've written to help you build faster.",
              "Des guides pratiques que j'ai écrits pour vous aider à construire plus vite.",
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks.map((b) => (
            <article key={b.id} className="ebook-card">
              <div className="ebook-cover">
                {b.cover_url ? (
                  <img src={b.cover_url} alt={b.title} loading="lazy" decoding="async" />
                ) : (
                  <div className="ebook-cover-fallback">
                    <i className="fa-solid fa-book-open" />
                  </div>
                )}
                {b.badge && <span className="ebook-badge">{b.badge}</span>}
              </div>
              <div className="ebook-body">
                <h3 className="ebook-title">{b.title}</h3>
                {b.description && <p className="ebook-desc">{b.description}</p>}
                <div className="ebook-foot">
                  {b.price && (
                    <span className="ebook-price">
                      {b.currency === "USD" ? "$" : ""}
                      {b.price}
                      {b.currency && b.currency !== "USD" ? ` ${b.currency}` : ""}
                    </span>
                  )}
                  <a
                    href={b.buy_url}
                    target="_blank"
                    rel="noreferrer"
                    className="ebook-buy-btn"
                  >
                    <i className="fa-solid fa-bolt" />
                    {t("Buy Now", "Acheter")}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
