import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { useCrud } from "@/lib/use-crud";

type HeroImageRow = {
  id: string;
  url: string;
  device: "desktop" | "mobile" | "both";
  order_index: number;
  published: boolean;
};
type Row = HeroImageRow;
const empty: Partial<Row> = { url: "", device: "both", order_index: 0, published: true };

export const Route = createFileRoute("/admin/hero-images")({ component: HeroImagesAdmin });

function HeroImagesAdmin() {
  const { rows, save, remove } = useCrud<Row>("hero_images" as any, "order_index", true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [busy, setBusy] = useState(false);

  const desktop = rows.filter((r) => r.device !== "mobile").length;
  const mobile = rows.filter((r) => r.device !== "desktop").length;

  return (
    <AdminShell
      title="Hero Images"
      subtitle="Rotating hero portraits — these auto-rotate on the homepage, no code changes needed"
      actions={
        <button
          onClick={() => setEditing({ ...empty, order_index: rows.length + 1 })}
          className="btn-brand !py-2 !px-4 text-sm"
        >
          <i className="fa-solid fa-plus" /> New Hero Image
        </button>
      }
    >
      <div className="flex gap-3 mb-4 text-xs">
        <span className="px-3 py-1.5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/25">
          <i className="fa-solid fa-desktop mr-1.5" /> {desktop} on desktop
        </span>
        <span className="px-3 py-1.5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/25">
          <i className="fa-solid fa-mobile-screen mr-1.5" /> {mobile} on mobile
        </span>
      </div>

      <CrudTable
        rows={rows}
        columns={[
          {
            key: "url",
            label: "Preview",
            render: (r) => (
              <img
                src={r.url}
                alt=""
                className="h-12 w-16 rounded-lg object-cover border border-white/10 bg-black/40"
              />
            ),
          },
          {
            key: "device",
            label: "Shows on",
            render: (r) => (
              <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300 capitalize">{r.device}</span>
            ),
          },
          { key: "order_index", label: "Order" },
          {
            key: "published",
            label: "Status",
            render: (r) => (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  r.published ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"
                }`}
              >
                {r.published ? "Live" : "Hidden"}
              </span>
            ),
          },
        ]}
        onEdit={setEditing}
        onDelete={(r) => remove(r.id)}
      />

      <FormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Hero Image" : "New Hero Image"}
        busy={busy}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editing) return;
          setBusy(true);
          const ok = await save(editing);
          setBusy(false);
          if (ok) setEditing(null);
        }}
      >
        {editing && (
          <>
            <Field label="Image" hint="Portrait works best — transparent PNG/WebP recommended">
              <MediaUpload
                value={editing.url}
                onChange={(url) => setEditing({ ...editing, url })}
                accept="image/*"
                label="Upload image"
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4 items-end">
              <Field label="Shows on">
                <select
                  className={inputCls}
                  value={editing.device ?? "both"}
                  onChange={(e) => setEditing({ ...editing, device: e.target.value as Row["device"] })}
                >
                  <option value="both">Desktop + Mobile</option>
                  <option value="desktop">Desktop only</option>
                  <option value="mobile">Mobile only</option>
                </select>
              </Field>
              <Field label="Order">
                <input
                  type="number"
                  className={inputCls}
                  value={editing.order_index ?? 0}
                  onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
                />
              </Field>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={!!editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="accent-[var(--brand)]"
              />
              Live (rotates on the site)
            </label>
          </>
        )}
      </FormModal>
    </AdminShell>
  );
}
