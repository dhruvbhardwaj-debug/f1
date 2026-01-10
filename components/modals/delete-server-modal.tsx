"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Flame, AlertOctagon, PowerOff } from "lucide-react";

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

export function DeleteServerModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)] rounded-sm max-w-md">
        {/* Top Warning Banner */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#000_10px,#000_20px)]" />

        <DialogHeader className="pt-8 px-6 bg-[#161621]">
          <div className="flex items-center gap-x-2 mb-3">
            <AlertOctagon className="h-6 w-6 text-red-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 italic">
              Terminal_Constructor_Failure
            </span>
          </div>
          
          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-white text-left leading-none">
            Liquidate Team
          </DialogTitle>
          
          <DialogDescription className="text-left text-zinc-400 font-medium pt-4 text-sm leading-relaxed">
            You are initiating a <span className="text-white font-bold">Total Withdrawal</span>. 
            All paddock data, telemetry logs, and driver records for 
            <span className="block mt-2 text-xl font-black text-red-600 uppercase italic tracking-widest bg-red-600/10 p-2 border border-red-600/20">
              {server?.name}
            </span>
            will be <span className="text-red-500 underline decoration-2 underline-offset-4">permanently erased</span> from the championship.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-[#161621] px-6 py-6 border-t border-zinc-800/50">
          <div className="flex flex-col w-full gap-y-3">
            <Button
              disabled={isLoading}
              onClick={onClick}
              className="w-full bg-red-600 hover:bg-red-800 text-white font-black uppercase italic tracking-[0.2em] py-6 rounded-sm transition-all flex items-center justify-center gap-x-2 group"
            >
              {isLoading ? "WIPING_DATABASE..." : "Confirm_Liquidation"}
              <PowerOff className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
            
            <Button 
              variant="ghost" 
              disabled={isLoading} 
              onClick={onClose}
              className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800 font-bold uppercase italic text-[10px] tracking-widest"
            >
              Abort_Sequence
            </Button>
          </div>
        </DialogFooter>

        {/* Bottom Metadata */}
        <div className="bg-black/40 px-6 py-2 flex justify-between items-center border-t border-zinc-800">
            <span className="text-[8px] font-mono text-zinc-600 uppercase">Auth_Level: Admin_Overwrite</span>
            <span className="text-[8px] font-mono text-red-900 uppercase font-bold animate-pulse">Warning: Data_Loss_Imminent</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}