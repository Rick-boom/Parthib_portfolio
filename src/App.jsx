import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

/* ─────────────────────────────────────────────────────────
   DATA (Retro Tech Themed)
───────────────────────────────────────────────────────── */
const SKILLS = [
  { name: "CORE_LOGIC: HTML / CSS", level: 92 },
  { name: "SCRIPTING: JavaScript", level: 80 },
  { name: "FRAMEWORK: React.sys", level: 75 },
  { name: "BACKEND: Python.py", level: 85 },
  { name: "LOW_LEVEL: C / C++", level: 78 },
  { name: "NEURAL_NET: Machine Learning", level: 72 },
  { name: "QUERY: SQL", level: 70 },
  { name: "ALGORITHMS: Data Structures", level: 76 },
];

const EDUCATION = [
  {
    year: "2023 - PRESENT",
    title: "B.Tech: Artificial Intelligence",
    place: "BIT Mesra (Terminal_Node)",
    detail: "PROCESSOR_SCORE: 8.1 CGPA",
  },
  {
    year: "2021 - 2022",
    title: "System_Layer: Class XII",
    place: "Vivekananda Academy",
    detail: "OPTIMIZATION: 88.8%",
  },
  {
    year: "2010 - 2020",
    title: "Base_Layer: Class X",
    place: "Gospel Home School",
    detail: "OPTIMIZATION: 89%",
  },
];

const PROJECTS = [
  {
    title: "MISSION_CONTROL_PORTFOLIO",
    year: "2024",
    tags: ["React", "CSS_V3", "GitHub_Mainframe"],
    desc: "Designed and deployed a personal portfolio with a terminal aesthetic. Showcases skills, resume, and links.",
    link: "#",
  },
  {
    title: "CGPA_PREDICTOR_V1.0",
    year: "2024",
    tags: ["Python", "scikit-learn", "ML_Core"],
    desc: "Built a regression pipeline to predict academic performance. Applied data preprocessing and feature selection.",
    link: "#",
  },
  {
    title: "STUDY_ANALYSER.EXE",
    year: "2023",
    tags: ["Python", "Pandas", "Analytics"],
    desc: "Processing academic records to generate insights on study patterns and optimization strategies.",
    link: "#",
  },
  {
    title: "FACE_FORGERY_DETECTION.BIN",
    year: "2024",
    tags: ["Deep_Learning", "CV", "Python"],
    desc: "Computer-vision techniques to classify real vs. manipulated facial images using CNN architectures.",
    link: "#",
  },
];

const LOG_ENTRIES = [
  { year: "2003", text: "SYSTEM_INIT: Node spawned in West Bengal, India." },
  { year: "2020", text: "COMPILED: Class X certification achieved (89%)." },
  { year: "2022", text: "UPGRADED: Class XII optimization completed (88.8%)." },
  { year: "2023", text: "LINKING: Joined BIT Mesra for AI hardware abstraction." },
  { year: "2024", text: "PROGRAMMING: Deployed first ML kernels and UI modules." },
  { year: "PRESENT", text: "RUNNING: Crafting immersive terminal interfaces." },
];

/* ─────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────── */

