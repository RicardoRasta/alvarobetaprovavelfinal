import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Mountain, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/api";
import { formatPhone, phoneHref } from "@/data/trips";
import { enrollmentGroups, RISK_TERMS } from "@/lib/enrollment-fields";

export const Route = createFileRoute("/ficha/$token")({
  head: () => ({
    meta: [
      { title: "Ficha de inscrição — A Casa de Aventura" },
      {
        name: "description",
        content: "Preencha sua ficha de inscrição para a viagem contratada com a A Casa de Aventura.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Ficha de inscrição — A Casa de Aventura" },
      { property: "og:description", content: "Formulário de inscrição do participante." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnrollmentForm,
});

const field =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const area =
  "min-h-24 w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

function EnrollmentForm() {
  const { token } = Route.useParams();
  const { data: settings } = useQuery(settingsQuery);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [accepted, setAccepted] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const { data: link, isLoading } = useQuery({
    queryKey: ["enrollment_link", token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollment_links")
        .select("*")
        .eq("token", token)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const set = (k: string, v: string | boolean) => setValues((p) => ({ ...p, [k]: v }));

  /** Busca o endereço no ViaCEP quando o CEP tem 8 dígitos. */
  const lookupCep = async (raw: string) => {
    const cep = raw.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) {
        toast.error("CEP não encontrado.");
        return;
      }
      setValues((p) => ({
        ...p,
        street: data.logradouro || String(p.street ?? ""),
        district: data.bairro || String(p.district ?? ""),
        city: data.localidade || String(p.city ?? ""),
        state: data.uf || String(p.state ?? ""),
        country: String(p.country ?? "") || "Brasil",
      }));
    } catch {
      toast.error("Não foi possível consultar o CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const submit = async () => {
    if (!link) return;
    if (!String(values.full_name ?? "").trim()) return toast.error("Informe seu nome completo.");
    if (!accepted) return toast.error("É necessário aceitar o termo de ciência de riscos.");
    setSending(true);
    const payload: Record<string, unknown> = {
      link_id: link.id,
      trip_id: link.trip_id,
      trip_name: link.trip_name,
      risk_terms_accepted: true,
    };
    for (const g of enrollmentGroups) {
      for (const f of g.fields) {
        const v = values[f.key];
        if (f.kind === "bool") payload[f.key] = Boolean(v);
        else if (f.kind === "date") payload[f.key] = v ? String(v) : null;
        else payload[f.key] = String(v ?? "");
      }
    }
    const { error } = await supabase.from("enrollments").insert(payload as never);
    setSending(false);
    if (error) return toast.error(error.message);
    setDone(true);
  };

  if (isLoading) {
    return <div className="p-16 text-center text-muted-foreground">Carregando ficha...</div>;
  }

  if (!link) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold uppercase">Link inválido</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta ficha de inscrição não existe ou foi desativada. Fale com a equipe da A Casa de Aventura.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h1 className="mt-4 text-2xl font-bold uppercase">Ficha enviada!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Recebemos sua inscrição para <strong>{link.trip_name}</strong>. Em breve entraremos em contato.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-up px-4 py-10 md:px-6">
      <header className="card-surface flex flex-wrap items-center gap-4 p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Mountain className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold uppercase">A Casa de Aventura</p>
          <a href={phoneHref(settings)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
            <Phone className="h-3.5 w-3.5" /> {formatPhone(settings)}
            {settings?.contact_email ? ` · ${settings.contact_email}` : ""}
          </a>
        </div>
      </header>

      <h1 className="mt-6 text-2xl font-bold uppercase md:text-3xl">Ficha de inscrição</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Evento: <strong className="text-foreground">{link.trip_name}</strong>
      </p>

      <div className="mt-6 space-y-6">
        {enrollmentGroups.map((g) => (
          <section key={g.title} className="card-surface p-5">
            <h2 className="mb-4 text-sm font-bold uppercase text-accent">{g.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.fields.map((f) => (
                <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
                  {f.kind === "bool" ? (
                    <div className="flex flex-wrap items-center gap-4 rounded-md border border-input bg-card px-3 py-2.5">
                      <span className="text-sm">{f.label}</span>
                      <div className="ml-auto flex gap-3 text-sm">
                        {[true, false].map((opt) => (
                          <label key={String(opt)} className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name={f.key}
                              checked={Boolean(values[f.key]) === opt}
                              onChange={() => set(f.key, opt)}
                            />
                            {opt ? "Sim" : "Não"}
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <label>
                      <span className={labelCls}>
                        {f.label}
                        {f.required && " *"}
                      </span>
                      {f.kind === "textarea" ? (
                        <textarea
                          className={area}
                          value={String(values[f.key] ?? "")}
                          onChange={(e) => set(f.key, e.target.value)}
                        />
                      ) : f.kind === "select" ? (
                        <select
                          className={field}
                          value={String(values[f.key] ?? "")}
                          onChange={(e) => set(f.key, e.target.value)}
                        >
                          <option value="">Selecione</option>
                          {(f.options ?? []).map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.kind === "date" ? "date" : f.kind === "email" ? "email" : "text"}
                          className={field}
                          value={String(values[f.key] ?? "")}
                          onChange={(e) => set(f.key, e.target.value)}
                        />
                      )}
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="card-surface p-5">
          <h2 className="mb-3 text-sm font-bold uppercase text-accent">Termo de ciência de riscos</h2>
          <p className="text-sm text-muted-foreground">{RISK_TERMS}</p>
          <label className="mt-4 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            Li e aceito o termo de ciência de riscos.
          </label>
        </section>

        <button
          type="button"
          onClick={submit}
          disabled={sending}
          className="w-full rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          {sending ? "Enviando..." : "Enviar ficha de inscrição"}
        </button>
      </div>
    </div>
  );
}
