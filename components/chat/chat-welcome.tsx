import React from "react";
import { Hash, Radio, MessageSquareQuote } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

export function ChatWelcome({ name, type }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col justify-end px-6 mb-8 mt-10 relative overflow-hidden">
      {/* Decorative Background: Faded Starting Grid Lines */}
      <div className="absolute left-0 bottom-0 w-full h-32 opacity-[0.03] dark:opacity-[0.07] pointer-events-none select-none">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, currentColor 41px)`,
          maskImage: `linear-gradient(to top, black, transparent)`
        }} />
      </div>

      <div className="relative z-10 space-y-4">
        {/* ICON: Technical Hexagon Frame */}
        {type === "channel" ? (
          <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-sm rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <Radio className="h-10 w-10 text-white -rotate-3 animate-pulse" />
          </div>
        ) : (
          <div className="h-16 w-16 bg-zinc-800 dark:bg-[#2a2a3d] border-2 border-red-600 flex items-center justify-center rounded-sm -rotate-2 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.2)]">
            <MessageSquareQuote className="h-8 w-8 text-red-600 rotate-2" />
          </div>
        )}

        {/* TITLE: Aggressive F1 Typography */}
        <div className="space-y-1">
          <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] italic">
            {type === "channel" ? "Sector_Initialization" : "Direct_Uplink_Established"}
          </p>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-none">
            {type === "channel" ? `#${name}` : name}
          </h1>
        </div>

        {/* DESCRIPTION: Monospaced Status Message */}
        <div className="max-w-[450px] border-l-2 border-red-600 pl-4 py-1">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">
            {type === "channel"
              ? `System Check: All sensors active. You have entered the #${name} comms sector. Maintain radio silence unless transmitting race data.`
              : `Point-to-point secure frequency opened with ${name}. All transmissions are logged and encrypted for the team principal.`}
          </p>
          <div className="flex items-center gap-x-2 mt-2">
            <div className="h-1 w-1 bg-red-600 rounded-full animate-ping" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Signal_Status: 100% // Latency: 0ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}