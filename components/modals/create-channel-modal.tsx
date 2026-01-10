"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";
import qs from "query-string";
import { Terminal, Cpu } from "lucide-react";

import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Sector ID is required." })
    .refine((name) => name !== "general", {
      message: "Sector name cannot be 'general'"
    }),
  type: z.enum(ChannelType)
});

export function CreateChannelModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "createChannel";
  const { channelType } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT
    }
  });

  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType);
    } else {
      form.setValue("type", ChannelType.TEXT);
    }
  }, [channelType, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: { serverId: params?.serverId }
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1e1e2b] text-zinc-200 p-0 overflow-hidden border border-zinc-800 shadow-2xl rounded-sm max-w-md">
        <DialogHeader className="pt-8 px-6 bg-[#161621] border-b border-zinc-800">
          <div className="flex items-center gap-x-2 mb-1">
            <Cpu className="h-4 w-4 text-red-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
              System_Deployment
            </span>
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white text-left">
            Initialize New Sector
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <div className="space-y-6 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-black tracking-widest text-zinc-500 italic">
                      Sector Identification (Name)
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-red-600 transition" />
                        <Input
                          disabled={isLoading}
                          placeholder="e.g. engine-telemetry"
                          className="bg-black/20 border-zinc-800 border-x-0 border-t-0 border-b-2 rounded-none pl-10 focus-visible:ring-0 text-zinc-200 focus-visible:ring-offset-0 focus:border-red-600 transition-all font-mono text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-black tracking-widest text-zinc-500 italic">
                      Transmission Protocol (Type)
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-zinc-800 border-x-0 border-t-0 border-b-2 rounded-none focus:ring-0 text-zinc-300 ring-offset-0 focus:ring-offset-0 capitalize outline-none font-mono text-sm focus:border-red-600 transition-all">
                          <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#161621] border-zinc-800 text-zinc-300 rounded-none">
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize focus:bg-red-600 focus:text-white font-mono text-xs"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-[#161621] px-6 py-4 border-t border-zinc-800">
              <Button 
                disabled={isLoading} 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              >
                Deploy_Sector
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}