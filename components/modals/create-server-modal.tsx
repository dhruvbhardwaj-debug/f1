/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronRight, Trophy, Zap, Activity } from "lucide-react"; 
import { useModal } from "@/hooks/use-modal-store";

const QUICK_JOIN_TEAMS = [
    { name: "Scuderia Ferrari", id: "844cb7e1-64f5-4b14-81b6-867cff1425ae", color: "border-red-600", bg: "hover:bg-red-950/40" },
    { name: "Red Bull Racing", id: "a7bb557c-2cda-4788-8721-d7ac2da1dfe9", color: "border-blue-700", bg: "hover:bg-blue-950/40" },
    { name: "Mercedes AMG", id: "e197b2d6-c73b-4986-b025-9a91fbf95e11", color: "border-emerald-500", bg: "hover:bg-emerald-950/40" },
    { name: "McLaren", id: "9ed8dfd7-431d-4055-856b-2b849c7fb6b7", color: "border-emerald-500", bg: "hover:bg-emerald-950/40" }
];

const formSchema = z.object({
    name: z.string().optional(),
    imageUrl: z.string().optional(),
    inviteCode: z.string().optional(),
}).refine((data) => {
    if (!data.inviteCode || data.inviteCode.trim() === "") {
        return !!(data.name && data.name.length > 0 && data.imageUrl && data.imageUrl.length > 0);
    }
    return true;
}, { message: "Required", path: ["name"] });

export const CreateServerModal = () =>{
    const {isOpen,onClose,type}=useModal(); 
    const [isMounted, setIsMounted] = useState(false);
    const [isJoining, setIsJoining] = useState(false); 
    const router = useRouter();

    useEffect(() => { setIsMounted(true); }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", imageUrl: "", inviteCode: "" }
    });

    const isLoading = form.formState.isSubmitting;

    const handleQuickJoin = (inviteId: string) => {
        router.push(`/invite/${inviteId}`);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (isJoining && values.inviteCode) {
                const code = values.inviteCode.includes("/invite/") 
                    ? values.inviteCode.split("/invite/")[1] 
                    : values.inviteCode;
                router.push(`/invite/${code}`);
                return;
            }
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) { console.error(error); }
    }

    if (!isMounted) return null;


 
 
    const isModalOpen = isOpen && type=="createServer"

    const handleClose = ()=>{
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            {/* FORCE FIXED WIDTH: Using min-w-[800px] and removing md: logic */}
            <DialogContent className="bg-[#050505] text-white p-0 overflow-hidden max-w-[850px] min-w-[800px] h-[520px] border-zinc-800 border-[1px] shadow-[0_0_60px_-15px_rgba(220,38,38,0.4)]">
                
                <div className="flex w-full h-full">
                    
                    {/* LEFT SIDE: THE PADDOCK (Quick Join) */}
                    <div className="w-[35%] bg-zinc-900/30 p-8 border-r border-zinc-800/50 flex flex-col">
                        <div className="flex items-center gap-2 mb-10">
                            <Zap className="w-4 h-4 text-red-600 fill-red-600" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] italic text-zinc-500">Fast_Entry</h2>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            {QUICK_JOIN_TEAMS.map((team) => (
                                <button
                                    key={team.id}
                                    type="button"
                                    onClick={() => handleQuickJoin(team.id)}
                                    className={`w-full flex items-center justify-between p-4 bg-black/40 border-l-[3px] ${team.color} ${team.bg} transition-all duration-300 group rounded-r-sm`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white text-zinc-400">{team.name}</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-red-600" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-zinc-800/50">
                            <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                Connection: Encrypted
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: CONSTRUCTOR (Manual Controls) */}
                    <div className="flex-1 p-10 flex flex-col bg-gradient-to-br from-black to-zinc-900/20">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter text-left leading-none">
                                {isJoining ? "Join Grid" : "New Team"}
                            </DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col flex-1">
                                {!isJoining ? (
                                    <div className="flex flex-row items-center gap-8">
                                        <FormField
                                            control={form.control}
                                            name="imageUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <FileUpload 
                                                            endpoint="serverImage" 
                                                            value={field.value || ""}
                                                            onChange={field.onChange} 
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex-1">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="uppercase text-[10px] font-black text-zinc-500 tracking-[0.2em]">Constructor Name</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                className="bg-transparent border-0 border-b-2 border-zinc-800 focus:border-red-600 rounded-none px-0 text-xl h-10 transition-colors focus-visible:ring-0 placeholder:text-zinc-800" 
                                                                placeholder="SCUDERIA..." 
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="inviteCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="uppercase text-[10px] font-black text-zinc-500 tracking-[0.2em]">Invite Signal</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        className="bg-transparent border-0 border-b-2 border-zinc-800 focus:border-red-600 rounded-none px-0 text-xl h-10 transition-colors focus-visible:ring-0" 
                                                        placeholder="Enter code or URL..." 
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <div className="mt-auto space-y-4">
                                    <Button disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter h-14 text-lg shadow-[0_5px_15px_-5px_rgba(220,38,38,0.4)]">
                                        {isJoining ? "Enter Session" : "Deploy Constructor"}
                                    </Button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => { setIsJoining(!isJoining); form.clearErrors(); }}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-red-500 transition text-left"
                                    >
                                        {isJoining ? "// Open Constructor Lab" : "// Manual Paddock Entry"}
                                    </button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}