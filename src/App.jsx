import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import "./index.css";

/* ── Data ──────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    title: "Mission Control Portfolio",
    category: "Web Development",
    year: "2024",
    color: "#e8e4ff",
    tags: ["React", "CSS", "GitHub"],
    desc: "A full-featured personal portfolio with an immersive aesthetic. Showcases skills, timeline, and projects with smooth animations.",
  },
  {
    id: 2,
    title: "CGPA Predictor v1.0",
    category: "Machine Learning",
    year: "2024",
    color: "#fff4e8",
    tags: ["Python", "scikit-learn", "Regression"],
    desc: "An ML regression pipeline to predict academic performance from study patterns, applying feature selection and data preprocessing.",
  },
  {
    id: 3,
    title: "Face Forgery Detection",
    category: "Computer Vision",
    year: "2024",
    color: "#e8f4ff",
    tags: ["Deep Learning", "CNN", "Python"],
    desc: "Computer-vision system to classify real vs. AI-manipulated facial images using advanced CNN architectures.",
  },
  {
    id: 4,
    title: "Study Analyser",
    category: "Data Analytics",
    year: "2023",
    color: "#e8ffee",
    tags: ["Python", "Pandas", "Matplotlib"],
    desc: "Data pipeline to process academic records and surface insights on study patterns to drive performance optimisation.",
  },
];

const SKILLS = [
  { num: "01", label: "Frontend Engineering", detail: "React, HTML, CSS, JavaScript — crafting interfaces that feel alive.", lottie: "/web-dev.c0017e.lottie" },
  { num: "02", label: "Machine Learning", detail: "scikit-learn, TensorFlow, Python — building models that learn and infer.", lottie: "/seo.475764.lottie" },
  { num: "03", label: "Backend Systems", detail: "Python, C/C++, SQL — designing the logic beneath the surface.", lottie: "/hosting.d6d8cb.lottie" },
  { num: "04", label: "Data & Analytics", detail: "Pandas, NumPy, Matplotlib — turning raw data into clear decisions.", lottie: "/social.7759fe.lottie" },
];

const STATS = [
  { value: "8.1", label: "CGPA", suffix: "" },
  { value: "4+", label: "Projects Shipped", suffix: "" },
  { value: "20", label: "Years on Earth", suffix: "yrs" },
  { value: "3+", label: "Languages Mastered", suffix: "" },
];

/* ── Arrow SVG ─────────────────────────────────────────────── */
const ArrowIcon = ({ size = 20 }) => (
  <svg width={size} height={size * 0.87} fill="none" viewBox="0 0 23 20">
    <path fill="currentColor" stroke="transparent"
      d="M10.897 0a.979.979 0 1 0 0 1.957h8.787a1 1 0 0 1 1 1v7.787a1 1 0 0 1-1 1H5.817c-.891 0-1.338-1.077-.708-1.707l2.781-2.78a.979.979 0 0 0-1.384-1.385L.293 12.085a1 1 0 0 0 0 1.414l6.213 6.214a.979.979 0 0 0 1.384-1.384l-2.919-2.92c-.63-.63-.183-1.707.708-1.707h15.005c1.08 0 1.957-.877 1.957-1.958V1.957A1.96 1.96 0 0 0 20.684 0z" />
  </svg>
);

/* ── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Work", "Skills", "About", "Contact"];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: scrolled ? 12 : 20, left: 0, right: 0,
        zIndex: 1000, display: "flex", justifyContent: "center",
        padding: "0 20px", pointerEvents: "none",
        transition: "top 0.3s"
      }}
    >
      <div className="nav-pill" style={{ pointerEvents: "all", maxWidth: 900, width: "100%", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="#home" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.1rem", color: "#fff", textDecoration: "none", letterSpacing: "-0.03em", flexShrink: 0 }}>
          Parthib<span style={{ color: "var(--orange)" }}>.</span>
        </a>

        {/* Desktop links */}
        <nav className="hide-mobile" style={{ display: "flex", gap: 4 }}>
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">{link}</a>
          ))}
        </nav>

        <a href="#contact" className="btn-orange" style={{ flexShrink: 0 }}>Say hey</a>
      </div>
    </motion.header>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" style={{ minHeight: "100dvh", paddingTop: "10rem", paddingBottom: "6rem", background: "var(--white)", position: "relative", overflow: "hidden" }}>
      <div className="container">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, color: "#666", letterSpacing: "0.02em" }}>
            B.Tech AI @ BIT Mesra · Open to opportunities
          </span>
        </motion.div>

        {/* Big headline */}
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="text-hero"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            Building<br />
            <span style={{ color: "var(--orange)" }}>digital</span><br />
            that thinks.
          </motion.h1>
        </div>

        {/* Sub-row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginTop: 48 }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.65, color: "#555", maxWidth: 360, fontWeight: 400 }}>
            I'm Parthib Saha — a frontend engineer and AI specialist from West Bengal, India.
            I craft interfaces that sit at the intersection of aesthetics and intelligence.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <a href="#work" className="btn-primary">
              <span className="btn-label">View my work</span>
              <span className="btn-arrow"><ArrowIcon /></span>
            </a>
            <a href="/Parthib_Saha_Resume.pdf" download className="btn-primary">
              <span className="btn-label" style={{ background: "transparent", color: "var(--black)" }}>Download CV</span>
              <span className="btn-arrow"><ArrowIcon /></span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Lottie world */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", width: "clamp(280px, 45vw, 640px)", pointerEvents: "none", zIndex: 0 }}
        className="hide-mobile"
      >
        <dotlottie-player
          src="/web-dev.c0017e.lottie"
          autoplay
          loop
          style={{ width: "100%", height: "auto" }}
        />
      </motion.div>
    </section>
  );
}

