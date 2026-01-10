import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-rooms";
import { ChannelType } from "@prisma/client";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/sign-in");

  const { channelId, serverId } = await params;

  const channel = await db.channel.findUnique({
    where: { id: channelId },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    /* DESIGN CHANGE: 
       - Background set to a deep 'Track Surface' grey-blue (#1e1e2b)
       - Border-l added to separate clearly from the sidebar
    */
    <div className="bg-zinc-50 dark:bg-[#1e1e2b] flex flex-col h-full border-l dark:border-zinc-800/50 relative overflow-hidden">
      
      {/* Subtle Scanline Overlay Effect for that HUD feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />

      {channel.type === ChannelType.TEXT && (
        <>
          {/* ChatMessages container flexed to grow */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            <ChatMessages
              member={member}
              name={channel.name}
              chatId={channel.id}
              type="channel"
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId
              }}
              paramKey="channelId"
              paramValue={channel.id}
            />
          </div>
          
          {/* ChatInput area with extra padding for a clean cockpit look */}
          <div className="px-4 pb-4 relative z-10 bg-linear-to-t from-[#1e1e2b] via-[#1e1e2b] to-transparent">
            <ChatInput
              name={channel.name}
              type="channel"
              apiUrl="/api/socket/messages"
              query={{
                channelId: channel.id,
                serverId: channel.serverId
              }}
            />
          </div>
        </>
      )}

      {/* Media Room containers (Voice/Video) */}
      {channel.type === ChannelType.AUDIO && (
        <div className="flex-1 bg-black/20 backdrop-blur-sm">
          <MediaRoom chatId={channel.id} video={false} audio={true} />
        </div>
      )}
      
      {channel.type === ChannelType.VIDEO && (
        <div className="flex-1 bg-black/20 backdrop-blur-sm">
          <MediaRoom chatId={channel.id} video={true} audio={true} />
        </div>
      )}
      
      {/* Decorative Corner Telemetry (Optional Visual) */}
        <div className="absolute bottom-2 right-4 text-[8px] font-mono text-zinc-600 uppercase tracking-widest pointer-events-none opacity-40 select-none">
        System_ID: {channel.id.slice(0, 8)} 
        <span className="mx-1 text-red-600/50">{"//"}</span> 
        Sector_{channel.type}
      </div>
    </div>
  );
};

export default ChannelIdPage;