/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"; 
import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { ChevronDown, Hash, LogOut, Settings, Trash, UserPlus, Users, Trophy, ShieldCheck } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
};

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    if (!isMounted) return null;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none group" asChild>
                <button
                    className="w-full justify-between px-4 flex items-center h-14 
                    bg-zinc-100 dark:bg-[#222231]  
                    border-b border-zinc-300 dark:border-zinc-800 
                    hover:bg-zinc-200 dark:hover:bg-[#2a2a3d] 
                    transition-all relative overflow-hidden"
                >
                    {/* NEW: Racing Line Gradient (Bottom) */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-transparent to-transparent opacity-40" />

                    {/* Side Racing Accent (Left) */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col items-start z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic leading-none mb-1">
                            Team_Paddock
                        </span>
                        <p className="font-black text-sm uppercase italic tracking-tighter text-zinc-900 dark:text-white truncate max-w-[150px]">
                            {server.name}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 z-10">
                         {isAdmin && <ShieldCheck className="h-3 w-3 text-red-600" />}
                         <ChevronDown className="h-4 w-4 text-zinc-500 group-hover:text-red-600 transition" />
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                className="w-60 bg-zinc-100 dark:bg-[#181825] border-zinc-300 dark:border-zinc-800 p-1 shadow-2xl rounded-sm"
            >
                {isModerator && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("invite", { server })}
                        className="text-red-600 dark:text-red-500 px-3 py-2.5 text-[11px] font-black uppercase italic tracking-wider cursor-pointer focus:bg-red-600/10"
                    >
                        Recruit Driver
                        <UserPlus className="h-4 w-4 ml-auto opacity-70"/>
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator className="bg-zinc-300 dark:bg-zinc-800" />

                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("editServer", { server })}
                        className="px-3 py-2.5 text-[11px] font-black uppercase italic tracking-wider cursor-pointer text-zinc-700 dark:text-zinc-300 focus:bg-zinc-200 dark:focus:bg-zinc-800"
                    >
                        Paddock Config
                        <Settings className="h-4 w-4 ml-auto opacity-70"/>
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("members", { server })}
                        className="px-3 py-2.5 text-[11px] font-black uppercase italic tracking-wider cursor-pointer text-zinc-700 dark:text-zinc-300 focus:bg-zinc-200 dark:focus:bg-zinc-800"
                    >
                        Driver Roster
                        <Users className="h-4 w-4 ml-auto opacity-70"/>
                    </DropdownMenuItem>
                )}

                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("createChannel", { server })}
                        className="px-3 py-2.5 text-[11px] font-black uppercase italic tracking-wider cursor-pointer text-zinc-700 dark:text-zinc-300 focus:bg-zinc-200 dark:focus:bg-zinc-800"
                    >
                        Add Comms Sector
                        <Hash className="h-4 w-4 ml-auto opacity-70"/>
                    </DropdownMenuItem>
                )}

                {(isAdmin || isModerator) && <DropdownMenuSeparator className="bg-zinc-300 dark:bg-zinc-800" />}

                {isAdmin ? (
                    <DropdownMenuItem 
                        onClick={() => onOpen("deleteServer", { server })}
                        className="px-3 py-2.5 text-[11px] font-black uppercase italic tracking-wider cursor-pointer text-rose-600 focus:bg-rose-600/10"
                    >
                        Liquidate Team
                        <Trash className="h-4 w-4 ml-auto opacity-70"/>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem 
                        onClick={() => onOpen("leaveServer", { server })}
                        className="px-3 py-2.5 text-[11px] font-black uppercase italic tracking-wider cursor-pointer text-rose-600 focus:bg-rose-600/10"
                    >
                        Retire from Team
                        <LogOut className="h-4 w-4 ml-auto opacity-70"/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}