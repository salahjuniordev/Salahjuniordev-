import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Subscriber = { id: string; email: string; source: string | null; created_at: string };

export const Route = createFileRoute("/admin/subscribers")({ component: SubscribersAdmin });

function SubscribersAdmin() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await (supabase.from("newsletter_subscribers" as any) as any)
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setRows((data as Subscriber[]) ?? []);
      } catch (e: any) {
        toast.error(e.message ?? "Failed to load subscribers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const remove = async (id: string) => {
    if (!window.confirm("Remove this subscriber?")) return;
    const { error } = await (supabase.from("newsletter_subscribers" as any) as any)
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Removed");
  };

  const filtered = rows.filter((r) => r.email.toLowerCase().includes(q.toLowerCase()));
  const csv = "email,source,subscribed_at\n" + rows.map((r) => `${r.email},${r.source ?? ""},${r.created_at}`).join("\n");

  return (
    <AdminShell
      title="Newsletter Subscribers"
      subtitle={`${rows.length} subscriber${rows.length === 1 ? "" : "s"}`}
      actions={
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
          download="subscribers.csv"
          className="btn-brand !py-2 !px-4 text-sm"
        >
          <i className="fa-solid fa-file-csv" /> Export CSV
        </a>
      }
    >
      <input
        className="w-full max-w-sm mb-4 bg-[#07101f] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[var(--brand)]"
        placeholder="Search emails…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading ? (
        <div className="text-slate-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#07101f] p-10 text-center text-slate-400">
          <i className="fa-regular fa-envelope-open text-3xl mb-3 text-slate-600" />
          <p>No subscribers yet. Signups from the landing page will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#07101f] border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-400">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-white">{r.email}</td>
                  <td className="px-4 py-3 text-slate-400">{r.source ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(r.id)} className="text-slate-500 hover:text-red-400">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
