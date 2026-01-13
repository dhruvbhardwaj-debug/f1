// components/modals/car-design-modal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import CarDesignCanvas from "@/components/modals/car-design/car-design-canvas";

export const CarDesignModal = () => {
  const { isOpen, type, onClose } = useModal();
  const open = isOpen && type === "carDesign";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-zinc-900 border-zinc-800 p-0 overflow-hidden outline-none">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-white text-xl font-black tracking-tighter uppercase italic">
            Chassis R&D Engineering Studio
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <CarDesignCanvas />
        </div>
      </DialogContent>
    </Dialog>
  );
};