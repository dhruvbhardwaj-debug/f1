/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import React, { useEffect, useState } from "react";
import { Member, MemberRole, Profile } from "@prisma/client";
import {
  Edit,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  Trash,
  Radio,
  Clock
} from "lucide-react";
import Image from "next/image";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/ui/action-tooltip";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-3.5 w-3.5 ml-1 text-emerald-500" />,
  ADMIN: <ShieldAlert className="h-3.5 w-3.5 ml-1 text-red-600" />
};

const formSchema = z.object({
  content: z.string().min(1)
});

export function ChatItem({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fileType, setFileType] = useState<'pdf' | 'image' | null>(null);
  const { onOpen } = useModal();

  useEffect(() => { setIsMounted(true); }, []);

  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) setIsEditing(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: `${socketUrl}/${id}`, query: socketQuery });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { form.reset({ content }); }, [content, form]);

  useEffect(() => {
    if (!fileUrl || !isMounted) { setFileType(null); return; }
    const detectFileType = async () => {
      try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('pdf')) setFileType('pdf');
        else setFileType('image');
      } catch (error) { setFileType('image'); }
    };
    detectFileType();
  }, [fileUrl, isMounted]);

  if (!isMounted) return null; 

  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = fileType === 'image' && fileUrl;

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  return (
    <div className="relative group flex items-start p-4 transition-all w-full border-l-2 border-transparent hover:border-red-600 hover:bg-zinc-800/10 dark:hover:bg-white/5">
      <div className="flex gap-x-3 items-start w-full">
        {/* User Avatar with Online status glow */}
        <div onClick={onMemberClick} className="cursor-pointer transition shrink-0">
          <UserAvatar 
            src={member.profile.imageUrl} 
            className="h-10 w-10 border border-zinc-700 group-hover:border-red-600/50"
          />
        </div>

        <div className="flex flex-col w-full">
          {/* Technical Header */}
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-black text-xs uppercase italic tracking-tighter text-zinc-900 dark:text-white hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <div className="flex items-center gap-x-1 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <Clock className="h-3 w-3" />
              {timestamp}
            </div>
          </div>

          {/* Media Handling */}
          {isImage && (
            <div className="mt-3 relative h-48 w-48 border-2 border-zinc-800 rounded-sm overflow-hidden group/image">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <Image src={fileUrl} alt={content} fill className="object-cover transition-transform group-hover/image:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition">
                        <span className="text-[10px] font-black uppercase text-white italic tracking-widest">View_Telemetry</span>
                    </div>
                </a>
            </div>
          )}

          {isPDF && (
            <div className="relative flex items-center p-3 mt-3 rounded-sm bg-zinc-900/50 border border-zinc-800 group/pdf">
              <FileIcon className="h-8 w-8 text-red-600 fill-red-600/10" />
              <div className="ml-3 flex flex-col">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase italic tracking-widest text-zinc-300 hover:text-red-500 transition">
                    PDF_DATA_STREAM
                  </a>
                  <span className="text-[9px] font-mono text-zinc-600">ENCRYPTED_TRANSFER.PDF</span>
              </div>
            </div>
          )}

          {/* Message Content */}
          {!fileUrl && !isEditing && (
            <div className="relative mt-1">
                 <p className={cn(
                    "text-[13px] leading-relaxed transition-colors",
                    deleted ? "italic text-zinc-500 text-xs mt-1" : "text-zinc-700 dark:text-zinc-300"
                )}>
                {content}
                {isUpdated && !deleted && (
                    <span className="text-[9px] font-mono mx-2 text-red-600/60 font-bold uppercase tracking-tighter">(sync_edit)</span>
                )}
                </p>
            </div>
          )}

          {/* Edit Terminal */}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form className="flex flex-col w-full gap-y-2 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative w-full">
                        <Input 
                            disabled={isLoading} 
                            className="bg-zinc-900/50 border-zinc-800 text-[13px] font-medium focus-visible:ring-red-600 focus-visible:ring-offset-0 text-white rounded-sm" 
                            {...field} 
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )} />
                <div className="flex items-center gap-x-2">
                    <Button disabled={isLoading} size="sm" className="bg-red-600 hover:bg-red-700 text-white font-black italic uppercase text-[10px] h-7 px-4">Save_Changes</Button>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Press ESC to abort mission</span>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
      
      {/* Quick Action Hub */}
      {canDeleteMessage && (
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 absolute -top-2 right-5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-sm shadow-xl transition-all z-50 overflow-hidden">
          {canEditMessage && (
            <ActionTooltip label="Edit Feed">
              <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition">
                <Edit className="w-3.5 h-3.5 text-zinc-500 hover:text-red-500" />
              </button>
            </ActionTooltip>
          )}
          <ActionTooltip label="Purge Data">
            <button 
                onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })} 
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              <Trash className="w-3.5 h-3.5 text-zinc-500 hover:text-red-600" />
            </button>
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}