"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw, UserPlus2, Fingerprint } from "lucide-react";
import axios from "axios";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen("invite", { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border border-zinc-800 shadow-2xl rounded-sm max-w-md">
                <DialogHeader className="pt-8 px-6 bg-[#161621] border-b border-zinc-800">
                    <div className="flex items-center gap-x-2 mb-1">
                        <UserPlus2 className="h-4 w-4 text-red-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
                            Personnel_Acquisition
                        </span>
                    </div>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white text-left">
                        Recruit Driver
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-400 text-xs font-medium pt-1">
                        Generate a secure paddock access link to authorize new team members.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label className="uppercase text-[10px] font-black tracking-widest text-zinc-500 italic">
                            Encrypted Invite Link
                        </Label>
                        <div className="flex items-center mt-2 gap-x-2 group">
                            <div className="relative flex-1">
                                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-red-600 transition" />
                                <Input 
                                    readOnly 
                                    disabled={isLoading}
                                    className="bg-black/20 border-zinc-800 border-x-0 border-t-0 border-b-2 rounded-none pl-10 focus-visible:ring-0 text-zinc-300 focus-visible:ring-offset-0 font-mono text-xs focus:border-red-600 transition-all"
                                    value={inviteUrl}
                                />
                            </div>
                            <Button 
                                disabled={isLoading} 
                                onClick={onCopy} 
                                size="icon"
                                className="bg-zinc-800 hover:bg-red-600 transition-colors rounded-sm h-10 w-10 shrink-0"
                            >
                                {copied 
                                    ? <Check className="w-4 h-4 text-white" /> 
                                    : <Copy className="w-4 h-4 text-zinc-400" />
                                }
                            </Button>
                        </div>
                    </div>

                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="text-[10px] font-black uppercase italic tracking-widest text-zinc-500 hover:text-red-500 transition-colors px-0 py-0 h-auto"
                    >
                        Generate New Frequency
                        <RefreshCw className={`w-3 h-3 ml-2 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                </div>

                {/* Footer Metadata */}
                <div className="bg-[#161621] px-6 py-3 border-t border-zinc-800">
                    <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">
                        Status: Link_Active // Sec_Protocol: Alpha_Zero
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};