"use client"

import { Plus } from "lucide-react"
import { ActionTooltip } from "@/components/ui/action-tooltip"
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

export const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div className="mb-4">
            <ActionTooltip side="right" align="center" label="Initialize New Constructor">
                <button 
                    onClick={() => onOpen("createServer")}
                    className="group flex items-center relative"
                >
                    {/* Active/Hover Indicator (Vertical pill) */}
                    <div className="absolute left-0 bg-red-600 rounded-r-full transition-all w-[4px] h-[8px] group-hover:h-[20px]" />

                    <div className={cn(
                        "flex mx-3 h-[48px] w-[48px] transition-all duration-300 overflow-hidden items-center justify-center",
                        "bg-[#18181b] border border-zinc-800", // Asphalt background
                        "rounded-[16px] group-hover:rounded-[12px] group-hover:bg-red-600 group-hover:border-red-500", // Shape shift on hover
                        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" // Subtle metallic highlight
                    )}>
                        <Plus 
                            className="transition-all duration-300 text-red-600 group-hover:text-white group-hover:rotate-90" 
                            size={22}
                            strokeWidth={3}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}