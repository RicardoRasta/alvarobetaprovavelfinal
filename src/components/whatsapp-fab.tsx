import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/trips";
import { logWhatsAppClick, settingsQuery } from "@/lib/api";

/** Botão flutuante para falar/agendar direto no WhatsApp da agência. */
export function WhatsAppFab() {
  const { data: settings } = useQuery(settingsQuery);
  return (
    <a
      href={whatsappLink(settings, { tripName: "uma viagem de aventura" })}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => logWhatsAppClick({ tripName: "Contato geral", source: "fab" })}
      aria-label="Agendar viagem pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105"
    >

      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Agendar no WhatsApp</span>
    </a>
  );
}
