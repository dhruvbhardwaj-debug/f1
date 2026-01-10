"use client";

import React from "react";
import { ChannelType, MemberRole } from "@prisma/client";
import { Plus, Settings, Activity } from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/types";
import { ActionTooltip } from "@/components/ui/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export function ServerSection({
  channelType,
  label,
  sectionType,
  role,
  server
}: ServerSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-x-2">
        {/* Decorative HUD Element */}
        <div className="h-3 w-[2px] bg-red-600 hidden group-hover:block transition-all" />
        
        <p className="text-[10px] uppercase font-black italic tracking-[0.15em] text-zinc-500 dark:text-zinc-500/70">
          {label}
        </p>
      </div>

      <div className="flex items-center gap-x-2">
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label="Initiate Sector" side="top">
            <button
              onClick={() => onOpen("createChannel", { channelType })}
              className="text-zinc-500 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-500 transition-all active:scale-90"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3px]" />
            </button>
          </ActionTooltip>
        )}
        
        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Engineer Controls" side="top">
            <button
              onClick={() => onOpen("members", { server })}
              className="text-zinc-500 hover:text-white dark:text-zinc-500 dark:hover:text-zinc-200 transition-all active:rotate-90"
            >
              <Settings className="h-3.5 w-3.5 stroke-[2px]" />
            </button>
          </ActionTooltip>
        )}
      </div>
    </div>
  );
}