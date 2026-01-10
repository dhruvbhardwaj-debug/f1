/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { Search, Terminal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export function ServerSearch({ data }: ServerSearchProps) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({
    id,
    type
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "member")
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);

    if (type === "channel")
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
  };

  // REPLACED: We use a simple div/button structure instead of a nested component to avoid the render error
  const triggerStyles = "group px-2 py-1 rounded-sm items-center flex gap-x-2 w-full bg-black/20 border border-zinc-800 hover:border-red-600/50 hover:bg-zinc-800/40 transition-all duration-200";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={triggerStyles}
      >
        <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-500 transition-colors" />
        <p className="font-black text-[10px] uppercase italic tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
          System_Search
        </p>
        <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded-sm border border-zinc-700 bg-zinc-900 px-1.5 font-mono text-[9px] font-bold text-zinc-500 ml-auto group-hover:border-red-600/50 transition-colors">
          <span className="text-[10px]">CTRL</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Logic only renders once mounted to avoid hydration mismatch */}
      {isMounted && (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="bg-[#0a0a0c] border border-zinc-800 shadow-2xl overflow-hidden rounded-sm">
            <div className="flex items-center border-b border-zinc-800 px-3 bg-zinc-900/50">
              <Terminal className="w-4 h-4 text-red-600 mr-2" />
              <CommandInput 
                placeholder="QUERY DATABASE: CHANNELS / DRIVERS" 
                className="h-12 bg-transparent text-[11px] font-black uppercase italic tracking-widest placeholder:text-zinc-700 focus:ring-0 outline-none border-none"
              />
            </div>
            <CommandList className="max-h-[300px] scrollbar-thin scrollbar-thumb-red-600">
              <CommandEmpty className="py-6 text-center text-[10px] font-black uppercase italic text-zinc-600">
                No Data Found in Current Sector
              </CommandEmpty>
              {data.map(({ label, type, data }) => {
                if (!data?.length) return null;

                return (
                  <CommandGroup 
                    key={label} 
                    heading={
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600/80 mb-2 block border-b border-red-600/20 pb-1">
                        {label}
                      </span>
                    }
                  >
                    {data?.map(({ id, icon, name }) => {
                      return (
                        <CommandItem
                          key={id}
                          onSelect={() => onClick({ id, type })}
                          className="flex items-center gap-2 px-3 py-2 my-1 cursor-pointer aria-selected:bg-red-600/10 aria-selected:text-white group"
                        >
                          <div className="w-4 h-4 flex items-center justify-center opacity-60 group-aria-selected:opacity-100 group-aria-selected:text-red-500">
                            {icon}
                          </div>
                          <span className="text-[11px] font-black uppercase italic tracking-tight">
                            {name}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </div>
        </CommandDialog>
      )}
    </>
  );
}