// BIOS Boot Animation
function BIOS_Boot({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const fullLogs = [
    "BIOS Version 2.0.4 - Release: 2026",
    "CPU: AMD Ryzen 7 @ 3.8GHz",
    "Memory Test: 16384KB OK",
    "Scanning for HDD... Primary Master: Found",
    "Loading Kernel... [##########] 100%",
    "Initializing UI_MODULE.sys...",
    "Mounting /home/parthib...",
    "System ready. Welcome, USER.",
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullLogs.length) {
        setLogs(prev => [...prev, fullLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#050505] text-[#FFFFFF] p-10 font-mono text-xl overflow-hidden"
    >
      <div className="mb-8 flex justify-between">
        <div className="text-3xl font-bold">ENERGY STAR <br /> COMPLIANT</div>
        <div className="text-right">
          American Megatrends (C) 1985<br />
          System ID: PARTHIB_CORE_01
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {logs.map((log, i) => (
          <div key={i}>{'>'} {log}</div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-3 h-6 bg-[#FFFFFF]"
        />
      </div>
    </motion.div>
  );
}

function TerminalHeader({ title }) {
  return (
    <div className="terminal-header">
      <span>[Parthib_OS_v2.0]</span>
      <span>{title}</span>
      <span>:: _ X </span>
    </div>
  );
}

function TypewriterTransition({ children, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

function ASCII_Divider({ isActive }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={isActive ? { width: "100%" } : { width: 0 }}
      className="h-[1px] bg-[#00FF41] opacity-50 my-6"
    />
  );
}

function SkillBar({ name, level, isActive, delay }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2 text-sm opacity-80">
        <span>{name}</span>
        <span>{level}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          initial={{ width: 0 }}
          animate={isActive ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay }}
          className="skill-bar-fill"
        />
      </div>
    </div>
  );
}

function Tag({ text }) {
  return (
    <span className="border border-[#00FF41] text-[#00FF41] text-[10px] px-2 py-1 mr-2 mb-2 inline-block opacity-70">
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   PANELS
───────────────────────────────────────────────────────── */

function HeroPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[100vw] px-6 md:px-[10vw]" id="panel-0">
      <TerminalHeader title="HOME_DIRECT" />
      <div className="terminal-border" />
      
      <TypewriterTransition isActive={isActive}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="text-[#FFB000] text-xl mb-4 blink">{'>'} SYSTEM_ONLINE</div>
            <h1 className="text-6xl md:text-9xl font-bold leading-none mb-6">
              PARTHIB<br />
              <span className="text-[#FFB000]">SAHA</span>
            </h1>
            <ASCII_Divider isActive={isActive} />
            <div className="text-2xl opacity-80 mb-6">
              $ whoami --verbose<br />
              {'>'} Frontend_Architect / AI_Engineer
            </div>
            <p className="max-w-xl text-lg opacity-60 leading-relaxed">
              B.Tech Student @ BIT Mesra. Specializing in low-latency UI modules 
              and machine learning kernels.
            </p>
          </div>
          <div className="hidden md:block text-[#00FF41] opacity-30 font-mono text-[10px] whitespace-pre leading-none">
{`
          ________________________________________________
         /                                                \\
        |    _________________________________________     |
        |   |                                         |    |
        |   |  C:\\> PARTHIB_PORTFOLIO.EXE             |    |
        |   |  INITIALIZING...                        |    |
        |   |  ....................... [DONE]         |    |
        |   |                                         |    |
        |   |  PARTHIB SAHA                           |    |
        |   |  VERSION 2.0.24-RELEASE                 |    |
        |   |                                         |    |
        |   |  LOADING MODULES:                       |    |
        |   |  - REACT_ENGINE         [OK]            |    |
        |   |  - AI_NEURAL_KERNELS    [OK]            |    |
        |   |  - UI_COMPONENTS        [OK]            |    |
        |   |                                         |    |
        |   |_________________________________________|    |
        |                                                  |
         \\________________________________________________/
                \\________________________________/
             ___________________________________________
            /___________________________________________\\
`}
          </div>
        </div>
      </TypewriterTransition>
    </div>
  );
}

function AboutPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[80vw] px-6 md:px-[8vw]" id="panel-1">
      <TerminalHeader title="USER_INFO.LOG" />
      <div className="terminal-border" />
      <div className="flex flex-col md:grid md:grid-cols-2 gap-10 items-center">
        <div className="text-6xl md:text-8xl border-4 border-[#00FF41] p-10 font-bold mb-6">
          PS_v2
        </div>
        <div>
          <TypewriterTransition isActive={isActive}>
            <h2 className="text-4xl font-bold mb-4">DATA_SPECIFICATION</h2>
            <ASCII_Divider isActive={isActive} />
            <p className="text-lg opacity-80 mb-8 leading-relaxed">
              Rooted in the physical world, dreaming in digital pixels. 
              I treat code as an art form, optimizing every cycle for 
              maximum aesthetic efficiency.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[["CGPA", "8.1"], ["PROJECTS", "4+"], ["Uptime", "20Y"]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-3xl font-bold text-[#FFB000]">{v}</div>
                  <div className="text-xs opacity-50">{k}</div>
                </div>
              ))}
            </div>
          </TypewriterTransition>
        </div>
      </div>
    </div>
  );
}

function JourneyPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[90vw] px-6 md:px-[8vw]" id="panel-2">
      <TerminalHeader title="CHRONOLOGICAL_BUFFER" />
      <div className="terminal-border" />
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3">
          <h2 className="text-4xl font-bold mb-4">SYSTEM_HISTORY</h2>
          <ASCII_Divider isActive={isActive} />
          <p className="opacity-60 text-lg">
            A trace of binary milestones across my current operating session.
          </p>
        </div>
        <div className="flex-1 max-h-[60vh] overflow-y-auto pr-4 custom-scroll">
          {LOG_ENTRIES.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              className="mb-8 border-l border-[#00FF41] pl-6 relative"
            >
              <div className="absolute left-[-4.5px] top-2 w-2 h-2 bg-[#00FF41]" />
              <div className="text-[#FFB000] text-sm mb-1">STAMP: {entry.year}</div>
              <div className="text-lg">{entry.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[85vw] px-6 md:px-[8vw]" id="panel-3">
      <TerminalHeader title="MODULE_EFFICIENCY" />
      <div className="terminal-border" />
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-4xl font-bold mb-4">CORE_SUBROUTINES</h2>
          <ASCII_Divider isActive={isActive} />
          <div className="bg-[#121212] p-6 border border-[#00FF41] border-opacity-30">
            <div className="text-xs opacity-40 mb-4">SECONDARY_LIBRARIES:</div>
            {["LeetCode_Optimized", "Pandas_Engine", "UI/UX_Raster", "Git_Control_v3"].map((s, i) => (
              <div key={i} className="mb-2 text-[#00FF41] text-opacity-80">
                {'>'} {s} [LOADED]
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a href="/Parthib_Saha_Resume.pdf" download className="terminal-btn">
              DOWNLOAD_RESUME.PDF
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          {SKILLS.map((s, i) => (
            <SkillBar key={i} name={s.name} level={s.level} isActive={isActive} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsPanel({ isActive }) {
  return (
    <div className="panel w-full md:w-[100vw] px-6 md:px-[6vw]" id="panel-4">
      <TerminalHeader title="WORKSPACE_ARCHIVE" />
      <div className="terminal-border" />
      <div className="mb-8">
        <h2 className="text-4xl font-bold">ACTIVE_KERNELS</h2>
        <ASCII_Divider isActive={isActive} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[60vh] p-2">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, x: 5 }}
            className="group p-6 border border-[#FFFFFF] border-opacity-20 hover:border-opacity-100 bg-[#0a0a0a] transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#FFB000] text-xs font-mono">{p.year}</span>
              <div className="flex flex-wrap justify-end">
                {p.tags.map(t => <Tag key={t} text={t} />)}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-[#FFB000]">{p.title}</h3>
            <p className="opacity-60 text-sm">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ContactPanel({ isActive }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("READY");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("TRANSMITTING...");
    setTimeout(() => {
      setStatus("DATA_SENT_SUCCESS");
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="panel w-full md:w-[90vw] px-6 md:px-[8vw]" id="panel-5">
      <TerminalHeader title="UPLINK_STATION" />
      <div className="terminal-border" />
      <div className="flex flex-col md:grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-4xl font-bold mb-4">ESTABLISH_CONNECTION</h2>
          <ASCII_Divider isActive={isActive} />
          <p className="opacity-60 mb-8">
            Transmit your coordinates. Open frequency for collaboration and inquiries.
          </p>
          <div className="space-y-4">
            <div className="text-sm opacity-50">NODE_DATA:</div>
            <div className="p-4 border border-[#FFFFFF] border-opacity-30 bg-[#121212]">
              <div className="flex gap-4 mb-2">
                <span className="text-[#FFB000]">EMAIL:</span>
                <span>parthibsaha.11sc2020@gmail.com</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#FFB000]">PHONE_NET:</span>
                <span>+91 9330616676</span>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input 
            type="text" 
            placeholder="[USER_NAME]" 
            className="terminal-input"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="[USER_EMAIL]" 
            className="terminal-input"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
          />
          <textarea 
            placeholder="[INPUT_MESSAGE]" 
            className="terminal-input h-32 resize-none"
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
          />
          <div className="flex items-center gap-6">
            <button className="terminal-btn">EXECUTE_SEND</button>
            <span className="text-xs text-[#FFB000] tracking-widest">{status}</span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────── */

export default function App() {
  const wrapperRef = useRef(null);
  const [activePanel, setActivePanel] = useState(0);
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    
    const onScroll = () => {
      const panels = el.querySelectorAll(".panel");
      panels.forEach((p, i) => {
        const rect = p.getBoundingClientRect();
        if (rect.left >= -100 && rect.left <= window.innerWidth / 2) {
          setActivePanel(i);
        }
      });
    };

    const onWheel = (e) => {
      if (window.innerWidth >= 768 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.target.closest('.overflow-y-auto')) return;
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 0.8, behavior: "auto" });
      }
    };

    el.addEventListener("scroll", onScroll);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
    };
  }, [isBooted]);

  return (
    <div className="bg-[#050505] min-h-screen">
      <AnimatePresence>
        {!isBooted && <BIOS_Boot onComplete={() => setIsBooted(true)} />}
      </AnimatePresence>

      {isBooted && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="outer-wrapper" 
          ref={wrapperRef}
        >
          <div className="scroll-track">
            <HeroPanel isActive={activePanel === 0} />
            <AboutPanel isActive={activePanel === 1} />
            <JourneyPanel isActive={activePanel === 2} />
            <SkillsPanel isActive={activePanel === 3} />
            <ProjectsPanel isActive={activePanel === 4} />
            <ContactPanel isActive={activePanel === 5} />
            <div className="panel w-[100vw] flex flex-col items-center justify-center" id="panel-6">
              <TerminalHeader title="SYTEM_SHUTDOWN" />
              <div className="terminal-border" />
              <div className="text-center">
                <h2 className="text-6xl font-bold mb-4">END_OF_LINE</h2>
                <ASCII_Divider isActive={activePanel === 6} />
                <p className="opacity-50 text-xl">Thank you for visiting the Mainframe.</p>
                <div className="mt-10 text-xs opacity-30">© 2024 PARTHIB_CORE // BENGAL_NODE</div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-[100]">
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                onClick={() => {
                  const p = document.getElementById(`panel-${i}`);
                  p?.scrollIntoView({ behavior: "smooth", inline: "start" });
                }}
                className={`nav-dot ${activePanel === i ? "active" : ""}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
