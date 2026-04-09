import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const SKILLS = [
  { name: "HTML / CSS", level: 92 },
  { name: "JavaScript", level: 80 },
  { name: "React", level: 75 },
  { name: "Python", level: 85 },
  { name: "C / C++", level: 78 },
  { name: "Machine Learning", level: 72 },
  { name: "SQL", level: 70 },
  { name: "Data Structures & Algorithms", level: 76 },
];

const EDUCATION = [
  {
    year: "2023 – Present",
    title: "B.Tech in Artificial Intelligence",
    place: "Birla Institute of Technology, Mesra",
    detail: "CGPA: 8.1 · Mesra, Jharkhand",
  },
  {
    year: "2021 – 2022",
    title: "Class XII",
    place: "Vivekananda Academy",
    detail: "88.8% · Serampore, West Bengal",
  },
  {
    year: "2010 – 2020",
    title: "Class X",
    place: "Gospel Home School",
    detail: "89% · Rishra, West Bengal",
  },
];

const PROJECTS = [
  {
    title: "Personal Portfolio Website",
    year: "2024",
    tags: ["React", "CSS", "GitHub Pages"],
    desc: "Designed and deployed a personal portfolio with a mission-control aesthetic. Showcases skills, resume, and links. Built with React and deployed via GitHub Pages.",
    link: "#",
  },
  {
    title: "CGPA Prediction — Machine Learning",
    year: "2024",
    tags: ["Python", "scikit-learn", "Regression"],
    desc: "Built a regression pipeline in Python and scikit-learn to predict academic CGPA. Applied data preprocessing, feature selection, Linear Regression, and Decision Tree models. Visualised results with matplotlib and seaborn.",
    link: "#",
  },
  {
    title: "Study Analyser",
    year: "2023",
    tags: ["Python", "Pandas", "Data Analysis"],
    desc: "An analytics tool that processes academic performance records and generates insights on study patterns, helping students optimise their revision strategy.",
    link: "#",
  },
  {
    title: "Face Forgery Detection",
    year: "2024",
    tags: ["Deep Learning", "CV", "Python"],
    desc: "Explored computer-vision techniques to classify real vs. manipulated facial images. Leveraged transfer learning on CNN architectures for robust forgery detection.",
    link: "#",
  },
];

const JOURNEY = [
  { year: "2003", text: "Born in West Bengal, India — surrounded by the colours of Durga Puja and the rivers of Bengal." },
  { year: "2020", text: "Cleared Class X with 89%. Developed a curiosity for computers and logical thinking." },
  { year: "2022", text: "Scored 88.8% in Class XII. Chose technology as a career direction." },
  { year: "2023", text: "Entered Birla Institute of Technology, Mesra — pursuing B.Tech in Artificial Intelligence." },
  { year: "2024", text: "Built first ML projects, deployed a portfolio, and fell in love with frontend design." },
  { year: "Now", text: "Aspiring Frontend Designer crafting immersive interfaces, one scroll at a time." },
];

/* ─────────────────────────────────────────────────────────
   ANIMATION & UTILITY COMPONENTS
───────────────────────────────────────────────────────── */

// The Scroll unrolling Entrance screen
function ScrollEntranceLoader({ onComplete }) {
  return (
    <motion.div
       initial={{ opacity: 1 }}
       animate={{ opacity: 0 }}
       transition={{ delay: 2.2, duration: 1 }}
       onAnimationComplete={onComplete}
       className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden"
    >
       {/* Left Scroll Roll */}
       <motion.div
          initial={{ right: "50%" }}
          animate={{ right: "100%" }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.77, 0, 0.17, 1] }}
          className="absolute top-0 bottom-0 left-0 bg-[var(--parchment-deep)] border-r-[18px] border-[#9B2335] shadow-[15px_0_50px_rgba(0,0,0,0.8)] z-20"
       >
         <div className="absolute right-0 top-0 bottom-0 w-16 bg-[url('/madhubani_banner.png')] opacity-30 mix-blend-multiply" />
       </motion.div>

       {/* Right Scroll Roll */}
       <motion.div
          initial={{ left: "50%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.77, 0, 0.17, 1] }}
          className="absolute top-0 bottom-0 right-0 bg-[var(--parchment-deep)] border-l-[18px] border-[#9B2335] shadow-[-15px_0_50px_rgba(0,0,0,0.8)] z-20"
       >
         <div className="absolute left-0 top-0 bottom-0 w-16 bg-[url('/madhubani_banner.png')] opacity-30 mix-blend-multiply" />
       </motion.div>

       {/* Center Golden Seal */}
       <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-30 w-28 h-28 rounded-full bg-gradient-to-br from-[var(--saffron)] to-[var(--turmeric)] border-4 border-[var(--parchment)] shadow-2xl flex items-center justify-center text-[var(--parchment)] text-5xl"
       >
         ॐ
       </motion.div>
    </motion.div>
  );
}

