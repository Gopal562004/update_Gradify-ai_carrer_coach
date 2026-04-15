import { NextResponse } from "next/server";
import { deleteUserAccount } from "@/actions/user";

export async function POST() {
  try {
    const result = await deleteUserAccount();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Account deletion failed",
      },
      { status: 500 },
    );
  }
}
