"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ShieldCheck, Trophy } from "lucide-react";

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
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(1, { message: "Constructor name is required." }),
  imageUrl: z.string().min(1, { message: "Constructor livery is required." })
});

export function EditServerModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: ""
    }
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border border-zinc-800 shadow-2xl rounded-sm max-w-md">
        <DialogHeader className="pt-8 px-6 bg-[#161621] border-b border-zinc-800">
          <div className="flex items-center gap-x-2 mb-1">
            <Trophy className="h-4 w-4 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
              Constructor_Profile
            </span>
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white text-left">
            Edit Team Settings
          </DialogTitle>
          <DialogDescription className="text-left text-zinc-400 text-xs font-medium pt-1">
            Update your team name and constructor livery. 
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <div className="space-y-6 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {/* FileUpload should ideally have its own dark styling within its component */}
                        <div className="border-2 border-dashed border-zinc-800 rounded-full p-1 hover:border-red-600 transition-colors">
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-black tracking-widest text-zinc-500 italic">
                      Team Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-red-600 transition" />
                        <Input
                          disabled={isLoading}
                          placeholder="e.g. Scuderia Ferrari"
                          className="bg-black/20 border-zinc-800 border-x-0 border-t-0 border-b-2 rounded-none pl-10 focus-visible:ring-0 text-zinc-200 focus-visible:ring-offset-0 focus:border-red-600 transition-all font-mono text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-[#161621] px-6 py-4 border-t border-zinc-800">
              <Button 
                disabled={isLoading} 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest rounded-sm transition-all"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}