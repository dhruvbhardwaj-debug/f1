"use client"

import { Plus } from "lucide-react"
import { ActionTooltip } from "@/components/ui/action-tooltip"
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
    const {onOpen} = useModal();


    return (
        <div>
            <ActionTooltip side="right" align="center" label="Add a server">
            <button onClick={()=>onOpen("createServer")}
             className="group flex items-center">
                <div className="flex mx-3 h-[48px] w-[48px] rounded-full transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700">
                    <Plus 
                        className="group-hover:text-white transition text-emerald-500" 
                        size={25}
                    />
                </div>
            </button>
            </ActionTooltip>
        </div>
    )
}