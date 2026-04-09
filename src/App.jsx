import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
   SMALL COMPONENTS
───────────────────────────────────────────────────────── */
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
  return <div className="section-label">{text}</div>;
}

function OrnamentLine() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, var(--saffron))", opacity: 0.5, transformOrigin: "left", animation: "drawLine 1s ease 0.3s both" }} />
      <span style={{ color: "var(--saffron)", fontSize: "1.2em", lineHeight: 1 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--saffron))", opacity: 0.5 }} />
    </div>
  );
}

function SkillBar({ name, level, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", letterSpacing: "0.04em" }}>
        <span style={{ color: "var(--cream-text)" }}>{name}</span>
        <span style={{ color: "var(--muted-text)", fontSize: "0.85em" }}>{level}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="skill-bar-fill"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: delay + 0.2 }}
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
   NAV DOTS (bottom center)
───────────────────────────────────────────────────────── */
function NavDots({ sections, active, onDotClick }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: 10,
      zIndex: 100,
    }}>
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

// 1. HERO
function HeroPanel() {
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
    <div
      className="panel"
      style={{ width: "100vw", background: "var(--parchment)", padding: "0 8vw", position: "relative" }}
      id="panel-0"
    >
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Portfolio · Parthib Saha" />

      {/* Mandala decoration right side */}
      <div style={{ position: "absolute", right: "5vw", top: "50%", transform: "translateY(-50%)", opacity: 0.12 }}>
        <img src="/mandala.png" alt="" style={{ width: 400, height: 400, animation: "spin-slow 30s linear infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Om / greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", letterSpacing: "0.3em", color: "var(--saffron)", textTransform: "uppercase", marginBottom: 20, opacity: 0.8 }}
        >
          ॐ &nbsp;·&nbsp; Namaste
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            color: "var(--indigo-ink)",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Parthib<br />
          <em style={{ color: "var(--saffron)", fontStyle: "italic" }}>Saha</em>
        </motion.h1>

        <OrnamentLine />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
            color: "var(--muted-text)",
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          Aspiring&nbsp;
          <span style={{ color: "var(--henna)", fontStyle: "italic" }}>
            {typed}
            <span style={{ animation: "blink 1s step-end infinite", opacity: charCount % 2 === 0 ? 1 : 0 }}>|</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "var(--muted-text)", maxWidth: 420, lineHeight: 1.7, marginTop: 12 }}
        >
          B.Tech AI student at BIT Mesra · West Bengal, India.<br />
          Building beautiful interfaces inspired by the colours and patterns of Bharat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          style={{ display: "flex", gap: 16, marginTop: 36, flexWrap: "wrap" }}
        >
          <a href="#panel-4" style={{ textDecoration: "none" }}>
            <button className="india-btn">View Projects</button>
          </a>
          <a href="#panel-6" style={{ textDecoration: "none" }}>
            <button className="india-btn" style={{ background: "transparent", color: "var(--saffron)", border: "1px solid var(--saffron)" }}>
              Contact Me
            </button>
          </a>
        </motion.div>
      </div>
      <Divider />
    </div>
  );
}

