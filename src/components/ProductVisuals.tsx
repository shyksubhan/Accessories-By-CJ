// src/components/ProductVisuals.tsx
// Replace path: Acc-by-Cj/src/components/ProductVisuals.tsx  (NEW FILE)
// Premium SVG product visuals from design — no motion/react dependency

import React from "react";

// ── 1. ApexPower 140W Pro - Smart Power Bank Visual ──
export const PowerBankVisual: React.FC = () => {
  return (
    <div className="relative w-44 h-72 rounded-2xl bg-gradient-to-b from-[#111c30] to-[#040914] border border-blue-500/20 shadow-2xl p-4 overflow-hidden group">
      {/* Glossy Overlay Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

      {/* Top Ports Area */}
      <div className="flex justify-around items-center w-full h-8 bg-black/40 rounded-lg mb-4 border border-white/5">
        <div className="w-5 h-2 rounded bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-blue-400" />
        </div>
        <div className="w-6 h-2 rounded bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
          <div className="w-3 h-0.5 bg-blue-400" />
        </div>
        <div className="w-4 h-2.5 rounded-sm bg-orange-500/20 border border-orange-400/50" />
      </div>

      {/* SMART TFT DISPLAY PANEL */}
      <div className="w-full h-24 rounded-xl bg-[#030712] border border-blue-400/30 p-2.5 flex flex-col justify-between font-mono relative overflow-hidden shadow-inner">
        {/* Grid pattern on screen */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:4px_4px]" />

        {/* Header line */}
        <div className="flex justify-between items-center text-[7px] text-blue-400 font-semibold z-10">
          <span>CJ SMART PRO v2.4</span>
          <span className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE
          </span>
        </div>

        {/* Battery Percent */}
        <div className="flex items-baseline justify-center gap-0.5 z-10 my-1">
          <span className="text-3xl font-extrabold text-white tracking-tighter" style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.5))" }}>
            98
          </span>
          <span className="text-xs text-blue-400 font-semibold">%</span>
        </div>

        {/* Real-time Telemetry values */}
        <div className="grid grid-cols-2 gap-1 text-[7px] text-white/70 z-10 border-t border-white/10 pt-1">
          <div className="flex flex-col">
            <span className="text-[5px] text-white/40">OUT_MAX</span>
            <span className="text-blue-300 font-bold">140.0W</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[5px] text-white/40">TEMP_CORE</span>
            <span className="text-emerald-400 font-bold">34.2°C</span>
          </div>
        </div>
      </div>

      {/* MAGSAFE CHARGING ALIGNMENT RING */}
      <div className="mt-6 flex flex-col items-center justify-center relative">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-500/10 flex items-center justify-center relative shadow-lg">
          <div className="w-18 h-18 rounded-full border border-blue-500/20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/5 flex items-center justify-center">
              <span className="text-[8px] text-white/20 uppercase tracking-widest font-podium">CJ</span>
            </div>
          </div>
          <div className="absolute bottom-[-16px] w-2 h-6 bg-blue-500/20 rounded-full border border-blue-400/30" />
        </div>
      </div>

      {/* Technical markings at the bottom */}
      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end font-mono text-[6px] text-white/30">
        <span>CAPACITY: 27,650mAh</span>
        <span>PD 3.1 TYPE-C</span>
      </div>
    </div>
  );
};

