import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, PlusSquare, Share2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

function getDevice() {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

export const Route = createFileRoute("/web")({
  head: () => ({
    meta: [
      { title: "Casa de Aventura — Aplicativo" },
      { name: "description", content: "Como adicionar a Casa de Aventura à tela inicial do celular." },
      { name: "theme-color", content: "#2C5642" },
    ],
  }),
  component: WebInstall,
});

function WebInstall() {
  const [device, setDevice] = useState("other");

  useEffect(() => {
    setDevice(getDevice());
  }, []);

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#416f58_0%,#2C5642_42%,#172d23_100%)] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.08] shadow-2xl backdrop-blur-xl">
          <div className="px-6 pb-8 pt-8 text-center sm:px-10 sm:pt-10">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[#E9E3D7] p-2 shadow-2xl ring-1 ring-white/20">
              <img
                src="/assets/casa-de-aventura-logo-redonda-transparente.svg"
                alt="Logo Casa de Aventura"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-5 text-xs font-extrabold uppercase tracking-[0.28em] text-[#E9E3D7]">Casa de Aventura</div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Aplicativo Casa de Aventura</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Adicione a Casa de Aventura à tela inicial do seu celular para ter acesso rápido às viagens, cursos, calendário, comentários e sua conta.
            </p>

            <Link
              to="/"
              className="mx-auto mt-7 inline-flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" /> Continuar no site
            </Link>
          </div>

          <div className="border-t border-white/10 px-6 py-7 sm:px-10">
            <div className="text-center">
              <h2 className="text-xl font-extrabold sm:text-2xl">Como adicionar o aplicativo</h2>
              <p className="mt-2 text-sm text-white/65">Não precisa baixar pela App Store ou Google Play.</p>
            </div>

            {device === "android" && (
              <section className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/10 bg-black/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><Smartphone className="h-5 w-5" /></div>
                  <h3 className="font-extrabold">Android</h3>
                </div>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                  <li><b className="text-white">1.</b> Abra esta página pelo <b className="text-white">Chrome</b>.</li>
                  <li><b className="text-white">2.</b> Toque no menu <b className="text-white">⋮</b> do Chrome.</li>
                  <li><b className="text-white">3.</b> Procure <b className="text-white">Instalar aplicativo</b> ou <b className="text-white">Adicionar à tela inicial</b>.</li>
                  <li><b className="text-white">4.</b> Confirme. O ícone oficial da <b className="text-white">Casa de Aventura</b> será adicionado à tela inicial.</li>
                </ol>
              </section>
            )}

            {device === "ios" && (
              <section className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/10 bg-black/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><Share2 className="h-5 w-5" /></div>
                  <h3 className="font-extrabold">iPhone</h3>
                </div>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                  <li><b className="text-white">1.</b> Abra esta página no <b className="text-white">Safari</b>.</li>
                  <li><b className="text-white">2.</b> Toque em <b className="text-white">Compartilhar</b> (quadrado com seta para cima).</li>
                  <li><b className="text-white">3.</b> Desça e toque em <b className="text-white">Adicionar à Tela de Início</b>.</li>
                  <li><b className="text-white">4.</b> Confirme em <b className="text-white">Adicionar</b>. O ícone oficial da <b className="text-white">Casa de Aventura</b> ficará na tela inicial.</li>
                </ol>
              </section>
            )}

            {device === "other" && (
              <section className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/10 bg-black/10 p-5 text-center">
                <Smartphone className="mx-auto h-7 w-7" />
                <p className="mt-3 text-sm leading-6 text-white/75">
                  Abra esta página pelo celular para receber as instruções específicas do seu aparelho.
                </p>
              </section>
            )}

            <div className="mx-auto mt-5 flex max-w-2xl items-center gap-2 rounded-xl bg-white/5 p-3 text-xs text-white/60">
              <PlusSquare className="h-4 w-4 shrink-0" />
              Depois de adicionar à tela inicial, abra pelo novo ícone da Casa de Aventura.
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/45">
            <span>Casa de Aventura</span><span className="mx-2">•</span><span>Aplicativo Web</span>
          </div>
        </div>
      </div>
    </main>
  );
}
