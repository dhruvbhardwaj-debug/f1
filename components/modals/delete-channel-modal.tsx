"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

export function DeleteChannelModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      });

      await axios.delete(url);

      onClose();
      router.push(`/servers/${server?.id}`);
      router.refresh();
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border-2 border-red-600/50 shadow-[0_0_30px_rgba(220,38,38,0.2)] rounded-sm max-w-md">
        <DialogHeader className="pt-8 px-6 bg-[#161621] border-b border-zinc-800">
          <div className="flex items-center gap-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 italic">
              Critical_System_Alert
            </span>
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white text-left">
            Decommission Sector
          </DialogTitle>
          <DialogDescription className="text-left text-zinc-400 font-medium pt-2">
            Warning: You are about to initiate a terminal purge.
            <br />
            <span className="font-black text-red-500 uppercase italic tracking-wider text-lg">
              Sector_{channel?.name}
            </span>{" "}
            will be permanently removed from the paddock database. This action cannot be reversed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-[#161621] px-6 py-4 border-t border-zinc-800">
          <div className="flex items-center justify-between w-full gap-x-4">
            <Button 
              variant="ghost" 
              disabled={isLoading} 
              onClick={onClose}
              className="flex-1 text-zinc-500 hover:text-white hover:bg-zinc-800 font-black uppercase italic text-xs tracking-widest"
            >
              Abort_Mission
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={onClick}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic text-xs tracking-widest rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all flex items-center gap-x-2"
            >
              {isLoading ? "Purging..." : "Confirm_Purge"}
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
        
        {/* Subtle decorative "Caution" stripe at the bottom */}
        <div className="h-1 w-full bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#000_10px,#000_20px)] opacity-40" />
      </DialogContent>
    </Dialog>
  );
}