import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

// This file mirrors route.js to avoid duplicate, broken handlers
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body || {};

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields: name and email" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existing && existing.length > 0) {
      return NextResponse.json(existing[0], { status: 200 });
    }

    const inserted = await db
      .insert(usersTable)
      .values({ name, email })
      .returning();

    const created = inserted?.[0] || null;
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("/api/user POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}