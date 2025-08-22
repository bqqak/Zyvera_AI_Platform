import { NextResponse } from "next/server";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import {eq, desc, sql} from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const user = await currentUser();

    if (courseId === "0") {
        const result = await db
            .select()
            .from(coursesTable)
            .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);

        if (!result || result.length === 0) {
            // For explore listing, return an empty array if none found
            return NextResponse.json([]);
        }

        return NextResponse.json(result);
    }
    // If a specific courseId is provided, fetch that course
    if (courseId) {
      const result = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId));

      if (!result || result.length === 0) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      return NextResponse.json(result[0]);
    }

    // Otherwise, list courses for the current user
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select()

      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
        .orderBy(desc(coursesTable.id));

    // For list endpoints, return an empty array if no courses found

      return NextResponse.json(result || []);
  } catch (err) {
    console.error("GET /api/courses error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}