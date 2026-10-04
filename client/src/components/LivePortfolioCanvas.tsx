import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon, LoaderCircle, RefreshCw, X } from "lucide-react";
import { loadPublishedPortfolio, portfolioImageUrl, portfolioSupabase, type LivePortfolioElement, type LivePortfolioPage } from "@/lib/portfolio";

type Frame = { x: number; y: number; width: number; height: number };

function frameFor(element: LivePortfolioElement, width: number): Frame {
  const responsive = element.styles.responsive as Record<string, Frame> | undefined;
  const breakpoint = width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
  return responsive?.[breakpoint] || responsive?.desktop || { x: element.x, y: element.y, width: element.width, height: element.height };
}

function textValue(element: LivePortfolioElement) {
  return String(element.content.text || element.content.title || "");
}

export default function LivePortfolioCanvas() {
  const [page, setPage] = useState<LivePortfolioPage | null>(null);
  const [elements, setElements] = useState<LivePortfolioElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageElements = useMemo(() => elements.filter((element) => element.element_type === "image" && portfolioImageUrl(element)), [elements]);

  async function refresh() {
    setLoading(true);
    const result = await loadPublishedPortfolio();
    setPage(result.page);
    setElements(result.elements);
    setUpdatedAt(result.page?.updated_at || new Date().toISOString());
    setLoading(false);
  }

  useEffect(() => { void refresh(); }, []);

  useEffect(() => {
    const channel = portfolioSupabase
      .channel("avenphotos-live-portfolio")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_pages" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_elements" }, () => void refresh())
      .subscribe();
    return () => { void portfolioSupabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") setActiveImage((value) => (value + imageElements.length - 1) % imageElements.length);
      if (event.key === "ArrowRight") setActiveImage((value) => (value + 1) % imageElements.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imageElements.length, lightboxOpen]);

  if (loading && !page) return <section className="live-portfolio live-portfolio--loading"><LoaderCircle className="spin" size={18} /> <span>جارٍ تحميل النسخة المنشورة…</span></section>;
  if (!page) return null;

  return <section className="live-portfolio" id="live-portfolio" aria-label="Live published portfolio">
    <div className="live-portfolio__bar"><div><span>AVEN / LIVE PORTFOLIO</span><strong>{page.title || "Published canvas"}</strong></div><div className="live-portfolio__meta"><span>{updatedAt ? `Updated ${new Date(updatedAt).toLocaleString()}` : "Live"}</span><button type="button" onClick={() => void refresh()} aria-label="Refresh published portfolio"><RefreshCw size={14} /></button><a href="#contact"><ExternalLink size={14} /> Contact</a></div></div>
    <div className="live-portfolio__viewport">
      <div className="live-portfolio__canvas">
        {elements.map((element) => {
          const frame = frameFor(element, window.innerWidth);
          const styles = element.styles;
          const common = { left: frame.x, top: frame.y, width: frame.width, height: frame.height, zIndex: element.z_index, color: String(styles.color || "#f6f3ec"), fontSize: Number(styles.fontSize || 28), fontWeight: Number(styles.fontWeight || 400), borderRadius: Number(styles.borderRadius || 0), backgroundColor: String(styles.backgroundColor || "transparent") } as CSSProperties;
          if (element.element_type === "image") {
            const imageIndex = imageElements.findIndex((item) => item.id === element.id);
            return <button type="button" key={element.id} className="live-portfolio__element live-portfolio__image" style={common} onClick={() => { setActiveImage(Math.max(0, imageIndex)); setLightboxOpen(true); }} aria-label="Open portfolio image"><img src={portfolioImageUrl(element)} alt={String(element.content.alt || textValue(element))} style={{ objectFit: (String(styles.objectFit || "cover") as CSSProperties["objectFit"]), borderRadius: common.borderRadius }} /><span className="live-portfolio__image-hint"><ImageIcon size={14} /> View</span></button>;
          }
          if (element.element_type === "divider") return <div key={element.id} className="live-portfolio__element" style={{ ...common, height: Math.max(1, frame.height), backgroundColor: String(styles.color || "#00d6c6") }} />;
          if (element.element_type === "button") return <a key={element.id} className="live-portfolio__element live-portfolio__button" href={String(element.content.href || "#contact")} style={common}>{textValue(element)} <ExternalLink size={15} /></a>;
          return <div key={element.id} className="live-portfolio__element live-portfolio__text" style={common}>{element.content.eyebrow ? <span>{String(element.content.eyebrow)}</span> : null}{textValue(element)}</div>;
        })}
      </div>
    </div>
    {lightboxOpen && imageElements.length > 0 && <div className="live-lightbox" role="dialog" aria-modal="true" aria-label="Portfolio image viewer" onClick={() => setLightboxOpen(false)}><button type="button" className="live-lightbox__close" onClick={() => setLightboxOpen(false)} aria-label="Close"><X size={22} /></button><button type="button" className="live-lightbox__prev" onClick={(event) => { event.stopPropagation(); setActiveImage((value) => (value + imageElements.length - 1) % imageElements.length); }} aria-label="Previous image"><ChevronLeft size={28} /></button><img src={portfolioImageUrl(imageElements[activeImage])} alt={String(imageElements[activeImage].content.alt || "Portfolio image")} onClick={(event) => event.stopPropagation()} /><button type="button" className="live-lightbox__next" onClick={(event) => { event.stopPropagation(); setActiveImage((value) => (value + 1) % imageElements.length); }} aria-label="Next image"><ChevronRight size={28} /></button><span className="live-lightbox__count">{activeImage + 1} / {imageElements.length}</span></div>}
  </section>;
}
