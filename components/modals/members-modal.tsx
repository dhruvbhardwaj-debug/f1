"use client";

import React, { useState } from "react";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Users2,
  Trophy
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";

const roleIconMap = {
  GUEST: <Shield className="h-3.5 w-3.5 ml-2 text-zinc-500" />,
  MODERATOR: <ShieldCheck className="h-3.5 w-3.5 ml-2 text-emerald-500" />,
  ADMIN: <ShieldAlert className="h-3.5 w-3.5 ml-2 text-red-600" />
};

export function MembersModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id }
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id }
      });
      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border border-zinc-800 shadow-2xl rounded-sm max-w-lg">
        <DialogHeader className="pt-8 px-6 bg-[#161621] border-b border-zinc-800">
          <div className="flex items-center gap-x-2 mb-1">
            <Users2 className="h-4 w-4 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
              Paddock_Registry
            </span>
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white text-left">
            Driver Roster
          </DialogTitle>
          <DialogDescription className="text-left text-zinc-400 text-xs font-mono uppercase tracking-widest pt-1">
            {server?.members?.length} Personnel_Linked
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-2 max-h-[420px] px-6 py-4 scrollbar-thin scrollbar-thumb-zinc-800">
          {server?.members?.map((member) => (
            <div 
              key={member.id} 
              className="flex items-center gap-x-3 mb-4 p-3 bg-black/20 border border-zinc-800/50 hover:border-red-600/30 transition-all group rounded-sm"
            >
              <UserAvatar 
                src={member.profile.imageUrl} 
                className="h-10 w-10 border border-zinc-700 group-hover:border-red-600/50 transition-colors"
              />
              <div className="flex flex-col gap-y-0.5">
                <div className="text-[13px] font-black uppercase italic tracking-tighter flex items-center text-white">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                  {member.profile.email}
                </p>
              </div>

              {server.profileId !== member.profileId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical className="h-4 w-4 text-zinc-500 hover:text-white transition" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      side="left" 
                      className="bg-[#161621] border-zinc-800 text-zinc-300 rounded-sm min-w-[140px]"
                    >
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center text-[10px] font-black uppercase italic tracking-widest focus:bg-zinc-800">
                          <ShieldQuestion className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                          <span>Assign Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="bg-[#161621] border-zinc-800 text-zinc-300 ml-1">
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, "GUEST")}
                              className="text-[10px] font-black uppercase italic tracking-widest focus:bg-zinc-800 focus:text-white"
                            >
                              <Shield className="h-3.5 w-3.5 mr-2" />
                              Reserve Driver
                              {member.role === "GUEST" && (
                                <Check className="h-3 w-3 ml-auto text-red-600" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, "MODERATOR")}
                              className="text-[10px] font-black uppercase italic tracking-widest focus:bg-zinc-800 focus:text-white"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                              Lead Engineer
                              {member.role === "MODERATOR" && (
                                <Check className="h-3 w-3 ml-auto text-red-600" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem 
                        onClick={() => onKick(member.id)}
                        className="text-[10px] font-black uppercase italic tracking-widest text-red-500 focus:bg-red-600/10 focus:text-red-500"
                      >
                        <Gavel className="h-3.5 w-3.5 mr-2" />
                        Black Flag (Kick)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-red-600 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
        <div className="bg-[#161621] h-1 w-full bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#000_10px,#000_20px)] opacity-20" />
      </DialogContent>
    </Dialog>
  );
}