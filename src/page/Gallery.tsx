import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";



const images: string[] = [
  "https://ste.digital/demos/codepen/1.jpg",
  "https://ste.digital/demos/codepen/2.jpg",
  "https://ste.digital/demos/codepen/3.jpg",
  "https://ste.digital/demos/codepen/4.jpg",
  "https://ste.digital/demos/codepen/5.jpg",
  "https://ste.digital/demos/codepen/6.jpg",
  "https://ste.digital/demos/codepen/1.jpg",
  "https://ste.digital/demos/codepen/2.jpg",
];

type ViewMode = "grid" | "masonry" | "carousel" | "collage" | "list";
type ThemeMode = "light" | "pastel" | "dark";

const VIEWS: ViewMode[] = ["grid", "masonry", "carousel", "collage", "list"];
const THEMES: ThemeMode[] = ["light", "pastel", "dark"];

type SelectedImage = { idx: number; src: string } | null;

/* ----------------------
   Helper: keyboard handler for lightbox navigation
------------------------*/
function useLightboxKeyboard(onPrev: () => void, onNext: () => void, onClose: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onPrev, onNext, onClose]);
}

/* ----------------------
   Main page component
------------------------*/
export default function Gallery(){
  const [view, setView] = useState<ViewMode>("grid");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [selected, setSelected] = useState<SelectedImage>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // lightbox handlers
  const openAt = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setSelected({ idx, src: images[idx] });
    // prevent background scroll
    if (typeof document !== "undefined") document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setSelected(null);
    if (typeof document !== "undefined") document.body.style.overflow = "";
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex((s) => {
      const next = (s - 1 + images.length) % images.length;
      setSelected({ idx: next, src: images[next] });
      return next;
    });
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((s) => {
      const next = (s + 1) % images.length;
      setSelected({ idx: next, src: images[next] });
      return next;
    });
  }, []);

  useLightboxKeyboard(prevImage, nextImage, closeLightbox);

  const themeClasses =
    theme === "light"
      ? { bg: "bg-white/60", page: "bg-gradient-to-br from-white via-pink-50 to-purple-50", text: "text-gray-900" }
      : theme === "pastel"
      ? { bg: "bg-white/30", page: "bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100", text: "text-gray-900" }
      : { bg: "bg-slate-900/60", page: "bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900", text: "text-white" };

  return (
    <div className={`min-h-screen ${themeClasses.page} py-10`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${themeClasses.text}`}>Multi-Style Gallery</h1>
            <p className="text-sm text-gray-600/80">Choose a view and a visual theme — click images to open lightbox.</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur rounded-full px-2 py-1 shadow-sm">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`px-3 py-1 text-sm rounded-full ${view === v ? "bg-white text-gray-900 font-semibold shadow" : "text-gray-700/90"}`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white/40 backdrop-blur rounded-full px-2 py-1 shadow-sm">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  aria-pressed={theme === t}
                  className={`px-3 py-1 text-sm rounded-full ${theme === t ? "bg-white text-indigo-700 font-semibold" : "text-gray-700/90"}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Gallery container */}
        <main className="relative">
          {theme === "dark" && <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/30 to-transparent pointer-events-none -z-10" />}

          <div className="rounded-lg p-4">
            {view === "grid" && <GridView images={images} openAt={openAt} prefersReducedMotion={prefersReducedMotion} />}
            {view === "masonry" && <MasonryView images={images} openAt={openAt} />}
            {view === "carousel" && <CarouselView images={images} openAt={openAt} prefersReducedMotion={prefersReducedMotion} />}
            {view === "collage" && <CollageView images={images} openAt={openAt} />}
            {view === "list" && <ListView images={images} openAt={openAt} />}
          </div>
        </main>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backdropFilter: "blur(6px)" }}
            onClick={closeLightbox}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="max-w-4xl w-full rounded-2xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
            >
              <div className="relative">
                <img src={selected.src} alt={`Image ${currentIndex + 1}`} className="w-full max-h-[80vh] object-contain bg-black" />
                <button aria-label="Previous" onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow">
                  ◀
                </button>
                <button aria-label="Next" onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow">
                  ▶
                </button>
                <button aria-label="Close" onClick={closeLightbox} className="absolute right-3 top-3 bg-white/90 rounded-full p-2 shadow">
                  ✕
                </button>
              </div>
              <div className="p-4 text-center">
                <div className="text-sm text-gray-700">
                  Image {currentIndex + 1} of {images.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------
   Grid view (simple responsive)
------------------------*/
function GridView({ images, openAt }: { images: string[]; openAt: (idx: number) => void; prefersReducedMotion: boolean }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
      {images.map((src, i) => (
        <motion.figure key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.04 }}>
          <button onClick={() => openAt(i)} aria-label={`Open image ${i + 1}`} className={`block w-full rounded-xl overflow-hidden shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300`}>
            <img src={src} alt={`img-${i}`} loading="lazy" className="w-full h-56 object-cover" />
          </button>
        </motion.figure>
      ))}
    </div>
  );
}

