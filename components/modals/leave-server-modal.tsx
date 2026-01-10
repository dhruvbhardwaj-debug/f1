"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut, AlertTriangle, ChevronRight } from "lucide-react";

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

export function LeaveServerModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

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
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border border-zinc-800 shadow-2xl rounded-sm max-w-md">
        {/* Warning Accent Strip */}
        <div className="h-1.5 w-full bg-yellow-500/80" />

        <DialogHeader className="pt-8 px-6 bg-[#161621]">
          <div className="flex items-center gap-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
              Status: Resignation_Protocol
            </span>
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white text-left">
            Retire From Team
          </DialogTitle>
          <DialogDescription className="text-left text-zinc-400 font-medium pt-2">
            Are you sure you want to vacate your seat at 
            <span className="text-yellow-500 font-black uppercase italic mx-1 tracking-wider">
              {server?.name}
            </span>?
            <br />
            <span className="text-[11px] mt-2 block opacity-70">
              You will lose access to all encrypted comms and paddock telemetry.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-[#161621] px-6 py-4 border-t border-zinc-800/50">
          <div className="flex items-center justify-between w-full gap-x-4">
            <Button 
              variant="ghost" 
              disabled={isLoading} 
              onClick={onClose}
              className="flex-1 text-zinc-500 hover:text-white hover:bg-zinc-800 font-black uppercase italic text-xs tracking-widest"
            >
              Stay_In_Paddock
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={onClick}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-black uppercase italic text-xs tracking-widest rounded-sm transition-all flex items-center justify-center gap-x-2"
            >
              {isLoading ? "Processing..." : "Confirm_Exit"}
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>

        {/* Footer Data String */}
        <div className="bg-black/20 px-6 py-2">
           <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter flex items-center">
             DRIVER_OFFBOARDING_SEQUENCE <ChevronRight className="h-2 w-2 mx-1" /> ACTIVE
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}