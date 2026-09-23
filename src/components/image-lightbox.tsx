import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";

export function ImageLightbox({
  src,
  alt,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Visualização ampliada da imagem"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[94vh] max-w-[96vw] items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-h-[94vh] max-w-[96vw] rounded-xl object-contain shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar imagem"
          className="absolute -right-2 -top-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#214936] shadow-xl ring-1 ring-black/10 transition hover:scale-105 sm:-right-4 sm:-top-4"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
          <ZoomIn className="h-3.5 w-3.5" /> Foto ampliada
        </div>
      </div>
    </div>,
    document.body,
  );
}
