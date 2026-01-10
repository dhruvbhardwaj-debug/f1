/* eslint-disable @typescript-eslint/no-unused-vars */
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";
import { ServerHeader } from "./server-Header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { 
  Hash, 
  Headset, 
  ShieldAlert, 
  ShieldCheck, 
  Cctv, 
  Zap, 
  Target 
} from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

// Aggressive Racing Icon Map
const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4 text-zinc-500" />,
  [ChannelType.AUDIO]: <Headset className="mr-2 h-4 w-4 text-red-500" />, // Changed to Headset for Pit Radio feel
  [ChannelType.VIDEO]: <Cctv className="mr-2 h-4 w-4 text-zinc-400" />,    // Changed to CCTV for Trackside Cam feel
};

const roleIconMap = {
  [MemberRole.GUEST]: <Target className="h-4 w-4 mr-2 text-zinc-500" />, // Rookie Driver
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" /> // Team Engineer
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-red-600" />, // Team Principal
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: "asc" } },
      members: {
        include: { profile: true },
        orderBy: { role: "asc" },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server.channels.filter(c => c.type === ChannelType.TEXT);
  const AudioChannels = server.channels.filter(c => c.type === ChannelType.AUDIO);
  const VideoChannels = server.channels.filter(c => c.type === ChannelType.VIDEO);
  const members = server.members.filter(m => m.profileId !== profile.id);

  const role = server.members.find(m => m.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full w-full dark:bg-[#222231] bg-[#EBEDF0] border-r dark:border-zinc-800">
      <ServerHeader server={server} role={role} />
      
      <ScrollArea className="flex-1 px-3">
        {/* Search Bar with HUD Styling */}
        <div className="mt-4 px-2">
          <div className="relative group">
            <ServerSearch
              data={[
                {
                  label: "Comms Sectors", // TEXT
                  type: "channel",
                  data: textChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Pit Radio", // AUDIO
                  type: "channel",
                  data: AudioChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Trackside Cams", // VIDEO
                  type: "channel",
                  data: VideoChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Driver Grid", // MEMBERS
                  type: "member",
                  data: members?.map((member) => ({
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
        </div>

        <Separator className="bg-zinc-300 dark:bg-zinc-800 rounded-full my-4 h-[1px] opacity-50"/>

        {/* Text Channels - "Comms Sectors" */}
        {!!textChannels?.length && (
          <div className="mb-4">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Comms Sectors"
            />
            <div className="space-y-[4px]">
              {textChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {/* Voice Channels - "Pit Radio" */}
        {!!AudioChannels?.length && (
          <div className="mb-4">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Pit Radio"
            />
            <div className="space-y-[4px]">
              {AudioChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {/* Video Channels - "Trackside Cams" */}
        {!!VideoChannels?.length && (
          <div className="mb-4">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Live Telemetry"
            />
            <div className="space-y-[4px]">
              {VideoChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {/* Members - "Driver Roster" */}
        {!!members?.length && (
          <div className="mb-4">
            <ServerSection
              sectionType="members"
              role={role}
              label="Driver Roster"
              server={server}
            />
            <div className="space-y-[4px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Sidebar Footer Accent */}
      <div className="p-4 mt-auto border-t dark:border-zinc-800 bg-black/10">
        <div className="flex items-center gap-2 opacity-40 grayscale group-hover:grayscale-0 transition cursor-default">
           <Zap className="h-3 w-3 text-red-600 fill-red-600" />
           <span className="text-[10px] font-black uppercase italic tracking-widest text-zinc-500">
             Telemetry_Linked
           </span>
        </div>
      </div>
    </div>
  );
};