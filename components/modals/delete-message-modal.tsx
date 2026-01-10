"use client";

import React, { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { ShieldAlert, Eraser, XCircle } from "lucide-react";

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

export function DeleteMessageModal() {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query }
  } = useModal();

  const isModalOpen = isOpen && type === "deleteMessage";
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });

      await axios.delete(url);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border border-red-600/30 shadow-2xl rounded-sm max-w-sm">
        <DialogHeader className="pt-6 px-6 bg-[#161621] border-b border-zinc-800">
          <div className="flex items-center gap-x-2 mb-2">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
              Log_Security_Protocol
            </span>
          </div>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-white text-left">
            Purge Transmission
          </DialogTitle>
          <DialogDescription className="text-left text-zinc-400 text-xs font-medium pt-1 pb-4">
            Initiating permanent redaction of this entry. 
            <span className="block mt-1 text-red-500/80 font-mono text-[10px]">
              {">>"} ACTION_IRREVERSIBLE
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-[#161621] px-6 py-4">
          <div className="flex items-center justify-between w-full gap-x-3">
            <Button 
              variant="ghost" 
              disabled={isLoading} 
              onClick={onClose}
              className="flex-1 text-zinc-500 hover:text-white hover:bg-zinc-800 font-black uppercase italic text-[10px] tracking-widest"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClick}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic text-[10px] tracking-widest rounded-sm transition-all flex items-center justify-center gap-x-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
            >
              {isLoading ? "Redacting..." : "Confirm_Purge"}
              <Eraser className="h-3.5 w-3.5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}