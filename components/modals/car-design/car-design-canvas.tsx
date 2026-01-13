/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Stage, Layer, Image as KonvaImage, Group, Text, Rect, Circle, Line } from 'react-konva';
import { 
  Droplet, Wind, Gauge, Activity, Link as LinkIcon, 
  Download, MoveHorizontal, Type, Zap, ShieldCheck 
} from 'lucide-react';
import useImage from 'use-image';
import Konva from 'konva';

// --- Type Definitions ---

interface CarConfig {
  liveryColor: string;
  paintOpacity: number;
  wingAngle: number;          // 1. Grip ↔ Speed
  suspensionStiffness: number; // 2. Suspension
  rideHeight: number;         // 3. Ride Height
  stability: number;          // 4. Stability ↔ Agility
  tyreWear: number;           // 5. Tyre Wear
  fuelEfficiency: number;     // 6. Fuel Efficiency
  accelBias: number;          // 7. Acceleration Bias
  tractionBias: number;       // 8. Corner Exit Traction
  brakeAggression: number;    // 9. Brake Aggressiveness
  perfReliability: number;    // 10. Reliability ↔ Performance
}

interface CustomLabel {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface LabelProps {
  x: number;
  y: number;
  title: string;
  value: string | number;
  color: string;
}

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  color?: "red" | "blue" | "emerald";
  leftLabel?: string;
  rightLabel?: string;
}

