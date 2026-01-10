/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { Share2, FileCode, UploadCloud } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Telemetry attachment is required." })
});

export function MessageFileModal() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query }
  } = useModal();
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: ""
    }
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });
      await axios.post(url, { ...values, content: values.fileUrl });

      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border border-zinc-800 shadow-2xl rounded-sm max-w-md">
        <DialogHeader className="pt-8 px-6 bg-[#161621] border-b border-zinc-800">
          <div className="flex items-center gap-x-2 mb-1">
            <Share2 className="h-4 w-4 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
              Data_Transmission_Protocol
            </span>
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white text-left">
            Add Attachment
          </DialogTitle>
          <DialogDescription className="text-left text-zinc-400 text-xs font-medium pt-1">
            Select technical data or media to uplink to the paddock feed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-6"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="border-2 border-dashed border-zinc-800 rounded-sm p-4 bg-black/20 hover:border-red-600/50 transition-all group">
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {!field.value && (
                            <div className="flex flex-col items-center justify-center py-4 space-y-2">
                                <UploadCloud className="h-8 w-8 text-zinc-600 group-hover:text-red-600 transition" />
                                <p className="text-[10px] font-mono uppercase text-zinc-500">Awaiting_File_Drop</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter className="bg-[#161621] px-6 py-4 border-t border-zinc-800">
              <Button 
                disabled={isLoading} 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest rounded-sm transition-all flex items-center gap-x-2"
              >
                {isLoading ? "UPLINKING..." : "Begin_Transmission"}
                <FileCode className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Diagnostic Footer */}
        <div className="px-6 py-2 bg-black/40 flex justify-between items-center">
            <div className="flex gap-x-1">
                <div className="h-1 w-1 bg-red-600 rounded-full animate-ping" />
                <span className="text-[8px] font-mono text-zinc-600 uppercase">Uplink: Ready</span>
            </div>
            <span className="text-[8px] font-mono text-zinc-600 uppercase">Enc_Type: AES-PADDOCK</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}