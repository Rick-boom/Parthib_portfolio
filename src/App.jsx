import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

function Knob({ label, options, value, setValue }) {
  const angle = value * (360 / options.length);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={{ rotate: angle }}
        transition={{ type: "spring", stiffness: 120 }}
        className="relative w-24 h-24 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center cursor-pointer"
        onClick={() => setValue((value + 1) % options.length)}
      >
        <div className="absolute w-2 h-8 bg-red-500 rounded -translate-y-6" />
      </motion.div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xs text-red-400">{options[value]}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="bg-[#0f1115] border border-gray-800 rounded-2xl p-5 shadow-xl h-full hover:border-red-500 hover:shadow-[0_0_25px_rgba(255,0,0,0.4)] transition-all duration-300"
    >
      <div className="text-sm text-gray-400 mb-3 tracking-widest font-space-heading">{title}</div>
      {children}
    </motion.div>
  );
}

function LiftOffButton({ onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center cursor-pointer"
    >
      <span className="font-space-heading">LIFT-OFF</span>
    </motion.div>
  );
}

export default function Portfolio() {
  const [fundingFlip, setFundingFlip] = useState(false);
  const [fuel, setFuel] = useState(0);
  const [tech, setTech] = useState(0);
  const [pump, setPump] = useState(0);
  const [launcher, setLauncher] = useState("");
  const [status, setStatus] = useState("WAITING CONFIRMATION");
  const [ignition, setIgnition] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [correctCode, setCorrectCode] = useState(false);
  const [roadmapVisible, setRoadmapVisible] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const [typedText, setTypedText] = useState("");
  const fullText = "Thank you for visiting my website";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fuel === 0 && tech === 0 && pump === 1) {
      setRoadmapVisible(true);
    }
    if (fuel === 1 && tech === 0 && pump === 2) {
      setPricingVisible(true);
    }
    if (fuel === 2 && tech === 1 && pump === 3) {
      setVisionVisible(true);
    }
    if (fuel === 0 && tech === 1 && pump === 3) {
      setContactVisible(true);
    }
  }, [fuel, tech, pump]);

  const validateLaunch = () => {
    if (launcher === "3468") {
      setStatus("ACCESS GRANTED");
      setCorrectCode(true);
      setTimeout(() => setCorrectCode(false), 1000);
    } else {
      setStatus("ACCESS DENIED");
    }
  };

  const triggerLaunch = () => {
    if (status === "ACCESS GRANTED") {
      setIgnition(true);
      setStatus("IGNITION...");
      setTimeout(() => {
        setIgnition(false);
        setLaunched(true);
        setStatus("LIFTOFF SUCCESS");
      }, 2000);
    }
  };

  const handleContactSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Failed to submit form", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 grid grid-cols-4 gap-4 relative font-space-body">



      {/* Ignition Animation (Improved) */}
      {ignition && (
        <>
          {/* Soft ambient glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-red-600 blur-2xl z-0"
          />

          {/* Pulsing energy layer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-t from-orange-500 via-red-500 to-transparent z-0"
          />

          {/* Bottom flame burst */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: [0.4, 0.8, 0.4], y: [40, 0, 40] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-orange-400 via-red-500 to-transparent blur-xl z-0"
          />
        </>
      )}

      <div className="col-span-4 flex justify-between relative z-10">
        <h1 className="font-space-heading text-xl">PARTHIB SAHA</h1>
        <LiftOffButton onClick={triggerLaunch} />
      </div>

      <motion.div
        onClick={() => setFundingFlip(!fundingFlip)}
        style={{ perspective: "1000px" }}
        className="h-full"
      >
        <motion.div
          animate={{ rotateY: fundingFlip ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-full"
        >
          {/* FRONT */}
          <div style={{ backfaceVisibility: "hidden" }} className="h-full">
            <Panel title="FUNDING">
              <div className="flex flex-col justify-center items-start h-full">
                <div className="text-5xl md:text-6xl font-space-heading text-white">
                  ₹615 Crore
                </div>
                <div className="text-[10px] font-bold text-gray-400 mt-2 tracking-widest">
                  BUDGET FOR CHANDRAYAAN-3
                </div>
              </div>
            </Panel>
          </div>

          {/* BACK (EASTER EGG) */}
          <div
            className="absolute inset-0 h-full"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <Panel title="SYSTEM SECRETS">
              <div className="text-xs text-gray-300 space-y-2">
                🔐 Launch Code: <span className="text-red-400">3468</span><br />
                🔓 Roadmap: Hydrazine / Liquid / 01<br />
                💰 Pricing: H2 / Liquid / 02<br />
                🌍 Vision: Solid / Solid / 03<br />
                📡 Contact: Hydrazine / Solid / 03
              </div>
            </Panel>
          </div>
        </motion.div>
      </motion.div>

      <Panel title="TEST SCORE">
        <svg viewBox="0 0 300 100" className="w-full h-24">
          <path
            id="graphPath"
            d="M0,80 L50,60 L100,40 L150,50 L200,20 L250,30 L300,10"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="6,6"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;12"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>

          <circle r="4" fill="#ef4444">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath xlinkHref="#graphPath" />
            </animateMotion>
          </circle>
        </svg>
      </Panel>

      <Panel title="COORDINATES">
        <div>22.7526° N, 88.3406° E</div>
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=22.7526,88.3406&z=14&output=embed"
          className="w-full h-32 mt-2"
        />
      </Panel>

      <Panel title="STATUS">{status}</Panel>

      <Panel title="LAUNCH CODE">
        <motion.input
          value={launcher}
          onChange={(e) => setLauncher(e.target.value)}
          animate={correctCode ? { opacity: [1, 0.2, 1, 0.2, 1] } : { opacity: 1 }}
          className="w-full p-2 bg-black border border-gray-500 rounded-lg hover:border-red-400 focus:border-red-500 transition-all duration-300"
        />
        <button onClick={validateLaunch} className="mt-2 px-3 py-1 bg-gray-800 rounded hover:bg-red-600 hover:shadow-[0_0_10px_rgba(255,0,0,0.6)] transition-all">VALIDATE</button>
      </Panel>

      <div className="col-span-2 flex justify-around">
        <Knob label="Fuel" options={["Hydrazine", "H2", "Solid"]} value={fuel} setValue={setFuel} />
        <Knob label="Tech" options={["Liquid", "Solid"]} value={tech} setValue={setTech} />
        <Knob label="Pump" options={["00", "01", "02", "03"]} value={pump} setValue={setPump} />
      </div>

      {/* ROADMAP */}
      {roadmapVisible && (
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          <Panel title="GROWTH ROADMAP">
            <div className="max-h-48 overflow-y-auto custom-scroll text-sm text-gray-300 space-y-3 pr-2">
              <div>
                📌 <span className="text-red-400">Phase 1 (2023–2024)</span><br />
                C++, Python, Discrete Math, DSA basics<br />
                Projects: Study Analyzer, Basic ML Models
              </div>
              <div>
                📌 <span className="text-red-400">Phase 2 (2024–2025)</span><br />
                Advanced DSA, ML, NumPy, Pandas<br />
                Projects: DBSCAN, Face Forgery Detection, Portfolio
              </div>
              <div>
                📌 <span className="text-red-400">Phase 3 (2025–2026)</span><br />
                Deep Learning, CV, System Design<br />
                Projects: Image Processing, Recommendation System
              </div>
              <div>
                📌 <span className="text-red-400">Phase 4 (2026–2027)</span><br />
                Internships, Full-stack + AI<br />
                Final Product + Strong Portfolio
              </div>
            </div>
          </Panel>
        </motion.div>
      )}

      {/* PRICING */}
      {pricingVisible && (
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          <Panel title="PRICING">
            <div className="max-h-48 overflow-y-auto custom-scroll text-sm text-gray-300 space-y-3 pr-2">
              <div>
                🔹 <span className="text-red-400">Basic</span><br />
                Simple website / small project<br />
                Clean UI + basic functionality<br />
                ₹1,000 – ₹2,000
              </div>
              <div>
                🔹 <span className="text-red-400">Standard</span><br />
                Advanced website / ML project<br />
                Interactive UI + backend logic<br />
                ₹3,000 – ₹5,000
              </div>
              <div>
                🔹 <span className="text-red-400">Premium</span><br />
                Full AI-based solution / end-to-end product<br />
                Deployment + optimization + support<br />
                ₹5,000+
              </div>
            </div>
          </Panel>
        </motion.div>
      )}

      {/* VISION */}
      {visionVisible && (
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          <Panel title="VISION">
            <div className="max-h-56 overflow-y-auto custom-scroll text-sm text-gray-300 space-y-4 pr-2">
              <div>
                My vision is to become a highly skilled AI Engineer who builds intelligent systems that create real impact.
              </div>
              <div>
                🧠 Master Deep Learning, Computer Vision & AI Research
              </div>
              <div>
                ⚙️ Build end-to-end AI products
              </div>
              <div>
                🚀 Contribute to space tech, healthcare & automation
              </div>
              <div>
                🌍 Create impactful, accessible solutions
              </div>
            </div>
          </Panel>
        </motion.div>
      )}

      {/* CONTACT */}
      {contactVisible && (
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          <Panel title="CONTACT">
            <div className="max-h-64 overflow-y-auto custom-scroll text-sm text-gray-300 space-y-4 pr-2">
              <div>
                Let’s build something amazing together.
              </div>

              <div>
                📧 Email: parthibsaha.11sc2020@gmail.com<br />
                📱 Phone: +91 9330616676<br />
                🌐 Portfolio: parthibportfolio.com<br />
                💼 LinkedIn: linkedin.com/in/parthib-saha-752a20203
              </div>

              {/* FORM */}
              <div className="space-y-2">
                <input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-black border border-gray-600 rounded hover:border-red-400"
                />
                <input
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 bg-black border border-gray-600 rounded hover:border-red-400"
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2 bg-black border border-gray-600 rounded hover:border-red-400"
                />

                <button
                  onClick={handleContactSubmit}
                  className="px-3 py-1 bg-gray-800 rounded hover:bg-red-600 transition"
                >
                  SEND
                </button>

                {submitted && <div className="text-green-400 text-xs">Request Sent ✔</div>}
              </div>
            </div>
          </Panel>
        </motion.div>
      )}

      <div className="col-span-4 text-center space-y-2">
        <div>{launched ? "🚀 SUCCESS" : "READY"}</div>
        <div className="text-xs text-gray-500 tracking-widest font-space-heading">
          {typedText}
          <span className="animate-pulse">|</span>
        </div>
      </div>

    </div>
  );
}
