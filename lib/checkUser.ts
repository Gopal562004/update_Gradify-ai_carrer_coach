import { currentUser } from "@clerk/nextjs/server";
import {db} from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  try{
    const loggedInUser = await db.user.findUnique({
      where:{
        clerkUserId: user.id,
      },
    });
    if (loggedInUser) {
      return loggedInUser;
    }
    const name=`${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data : {
        clerkUserId: user.id,
        name,
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
      },
    });

    // Auto-create FREE subscription with initial tokens
    await db.subscription.create({
      data: {
        userId: newUser.id,
        plan: "FREE",
        billingPeriod: "MONTHLY",
        status: "ACTIVE",
        resumeLimit: 2,
        coverLetterLimit: 1,
        interviewLimit: 3,
        atsCheckLimit: 2,
        careerEvalLimit: 1,
      },
    });

    return newUser; 
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
