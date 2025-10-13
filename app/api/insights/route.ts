// //insights/route.ts
// import { NextResponse } from "next/server";
// import { getIndustryInsights } from "@/actions/dashboard"; // Adjust import if needed

// // export async function GET() {
// //   try {
// //     const insights = await getIndustryInsights();
// //     return NextResponse.json(insights);
// //   } catch (error: any) {
// //     console.error("❌ API Error:", error);
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }
// export async function GET() {
//   try {
//     if (!process.env.DATABASE_URL) {
//       console.warn("⚠️ DATABASE_URL is missing. Returning empty insights.");
//       return NextResponse.json([]);
//     }
//     const insights = await getIndustryInsights();
//     return NextResponse.json(insights);
//   } catch (error: any) {
//     console.error("❌ API Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
