import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download, ExternalLink, Share2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = Boolean(
    (navigator as Navigator & { standalone?: boolean }).standalone,
  );
  return media || iosStandalone;
}

function isIPhoneSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
}

export const Route = createFileRoute("/web")({
  head: () => ({
    meta: [
      { title: "Casa de Aventura — Aplicativo" },
      {
        name: "description",
        content:
          "Instale o aplicativo web da Casa de Aventura no seu celular para acessar suas viagens e cursos com rapidez.",
      },
      { name: "theme-color", content: "#2C5642" },
    ],
  }),
  component: WebInstall,
});

function WebInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

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
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
      setInstallPrompt(null);
      return;
    }

    setShowIosHelp(isIPhoneSafari());
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_top,#3b6b54_0%,#2C5642_45%,#1d392c_100%)] px-5 py-8 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] bg-[#E9E3D7] p-2 shadow-xl ring-1 ring-black/10">
              <img
                src="/assets/casa-de-aventura-logo-redonda-transparente.svg"
                alt="Casa de Aventura"
                className="h-full w-full object-contain"
              />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#E9E3D7]/80">
              Casa de Aventura
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Seu aplicativo de aventura.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/75 sm:text-base">
              Instale a Casa de Aventura no celular e tenha acesso rápido a viagens, cursos,
              calendário, comentários e sua conta.
            </p>

            <button
              type="button"
              onClick={handleInstall}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#B3833F] px-6 py-4 text-base font-extrabold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {installed ? <Check className="h-5 w-5" /> : <Download className="h-5 w-5" />}
              {installed ? "Abrir Casa de Aventura" : "Instalar aplicativo"}
            </button>

            <Link
              to="/"
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              Continuar no site
            </Link>
          </div>

          {!installed && (
            <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-black/10 p-4">
                <Smartphone className="h-5 w-5 text-[#E9E3D7]" />
                <p className="mt-2 text-sm font-bold">Android</p>
                <p className="mt-1 text-xs leading-5 text-white/65">
                  Toque em instalar quando o navegador mostrar a opção.
                </p>
              </div>
              <div className="rounded-2xl bg-black/10 p-4">
                <Share2 className="h-5 w-5 text-[#E9E3D7]" />
                <p className="mt-2 text-sm font-bold">iPhone</p>
                <p className="mt-1 text-xs leading-5 text-white/65">
                  Use Compartilhar e depois “Adicionar à Tela de Início”.
                </p>
              </div>
            </div>
          )}

          {showIosHelp && (
            <div className="mt-4 rounded-2xl border border-[#E9E3D7]/20 bg-[#E9E3D7]/10 p-4 text-sm leading-6 text-white/85">
              No iPhone/iPad, toque em <strong>Compartilhar</strong> no Safari e escolha
              <strong> Adicionar à Tela de Início</strong>. O ícone da Casa de Aventura ficará
              disponível como um aplicativo no celular.
            </div>
          )}

          <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-white/45">
            <span>Casa de Aventura</span>
            <span>•</span>
            <span>Aplicativo Web</span>
          </div>
        </div>
      </div>
    </main>
  );
}
