// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// export async function GET() {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return Response.json({ connected: false, email: null });
//     }

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//       select: {
//         refreshToken: true,
//         canSendEmail: true,
//       },
//     });

//     const isConnected = !!(user?.refreshToken && user?.canSendEmail);

//     return Response.json({
//       connected: isConnected,
//       email: null, // no googleEmail in schema
//     });
//   } catch (error) {
//     return Response.json(
//       {
//         connected: false,
//         email: null,
//         error: "Failed to check connection",
//       },
//       { status: 500 }
//     );
//   }
// }
// app/api/google/status/route.js
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ 
        connected: false, 
        email: null,
        name: null 
      });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        email: true,
        name: true,
        refreshToken: true,
        canSendEmail: true,
      },
    });

    const isConnected = !!(user?.refreshToken && user?.canSendEmail);

    return Response.json({
      connected: isConnected,
      email: user?.email || null,
      name: user?.name || null,
      canSendEmail: user?.canSendEmail || false,
    });
  } catch (error) {
    console.error("Error checking Google connection:", error);
    return Response.json(
      {
        connected: false,
        email: null,
        name: null,
        error: "Failed to check connection",
      },
      { status: 500 }
    );
  }
}
