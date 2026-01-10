import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

interface MemberIdPageProps {
  params: Promise<{
    memberId: string;
    serverId: string;
  }>;
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const { memberId, serverId } = await params;

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-zinc-50 dark:bg-[#1e1e2b] flex flex-col h-full border-l dark:border-zinc-800/50 relative overflow-hidden">
      
      {/* HUD Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />

      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />

      {/* Message Feed Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <ChatMessages
          member={currentMember}
          name={otherMember.profile.name}
          chatId={conversation.id}
          type="conversation"
          apiUrl="/api/direct-messages"
          paramKey="conversationId"
          paramValue={conversation.id}
          socketUrl="/api/socket/direct-messages"
          socketQuery={{
            conversationId: conversation.id
          }}
        />
      </div>

      {/* Control Input Area */}
      <div className="px-4 pb-4 relative z-10 bg-linear-to-t from-[#1e1e2b] via-[#1e1e2b] to-transparent">
        <ChatInput
          name={otherMember.profile.name}
          type="conversation"
          apiUrl="/api/socket/direct-messages"
          query={{
            conversationId: conversation.id
          }}
        />
      </div>

      {/* Secure Telemetry Metadata */}
      <div className="absolute bottom-2 right-4 text-[8px] font-mono text-zinc-600 uppercase tracking-widest pointer-events-none opacity-40 select-none">
        UPLINK_ID: {conversation.id.slice(0, 8)} 
        <span className="mx-1 text-emerald-500/40">{"//"}</span> 
        ENCRYPTED_P2P
      </div>
    </div>
  );
};

export default MemberIdPage;