/**
 * TIDAL CONTACT SHEET / CAIRO EDITION — Arabic-first editorial motion, optical metadata,
 * and a light/dark gallery system. Movement is used as a compositional cue, not decoration.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ChevronDown, Languages, Menu, Moon, MoveDown, Pause, Play, Plus, Sun, X } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/useMobile";

type Language = "ar" | "en";

const assets = {
  hero: "/manus-storage/koro-moss-hero-projection_b2bf2d30.jpg",
  portrait: "/manus-storage/koro-moss-portrait-study_56521cb1.jpg",
  landscape: "/manus-storage/koro-moss-landscape-study_68729dd4.jpg",
  motion: "/manus-storage/koro-moss-motion-study_34b50128.jpg",
  mark: "/manus-storage/koro-moss-aperture-mark_d5db5650.png",
};

const copy = {
  ar: {
    nav: ["الأعمال", "المنهج", "أماكننا"],
    contactNav: "نبدأ كلام؟",
    menu: "الفهرس",
    close: "قفل",
    heroKicker: "استوديو صور مستقل",
    heroTitle: <>خلّي الصورة<br /><em>تسيب أثر.</em></>,
    heroBody: "بنصمّم عوالم بصرية لبراندات ثقافية عايزة تتشاف، ويتفضّل أثرها.",
    enter: "ادخل على مهلك",
    premise: "الفكرة / 01",
    manifesto: <>الانتباه مش بيتسرق.<br />هو <em>بيتصمّم.</em></>,
    manifestoBody: "بنركّب الظروف اللي تخلي البراند يبان طبيعي ومُلح في نفس الوقت: النور، الإيقاع، الوجوه، الخامة، والمنطق البصري اللي بيكمّل بعد أول نظرة.",
    noteLabel: "ملاحظة من الموقع",
    note: "الصورة مش زينة للفكرة. الصورة هي الفكرة.",
    workLabel: "اختيارات من الأرشيف / 02",
    workHeading: <>كادر ورا كادر،<br /><em>وبعدين أبعد من الكادر.</em></>,
    workIntro: "ثلاث طرق قريبة بنفكّر بيها في الصورة.",
    scrollStudies: "اسحب عشان تمشي بين المشاريع",
    motionLine: "الحركة مقياس للانتباه.",
    approachLabel: "إزاي الشغل بيتحرّك / 03",
    approachHeading: <>الصورة <em>تتابع</em><br />اختيارات.</>,
    material: "تجربة خامة",
    railLabel: "كونتاكت شيت متحرّك / 04",
    closer: "قرّب أكتر.",
    play: "تشغيل",
    pause: "إيقاف",
    openStudy: "افتح المشروع",
    locationLabel: "أماكننا / 05",
    locationsHeading: <>متعمل في حركة.<br /><em>ومتظبّط بقصد.</em></>,
    locationsBody: "قاعدتنا لندن. خط نظرنا بيحدده الشغل، الموسم، ونوع النور اللي هو محتاجه.",
    available: "متاحين لشغل معمول على مهل",
    contactLabel: "الكادر الجاي / 06",
    contactHeading: <>ودّي الصورة<br />في <em>حتّة تليق بيها.</em></>,
    contactBody: "للشغل، الشراكات، والكلام اللي عنده بُصيرة.",
    back: "ارجع للأول",
    footerLine: "إدارة صورة للثقافة وهي بتتحرّك.",
    moreWork: "في شغل أكتر بيتبعت لما يبقى فيه سبب.",
    themeToDark: "الوضع الداكن",
    themeToLight: "الوضع الفاتح",
  },
  en: {
    nav: ["Work", "Approach", "Locations"],
    contactNav: "Start a conversation",
    menu: "Index",
    close: "Close",
    heroKicker: "Independent image practice",
    heroTitle: <>Make the image<br /><em>leave a mark.</em></>,
    heroBody: "We build visual worlds for cultural brands that need to be seen — and remembered.",
    enter: "Enter slowly",
    premise: "Premise / 01",
    manifesto: <>Attention is not borrowed.<br />It is <em>composed.</em></>,
    manifestoBody: "We set the conditions for a brand to feel inevitable: light, rhythm, casting, material, and an editorial logic that continues after the first glance.",
    noteLabel: "Field note",
    note: "The image does not decorate the idea. It becomes the idea.",
    workLabel: "Selected archive / 02",
    workHeading: <>Frame by frame,<br /><em>then beyond it.</em></>,
    workIntro: "Three recent ways of thinking through an image.",
    scrollStudies: "Scroll to move through studies",
    motionLine: "Motion is a measure of attention.",
    approachLabel: "How the work moves / 03",
    approachHeading: <>A picture is<br />a <em>sequence</em> of choices.</>,
    material: "Material test",
    railLabel: "Moving contact sheet / 04",
    closer: "Look closer.",
    play: "Play",
    pause: "Pause",
    openStudy: "Open study",
    locationLabel: "Location / 05",
    locationsHeading: <>Made in motion.<br /><em>Placed with intent.</em></>,
    locationsBody: "Our base is London. Our field of view is determined by the work, the season, and the kind of light it needs.",
    available: "Available for considered collaborations",
    contactLabel: "Next frame / 06",
    contactHeading: <>Give the image<br />somewhere to <em>go.</em></>,
    contactBody: "For commissions, collaborations, and perceptive conversations.",
    back: "Back to top",
    footerLine: "Image direction for culture in motion.",
    moreWork: "More work is shared when there is a reason to see it.",
    themeToDark: "Dark mode",
    themeToLight: "Light mode",
  },
} as const;

const studies = [
  {
    number: "01", image: assets.portrait, tone: "portrait", year: "2026", format: "Still / Direction",
    title: { ar: "أشكال على الحافة", en: "Liminal Forms" },
    type: { ar: "توجيه حملة / باريس", en: "Campaign direction / Paris" },
    detail: { ar: "دراسة في الطقوس، الخطوط، ونور الميّه لدار جديدة بتشتغل بالأشياء.", en: "A study in ritual, silhouette, and waterline light for a new house of objects." },
  },
  {
    number: "02", image: assets.landscape, tone: "landscape", year: "2025", format: "World / System",
    title: { ar: "الإشارة البطيئة", en: "The Slow Signal" },
    type: { ar: "نظام بصري / مينوركا", en: "Image system / Menorca" },
    detail: { ar: "ساحل بيتحوّل لقواعد بصرية لفندق بيشتغل بذاكرة طويلة.", en: "A coastline becomes a visual grammar for hospitality with a long memory." },
  },
  {
    number: "03", image: assets.motion, tone: "motion", year: "2026", format: "Motion / Editorial",
    title: { ar: "نقطة ثبات", en: "Holding Pattern" },
    type: { ar: "موشن إيديتوريال / لندن", en: "Editorial motion / London" },
    detail: { ar: "دراسة ملابس متحرّكة بتخلّي الوقت نفسه يبان في كادر واحد.", en: "A moving wardrobe study composed to make duration visible in a single frame." },
  },
] as const;

const capabilities = [
  ["01", { ar: "هندسة الصورة", en: "Image architecture" }, { ar: "أنظمة حملات ليها وجهة نظر بصرية واضحة.", en: "Campaign systems with a visual point of view." }],
  ["02", { ar: "توجيه إيديتوريال", en: "Editorial direction" }, { ar: "حكايات موزونة للورق، الشاشة، والمكان.", en: "Stories calibrated for paper, screens, and space." }],
  ["03", { ar: "لغة الحركة", en: "Motion language" }, { ar: "تتابعات تخلي العين تفضّل، وبعدها تمشي.", en: "Sequences that let the eye linger, then move." }],
  ["04", { ar: "بحث ثقافي", en: "Cultural research" }, { ar: "مراجع مخصوصة قبل ما الكاميرا تترفع.", en: "References made specific before the camera is raised." }],
] as const;

const locations = [
  ["01", { ar: "لندن", en: "London" }, { ar: "مكتب ميداني · GMT", en: "Field office · GMT" }],
  ["02", { ar: "نيويورك", en: "New York" }, { ar: "شريك إنتاج · EST", en: "Production partner · EST" }],
  ["03", { ar: "باريس", en: "Paris" }, { ar: "شبكة كاستينج · CET", en: "Casting network · CET" }],
  ["04", { ar: "أي مكان تاني", en: "Everywhere else" }, { ar: "على مقاس النور الصح", en: "Built around the right light" }],
] as const;

const reveal = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

function ProgressDial({ value }: { value: MotionValue<number> }) {
  return (
    <div className="progress-dial" aria-hidden="true">
      <svg viewBox="0 0 36 36">
        <path className="progress-dial__track" d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 1 1 0-31" />
        <motion.path className="progress-dial__value" d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 1 1 0-31" style={{ pathLength: value }} />
      </svg>
    </div>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <motion.div className={`eyebrow ${dark ? "eyebrow--dark" : ""}`} initial={{ opacity: 0, x: -14, y: 8 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}><span className="eyebrow__dot" /><span>{children}</span></motion.div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStudy, setActiveStudy] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");
  const [isDark, setIsDark] = useState(false);
  const isMobile = useIsMobile();
  const workRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.25 });
  const { scrollYProgress: workProgress } = useScroll({ target: workRef, offset: ["start start", "end end"] });
  const projectX = useTransform(workProgress, [0, 1], ["0%", "-65%"]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], ["0%", "16%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1.06, 1]);
  const t = copy[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("aven-language");
    const savedTheme = window.localStorage.getItem("aven-theme");
    if (savedLanguage === "ar" || savedLanguage === "en") setLanguage(savedLanguage);
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "ar" ? "ar-EG" : "en";
    document.documentElement.dir = dir;
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("aven-language", language);
    window.localStorage.setItem("aven-theme", isDark ? "dark" : "light");
  }, [dir, isDark, language]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const update = () => setActiveStudy(carouselApi.selectedScrollSnap());
    update(); carouselApi.on("select", update);
    return () => { carouselApi.off("select", update); };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || isPaused) return;
    const timer = window.setInterval(() => carouselApi.scrollNext(), 5600);
    return () => window.clearInterval(timer);
  }, [carouselApi, isPaused]);

  const goTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); setMenuOpen(false); };
  const switchLanguage = () => setLanguage((current) => current === "ar" ? "en" : "ar");

  return (
    <div className="site-shell" dir={dir} data-language={language}>
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} />
      <header className={`masthead ${scrolled ? "masthead--scrolled" : ""}`}>
        <motion.button className="brand" onClick={() => goTo("top")} aria-label="Aven home" whileHover={{ x: language === "ar" ? -3 : 3 }} whileTap={{ scale: 0.97 }}>
          <motion.img src={assets.mark} alt="" className="brand__mark" animate={{ rotate: scrolled ? 180 : 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} />
          <span className="brand__wordmark">Aven</span>
        </motion.button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <motion.button onClick={() => goTo("work")} whileHover={{ y: -2 }}>{t.nav[0]}</motion.button>
          <motion.button onClick={() => goTo("approach")} whileHover={{ y: -2 }}>{t.nav[1]}</motion.button>
          <motion.button onClick={() => goTo("locations")} whileHover={{ y: -2 }}>{t.nav[2]}</motion.button>
          <motion.button className="desktop-nav__contact" onClick={() => goTo("contact")} whileHover={{ x: language === "ar" ? -3 : 3 }}>{t.contactNav} <ArrowUpRight size={15} /></motion.button>
        </nav>
        <div className="header-controls">
          <motion.button className="utility-button" onClick={switchLanguage} whileTap={{ scale: 0.94 }} title="Switch language"><Languages size={15} /><span>{language === "ar" ? "EN" : "ع"}</span></motion.button>
          <motion.button className="utility-button" onClick={() => setIsDark((value) => !value)} whileTap={{ rotate: 18, scale: 0.94 }} title={isDark ? t.themeToLight : t.themeToDark}>{isDark ? <Sun size={15} /> : <Moon size={15} />}<span>{isDark ? t.themeToLight : t.themeToDark}</span></motion.button>
          <motion.button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} whileTap={{ scale: 0.94 }}>{menuOpen ? <X size={21} /> : <Menu size={21} />}<span>{menuOpen ? t.close : t.menu}</span></motion.button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.48, ease: [0.77, 0, 0.175, 1] }}>
          <div className="mobile-menu__upper">Aven / {t.menu}</div>
          {[["work", t.nav[0]], ["approach", t.nav[1]], ["locations", t.nav[2]], ["contact", t.contactNav]].map(([id, label], index) => <motion.button key={id} onClick={() => goTo(id)} initial={{ opacity: 0, x: language === "ar" ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + index * 0.07 }}><small>0{index + 1}</small><span>{label}</span></motion.button>)}
          <p>{language === "ar" ? "استوديو مستقل من لندن، شغال بين الصورة، الشيء، والحركة." : "Independent creative direction from London, working between image, object, and movement."}</p>
        </motion.div>}
      </AnimatePresence>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <motion.div className="hero__image-wrap" style={{ y: heroY, scale: heroScale }}><img src={assets.hero} alt="Model illuminated by a lagoon-teal projection in a black-box gallery" className="hero__image" /></motion.div>
          <div className="hero__wash" /><div className="hero__register hero__register--left">Creative direction / Image making / 2026</div>
          <motion.div className="hero__halo" animate={{ rotate: 360, scale: [1, 1.08, 1] }} transition={{ rotate: { duration: 14, repeat: Infinity, ease: "linear" }, scale: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } }} aria-hidden="true"><img src={assets.mark} alt="" /></motion.div>
          <div className="hero__content">
            <motion.p className="hero__kicker" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.25 }}>{t.heroKicker}</motion.p>
            <motion.h1 id="hero-title" initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}>{t.heroTitle}</motion.h1>
            <motion.div className="hero__bottomline" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62 }}><p>{t.heroBody}</p><motion.button onClick={() => goTo("work")} className="round-action" aria-label={t.nav[0]} whileHover={{ rotate: 45 }} whileTap={{ scale: 0.94 }}><ArrowDownRight size={21} /></motion.button></motion.div>
          </div>
          <div className="hero__index">001 / 006</div><motion.div className="hero__folio" aria-hidden="true" animate={{ opacity: [0.56, 1, 0.56] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}><span>Frame 001</span><i /><span>AVN optics</span></motion.div>
          <div className="hero__dial"><ProgressDial value={smoothProgress} /></div>
          <motion.button className="hero__scroll" onClick={() => goTo("manifesto")} animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}><span>{t.enter}</span><ChevronDown size={15} /></motion.button>
        </section>

        <section id="manifesto" className="manifesto paper-section" aria-labelledby="manifesto-title"><div className="manifesto__rail">Aven — image direction — London / global</div><div className="manifesto__lead"><Eyebrow>{t.premise}</Eyebrow><motion.h2 id="manifesto-title" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={reveal} transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}>{t.manifesto}</motion.h2></div><div className="manifesto__body"><p>{t.manifestoBody}</p><motion.div className="manifesto__note" initial={{ opacity: 0, rotate: -2, y: 16 }} whileInView={{ opacity: 1, rotate: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}><span>{t.noteLabel}</span><strong>{t.note}</strong></motion.div></div><div className="manifesto__number">01</div></section>

        <section id="work" ref={workRef} className="work-chapter" aria-labelledby="work-title"><div className="work-chapter__sticky"><div className="work-chapter__intro"><Eyebrow dark>{t.workLabel}</Eyebrow><h2 id="work-title">{t.workHeading}</h2><p>{t.workIntro}</p><div className="work-chapter__progress"><MoveDown size={15} /><span>{t.scrollStudies}</span></div></div><motion.div className="work-chapter__archive" aria-hidden="true" animate={{ y: [0, -4, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}><div className="work-chapter__archive-ring"><img src={assets.mark} alt="" /></div><div><span>Optical index / 02</span><strong>{language === "ar" ? "كادر ورا كادر" : "Frame follows frame"}</strong></div><p>01 — 02 — 03 — 04 — 05 — 06</p></motion.div><div className="work-chapter__axis" aria-hidden="true"><span>Archive 02</span><i /><span>12 studies / 4 cities / 1 visual rule</span></div><motion.div className="work-track" style={isMobile ? undefined : { x: projectX }}>{studies.map((study, index) => <motion.article className={`work-card work-card--${study.tone}`} key={study.number} whileHover={{ y: -11, rotate: index === 1 ? 0.4 : -0.4 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}><div className="work-card__image"><img src={study.image} alt={study.title[language]} /><div className="work-card__image-shade" /><span>{study.number}</span></div><div className="work-card__caption"><p>{study.type[language]}</p><h3>{study.title[language]}</h3><motion.button onClick={() => goTo("contact")} aria-label={t.contactNav} whileTap={{ scale: 0.92 }}><ArrowUpRight size={17} /></motion.button></div><p className="work-card__copy">{study.detail[language]}</p><div className="work-card__facts"><span>{study.year}</span><i /><span>{study.format}</span></div><div className="work-card__count">0{index + 1} — 03</div></motion.article>)}<div className="work-track__tail"><span>{t.moreWork}</span><ArrowUpRight size={22} /></div></motion.div></div></section>

        <section className="cinema-slice" aria-label="Kinetic still from Aven"><div className="cinema-slice__inner"><motion.img src={assets.motion} alt="A model moving through a gallery corridor" initial={{ clipPath: "inset(12% 9% 12% 9%)", scale: 1.14 }} whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.15, ease: [0.77, 0, 0.175, 1] }} /><motion.div className="cinema-slice__overlay" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} animate={{ y: [0, -4, 0] }} viewport={{ once: true }} transition={{ y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" }, opacity: { delay: 0.3, duration: 0.6 } }}>{t.motionLine}</motion.div><div className="cinema-slice__side-label">Image direction / 26.4° N</div></div></section>

        <section id="approach" className="approach paper-section" aria-labelledby="approach-title"><div className="approach__heading"><Eyebrow>{t.approachLabel}</Eyebrow><h2 id="approach-title">{t.approachHeading}</h2></div><div className="approach__image"><motion.img src={assets.portrait} alt="Editorial portrait in a field of lagoon light" initial={{ y: 64, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} whileHover={{ scale: 1.025 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} /><div className="approach__image-note"><span>{t.material}</span><strong>{language === "ar" ? "حرير / ميّه / نور" : "Silk / water / light"}</strong></div></div><div className="capabilities">{capabilities.map(([number, title, description]) => <motion.article className="capability" key={number} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8, x: language === "ar" ? -3 : 3 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: Number(number) * 0.05 }}><span>{number}</span><h3>{title[language]}</h3><p>{description[language]}</p><Plus size={17} /></motion.article>)}</div><div className="approach__folio" aria-hidden="true"><span>{language === "ar" ? "طريقة الكونتاكت شيت" : "Contact sheet method"}</span><i /><span>{language === "ar" ? "04 كادرات / لغة بصرية واحدة" : "04 frames / one visual language"}</span></div></section>

        <section className="study-rail" aria-labelledby="study-rail-title" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}><div className="study-rail__folio" aria-hidden="true">Archive reel / 04 — photographs selected from live direction studies</div><div className="study-rail__top"><div><Eyebrow dark>{t.railLabel}</Eyebrow><h2 id="study-rail-title">{t.closer}</h2></div><div className="study-rail__controls"><motion.button onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? t.play : t.pause} whileTap={{ scale: 0.94 }}>{isPaused ? <Play size={15} /> : <Pause size={15} />}<span>{isPaused ? t.play : t.pause}</span></motion.button><span>{String(activeStudy + 1).padStart(2, "0")} / 03</span></div></div><Carousel opts={{ loop: true, align: "start" }} setApi={setCarouselApi} className="study-carousel"><CarouselContent className="study-carousel__content">{studies.map((study, index) => <CarouselItem key={study.number} className="study-carousel__item"><article className="rail-study"><div className="rail-study__media"><img src={study.image} alt="" /><div className="rail-study__scrim" /><span>{study.type[language]}</span></div><div className="rail-study__copy"><span>{study.number}</span><h3>{study.title[language]}</h3><p>{study.detail[language]}</p><motion.button onClick={() => goTo("contact")} whileHover={{ x: language === "ar" ? -3 : 3 }}>{t.openStudy} <ArrowUpRight size={16} /></motion.button></div><div className="rail-study__ghost">0{index + 1}</div></article></CarouselItem>)}</CarouselContent><CarouselPrevious className="rail-arrow rail-arrow--previous" aria-label="Previous study" /><CarouselNext className="rail-arrow rail-arrow--next" aria-label="Next study" /></Carousel><div className="study-rail__tabs" role="tablist" aria-label="Selected studies">{studies.map((study, index) => <motion.button key={study.number} role="tab" aria-selected={activeStudy === index} className={activeStudy === index ? "is-active" : ""} onClick={() => carouselApi?.scrollTo(index)} whileHover={{ x: language === "ar" ? -2 : 2 }}><span>{study.number}</span>{study.title[language]}</motion.button>)}</div></section>

        <section id="locations" className="locations paper-section" aria-labelledby="locations-title"><div className="locations__top"><Eyebrow>{t.locationLabel}</Eyebrow><div><h2 id="locations-title">{t.locationsHeading}</h2><p>{t.locationsBody}</p></div></div><div className="location-grid">{locations.map(([number, city, caption]) => <motion.article className="location-card" key={number} whileHover={{ y: -8 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}><span>{number}</span><h3>{city[language]}</h3><p>{caption[language]}</p><div className="location-card__line" /></motion.article>)}</div><div className="locations__orbit"><motion.img src={assets.mark} alt="" animate={{ rotate: [0, 15, 0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} /><span>{t.available}</span></div><div className="locations__folio" aria-hidden="true"><span>Latitude 51.5072° N</span><i /><span>Longitude 0.1276° W</span></div></section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="contact-section__image"><img src={assets.landscape} alt="Coastline and architecture at dusk" /><div /></div><motion.div className="contact-section__content" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}><Eyebrow dark>{t.contactLabel}</Eyebrow><h2 id="contact-title">{t.contactHeading}</h2><motion.a href="mailto:studio@koroandmoss.com" className="contact-link" whileHover={{ y: -3 }}>{"studio@koroandmoss.com"} <ArrowUpRight size={25} /></motion.a><p>{t.contactBody}</p></motion.div><div className="contact-section__folio" aria-hidden="true"><img src={assets.mark} alt="" /><span>{language === "ar" ? "اللوحة الأخيرة / 006" : "Final plate / 006"}</span><i /><span>{language === "ar" ? "أول كادر قرار." : "The first frame is a decision."}</span></div><div className="contact-section__corner">AVN / 2026<br />London · Worldwide</div></section>
      </main>
      <footer className="footer"><div><img src={assets.mark} alt="" /><span>Aven</span></div><p>{t.footerLine}</p><span className="footer__folio">AVN / Optical archive / 2026</span><motion.button onClick={() => goTo("top")} whileHover={{ y: -2 }}>{t.back} <ArrowUpRight size={14} /></motion.button></footer>
    </div>
  );
}
