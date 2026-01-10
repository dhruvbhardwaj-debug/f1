/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Hash, Radio, Gauge, Zap, Activity } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export function ChatHeader({
  name,
  serverId,
  type,
  imageUrl
}: ChatHeaderProps) {
  return (
    <div className="
      text-md px-4 flex items-center h-14 
      bg-zinc-100 dark:bg-[#222231] 
      border-b-2 border-zinc-300 dark:border-zinc-800 
      transition-colors duration-200 relative overflow-hidden group"
    >
        {/* The "Racing Line" bottom accent */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-transparent to-transparent opacity-40" />

        {/* Icon / Avatar Section */}
        <div className="flex items-center gap-2">
            {type === "channel" && (
                <div className="bg-zinc-200 dark:bg-zinc-900 p-1.5 rounded-sm border border-zinc-300 dark:border-zinc-800 shadow-sm">
                    <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                </div>
            )}
            {type === "conversation" && (
                <div className="relative">
                    <UserAvatar
                        src={imageUrl}
                        className="h-8 w-8 border-2 border-red-600"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-2.5 h-2.5 rounded-full border-2 border-zinc-100 dark:border-[#0a0a0c]" />
                </div>
            )}
        </div>

        {/* Title Section */}
        <div className="ml-3 flex flex-col justify-center">
            <div className="flex items-center gap-2">
                <p className="font-black text-[13px] uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-none">
                    {type === "channel" ? `COMMS // ${name}` : name}
                </p>
                <div className="h-3 w-[1px] bg-zinc-400 dark:bg-zinc-700 mx-1 hidden sm:block" />
                <span className="hidden sm:inline-flex items-center text-[9px] font-black uppercase italic text-red-600 dark:text-red-500 tracking-widest">
                   <Activity className="w-3 h-3 mr-1" /> Live_Feed
                </span>
            </div>
            <p className="text-[8px] font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                {type === "channel" ? "Sector_Protocol: Active" : "Point-to-Point Link"}
            </p>
        </div>

        {/* Right Side Telemetry */}
        <div className="ml-auto flex items-center gap-4">
            {/* Mock Telemetry (Only on Large Screens) */}
            <div className="hidden md:flex items-center gap-4 border-r border-zinc-300 dark:border-zinc-800 pr-4 mr-2">
                <div className="flex flex-col items-end">
                    <span className="text-[7px] text-zinc-400 font-bold uppercase">Lat</span>
                    <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">14ms</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[7px] text-zinc-400 font-bold uppercase">BPS</span>
                    <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">102.4</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Gauge className="w-4 h-4 text-zinc-400 dark:text-zinc-600 hover:text-red-600 transition-colors cursor-pointer" />
                <SocketIndicator />
            </div>
        </div>
    </div>
  );
}