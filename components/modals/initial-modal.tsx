/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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

// Updated Schema: Validation rules change based on whether we are joining or creating
const formSchema = z.object({
    name: z.string().optional(),
    imageUrl: z.string().optional(),
    inviteCode: z.string().optional(),
}).refine((data) => {
    // If no invite code is provided, name and image MUST exist
    if (!data.inviteCode || data.inviteCode.trim() === "") {
        return !!(data.name && data.name.length > 0 && data.imageUrl && data.imageUrl.length > 0);
    }
    return true;
}, {
    message: "Server name and image are required",
    path: ["name"], 
});

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isJoining, setIsJoining] = useState(false); 
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
            inviteCode: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (isJoining && values.inviteCode) {
                // Logic: Extract code from full URL if needed
                // Example: http://localhost:3000/invite/abc-123 -> abc-123
                const inviteCode = values.inviteCode.includes("/invite/") 
                    ? values.inviteCode.split("/invite/")[1] 
                    : values.inviteCode;

                // Navigate directly to the invite page
                router.push(`/invite/${inviteCode}`);
                return;
            }

            // Standard Create Logic
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            window.location.reload();

        } catch (error) {
            console.log("Error in InitialModal:", error);
        }
    }

    if (!isMounted) return null;

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-md" showCloseButton={false}>
                <DialogHeader className="pt-8 px-6 space-y-2">
                    <DialogTitle className="text-2xl text-center font-bold">
                        {isJoining ? "Join a server" : "Customize your server"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {isJoining 
                            ? "Paste an invite link below to join an existing crew." 
                            : "Give your server a personality with a name and an image."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-6 px-6">
                            {!isJoining ? (
                                <>
                                    <div className="flex items-center justify-center text-center">
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
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                                                    Server name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" 
                                                        placeholder="Enter server name" 
                                                        disabled={isLoading} 
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="inviteCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                                                Invite Link
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" 
                                                    placeholder="e.g. https://app.com/invite/xxxx" 
                                                    disabled={isLoading} 
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsJoining(!isJoining);
                                        form.clearErrors();
                                    }}
                                    className="text-xs text-zinc-500 hover:text-zinc-700 underline transition"
                                >
                                    {isJoining ? "Create a new server instead" : "Have an invite link? Join a server"}
                                </button>
                            </div>
                        </div>

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading} className="w-full">
                                {isJoining ? "Join" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}