function PatachitraUnroll({ children, delay = 0, isActive }) {
  return (
    <motion.div
      initial="closed"
      animate={isActive ? "open" : "closed"}
      variants={{
        closed: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: 0 },
        open: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }
      }}
      transition={{ duration: 1.2, ease: [0.77, 0, 0.17, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Divider() {
  return <div className="panel-divider" />;
}

function MadhubaniTop() {
  return <div className="madhubani-band" style={{ top: 0 }} />;
}
function MadhubaniBottom() {
  return <div className="madhubani-band" style={{ bottom: 0 }} />;
}

function SectionLabel({ text }) {
  return <div className="section-label hidden md:block">{text}</div>;
}

function OrnamentLine({ isActive }) {
  return (
    <motion.div 
      initial="closed"
      animate={isActive ? "open" : "closed"}
      variants={{
        closed: { scaleX: 0, opacity: 0 },
        open: { scaleX: 1, opacity: 1 }
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}
    >
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, var(--saffron))", opacity: 0.5 }} />
      <span style={{ color: "var(--saffron)", fontSize: "1.2em", lineHeight: 1 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--saffron))", opacity: 0.5 }} />
    </motion.div>
  );
}

function SkillBar({ name, level, delay = 0, isActive }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", letterSpacing: "0.04em" }}>
        <span style={{ color: "var(--cream-text)" }}>{name}</span>
        <span style={{ color: "var(--muted-text)", fontSize: "0.85em" }}>{level}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
           className="skill-bar-fill"
           initial="closed"
           animate={isActive ? "open" : "closed"}
           variants={{ closed: { scaleX: 0 }, open: { scaleX: level / 100 } }}
           transition={{ duration: 1, ease: "easeOut", delay: delay + 0.1 }}
        />
      </div>
    </div>
  );
}

function Tag({ text }) {
  return (
    <span style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "0.7rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--saffron)",
      border: "1px solid var(--saffron)",
      padding: "2px 8px",
      marginRight: 6,
      marginBottom: 4,
      display: "inline-block",
      opacity: 0.85,
    }}>{text}</span>
  );
}

/* ─────────────────────────────────────────────────────────
   NAV DOTS
───────────────────────────────────────────────────────── */
function NavDots({ sections, active, onDotClick }) {
  return (
    <div 
      className="hidden md:flex" 
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        gap: 10,
        zIndex: 100,
      }}
    >
      {sections.map((s, i) => (
        <div
          key={i}
          className={`nav-dot${active === i ? " active" : ""}`}
          onClick={() => onDotClick(i)}
          title={s}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PANELS
───────────────────────────────────────────────────────── */

function HeroPanel({ isActive }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, []);
  const phrases = ["Frontend Designer", "AI Engineer", "Creative Coder", "Problem Solver"];
  const phrase = phrases[Math.floor(tick / 30) % phrases.length];
  const charCount = tick % 30;
  const typed = phrase.slice(0, charCount);

  return (
    <div className="panel w-full md:w-[100vw] px-6 md:px-[8vw]" style={{ background: "var(--parchment)", position: "relative" }} id="panel-0">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Portfolio · Parthib Saha" />

      {/* Hero Right Mandala (100% circular constrained with gradient edge fade) */}
      <div className="hidden md:block" style={{ position: "absolute", right: "5vw", top: "50%", transform: "translateY(-50%)", opacity: 0.12, width: 400, height: 400, borderRadius: "50%", overflow: "hidden", WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 70%)", maskImage: "radial-gradient(circle, black 45%, transparent 70%)" }}>
        <img src="/mandala.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 50%", animation: "spin-slow 30s linear infinite", mixBlendMode: "multiply" }} />
      </div>

      <PatachitraUnroll isActive={isActive}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", letterSpacing: "0.3em", color: "var(--saffron)", textTransform: "uppercase", marginBottom: 20, opacity: 0.8 }}>
            ॐ &nbsp;·&nbsp; Namaste
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 300, lineHeight: 1.05, color: "var(--indigo-ink)", letterSpacing: "-0.01em", margin: 0 }}>
            Parthib<br />
            <em style={{ color: "var(--saffron)", fontStyle: "italic" }}>Saha</em>
          </h1>

          <OrnamentLine isActive={isActive} />

          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(1rem, 2.2vw, 1.5rem)", color: "var(--muted-text)", letterSpacing: "0.05em", marginBottom: 8 }}>
            Aspiring&nbsp;
            <span style={{ color: "var(--henna)", fontStyle: "italic" }}>
              {typed}
              <span style={{ animation: "blink 1s step-end infinite", opacity: charCount % 2 === 0 ? 1 : 0 }}>|</span>
            </span>
          </div>

          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "var(--muted-text)", maxWidth: 420, lineHeight: 1.7, marginTop: 12 }}>
            B.Tech AI student at BIT Mesra · West Bengal, India.<br />
            Building beautiful interfaces inspired by the colours and patterns of Bharat.
          </p>
        </div>
      </PatachitraUnroll>
      <Divider />
    </div>
  );
}

function AboutPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[80vw] px-6 md:px-[7vw]" style={{ background: "var(--parchment-dark)", position: "relative" }} id="panel-1">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="About · परिचय" />

      <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-[6vw] items-center h-fit md:h-full">
        <div style={{ display: "flex", justifyContent: "center" }} className="order-2 md:order-1">
          <PatachitraUnroll isActive={isActive}>
            <div style={{ position: "relative", width: 260, height: 260 }}>
              
              {/* Massive 160% perfectly clamped Mandala with gradient fade */}
              <div style={{ position: "absolute", top: "-30%", left: "-30%", width: "160%", height: "160%", pointerEvents: "none", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", WebkitMaskImage: "radial-gradient(circle, black 50%, transparent 70%)", maskImage: "radial-gradient(circle, black 50%, transparent 70%)" }}>
                <img src="/mandala.png" alt="decoration" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, transformOrigin: "50% 50%", animation: "spin-slow 25s linear infinite", mixBlendMode: "multiply" }} />
              </div>

              <div style={{
                width: 260, height: 260, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--saffron) 0%, var(--turmeric) 50%, var(--henna) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "6rem", color: "var(--parchment)", fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, boxShadow: "0 8px 40px rgba(232,101,26,0.3)",
                border: "4px solid var(--parchment)",
                position: "relative", zIndex: 1,
              }}>
                PS
              </div>
            </div>
          </PatachitraUnroll>
        </div>

        <div className="order-1 md:order-2">
          <PatachitraUnroll isActive={isActive} delay={0.2}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
              About Me
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
              Rooted in Bengal,<br /><em>dreaming in pixels.</em>
            </h2>
            <OrnamentLine isActive={isActive} />
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", color: "var(--muted-text)", lineHeight: 1.85, marginBottom: 14 }}>
              I'm Parthib Saha — an AI engineering student who believes that great software is as much an art form as a technical discipline.
            </p>
            <div className="mt-6 flex gap-6 flex-wrap justify-center md:justify-start">
              {[["CGPA", "8.1"], ["Projects", "4+"], ["Year", "2nd"]].map(([k, v]) => (
                <div key={k} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: "var(--saffron)" }}>{v}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted-text)" }}>{k}</div>
                </div>
              ))}
            </div>
          </PatachitraUnroll>
        </div>
      </div>
      <Divider />
    </div>
  );
}

function JourneyPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[90vw] px-6 md:px-[8vw]" style={{ background: "var(--parchment)", position: "relative" }} id="panel-2">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Journey · यात्रा" />

      <div className="flex flex-col md:flex-row gap-8 md:gap-[8vw] items-start md:h-full pt-10 md:pt-0 pb-10">
        <PatachitraUnroll isActive={isActive}>
          <div className="md:pt-[60px]" style={{ maxWidth: 320 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
              My Story
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 8px" }}>
              A journey of<br /><em>a thousand scrolls.</em>
            </h2>
            <OrnamentLine isActive={isActive} />
            <p style={{ fontFamily: "'EB Garamond', serif", color: "var(--muted-text)", lineHeight: 1.8, fontSize: "0.98rem" }}>
              Every great design begins with a story. Here is mine — unfolding like a Bengali patachitra scroll, one chapter at a time.
            </p>
          </div>
        </PatachitraUnroll>

        <div className="flex-1 w-full relative md:pt-8 overflow-y-auto max-h-[60vh] md:max-h-[70vh] custom-scroll">
          <div style={{ position: "absolute", left: 4, top: 0, bottom: 0, width: 1.5, background: "linear-gradient(to bottom, var(--saffron), var(--turmeric), transparent)", opacity: 0.4 }} />

          {JOURNEY.map((item, i) => (
            <motion.div
              key={i}
              initial="closed"
              animate={isActive ? "open" : "closed"}
              variants={{
                closed: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: 0 },
                open: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }
              }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              style={{ display: "flex", gap: 20, marginBottom: 36, paddingLeft: 24, position: "relative" }}
            >
              <div className="timeline-dot" style={{ position: "absolute", left: -1 }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 4 }}>
                  {item.year}
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "var(--cream-text)", lineHeight: 1.7 }}>
                  {item.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Divider />
    </div>
  );
}

function SkillsPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[85vw] px-6 md:px-[8vw]" style={{ background: "var(--parchment-dark)", position: "relative" }} id="panel-3">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Skills · कौशल" />

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-[6vw] items-start pt-10 pb-10">
        <PatachitraUnroll isActive={isActive}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
              Technical Skills
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
              The threads of<br /><em>my craft.</em>
            </h2>
            <OrnamentLine isActive={isActive} />

            <div style={{ padding: "20px 24px", background: "var(--parchment)", border: "1px solid var(--parchment-deep)", borderRadius: 2 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted-text)", marginBottom: 16 }}>
                Also Proficient In
              </div>
              {["Competitive Programming (LeetCode)", "Data Preprocessing & Visualisation", "UI/UX Design Principles", "Git & Version Control"].map((item, i) => (
                <div key={i} style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "var(--cream-text)", padding: "6px 0", borderBottom: "1px solid var(--parchment-deep)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--saffron)", fontSize: "0.7em" }}>✦</span> {item}
                </div>
              ))}
            </div>

            {/* DOWNLOAD RESUME PDF BUTTON */}
            <div className="mt-8 flex justify-center md:justify-start">
               <a href="/Parthib_Saha_Resume.pdf" download="Parthib_Saha_Resume.pdf" style={{ textDecoration: "none" }}>
                  <button className="india-btn flex items-center justify-center gap-3 w-full md:w-auto">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     DOWNLOAD PDF RESUME
                  </button>
               </a>
            </div>

          </div>
        </PatachitraUnroll>

        <PatachitraUnroll isActive={isActive} delay={0.2}>
          <div className="w-full">
            {SKILLS.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.05} isActive={isActive} />)}
          </div>
        </PatachitraUnroll>
      </div>
      <Divider />
    </div>
  );
}

function ProjectsPanel({ isActive }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="panel w-full md:w-[100vw] px-6 md:px-[6vw]" style={{ background: "var(--parchment)", position: "relative" }} id="panel-4">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Projects · परियोजनाएँ" />

      <PatachitraUnroll isActive={isActive}>
        <div className="pt-10 md:pt-0">
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
            Selected Works
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 8px" }}>
            Things I have<br /><em>built with care.</em>
          </h2>
          <OrnamentLine isActive={isActive} />
        </div>
      </PatachitraUnroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-8 pb-10">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={i}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            initial="closed"
            animate={isActive ? "open" : "closed"}
            variants={{
                closed: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: 0 },
                open: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }
            }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            style={{
              padding: "20px 24px",
              border: `1px solid ${hovered === i ? "var(--saffron)" : "var(--parchment-deep)"}`,
              background: hovered === i ? "rgba(232,101,26,0.04)" : "var(--parchment-dark)",
              transition: "all 0.35s ease",
              cursor: "default",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--muted-text)", opacity: 0.7 }}>
              {p.year}
            </div>

            <div style={{ marginBottom: 10 }}>
              {p.tags.map(t => <Tag key={t} text={t} />)}
            </div>
            <h3 className="text-[1.2rem] md:text-[1.4rem]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: "var(--indigo-ink)", margin: "0 0 8px" }}>
              {p.title}
            </h3>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "var(--muted-text)", lineHeight: 1.6, margin: 0 }}>
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
      <Divider />
    </div>
  );
}

function EducationPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[75vw] px-6 md:px-[7vw]" style={{ background: "var(--parchment-dark)", position: "relative" }} id="panel-5">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Education · शिक्षा" />

      <PatachitraUnroll isActive={isActive}>
        <div className="pt-10 pb-10">
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
            Academic Path
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3.2rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
            Where knowledge<br /><em>found its roots.</em>
          </h2>
          <OrnamentLine isActive={isActive} />

          <div style={{ marginTop: 20, position: "relative" }}>
            <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1.5, background: "linear-gradient(to bottom, var(--saffron), transparent)", opacity: 0.4 }} />

            {EDUCATION.map((edu, i) => (
              <motion.div
                key={i}
                initial="closed"
                animate={isActive ? "open" : "closed"}
                variants={{
                    closed: { opacity: 0, x: -30 },
                    open: { opacity: 1, x: 0 }
                }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                style={{ display: "flex", gap: 30, marginBottom: 44, paddingLeft: 28, position: "relative" }}
              >
                <div className="timeline-dot" style={{ position: "absolute", left: 0, top: 6 }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 6 }}>
                    {edu.year}
                  </div>
                  <div className="text-[1.1rem] md:text-[1.3rem]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: "var(--indigo-ink)", marginBottom: 4 }}>
                    {edu.title}
                  </div>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "var(--cream-text)", fontStyle: "italic", marginBottom: 4 }}>
                    {edu.place}
                  </div>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "var(--muted-text)" }}>
                    {edu.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PatachitraUnroll>
      <Divider />
    </div>
  );
}

function ContactPanel({ isActive }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="panel w-full md:w-[90vw] px-6 md:px-[8vw]" style={{ background: "var(--parchment)", position: "relative" }} id="panel-6">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Contact · संपर्क" />

      <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-[7vw] items-center h-fit md:h-full pt-10 pb-10">
        <PatachitraUnroll isActive={isActive}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
              Get In Touch
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
              Let's create<br /><em>something together.</em>
            </h2>
            <OrnamentLine isActive={isActive} />
            <p style={{ fontFamily: "'EB Garamond', serif", color: "var(--muted-text)", lineHeight: 1.85, fontSize: "1.02rem", marginBottom: 32 }}>
              Whether you have a project in mind, an opportunity to share, or simply wish to say namaste — my inbox is always open.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Email", "parthibsaha.11sc2020@gmail.com", "mailto:parthibsaha.11sc2020@gmail.com"],
                ["WhatsApp", "+91 9330616676", "https://wa.me/919330616676?text=Hi%20Parthib!%20I%20reached%20you%20from%20your%20portfolio."],
                ["LinkedIn", "linkedin.com/in/parthib-saha", "https://linkedin.com/in/parthib-saha"],
              ].map(([label, value, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "10px 16px",
                    border: "1px solid var(--parchment-deep)",
                    transition: "border-color 0.3s, background 0.3s",
                    background: "var(--parchment-dark)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--saffron)"; e.currentTarget.style.background = "rgba(232,101,26,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--parchment-deep)"; e.currentTarget.style.background = "var(--parchment-dark)"; }}
                  >
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--saffron)", minWidth: 64 }}>{label}</span>
                    <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "var(--cream-text)" }}>{value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </PatachitraUnroll>

        <PatachitraUnroll isActive={isActive} delay={0.2}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted-text)", marginBottom: -8 }}>
              Send A Message
            </div>

            {[
              { id: "name", placeholder: "Your Name", type: "text" },
              { id: "email", placeholder: "Your Email", type: "email" },
            ].map(({ id, placeholder, type }) => (
              <input
                key={id}
                type={type}
                placeholder={placeholder}
                className="india-input"
                value={form[id]}
                onChange={e => setForm({ ...form, [id]: e.target.value })}
              />
            ))}

            <textarea
              placeholder="Your Message"
              className="india-input"
              rows={5}
              style={{ resize: "none" }}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <button type="submit" className="india-btn" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
              <AnimatePresence>
                {sent && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "var(--forest)", fontStyle: "italic" }}
                  >
                    Message sent. Dhanyavaad 🙏
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </PatachitraUnroll>
      </div>
    </div>
  );
}

function ColophonPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[50vw] px-6 md:px-[6vw]" style={{ background: "var(--parchment-deep)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} id="panel-7">
      <MadhubaniTop />
      <MadhubaniBottom />

      <PatachitraUnroll isActive={isActive}>
        <div style={{ textAlign: "center", position: "relative" }}>
          
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            {/* Clamped Circle Mandala with gradient fade */}
            <div style={{ position: "relative", width: 120, height: 120 }}>
              <div style={{ position: "absolute", top: -30, left: -30, right: -30, bottom: -30, pointerEvents: "none", borderRadius: "50%", overflow: "hidden", WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 70%)", maskImage: "radial-gradient(circle, black 40%, transparent 70%)" }}>
                <img src="/mandala.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 50%", animation: "spin-slow 20s linear infinite", opacity: 0.25, mixBlendMode: "multiply" }} />
              </div>
            </div>
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 14 }}>
            ~ समाप्त ~
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 8px" }}>
            Thank you.
          </h2>
          <p style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", color: "var(--muted-text)", fontSize: "1.1rem", lineHeight: 1.8 }}>
            "Like the Ganga, the journey continues<br />— always forward, never still."
          </p>
          <OrnamentLine isActive={isActive} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted-text)", marginTop: 12 }}>
            © 2025 Parthib Saha · West Bengal, India
          </div>
        </div>
      </PatachitraUnroll>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────── */
const SECTION_NAMES = ["Home", "About", "Journey", "Skills", "Projects", "Education", "Contact", "End"];

export default function App() {
  const wrapperRef = useRef(null);
  const [activePanel, setActivePanel] = useState(0);
  const [unrolledScroll, setUnrolledScroll] = useState(false);

  const scrollToPanel = (i) => {
    const el = wrapperRef.current;
    if (!el) return;
    const panel = el.querySelector(`#panel-${i}`);
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onScroll = () => {
      if (window.innerWidth >= 768) {
        const scrollX = el.scrollLeft;
        const totalScrollWidth = el.scrollWidth - el.clientWidth;
        if (totalScrollWidth <= 0 || scrollX === 0) { setActivePanel(0); return; }
        
        let cumulativeWidth = 0;
        let pIndex = 0;
        for (let i = 0; i < SECTION_NAMES.length; i++) {
          const p = el.querySelector(`#panel-${i}`);
          if (p) {
            cumulativeWidth += p.clientWidth;
            if (scrollX + (el.clientWidth / 2) < cumulativeWidth) {
              pIndex = i;
              break;
            }
          }
        }
        setActivePanel(pIndex);
      } else {
        const scrollY = el.scrollTop;
        let cumulativeHeight = 0;
        let pIndex = 0;
        for (let i = 0; i < SECTION_NAMES.length; i++) {
          const p = el.querySelector(`#panel-${i}`);
          if (p) {
            cumulativeHeight += p.clientHeight;
            if (scrollY + (el.clientHeight / 2) < cumulativeHeight) {
                pIndex = i;
                break;
            }
          }
        }
        setActivePanel(pIndex);
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
      
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActivePanel(p => { const next = Math.min(p + 1, SECTION_NAMES.length - 1); scrollToPanel(next); return next; });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActivePanel(p => { const prev = Math.max(p - 1, 0); scrollToPanel(prev); return prev; });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* THE INITIAL UNROLLING ENTRANCE LOADER OVERLAY */}
      {!unrolledScroll && (
         <ScrollEntranceLoader onComplete={() => setUnrolledScroll(true)} />
      )}

      <div className="outer-wrapper" ref={wrapperRef}>
        <div className="scroll-track">
          {/* Elements stay active if the unroll hasn't finished, giving them time to load their visual assets beneath the loader! */}
          <HeroPanel isActive={activePanel === 0 || !unrolledScroll} />
          <AboutPanel isActive={activePanel === 1} />
          <JourneyPanel isActive={activePanel === 2} />
          <SkillsPanel isActive={activePanel === 3} />
          <ProjectsPanel isActive={activePanel === 4} />
          <EducationPanel isActive={activePanel === 5} />
          <ContactPanel isActive={activePanel === 6} />
          <ColophonPanel isActive={activePanel === 7} />
        </div>
      </div>
      <NavDots sections={SECTION_NAMES} active={activePanel} onDotClick={scrollToPanel} />
    </>
  );
}
