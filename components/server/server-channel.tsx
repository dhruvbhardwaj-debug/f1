"use client";

import React from "react";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Headset, Trash, Cctv, Gauge } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/ui/action-tooltip"
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

// Technical Racing Icons
const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Headset, // Pit Radio vibe
  [ChannelType.VIDEO]: Cctv,    // Track cam vibe
};

export function ServerChannel({
  channel,
  server,
  role
}: ServerChannelProps) {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];
  const isActive = params?.channelId === channel.id;

  const onClick = () =>
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-3 py-2 rounded-sm flex items-center gap-x-2 w-full transition-all mb-1 relative overflow-hidden",
        "hover:bg-zinc-800/40 dark:hover:bg-white/5",
        isActive && "bg-red-600/10 dark:bg-red-600/20"
      )}
    >
      {/* Active Indicator (Vertical Bar) */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-[3px] bg-red-600 transition-transform duration-200 -translate-x-full",
        "group-hover:translate-x-0",
        isActive && "translate-x-0"
      )} />

      {/* Sector Icon */}
      <Icon className={cn(
        "shrink-0 w-4 h-4 transition-colors",
        isActive ? "text-red-500" : "text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-400"
      )} />

      {/* Channel Name - F1 Typography */}
      <div className="flex flex-col items-start overflow-hidden">
        <p
          className={cn(
            "line-clamp-1 font-black text-[11px] uppercase italic tracking-tight transition leading-none",
            "text-zinc-500 group-hover:text-zinc-300",
            isActive && "text-white"
          )}
        >
          {channel.name}
        </p>
        {isActive && (
           <span className="text-[7px] font-mono text-red-500 uppercase tracking-widest mt-1 animate-pulse">
             Connected_Sector
           </span>
        )}
      </div>

      {/* Action Buttons (Pit Crew Controls) */}
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Config">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden group-hover:block w-3.5 h-3.5 text-zinc-500 hover:text-white transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete Sector">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden group-hover:block w-3.5 h-3.5 text-zinc-500 hover:text-red-500 transition"
            />
          </ActionTooltip>
        </div>
      )}

      {/* Locked Icon (Security Protocol) */}
      {channel.name === "general" && (
        <ActionTooltip label="Secure Protocol">
          <Lock className="ml-auto w-3 h-3 text-zinc-500 dark:text-zinc-600" />
        </ActionTooltip>
      )}
    </button>
  );
}