const CarDesignCanvas: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<string>('/car.png'); 
  const [img] = useImage(imgSrc, 'anonymous');
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });
  const [customLabels, setCustomLabels] = useState<CustomLabel[]>([]);
  const [newLabelText, setNewLabelText] = useState<string>("");

  const [config, setConfig] = useState<CarConfig>({
    liveryColor: '#f5f7f6',
    paintOpacity: 0.35,
    wingAngle: 14,
    suspensionStiffness: 65,
    rideHeight: 25,
    stability: 70,
    tyreWear: 40,
    fuelEfficiency: 50,
    accelBias: 60,
    tractionBias: 30,
    brakeAggression: 80,
    perfReliability: 90
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 500
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleAddLabel = () => {
    if (!newLabelText.trim()) return;
    const label: CustomLabel = {
      id: Date.now(),
      text: newLabelText.toUpperCase(),
      x: 150,
      y: 150
    };
    setCustomLabels((prev) => [...prev, label]);
    setNewLabelText("");
  };

  const downloadDesign = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = `f1-spec-${Date.now()}.png`;
    link.href = uri;
    link.click();
  };

  return (
    <div className="w-full h-[780px] bg-[#050505] text-slate-200 flex flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl font-sans">
      
      {/* --- HEADER --- */}
      <header className="h-14 border-b border-white/10 bg-black flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white font-black px-2 py-0.5 italic text-[10px] rounded-sm uppercase font-mono">ENG-OS</div>
          <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 font-mono">Chassis Engineering Terminal</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 border border-white/10 rounded px-3 py-1 gap-2">
            <Type size={12} className="text-slate-500" />
            <input 
              type="text" 
              value={newLabelText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewLabelText(e.target.value)}
              placeholder="CREATE CUSTOM LABEL..."
              className="bg-transparent text-[10px] w-40 outline-none text-white font-mono placeholder:text-slate-700 uppercase"
            />
            <button 
              onClick={handleAddLabel}
              className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors uppercase font-black"
            >
              Add
            </button>
          </div>
          <button onClick={downloadDesign} className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors">
            <Download size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* --- SIDEBAR: ALL 10 PARAMETERS --- */}
        <aside className="w-[320px] border-r border-white/10 bg-[#0a0a0a] p-6 flex flex-col gap-6 shrink-0 overflow-y-auto custom-scrollbar">
          
          <section className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500 border-b border-white/5 pb-2">01 // Aero & Dynamics</h3>
            <BalanceSlider 
                label="Grip ↔ Speed" 
                leftLabel="Downforce" rightLabel="Velocity"
                value={config.wingAngle} min={0} max={35}
                onChange={(v) => setConfig({...config, wingAngle: v})} 
            />
            <BalanceSlider 
                label="Stability ↔ Agility" 
                leftLabel="Stability" rightLabel="Rotation"
                value={config.stability}
                onChange={(v) => setConfig({...config, stability: v})} 
            />
            <BalanceSlider 
                label="Reliability ↔ Performance" 
                leftLabel="Safety" rightLabel="Peak"
                value={config.perfReliability}
                onChange={(v) => setConfig({...config, perfReliability: v})} 
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 border-b border-white/5 pb-2">02 // Mechanical Linkage</h3>
            <MetricSlider label="Suspension Stiffness" value={config.suspensionStiffness} onChange={(v) => setConfig({...config, suspensionStiffness: v})} color="blue" />
            <MetricSlider label="Ride Height (mm)" value={config.rideHeight} min={10} max={60} onChange={(v) => setConfig({...config, rideHeight: v})} color="blue" />
            <MetricSlider label="Brake Aggressiveness" value={config.brakeAggression} onChange={(v) => setConfig({...config, brakeAggression: v})} color="blue" />
          </section>

          <section className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 border-b border-white/5 pb-2">03 // Power & Efficiency</h3>
            <MetricSlider label="Tyre Wear Tendency" value={config.tyreWear} onChange={(v) => setConfig({...config, tyreWear: v})} color="emerald" />
            <MetricSlider label="Fuel Efficiency" value={config.fuelEfficiency} onChange={(v) => setConfig({...config, fuelEfficiency: v})} color="emerald" />
            <MetricSlider label="Corner Exit Traction" value={config.tractionBias} onChange={(v) => setConfig({...config, tractionBias: v})} color="emerald" />
            <MetricSlider label="Acceleration Bias" value={config.accelBias} onChange={(v) => setConfig({...config, accelBias: v})} color="emerald" />
          </section>

          <section className="pt-4 border-t border-white/10 flex items-center gap-4">
              <input type="color" value={config.liveryColor} onChange={(e) => setConfig({...config, liveryColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
              <div className="text-[9px] text-slate-500 font-bold uppercase leading-tight italic">Primary Chassis<br/>Paint Tint</div>
          </section>
        </aside>

        {/* --- CANVAS --- */}
        <section ref={containerRef} className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
          <Stage width={dimensions.width} height={dimensions.height} ref={stageRef}>
            <Layer>
              {img && (
                <Group x={dimensions.width/2 - 350} y={dimensions.height/2 - 150}>
                  <KonvaImage image={img} width={700} height={300} />
                  <Rect 
                    width={700} height={300} 
                    fill={config.liveryColor}
                    opacity={config.paintOpacity}
                    globalCompositeOperation="multiply"
                    listening={false}
                  />

                  {/* Dynamic Labels */}
                  <EngineeringPoint x={620} y={30} title="REAR_AERO" value={`${config.wingAngle}°`} color={config.liveryColor} />
                  <EngineeringPoint x={80} y={230} title="FRONT_SUSP" value={`${config.suspensionStiffness}%`} color="#3b82f6" />
                  <EngineeringPoint x={350} y={260} title="RIDE_HEIGHT" value={`${config.rideHeight}mm`} color="#10b981" />

                  {/* Custom Labels */}
                  {customLabels.map(label => (
                    <Group key={label.id} draggable x={label.x} y={label.y}>
                        <Rect width={120} height={30} fill="#000" stroke="#fff" strokeWidth={0.5} cornerRadius={2} />
                        <Text text={label.text} fontSize={9} fill="#fff" x={10} y={11} fontStyle="bold" />
                        <Circle radius={2} fill="#fff" x={0} y={0} />
                    </Group>
                  ))}
                </Group>
              )}
            </Layer>
          </Stage>

          {/* HUD Logic */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
            <div className="bg-black/80 border border-white/5 p-4 rounded text-[10px] font-mono backdrop-blur-md">
                <span className="text-slate-500 block mb-2 uppercase tracking-widest">Calculated Velocity</span>
                <span className="text-emerald-500 text-xl font-bold">{(285 + (config.accelBias * 0.3) - (config.wingAngle * 1.2)).toFixed(1)} km/h</span>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </section>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const BalanceSlider: React.FC<SliderProps> = ({ label, value, min=0, max=100, onChange, leftLabel, rightLabel }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
      <span>{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 accent-red-600 appearance-none bg-white/10 rounded cursor-pointer"
    />
    <div className="flex justify-between text-[7px] text-slate-600 uppercase italic">
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
  </div>
);

const MetricSlider: React.FC<SliderProps> = ({ label, value, min=0, max=100, onChange, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
      <span>{label}</span>
      <span className={color === "blue" ? "text-blue-400" : "text-emerald-400"}>{value}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`w-full h-1 appearance-none bg-white/5 rounded cursor-pointer ${color === "blue" ? "accent-blue-500" : "accent-emerald-500"}`}
    />
  </div>
);

const EngineeringPoint: React.FC<LabelProps> = ({ x, y, title, value, color }) => (
    <Group draggable x={x} y={y}>
      <Rect width={110} height={40} fill="#000" stroke={color} strokeWidth={1} cornerRadius={2} />
      <Text text={title} fontSize={8} fill="#888" x={10} y={8} fontStyle="bold" />
      <Text text={value.toString()} fontSize={12} fill="#fff" x={10} y={20} fontStyle="bold" />
      <Circle radius={3} fill={color} x={0} y={0} />
      <Line points={[0, 0, -20, -20]} stroke={color} strokeWidth={0.5} opacity={0.4} />
    </Group>
);

export default CarDesignCanvas;