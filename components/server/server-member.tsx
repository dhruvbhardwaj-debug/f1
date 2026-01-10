"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck, User, Zap, Target, Crown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

// Aggressive F1 Role Icons
const roleIconMap = {
  [MemberRole.GUEST]: <Target className="h-3.5 w-3.5 ml-auto text-zinc-500 opacity-50" />, // Rookie
  [MemberRole.MODERATOR]: (
    <Zap className="h-3.5 w-3.5 ml-auto text-emerald-500 fill-emerald-500/20" /> // Race Engineer
  ),
  [MemberRole.ADMIN]: (
    <Crown className="h-3.5 w-3.5 ml-auto text-red-600 fill-red-600/20" /> // Team Principal
  )
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];
  const isActive = params?.memberId === member.id;

  const onClick = () =>
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-3 py-2 rounded-sm flex items-center gap-x-3 w-full transition-all mb-1 relative overflow-hidden",
        "bg-transparent hover:bg-zinc-800/30 dark:hover:bg-white/5",
        isActive && "bg-zinc-800/50 dark:bg-white/10 border-r-2 border-red-600 shadow-[inset_-10px_0_20px_-10px_rgba(220,38,38,0.2)]"
      )}
    >
      {/* Left Livery Accent (Only visible on hover or active) */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-[3px] bg-red-600 transition-transform duration-200 -translate-x-full",
        "group-hover:translate-x-0",
        isActive && "translate-x-0"
      )} />

      <div className="relative">
        <UserAvatar
          src={member.profile.imageUrl}
          className={cn(
            "h-8 w-8 transition-transform group-hover:scale-105",
            isActive ? "border-2 border-red-600" : "border border-zinc-700"
          )}
        />
        {/* Online Status Dot (Aggressive Glow) */}
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#222231] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      </div>

      <div className="flex flex-col items-start overflow-hidden">
        <p
          className={cn(
            "font-black text-[11px] uppercase italic tracking-tighter transition truncate",
            "text-zinc-500 group-hover:text-zinc-300",
            isActive && "text-white"
          )}
        >
          {member.profile.name}
        </p>
        <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest leading-none mt-0.5">
            {member.role === "ADMIN" ? "Principal" : member.role === "MODERATOR" ? "Engineer" : "Driver"}
        </p>
      </div>

      <div className="ml-auto">
        {icon}
      </div>
    </button>
  );
};