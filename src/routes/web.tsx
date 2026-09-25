import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download, ExternalLink, Share2, Smartphone, MoreVertical, PlusSquare, ArrowDownToLine } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

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
      { name: "description", content: "Instale o aplicativo da Casa de Aventura no seu celular." },
      { name: "theme-color", content: "#2C5642" },
    ],
  }),
  component: WebInstall,
});

function WebInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [device, setDevice] = useState("other");

  useEffect(() => {
    setInstalled(isStandalone());
    setDevice(getDevice());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installed) {
      window.location.href = "/";
      return;
    }
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setInstallPrompt(null);
      return;
    }
    setShowInstructions(true);
  };

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#416f58_0%,#2C5642_42%,#172d23_100%)] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.08] shadow-2xl backdrop-blur-xl">
          <div className="px-6 pb-8 pt-8 text-center sm:px-10 sm:pt-10">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[#E9E3D7] p-2 shadow-2xl ring-1 ring-white/20">
              <img src="/assets/casa-de-aventura-logo-redonda-transparente.svg" alt="Logo Casa de Aventura" className="h-full w-full object-contain" />
            </div>
            <div className="mt-5 text-xs font-extrabold uppercase tracking-[0.28em] text-[#E9E3D7]">Casa de Aventura</div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Aplicativo Casa de Aventura</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Tenha a Casa de Aventura na tela inicial do seu celular, com acesso rápido às viagens, cursos, calendário, comentários e sua conta.
            </p>

            <button
              type="button"
              onClick={handleInstall}
              className="mt-7 inline-flex min-h-14 w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-[#B3833F] px-6 py-4 text-base font-extrabold shadow-lg transition hover:-translate-y-0.5 active:translate-y-0"
            >
              {installed ? <Check className="h-5 w-5" /> : <Download className="h-5 w-5" />}
              {installed ? "Abrir Casa de Aventura" : "Instalar aplicativo"}
            </button>

            <Link to="/" className="mx-auto mt-3 inline-flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              <ExternalLink className="h-4 w-4" /> Continuar no site
            </Link>
          </div>

          <div className="border-t border-white/10 px-6 py-7 sm:px-10">
            <div className="text-center">
              <h2 className="text-xl font-extrabold sm:text-2xl">Como instalar o aplicativo</h2>
              <p className="mt-2 text-sm text-white/65">É gratuito e não precisa baixar pela App Store ou Google Play.</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-black/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><Smartphone className="h-5 w-5" /></div>
                  <h3 className="font-extrabold">Android</h3>
                </div>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                  <li><b className="text-white">1.</b> Abra esta página pelo Chrome.</li>
                  <li><b className="text-white">2.</b> Toque em <b className="text-white">Instalar aplicativo</b>. Se aparecer uma confirmação, confirme.</li>
                  <li><b className="text-white">3.</b> O ícone <b className="text-white">Casa de Aventura</b> será adicionado à tela inicial.</li>
                </ol>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs text-white/60">
                  <ArrowDownToLine className="h-4 w-4 shrink-0" /> Se o botão não aparecer, abra o menu ⋮ do Chrome e procure <b className="text-white/80">Instalar aplicativo</b> ou <b className="text-white/80">Adicionar à tela inicial</b>.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-black/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><Share2 className="h-5 w-5" /></div>
                  <h3 className="font-extrabold">iPhone</h3>
                </div>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                  <li><b className="text-white">1.</b> Abra esta página no <b className="text-white">Safari</b>.</li>
                  <li><b className="text-white">2.</b> Toque no botão <b className="text-white">Compartilhar</b> (quadrado com seta para cima).</li>
                  <li><b className="text-white">3.</b> Desça e toque em <b className="text-white">Adicionar à Tela de Início</b>.</li>
                  <li><b className="text-white">4.</b> Confirme em <b className="text-white">Adicionar</b>. O ícone da Casa de Aventura ficará na tela inicial.</li>
                </ol>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs text-white/60">
                  <PlusSquare className="h-4 w-4 shrink-0" /> No iPhone, a instalação deve ser feita pelo Safari para aparecer corretamente como aplicativo.
                </div>
              </section>
            </div>

            <button type="button" onClick={() => setShowInstructions(v => !v)} className="mx-auto mt-6 flex items-center gap-2 text-sm font-bold text-[#E9E3D7] hover:underline">
              <MoreVertical className="h-4 w-4" /> {showInstructions ? "Ocultar explicação" : "Ver instruções novamente"}
            </button>
            {showInstructions && (
              <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-[#E9E3D7]/20 bg-[#E9E3D7]/10 p-4 text-center text-sm leading-6 text-white/80">
                Depois de instalado, procure o ícone da <b>Casa de Aventura</b> na tela inicial. Você poderá abrir o aplicativo diretamente por ele, sem precisar voltar ao navegador.
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/45">
            <span>Casa de Aventura</span><span className="mx-2">•</span><span>Aplicativo Web</span>
          </div>
        </div>
      </div>
    </main>
  );
}
