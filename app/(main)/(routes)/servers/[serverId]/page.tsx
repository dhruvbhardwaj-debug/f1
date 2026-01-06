
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
  params: Promise<{ // 1. Type params as a Promise
    serverId: string;
  }>;
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
  // 2. Correctly await the params object first
  const { serverId } = await params;
  
  const profile = await currentProfile();

  if (!profile) return redirect("/sign-in");

  const server = await db.server.findUnique({
    where: {
      id: serverId, // Use the unwrapped ID
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  const initialChannel = server?.channels[0];

  // 3. Ensure we have an initial channel before trying to redirect
  if (!initialChannel || initialChannel.name !== "general") {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel.id}`);
}