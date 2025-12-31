import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const currentProfile = async () => {
    // 1. Await the auth() call
    const { userId } = await auth();

    // 2. Check if userId exists
    if (!userId) {
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId // Now this is a string, not a Promise
        }
    });

    return profile;
};