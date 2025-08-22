import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { enrollCourseTable } from "@/config/schema";
import {and, desc, eq} from "drizzle-orm";
import { coursesTable } from "@/config/schema";

export async function POST(req) {
    try {
        const { courseId } = await req.json();
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!courseId) {
            return NextResponse.json({ error: "courseId is required" }, { status: 400 });
        }

        const userEmail = user.primaryEmailAddress?.emailAddress;

        const enrollCourses = await db
            .select()
            .from(enrollCourseTable)
            .where(
                and(
                    eq(enrollCourseTable.userEmail, userEmail),
                    eq(enrollCourseTable.cid, courseId)
                )
            );

        if (!enrollCourses || enrollCourses.length === 0) {
            const result = await db
                .insert(enrollCourseTable)
                .values({
                    cid: courseId,
                    userEmail: userEmail,
                })
                .returning();
            return NextResponse.json(result[0] ?? result);
        }
        return NextResponse.json({ resp: "Already Enrolled" });
    } catch (err) {
        console.error("POST /api/enroll-course error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {

    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if(courseId) {
        const result = await db.select().from(coursesTable)
            .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
            .where(and(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress), eq(enrollCourseTable.cid, courseId)))

        return NextResponse.json(result[0] || []);
    } else {
        const result = await db.select().from(coursesTable)
            .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
            .where(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress))
            .orderBy(desc(enrollCourseTable.id));

        return NextResponse.json(result || []);
    }
}

export async function PUT(req) {
    const {completedChapter, courseId} = await req.json();
    const user = await currentUser();

    const result = await db.update(enrollCourseTable).set({
        completedChapters: completedChapter
    }).where(and(eq(enrollCourseTable.cid, courseId),
        eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress)))
        .returning(enrollCourseTable)
    return NextResponse.json(result);
}