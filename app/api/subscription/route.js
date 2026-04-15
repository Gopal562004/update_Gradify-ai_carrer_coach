import { NextResponse } from "next/server";
import {
  getUserSubscription,
  getUsageDashboard,
  upgradePlan,
  cancelSubscription,
  startFreeTrial,
} from "@/actions/subscription";

export async function GET() {
  try {
    const dashboard = await getUsageDashboard();
    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to get subscription" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, plan, billingPeriod } = body;

    let result;

    switch (action) {
      case "upgrade":
        result = await upgradePlan(plan, billingPeriod);
        break;
      case "cancel":
        result = await cancelSubscription();
        break;
      case "trial":
        result = await startFreeTrial();
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Subscription action failed" },
      { status: 500 }
    );
  }
}