// 2. ABOUT
function AboutPanel() {
  return (
    <div className="panel" style={{ width: "80vw", background: "var(--parchment-dark)", padding: "80px 7vw", position: "relative" }} id="panel-1">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="About · परिचय" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6vw", alignItems: "center", height: "100%" }}>
        {/* Left – portrait placeholder with mandala */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 260, height: 260 }}>
            <img src="/mandala.png" alt="decoration" style={{ position: "absolute", inset: -30, width: "calc(100%+60px)", height: "calc(100%+60px)", opacity: 0.18, animation: "spin-slow 25s linear infinite" }} />
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
        </div>

        {/* Right – text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
            About Me
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
            Rooted in Bengal,<br /><em>dreaming in pixels.</em>
          </h2>
          <OrnamentLine />
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", color: "var(--muted-text)", lineHeight: 1.85, marginBottom: 14 }}>
            I'm Parthib Saha — an AI engineering student who believes that great software is
            as much an art form as a technical discipline. Growing up in the culturally rich
            heartland of West Bengal, I've always been drawn to things of beauty: the intricate
            geometry of Madhubani art, the vibrant chaos of Kolkata's streets, the quiet
            precision of a perfectly tuned algorithm.
          </p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", color: "var(--muted-text)", lineHeight: 1.85 }}>
            Today, I channel that sensibility into frontend design and machine learning — building
            interfaces that don't just function, but <em>feel.</em>
          </p>

          <div style={{ marginTop: 24, display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["CGPA", "8.1"], ["Projects", "4+"], ["Year", "2nd"]].map(([k, v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: "var(--saffron)" }}>{v}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted-text)" }}>{k}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <Divider />
    </div>
  );
}

// 3. JOURNEY / TIMELINE
function JourneyPanel() {
  return (
    <div className="panel" style={{ width: "90vw", background: "var(--parchment)", padding: "80px 8vw", position: "relative" }} id="panel-2">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Journey · यात्रा" />

      <div style={{ display: "flex", gap: "8vw", alignItems: "flex-start", height: "100%" }}>
        <div style={{ paddingTop: 60 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
            My Story
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 8px", maxWidth: 280 }}>
            A journey of<br /><em>a thousand scrolls.</em>
          </h2>
          <OrnamentLine />
          <p style={{ fontFamily: "'EB Garamond', serif", color: "var(--muted-text)", lineHeight: 1.8, fontSize: "0.98rem", maxWidth: 260 }}>
            Every great design begins with a story. Here is mine — unfolding like a Bengali patachitra scroll, one chapter at a time.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, position: "relative", paddingTop: 30, overflowY: "auto", maxHeight: "70vh" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 4, top: 0, bottom: 0, width: 1.5, background: "linear-gradient(to bottom, var(--saffron), var(--turmeric), transparent)", opacity: 0.4 }} />

          {JOURNEY.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
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

// 4. SKILLS
function SkillsPanel() {
  return (
    <div className="panel" style={{ width: "85vw", background: "var(--parchment-dark)", padding: "80px 8vw", position: "relative" }} id="panel-3">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Skills · कौशल" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6vw", alignItems: "start", paddingTop: 20 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
            Technical Skills
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
            The threads of<br /><em>my craft.</em>
          </h2>
          <OrnamentLine />
          <p style={{ fontFamily: "'EB Garamond', serif", color: "var(--muted-text)", lineHeight: 1.8, fontSize: "0.98rem", marginBottom: 28 }}>
            Like the intricate weave of a Banarasi saree, each skill interlocks with the next — building something greater than its individual threads.
          </p>

          <div style={{ padding: "20px 24px", background: "var(--parchment)", border: "1px solid var(--parchment-deep)", borderRadius: 2 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted-text)", marginBottom: 16 }}>
              Also Proficient In
            </div>
            {["Competitive Programming · LeetCode", "Data Preprocessing & Feature Engineering", "Data Visualisation · matplotlib & seaborn", "UI/UX Design Principles", "Git & Version Control"].map((item, i) => (
              <div key={i} style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "var(--cream-text)", padding: "6px 0", borderBottom: "1px solid var(--parchment-deep)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--saffron)", fontSize: "0.7em" }}>✦</span> {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: 10 }}>
          {SKILLS.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.07} />)}
        </div>
      </div>
      <Divider />
    </div>
  );
}

// 5. PROJECTS
function ProjectsPanel() {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="panel" style={{ width: "100vw", background: "var(--parchment)", padding: "80px 6vw", position: "relative" }} id="panel-4">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Projects · परियोजनाएँ" />

      <div style={{ paddingTop: 10 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
          Selected Works
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 8px" }}>
          Things I have<br /><em>built with care.</em>
        </h2>
        <OrnamentLine />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginTop: 8 }}>
        {PROJECTS.map((p, i) => (
          <motion.div
            key={i}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            style={{
              padding: "24px 28px",
              border: `1px solid ${hovered === i ? "var(--saffron)" : "var(--parchment-deep)"}`,
              background: hovered === i ? "rgba(232,101,26,0.04)" : "var(--parchment-dark)",
              transition: "all 0.35s ease",
              cursor: "default",
              position: "relative",
            }}
          >
            {/* Year badge */}
            <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--muted-text)", opacity: 0.7 }}>
              {p.year}
            </div>

            <div style={{ marginBottom: 10 }}>
              {p.tags.map(t => <Tag key={t} text={t} />)}
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 500, color: "var(--indigo-ink)", margin: "0 0 10px" }}>
              {p.title}
            </h3>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "var(--muted-text)", lineHeight: 1.75, margin: 0 }}>
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
      <Divider />
    </div>
  );
}

// 6. EDUCATION
function EducationPanel() {
  return (
    <div className="panel" style={{ width: "75vw", background: "var(--parchment-dark)", padding: "80px 7vw", position: "relative" }} id="panel-5">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Education · शिक्षा" />

      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
          Academic Path
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3.2rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
          Where knowledge<br /><em>found its roots.</em>
        </h2>
        <OrnamentLine />

        <div style={{ marginTop: 20, position: "relative" }}>
          <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1.5, background: "linear-gradient(to bottom, var(--saffron), transparent)", opacity: 0.4 }} />

          {EDUCATION.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              viewport={{ once: true }}
              style={{ display: "flex", gap: 30, marginBottom: 44, paddingLeft: 28, position: "relative" }}
            >
              <div className="timeline-dot" style={{ position: "absolute", left: 0, top: 6 }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 6 }}>
                  {edu.year}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 500, color: "var(--indigo-ink)", marginBottom: 4 }}>
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
      <Divider />
    </div>
  );
}

