import axios from "axios";
import { db } from "@/config/db";
import { eq, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";

const PROMPT = `Depends on Chapter name and Topic Generate content for each topic in HTML
and give response in JSON format.
Schema:{
chapterName:<>,
{
topic:<>,
content:<>
}
}
: User Input:
`;
export async function POST(req) {
  try {
    const { course, courseJson, courseTitle, courseId } = await req.json();

    // Support both "course" and legacy "courseJson" payload keys
    const courseData = course || courseJson;
    const chapters = Array.isArray(courseData?.chapters) ? courseData.chapters : [];
    if (!Array.isArray(chapters) || chapters.length === 0) {
      console.warn("generate-course-content: No chapters found in payload. Expected course or courseJson with chapters array.");
    }

    const promises = chapters.map(async (chapter) => {
      const config = {
        responseMimeType: "text/plain",
      };
      const model = "gemini-2.0-flash";
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: PROMPT + JSON.stringify(chapter),
            },
          ],
        },
      ];
      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const RawJson = RawResp.replace("```json", "").replace("```", "").trim();
      const JSONResp = RawJson ? JSON.parse(RawJson) : {};
      const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
      return {
        youtubeVideo: youtubeData,
        courseData: JSONResp,
      };
    });

    const CourseContent = await Promise.all(promises);

    let updateInfo = { branch: "none", count: 0 };

    // Try to find the course by cid first
    const byCid = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));

    if (byCid && byCid.length > 0) {
      const updatedByCid = await db
        .update(coursesTable)
        .set({ courseContent: CourseContent })
        .where(eq(coursesTable.cid, courseId))
        .returning({ id: coursesTable.id, cid: coursesTable.cid });
      updateInfo = { branch: "cid", count: updatedByCid?.length || 0 };
      console.log("updated by cid:", updatedByCid?.length, updatedByCid?.[0]);
    } else {
      // Fallback: try by course title/name if cid didn't match
      let updated = false;
      if (courseTitle) {
        const byName = await db
          .select()
          .from(coursesTable)
          .where(eq(coursesTable.name, courseTitle));
        if (byName && byName.length > 0) {
          const targetId = byName[0].id;
          const updatedByName = await db
            .update(coursesTable)
            .set({ courseContent: CourseContent })
            .where(eq(coursesTable.id, targetId))
            .returning({ id: coursesTable.id, cid: coursesTable.cid });
          updateInfo = { branch: "name", count: updatedByName?.length || 0 };
          console.log("updated by name:", updatedByName?.length, updatedByName?.[0]);
          updated = true;
        }
      }
      if (!updated) {
        // Final fallback: update the latest course for the current user
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;
        if (email) {
          const latest = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.userEmail, email))
            .orderBy(desc(coursesTable.id));
          if (latest && latest.length > 0) {
            const updatedLatest = await db
              .update(coursesTable)
              .set({ courseContent: CourseContent })
              .where(eq(coursesTable.id, latest[0].id))
              .returning({ id: coursesTable.id, cid: coursesTable.cid });
            updateInfo = { branch: "latestByUser", count: updatedLatest?.length || 0 };
            console.log("updated latest by user:", updatedLatest?.length, updatedLatest?.[0]);
          }
        }
      }
    }

    // As a final safety net, try a raw SQL update by cid
    if (courseId) {
      try {
        await db.execute(sql`UPDATE "courses" SET "courseContent" = ${JSON.stringify(CourseContent)} WHERE "cid" = ${courseId}`);
        console.log("raw update by cid attempted");
      } catch (e) {
        console.warn("raw update by cid failed:", e?.message || e);
      }
    }

    return NextResponse.json({
      courseName: courseTitle,
      courseContent: CourseContent,
      updateInfo,
    });
  } catch (err) {
    console.error("generate-course-content error:", err);
    return NextResponse.json(
      { error: "Failed to generate course content", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
const GetYoutubeVideo = async (topic) => {
  const params = {
    part: "snippet",
    q: topic,
    type: "video",
    maxResults: 4,
    key: process.env.YOUTUBE_API_KEY,
  };
  const resp = await axios.get(YOUTUBE_BASE_URL, { params });
  const youtubeVideoListResp = resp.data.items;
  const youtubeVideoList = [];
  youtubeVideoListResp.forEach((item) => {
    const data = {
      videoId: item?.id?.videoId,
      title: item?.snippet?.title,
    };
    youtubeVideoList.push(data);
  });
  console.log("youtubeVideoList: ", youtubeVideoList);
  return youtubeVideoList;
};