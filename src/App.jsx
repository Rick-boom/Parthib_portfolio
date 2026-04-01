import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css"; // (If there are old styles, this preserves them, but we rely on index.css)

// --- Skeuomorphic Micro-Components ---
function Screw() {
  return <div className="panel-screw"></div>;
}

function Panel({ title, children, className = "" }) {
  return (
    <motion.div
      className={`relative bg-[#161A22] border border-[#2B303B] rounded-[16px] p-5 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.03)] overflow-hidden ${className}`}
      whileHover={{ scale: 1.01, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <div className="absolute inset-0 scanlines pointer-events-none opacity-20 z-0" />
      
      {/* 4 Corner Screws for Hardware Vibe */}
      <div className="absolute screw-tl"><Screw /></div>
      <div className="absolute screw-tr"><Screw /></div>
      <div className="absolute screw-bl"><Screw /></div>
      <div className="absolute screw-br"><Screw /></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="text-[10px] md:text-xs text-[#64748B] mb-4 tracking-[0.2em] font-mono uppercase bg-[#0B0E14] inline-block px-2 py-1 rounded w-max border border-[#2B303B]">
          [{title}]
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function AnalogKnob({ label, options, value, setValue }) {
  const angle = value * (360 / options.length);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ rotate: angle }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative w-24 h-24 rounded-full bg-gradient-to-b from-[#2B303B] to-[#161A22] border border-[#334155] shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center cursor-pointer group"
        onClick={() => setValue((value + 1) % options.length)}
      >
        {/* Inner black textured dial */}
        <div className="absolute w-20 h-20 rounded-full bg-[#0B0E14] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-[#1e232c] flex items-center justify-center">
           {/* Center rivet */}
           <div className="w-4 h-4 rounded-full bg-gradient-to-b from-[#334155] to-[#161A22] shadow-inner" />
        </div>
        {/* Red Indicator Needle */}
        <div className="absolute w-1.5 h-10 bg-[#F43325] rounded -translate-y-[22px] shadow-[0_0_10px_rgba(244,51,37,0.8)] group-hover:bg-[#ff5544] transition-colors" />
      </motion.div>
      <div className="text-center font-mono">
        <div className="text-[10px] text-[#64748B] tracking-widest uppercase">{label}</div>
        <div className="text-[11px] text-[#F43325] tracking-wider font-bold mt-1 bg-[#2B303B]/30 px-2 py-1 rounded border border-[#F43325]/20">
          {options[value]}
        </div>
      </div>
    </div>
  );
}

function IndustrialLiftOff({ onClick, active }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95, y: 2 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${active ? 'shadow-[0_0_40px_rgba(244,51,37,0.6)]' : 'shadow-[0_4px_10px_rgba(0,0,0,0.8)]'}`}
      style={{
        background: 'linear-gradient(135deg, #2B303B 0%, #0B0E14 100%)',
        border: '3px solid #334155',
      }}
    >
      <div 
        className={`absolute inset-2 rounded-full transition-all duration-500 ${active ? 'bg-[#F43325] shadow-[inset_0_4px_15px_rgba(255,255,255,0.3)]' : 'bg-[#1e2229] shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]'}`}
      ></div>
      <span className={`relative z-10 font-mono font-bold text-sm tracking-[0.2em] pointer-events-none transition-colors duration-500 ${active ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-[#64748B]'}`}>
        EMBARQUER
      </span>
    </motion.button>
  );
}

// --- Main App ---
export default function Portfolio() {
  const [fundingFlip, setFundingFlip] = useState(false);
  const [fuel, setFuel] = useState(0);
  const [tech, setTech] = useState(0);
  const [pump, setPump] = useState(0);
  
  const [launcher, setLauncher] = useState("");
  const [status, setStatus] = useState("AWAITING VERIFICATION_");
  const [ignition, setIgnition] = useState(false);
  const [launched, setLaunched] = useState(false);
  
  const [roadmapVisible, setRoadmapVisible] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  
  // Typed system boot text
  const [typedText, setTypedText] = useState("");
  const fullText = "> SYSTEM INITIALIZED. WELCOME TO MISSION CONTROL.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // System secrets logic
  useEffect(() => {
    if (fuel === 0 && tech === 0 && pump === 1) setRoadmapVisible(true);
    if (fuel === 1 && tech === 0 && pump === 2) setPricingVisible(true);
    if (fuel === 2 && tech === 1 && pump === 3) setVisionVisible(true);
    if (fuel === 0 && tech === 1 && pump === 3) setContactVisible(true);
  }, [fuel, tech, pump]);

  const validateLaunch = () => {
    if (launcher === "3468") {
      setStatus("ACCESS_GRANTED :: SEQUENCE ARMED");
    } else {
      setStatus("ACCESS_DENIED :: INVALID OVERRIDE");
    }
  };

  const triggerLaunch = () => {
    if (status.includes("GRANTED")) {
      setIgnition(true);
      setStatus("IGNITION SEQUENCE IN PROGRESS...");
      setTimeout(() => {
        setIgnition(false);
        setLaunched(true);
        setStatus("LIFTOFF COMPLETE. ENTRANT EN ROUTE.");
      }, 3000);
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
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Transmission failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E2E8F0] p-4 md:p-8 relative font-sans selection:bg-[#F43325] selection:text-white overflow-x-hidden">

      {/* Atmospheric Dashboard Lighting */}
      <div className="fixed top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#1c2433] to-transparent opacity-20 pointer-events-none z-0 mix-blend-screen"></div>

      {/* Ignition Animation (Takes over screen) */}
      {ignition && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center mix-blend-screen"
        >
          <motion.div animate={{ scale: [1, 1.5, 2, 4], opacity: [0, 0.5, 0.8, 0] }} transition={{ duration: 3, ease: "easeIn" }} className="w-64 h-64 bg-[#F43325] blur-[100px] rounded-full"></motion.div>
        </motion.div>
      )}

      {/* TOP NAV/HEADER */}
      <header className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#2B303B] pb-6">
        <div>
          <h1 className="text-3xl font-mono text-white tracking-widest font-bold">PARTHIB.SAHA</h1>
          <div className="text-xs font-mono text-[#F43325] mt-2 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#F43325] animate-pulse"></div>
             {typedText}
          </div>
        </div>
        
        {/* The main lift-off trigger */}
        <div className="mt-6 md:mt-0 flex items-center gap-6">
          <div className="hidden md:block text-right font-mono text-[#64748B] text-xs">
            <div>STATUS_TAG: {launched ? "ORBIT" : "PRE-FLIGHT"}</div>
            <div>OVERRIDE: {status.includes("GRANTED") ? "LOCKED" : "REQ"}</div>
          </div>
          <IndustrialLiftOff onClick={triggerLaunch} active={status.includes("GRANTED")} />
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* METRICS PANEL */}
        <motion.div
          onClick={() => setFundingFlip(!fundingFlip)}
          className="col-span-1 xl:col-span-2 cursor-pointer h-full"
          style={{ perspective: "1500px" }}
        >
          <motion.div
            animate={{ rotateX: fundingFlip ? 180 : 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative h-48 md:h-full w-full"
          >
            {/* FRONT */}
            <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0">
              <Panel title="CHANDRAYAAN_3_METRICS">
                <div className="flex flex-col justify-center h-full">
                  <div className="text-5xl md:text-7xl font-mono text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    ₹615<span className="text-[#F43325] text-4xl">Cr</span>
                  </div>
                  <div className="text-xs font-mono text-[#64748B] mt-3 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#F43325] inline-block rounded-sm"></span>
                    APPROVED BUDGET CAP
                  </div>
                </div>
              </Panel>
            </div>

            {/* BACK (EASTER EGG SECRETS) */}
            <div
              className="absolute inset-0 h-full w-full"
              style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
            >
              <Panel title="SYSTEM_SECRETS_OVERRIDE" className="border-[#F43325]/50 bg-[#110505]">
                <div className="text-xs font-mono text-[#F43325] space-y-3 leading-relaxed">
                  <div className="flex justify-between border-b border-[#F43325]/30 pb-1"><span>Target: OVERRIDE CODE</span> <span>[ 3468 ]</span></div>
                  <div className="flex justify-between border-b border-[#F43325]/30 pb-1"><span>Target: ROADMAP</span> <span>[ HYD, LIQ, 01 ]</span></div>
                  <div className="flex justify-between border-b border-[#F43325]/30 pb-1"><span>Target: PRICING</span> <span>[ H2, LIQ, 02 ]</span></div>
                  <div className="flex justify-between"><span>Target: VISION</span> <span>[ SOL, SOL, 03 ]</span></div>
                </div>
              </Panel>
            </div>
          </motion.div>
        </motion.div>

        {/* CONTROLS (Knobs) */}
        <Panel title="HARDWARE_CALIBRATION" className="col-span-1 xl:col-span-2">
          <div className="grid grid-cols-3 gap-2 h-full items-center justify-items-center">
            <AnalogKnob label="FUEL_TYPE" options={["HYD", "H2", "SOL"]} value={fuel} setValue={setFuel} />
            <AnalogKnob label="ENGINE_TECH" options={["LIQ", "SOL"]} value={tech} setValue={setTech} />
            <AnalogKnob label="FLOW_PUMP" options={["00", "01", "02", "03"]} value={pump} setValue={setPump} />
          </div>
        </Panel>

        {/* OVERRIDE TERMINAL */}
        <Panel title="SECURITY_OVERRIDE" className="col-span-1 md:col-span-2">
          <div className="flex flex-col h-full bg-[#0B0E14] p-3 rounded border border-[#2B303B] shadow-inner relative">
            <div className="text-xs font-mono text-[#F43325] mb-2">{status}</div>
            <div className="flex gap-3 mt-auto">
              <input
                type="text"
                maxLength={4}
                value={launcher}
                onChange={(e) => setLauncher(e.target.value)}
                placeholder="____"
                className="flex-1 bg-transparent border-b-2 border-[#334155] focus:border-[#F43325] text-white font-mono text-2xl tracking-[0.5em] text-center outline-none transition-colors"
              />
              <button 
                onClick={validateLaunch} 
                className="px-4 py-2 bg-[#F43325] text-white font-mono text-xs uppercase tracking-widest rounded hover:bg-[#ff4433] hover:shadow-[0_0_15px_rgba(244,51,37,0.5)] transition-all"
              >
                AUTH
              </button>
            </div>
          </div>
        </Panel>

        {/* TELEMETRY GRAPH */}
        <Panel title="TELEMETRY_STREAM" className="col-span-1 md:col-span-2">
           <div className="h-full bg-[#0B0E14] rounded border border-[#2B303B] relative overflow-hidden flex items-center p-2">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#F43325 1px, transparent 1px), linear-gradient(90deg, #F43325 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             <svg viewBox="0 0 400 100" className="w-full h-16 drop-shadow-[0_0_5px_rgba(244,51,37,0.8)]">
                <path id="telemetryPath" d="M0,80 Q50,90 100,50 T200,30 T300,70 T400,20" fill="none" stroke="#F43325" strokeWidth="2" strokeDasharray="4,4">
                  <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite" />
                </path>
                <circle r="3" fill="#FFF" filter="drop-shadow(0 0 4px #F43325)">
                   <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                      <mpath xlinkHref="#telemetryPath" />
                   </animateMotion>
                </circle>
             </svg>
           </div>
        </Panel>

        {/* --- DYNAMIC RENDERED SECTIONS (Unlocked via Secrets) --- */}
        {roadmapVisible && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 md:col-span-2 xl:col-span-4">
            <Panel title="DB_FILE // ROADMAP_LOGS">
              <div className="font-mono text-sm text-[#E2E8F0] space-y-4 max-h-[200px] overflow-y-auto custom-scroll pr-4 bg-[#0B0E14] p-4 rounded border border-[#2B303B]">
                <div className="border-l-2 border-[#64748B] pl-3 py-1">
                  <div className="text-[#F43325] font-bold">PHASE_01 [23-24] // FOUNDATION</div>
                  <div className="text-[#64748B] mt-1">C++, Python, Discrete Math, DSA. Delivered: Study Analyzer, ML Models.</div>
                </div>
                <div className="border-l-2 border-[#64748B] pl-3 py-1">
                  <div className="text-[#F43325] font-bold">PHASE_02 [24-25] // SPECIALIZATION</div>
                  <div className="text-[#64748B] mt-1">Advanced DSA, Pandas. Delivered: DBSCAN, Face Forgery Detection.</div>
                </div>
                <div className="border-l-2 border-[#64748B] pl-3 py-1">
                  <div className="text-[#F43325] font-bold">PHASE_03 [25-26] // ARCHITECTURE</div>
                  <div className="text-[#64748B] mt-1">Deep Learning, CV, System Design. Target: Img Processing, CNN Rec Engine.</div>
                </div>
              </div>
            </Panel>
          </motion.div>
        )}

        {/* CONTACT TERMINAL */}
        {contactVisible && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 md:col-span-2 xl:col-span-4">
            <Panel title="SECURE_TRANSMISSION // CONTACT">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0B0E14] p-4 rounded border border-[#2B303B]">
                <div className="font-mono text-sm space-y-3">
                  <div className="text-[#F43325] font-bold">AVAILABLE CHANNELS:</div>
                  <div className="flex items-center gap-2"><span className="text-[#64748B]">EMAIL:</span> parthibsaha.11sc2020@gmail.com</div>
                  <div className="flex items-center gap-2"><span className="text-[#64748B]">COMMS_LINK:</span> +91 9330616676</div>
                  <div className="mt-4 p-3 bg-[#161A22] border border-[#334155] rounded text-xs leading-relaxed text-[#64748B]">
                    &gt; END-TO-END ENCRYPTION ENABLED.<br/>
                    &gt; WAITING FOR USER INPUT...
                  </div>
                </div>

                <div className="space-y-3 font-mono">
                  <input
                    placeholder="ENTER_ID (NAME)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#161A22] border border-[#334155] focus:border-[#F43325] rounded p-2 text-white outline-none placeholder-[#64748B] transition-colors"
                  />
                  <input
                    placeholder="ENTER_RELAY (EMAIL)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#161A22] border border-[#334155] focus:border-[#F43325] rounded p-2 text-white outline-none placeholder-[#64748B] transition-colors"
                  />
                  <textarea
                    placeholder="TRANSMIT_PAYLOAD (MESSAGE)"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#161A22] border border-[#334155] focus:border-[#F43325] rounded p-2 text-white outline-none placeholder-[#64748B] transition-colors resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleContactSubmit}
                      className="px-6 py-2 bg-[#F43325] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-white hover:text-[#F43325] transition-colors"
                    >
                      TRANSMIT DATA
                    </button>
                    {submitted && (
                      <span className="text-[#10B981] text-xs font-bold animate-pulse">
                        TRANSMISSION.SUCCESSFUL
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>
        )}

      </main>
    </div>
  );
}