// 7. CONTACT
function ContactPanel() {
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
    <div className="panel" style={{ width: "90vw", background: "var(--parchment)", padding: "80px 8vw", position: "relative" }} id="panel-6">
      <MadhubaniTop />
      <MadhubaniBottom />
      <SectionLabel text="Contact · संपर्क" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7vw", alignItems: "center", height: "100%" }}>
        {/* Left */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 10 }}>
            Get In Touch
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 16px" }}>
            Let's create<br /><em>something together.</em>
          </h2>
          <OrnamentLine />
          <p style={{ fontFamily: "'EB Garamond', serif", color: "var(--muted-text)", lineHeight: 1.85, fontSize: "1.02rem", marginBottom: 32 }}>
            Whether you have a project in mind, an opportunity to share, or simply wish to say namaste — my inbox is always open.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Email", "parthibsaha.11sc2020@gmail.com", "mailto:parthibsaha.11sc2020@gmail.com"],
              ["WhatsApp", "+91 9330616676", "https://wa.me/919330616676?text=Hi%20Parthib!%20I%20reached%20you%20from%20your%20portfolio."],
              ["LinkedIn", "linkedin.com/in/parthib-saha", "https://linkedin.com/in/parthib-saha"],
            ].map(([label, value, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px",
                  border: "1px solid var(--parchment-deep)",
                  transition: "border-color 0.3s, background 0.3s",
                  background: "var(--parchment-dark)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--saffron)"; e.currentTarget.style.background = "rgba(232,101,26,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--parchment-deep)"; e.currentTarget.style.background = "var(--parchment-dark)"; }}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--saffron)", minWidth: 64 }}>{label}</span>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.98rem", color: "var(--cream-text)" }}>{value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right – Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
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
        </motion.form>
      </div>
    </div>
  );
}

// 8. COLOPHON (final scroll panel like on the Japanese site)
function ColophonPanel() {
  return (
    <div className="panel" style={{ width: "50vw", background: "var(--parchment-deep)", padding: "80px 6vw", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} id="panel-7">
      <MadhubaniTop />
      <MadhubaniBottom />

      <div style={{ textAlign: "center" }}>
        <img src="/mandala.png" alt="" style={{ width: 120, height: 120, opacity: 0.25, animation: "spin-slow 20s linear infinite", marginBottom: 24 }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 14 }}>
          ~ समाप्त ~
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: "var(--indigo-ink)", margin: "0 0 8px" }}>
          Thank you.
        </h2>
        <p style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", color: "var(--muted-text)", fontSize: "1.1rem", lineHeight: 1.8 }}>
          "Like the Ganga, the journey continues<br />— always forward, never still."
        </p>
        <OrnamentLine />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted-text)", marginTop: 12 }}>
          © 2025 Parthib Saha · West Bengal, India
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SCROLL HINT
───────────────────────────────────────────────────────── */
function ScrollHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", bottom: 64, right: 40,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.75rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "var(--muted-text)", opacity: 0.7,
            display: "flex", alignItems: "center", gap: 8,
            zIndex: 100,
          }}
        >
          <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>→</motion.span>
          Scroll to explore
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────── */
const SECTION_NAMES = ["Home", "About", "Journey", "Skills", "Projects", "Education", "Contact", "End"];

export default function App() {
  const wrapperRef = useRef(null);
  const [activePanel, setActivePanel] = useState(0);

  // Track active panel via scroll
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollX = el.scrollLeft;
      const panelWidth = el.scrollWidth / SECTION_NAMES.length;
      setActivePanel(Math.round(scrollX / panelWidth));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPanel = (i) => {
    const el = wrapperRef.current;
    if (!el) return;
    const panel = el.querySelector(`#panel-${i}`);
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <>
      <div className="outer-wrapper" ref={wrapperRef}>
        <div className="scroll-track">
          <HeroPanel />
          <AboutPanel />
          <JourneyPanel />
          <SkillsPanel />
          <ProjectsPanel />
          <EducationPanel />
          <ContactPanel />
          <ColophonPanel />
        </div>
      </div>
      <NavDots sections={SECTION_NAMES} active={activePanel} onDotClick={scrollToPanel} />
      <ScrollHint />
    </>
  );
}