/* ── Stats Ticker ─────────────────────────────────────────────── */
function StatsTicker() {
  return (
    <section style={{ background: "var(--black)", color: "var(--white)", padding: "32px 0", overflow: "hidden" }}>
      <div style={{ overflow: "hidden" }}>
        <div className="marquee-track" style={{ gap: "80px" }}>
          {[...STATS, ...STATS].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16, flexShrink: 0 }}>
              <span className="stat-value" style={{ color: "var(--orange)" }}>{s.value}{s.suffix}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Work ─────────────────────────────────────────────────────── */
function Work() {
  return (
    <section id="work" className="section" style={{ background: "var(--grey)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 56 }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.5, marginBottom: 12 }}>// Selected Projects</p>
            <h2 className="text-display">Work that<br />speaks for itself.</h2>
          </div>
          <a href="#contact" className="btn-primary">
            <span className="btn-label">Start a project</span>
            <span className="btn-arrow"><ArrowIcon /></span>
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))", gap: 20 }}>
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              className="project-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Card colour swatch */}
              <div style={{ height: 200, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800, letterSpacing: "-0.05em", opacity: 0.12, lineHeight: 1, textAlign: "center", userSelect: "none" }}>
                  {p.title.split(" ")[0]}
                </span>
                <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.08)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "6px 12px", fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600 }}>
                  {p.year}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "28px 28px 32px" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, color: "#555" }}>{t}</span>
                  ))}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.45, marginBottom: 8 }}>{p.category}</p>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "-0.02em", marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#666", lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Skills ──────────────────────────────────────────────────── */