// ── 2. GaNPro 140W Quad - Wall Charger Visual ──
export const ChargerVisual: React.FC = () => {
  return (
    <div className="relative w-32 h-32 rounded-xl bg-gradient-to-br from-[#162238] to-[#070c1a] border border-blue-400/20 shadow-xl p-3 flex flex-col justify-between overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

      {/* Front Face: Brand name & technology */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-white tracking-widest uppercase">CJ GaN V</span>
          <span className="text-[6px] text-blue-400 tracking-wider">SUPER CHARGER</span>
        </div>
        <span className="text-[9px] font-extrabold text-blue-400 font-podium bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-400/20">
          140W
        </span>
      </div>

      {/* Charger Ports Panel */}
      <div className="space-y-2.5 my-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-2 rounded bg-[#030712] border border-blue-400/50 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-[1px] bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          </div>
          <span className="text-[6px] text-white/50 font-mono">USB-C1 (140W)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-2 rounded bg-[#030712] border border-blue-400/50 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-[1px] bg-blue-500/80 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
          </div>
          <span className="text-[6px] text-white/50 font-mono">USB-C2 (100W)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-2 rounded bg-[#030712] border border-blue-400/50 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-[1px] bg-blue-500/40" />
          </div>
          <span className="text-[6px] text-white/50 font-mono">USB-C3 (30W)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-2.5 rounded bg-[#030712] border border-orange-400/40 flex items-center justify-center">
            <div className="w-4 h-1 rounded-[1px] bg-orange-400/80" />
          </div>
          <span className="text-[6px] text-white/50 font-mono">USB-A (22.5W)</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[5px] text-white/20 border-t border-white/5 pt-1">
        <span>ActiveShield Safety</span>
        <span>PSE / CE APPROVED</span>
      </div>
    </div>
  );
};

// ── 3. MagAero Snap Bank - MagSafe Power Bank ──
export const MagSafeBankVisual: React.FC = () => {
  return (
    <div className="relative w-28 h-40 rounded-xl bg-gradient-to-b from-[#1a2536] to-[#0a0f1d] border border-cyan-400/20 shadow-xl p-3 flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-white/5 pointer-events-none" />

      <div className="flex justify-between items-center">
        <span className="text-[7px] tracking-wider text-cyan-400 font-semibold font-mono">MAGAERO LINK</span>
        <span className="text-[8px] text-white/40 font-bold font-podium">CJ</span>
      </div>

      <div className="my-auto flex justify-center items-center">
        <div className="w-20 h-20 rounded-full border border-cyan-400/30 flex items-center justify-center relative">
          <div className="w-14 h-14 rounded-full border border-dashed border-cyan-400/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-cyan-400/10 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" style={{ boxShadow: "0 0 8px #22d3ee" }} />
            </div>
          </div>
          <div className="absolute bottom-[-10px] w-1 h-4 bg-cyan-400/30 rounded-full" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <div className="w-2 h-1 rounded-sm bg-cyan-400" style={{ boxShadow: "0 0 4px #22d3ee" }} />
          <div className="w-2 h-1 rounded-sm bg-cyan-400" style={{ boxShadow: "0 0 4px #22d3ee" }} />
          <div className="w-2 h-1 rounded-sm bg-cyan-400" style={{ boxShadow: "0 0 4px #22d3ee" }} />
          <div className="w-2 h-1 rounded-sm bg-cyan-400/30" />
        </div>
        <span className="text-[6px] text-white/40 font-mono">10,000 mAh</span>
      </div>
    </div>
  );
};

// ── 4. NexusHub 6-in-1 - USB-C Multiport Hub ──
export const UsbHubVisual: React.FC = () => {
  return (
    <div className="relative w-16 h-48 rounded-lg bg-gradient-to-b from-[#142033] to-[#070b14] border border-blue-500/20 shadow-xl p-2 flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />

      <div className="text-center">
        <span className="text-[7px] font-podium tracking-widest text-white block">CJ</span>
        <span className="text-[4.5px] text-blue-400 uppercase tracking-widest">NEXUSHUB</span>
      </div>

      <div className="my-auto space-y-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-1.5 rounded-sm bg-black border border-white/10" />
          <span className="text-[4.5px] text-white/40 mt-1 font-mono">HDMI 4K60</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-col items-center">
            <div className="w-10 h-1 bg-[#020617] border border-blue-400/30 flex justify-center items-center">
              <div className="w-6 h-[1px] bg-blue-400" />
            </div>
            <span className="text-[4px] text-white/30 font-mono">USB 3.2</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-1 bg-[#020617] border border-blue-400/30 flex justify-center items-center">
              <div className="w-6 h-[1px] bg-blue-400" />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="w-8 h-0.5 bg-black" />
          <div className="w-6 h-0.5 bg-black" />
          <span className="text-[4px] text-white/30 font-mono block text-center">SD/TF</span>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" style={{ boxShadow: "0 0 6px rgba(59,130,246,1)" }} />
      </div>
    </div>
  );
};

// ── 5. ArmourCore Link - Braided USB-C Cable ──
export const BraidedCableVisual: React.FC = () => {
  return (
    <div className="relative w-40 h-28 flex items-center justify-center overflow-hidden">
      <svg width="150" height="100" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="30%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <path
          d="M 10 50 C 40 10, 110 90, 140 50"
          stroke="url(#cableGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="2,2"
          className="opacity-90"
        />
        <path
          d="M 10 50 C 40 10, 110 90, 140 50"
          stroke="#93c5fd"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-60"
        />
        <g transform="translate(10, 50) rotate(-55)">
          <rect x="-8" y="-4" width="12" height="8" rx="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="4" y="-2" width="6" height="4" rx="1" fill="#cbd5e1" />
          <circle cx="-5" cy="0" r="1.5" fill="#3b82f6" className="animate-ping" />
          <circle cx="-5" cy="0" r="1" fill="#3b82f6" />
        </g>
        <g transform="translate(140, 50) rotate(55)">
          <rect x="-4" y="-4" width="12" height="8" rx="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="-10" y="-2" width="6" height="4" rx="1" fill="#cbd5e1" />
          <circle cx="4" cy="0" r="1.5" fill="#ffffff" />
        </g>
      </svg>
      <div className="absolute bottom-1 text-[7px] text-white/30 font-mono tracking-wider">
        240W SUPER DUPLEX KEVLAR BRAID
      </div>
    </div>
  );
};

// ── 6. AeroGlide Wireless Pad - Qi2 Charging Pad ──
export const ChargingPadVisual: React.FC = () => {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center overflow-hidden">
      <div className="relative w-32 h-24 rounded-full bg-gradient-to-b from-[#141b2b] to-[#040812] border-t border-blue-400/30 flex flex-col items-center justify-center shadow-2xl" style={{ transform: "scaleY(0.75)" }}>
        <div className="absolute inset-0 rounded-full border border-blue-500/20" style={{ boxShadow: "inset 0 0 15px rgba(59,130,246,0.3)" }} />
        <div className="w-24 h-18 rounded-full border-2 border-[#1e293b] flex items-center justify-center">
          <div className="w-18 h-12 rounded-full border border-orange-500/30 flex items-center justify-center">
            <div className="w-10 h-6 rounded-full bg-blue-500/5 border border-dashed border-blue-400/40 flex items-center justify-center">
              <span className="text-[7px] text-blue-400 font-bold tracking-widest font-podium">CJ</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 w-28 h-4 rounded-full bg-blue-500/40 blur-md animate-pulse" />
      </div>
      <div className="absolute bottom-1 text-[7px] text-white/30 font-mono tracking-wider">
        30W AURACOOL ACTIVE COOLING
      </div>
    </div>
  );
};

// ── Visual Picker Helper ──
export const getProductVisualById = (id: string): React.ReactNode => {
  switch (id) {
    case "power-bank":    return <PowerBankVisual />;
    case "gan-charger":   return <ChargerVisual />;
    case "magsafe-bank":  return <MagSafeBankVisual />;
    case "usb-hub":       return <UsbHubVisual />;
    case "braided-cable": return <BraidedCableVisual />;
    case "charging-pad":  return <ChargingPadVisual />;
    default:              return <PowerBankVisual />;
  }
};