/* ----------------------
   Masonry view using CSS columns
------------------------*/
function MasonryView({ images, openAt }: { images: string[]; openAt: (idx: number) => void }) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      {images.map((src, i) => (
        <div key={i} className="break-inside-avoid">
          <button onClick={() => openAt(i)} className="w-full block rounded-xl overflow-hidden focus:outline-none">
            <img src={src} alt={`masonry-${i}`} loading="lazy" className="w-full mb-4 object-cover rounded-lg" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ----------------------
   Carousel view (framer-motion drag)
------------------------*/
function CarouselView({ images, openAt }: { images: string[]; openAt: (idx: number) => void; prefersReducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative">
      <motion.div ref={ref} className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
        {images.map((src, i) => (
          <motion.div key={i} className="snap-center min-w-[280px] flex-shrink-0" whileTap={{ scale: 0.98 }}>
            <button onClick={() => openAt(i)} className="block w-full rounded-2xl overflow-hidden focus:outline-none">
              <img src={src} alt={`carousel-${i}`} loading="lazy" className="w-full h-[360px] object-cover rounded-xl shadow-lg" />
            </button>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-3 text-sm text-gray-600">Swipe or drag horizontally — tap to open.</div>
    </div>
  );
}

/* ----------------------
   Collage view (absolute, overlapping)
------------------------*/
function CollageView({ images, openAt }: { images: string[]; openAt: (idx: number) => void }) {
  const positions = [
    { left: "2%", top: "4%", w: "34%", rotate: "-6deg" },
    { left: "40%", top: "0%", w: "34%", rotate: "4deg" },
    { left: "72%", top: "12%", w: "24%", rotate: "-8deg" },
    { left: "6%", top: "52%", w: "28%", rotate: "10deg" },
    { left: "36%", top: "44%", w: "30%", rotate: "-4deg" },
    { left: "68%", top: "56%", w: "28%", rotate: "8deg" },
    { left: "10%", top: "78%", w: "26%", rotate: "-3deg" },
    { left: "44%", top: "76%", w: "30%", rotate: "6deg" },
  ];

  return (
    <div className="relative w-full h-[720px] rounded-lg">
      {images.map((src, i) => {
        const p = positions[i % positions.length];
        return (
          <motion.button
            key={i}
            onClick={() => openAt(i)}
            style={{ left: p.left, top: p.top, width: p.w, rotate: p.rotate }}
            className="absolute rounded-xl overflow-hidden shadow-2xl transform-gpu"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Open collage image ${i + 1}`}
          >
            <img src={src} alt={`collage-${i}`} loading="lazy" className="w-full h-full object-cover" />
          </motion.button>
        );
      })}
    </div>
  );
}

/* ----------------------
   List view (big stacked)
------------------------*/
function ListView({ images, openAt }: { images: string[]; openAt: (idx: number) => void }) {
  return (
    <div className="space-y-6">
      {images.map((src, i) => (
        <div key={i} className="bg-white/60 rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <button onClick={() => openAt(i)} className="md:col-span-1">
              <img src={src} alt={`list-${i}`} loading="lazy" className="w-full h-64 object-cover" />
            </button>
            <div className="p-4 md:col-span-2">
              <h3 className="font-semibold mb-2">Beautiful Photo #{i + 1}</h3>
              <p className="text-sm text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Click to open in lightbox.</p>
              <div className="flex gap-2">
                <button onClick={() => openAt(i)} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">
                  Open
                </button>
                <a href={src} target="_blank" rel="noreferrer" className="px-3 py-1 rounded border text-sm">
                  Original
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
