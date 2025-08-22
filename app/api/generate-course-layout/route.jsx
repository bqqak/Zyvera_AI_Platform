import {
    GoogleGenAI
} from '@google/genai';
import {auth, currentUser} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/config/db";
import {coursesTable, usersTable} from "@/config/schema";
import axios from "axios";
import {eq} from "drizzle-orm";

const PROMPT = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, Topic under each chapters, Duration for each chapters etc, in JSON format only
Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ]
      }
    ]
  }
}, User Input:`
export async function POST(req) {
    try {
        const {courseId, ...formData} = await req.json();
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        const userName = user?.fullName || 'New User';
        if (!userEmail) {
            return NextResponse.json({ error: 'Email not found for user' }, { status: 400 });
        }

        // Ensure user exists in DB to satisfy FK constraint for courses.userEmail
        const existing = await db.select().from(usersTable).where(eq(usersTable.email, userEmail));
        if (!existing || existing.length === 0) {
            await db.insert(usersTable).values({ name: userName, email: userEmail }).returning();
        }

        const { has } = await auth();
        const hasPremiumAccess = has({ plan: 'plus' });

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        const config = { responseMimeType: 'text/plain' };
        const model = 'gemini-2.0-flash';
        const contents = [
            { role: 'user', parts: [ { text: PROMPT + JSON.stringify(formData) } ] }
        ];

        if (!hasPremiumAccess) {
            const existingCourses = await db
                .select()
                .from(coursesTable)
                .where(eq(coursesTable.userEmail, userEmail));
            if (existingCourses?.length >= 1) {
                return NextResponse.json({ resp: 'limit exceed' });
            }
        }

        const response = await ai.models.generateContent({ model, config, contents });
        const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const RawJson = RawResp.replace('```json', '').replace('```', '');
        const JSONResp = JSON.parse(RawJson);
        const ImagePrompt = JSONResp?.course?.bannerImagePrompt || '';

        const bannerImageUrl = await GenerateImage(ImagePrompt);

        await db.insert(coursesTable).values({
            ...formData,
            courseJson: JSONResp,
            userEmail: userEmail,
            cid: courseId,
            bannerImageUrl: bannerImageUrl,
        });

        return NextResponse.json({ courseId: courseId });
    } catch (e) {
        console.error('/api/generate-course-layout error:', e);
        return NextResponse.json({ error: 'Failed to generate course' }, { status: 500 });
    }
}

const GenerateImage = async(imagePrompt) => {
    const BASE_URL='https://aigurulab.tech';
    const result = await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: imagePrompt,
            model: 'flux',//'flux'
            aspectRatio:"16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process.env?.AI_GURU_LAB_API, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
    console.log(result.data.image) //Output Result: Base 64 Image
    return result.data.image;
}