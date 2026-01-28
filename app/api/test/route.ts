// ====================================
// ADD A LEAD
// ====================================

import { NextResponse } from "next/server";
import { getCollections } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leads } = await getCollections();

    const result = await leads.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add lead" }, { status: 500 });
  }
}