function Skills() {
  const [activeSkill, setActiveSkill] = useState(0);

  return (
    <section id="skills" className="section" style={{ background: "var(--white)" }}>
      <div className="container">
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.5, marginBottom: 12 }}>// Capabilities</p>
          <h2 className="text-display">What I do,<br />exceptionally well.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="skills-grid">
          {/* Skill List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SKILLS.map((s, i) => (
              <motion.div
                key={i}
                className="skill-card"
                onClick={() => setActiveSkill(i)}
                style={{ cursor: "pointer", borderColor: activeSkill === i ? "var(--black)" : "var(--border)", background: activeSkill === i ? "var(--black)" : "var(--white)", color: activeSkill === i ? "var(--white)" : "var(--black)", transition: "all 0.25s" }}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", opacity: 0.4, letterSpacing: "-0.02em", flexShrink: 0, marginTop: 2 }}>({s.num})</span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em", marginBottom: 6 }}>{s.label}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", opacity: 0.7, lineHeight: 1.55 }}>{s.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lottie Preview */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45 }}
                style={{ width: "min(100%, 380px)" }}
              >
                <dotlottie-player
                  src={SKILLS[activeSkill].lottie}
                  autoplay
                  loop
                  style={{ width: "100%", height: "auto" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ── About ───────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="section" style={{ background: "var(--black)", color: "var(--white)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 100px)", alignItems: "center" }} className="about-grid">
          {/* Left: big text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.4, marginBottom: 20 }}>// About Me</p>
            <h2 className="text-display" style={{ marginBottom: 32 }}>
              Rooted in<br />
              <span style={{ color: "var(--orange)" }}>West Bengal,</span><br />
              dreaming in code.
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              {STATS.map((s, i) => (
                <div key={i}>
                  <div className="stat-value" style={{ color: "var(--orange)" }}>{s.value}{s.suffix}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", opacity: 0.5, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.7)" }}>
              <p>
                I'm a second-year B.Tech student in Artificial Intelligence at BIT Mesra — but I've been building things on the web long before that. I treat code as a craft, not just a tool.
              </p>
              <p>
                My focus lies at the intersection of <strong style={{ color: "var(--white)", fontWeight: 600 }}>beautiful interfaces</strong> and <strong style={{ color: "var(--white)", fontWeight: 600 }}>intelligent systems</strong>. Whether it's a React UI or a machine learning pipeline, I obsess over the details.
              </p>
              <p>
                Outside the terminal: cricket, philosophy, and convincing people that design is just applied empathy.
              </p>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="/Parthib_Saha_Resume.pdf" download className="btn-primary">
                <span className="btn-label" style={{ background: "var(--orange)", borderColor: "var(--orange)", color: "var(--black)" }}>Download CV</span>
                <span className="btn-arrow" style={{ borderColor: "rgba(255,255,255,0.2)", background: "transparent" }}><ArrowIcon /></span>
              </a>
              <a href="mailto:parthibsaha.11sc2020@gmail.com" className="btn-primary">
                <span className="btn-label" style={{ background: "transparent", color: "var(--white)" }}>Email me</span>
                <span className="btn-arrow" style={{ borderColor: "rgba(255,255,255,0.2)", background: "transparent" }}><ArrowIcon /></span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const submit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setForm({ name: "", email: "", message: "" }); }, 1400);
  };

  return (
    <section id="contact" className="section" style={{ background: "var(--white)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 100px)" }} className="contact-grid">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.5, marginBottom: 20 }}>// Get in Touch</p>
            <h2 className="text-display" style={{ marginBottom: 32 }}>
              Let's build<br />something<br /><span style={{ color: "var(--orange)" }}>brilliant.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#666", lineHeight: 1.7, maxWidth: 360 }}>
              Open to internships, freelance work, and long-term collaborations. If you have an idea that deserves a great execution — get in touch.
            </p>

            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Email", val: "parthibsaha.11sc2020@gmail.com", href: "mailto:parthibsaha.11sc2020@gmail.com" },
                { label: "Phone", val: "+91 9330616676", href: "tel:+919330616676" },
                { label: "GitHub", val: "github.com/Rick-boom", href: "https://github.com/Rick-boom" },
                { label: "LinkedIn", val: "linkedin.com/in/parthib", href: "#" },
              ].map(({ label, val, href }) => (
                <div key={label} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.4, width: 60, flexShrink: 0 }}>{label}</span>
                  <a href={href} style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--black)", textDecoration: "none", borderBottom: "1px solid var(--border)", paddingBottom: 2, transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.target.style.borderColor = "var(--black)"}
                    onMouseLeave={e => e.target.style.borderColor = "var(--border)"}
                  >{val}</a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: "flex", flexDirection: "column", gap: 0 }}
          >
            <div style={{ marginBottom: 32 }}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, display: "block", marginBottom: 8 }}>Your Name</label>
              <input className="form-field" type="text" placeholder="Firstname Lastname" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, display: "block", marginBottom: 8 }}>Email Address</label>
              <input className="form-field" type="email" placeholder="you@domain.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 40 }}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, display: "block", marginBottom: 8 }}>Message</label>
              <textarea className="form-field" placeholder="Tell me about your project..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ height: 140, resize: "none", display: "block" }} required />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", cursor: "pointer" }} disabled={status === "sending" || status === "sent"}>
              <span className="btn-label" style={{ background: status === "sent" ? "#22c55e" : "var(--black)", borderColor: status === "sent" ? "#22c55e" : "var(--black)" }}>
                {status === "idle" ? "Send message" : status === "sending" ? "Sending…" : "Sent ✓"}
              </span>
              <span className="btn-arrow"><ArrowIcon /></span>
            </button>
          </motion.form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "var(--black)", color: "var(--white)", padding: "32px 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
          Parthib<span style={{ color: "var(--orange)" }}>.</span>
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", opacity: 0.45 }}>
          © {new Date().getFullYear()} Parthib Saha · Built with React & obsession.
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["GitHub", "LinkedIn", "Email"].map(s => (
            <a key={s} href="#" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--white)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── App ─────────────────────────────────────────────────────── */
export default function App() {
  // Register DotLottie web component
  useEffect(() => {
    import("@dotlottie/player-component").then(({ DotLottiePlayer }) => {
      if (!customElements.get("dotlottie-player")) {
        customElements.define("dotlottie-player", DotLottiePlayer);
      }
    }).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsTicker />
        <Work />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
