import React, {useState} from 'react';
import {Book, Clock, Gauge, Loader2, PlayCircle} from "lucide-react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import Link from "next/link";
function CourseInfo({ course, viewCourse }) {
    const courseLayout = course?.courseJson?.course;
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const GenerateCourseContent = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/generate-course-content', {
                courseJson: courseLayout,
                courseTitle: course?.name,
                courseId: course?.cid,
            });
            console.log(result.data);
            router.replace('/workspace')
            toast.success('Course Generated successfully, You can now start editing the course content')
        }
        catch(e) {
            console.log('Error generating content:', e);
            toast.error("Server Side error, Try Again!")
        }
        finally {
            setLoading(false);
        }
    }
    // Derive safe values with fallbacks
    const title = courseLayout?.name || course?.name || 'Untitled Course';
    const description = courseLayout?.description || course?.description || 'No description available.';
    const level = courseLayout?.level || course?.level || 'N/A';
    const chaptersCount = course?.noOfChapters ?? courseLayout?.noOfChapters ?? courseLayout?.chapters?.length ?? 0;

    // Prefer top-level bannerImageUrl saved in DB
    const bannerUrl = (typeof course?.bannerImageUrl === 'string' && course?.bannerImageUrl.trim() !== '')
        ? course.bannerImageUrl
        : undefined;

    // Try to compute a very rough total duration in minutes if chapter durations are numeric strings
    const totalDuration = (() => {
        const chapters = courseLayout?.chapters;
        if (!Array.isArray(chapters) || chapters.length === 0) return 'N/A';
        let minutes = 0;
        for (const ch of chapters) {
            const d = typeof ch?.duration === 'string' ? ch.duration : '';
            // Extract number and unit (supports patterns like "30 min", "1 hour", "2h", "45m")
            const match = d.toLowerCase().match(/(\d+\.?\d*)\s*(hours?|hrs?|h|minutes?|mins?|m)/);
            if (match) {
                const value = parseFloat(match[1]);
                const unit = match[2];
                if (/^h|hour/.test(unit)) minutes += value * 60;
                else minutes += value;
            }
        }
        if (minutes <= 0) return 'N/A';
        if (minutes < 60) return `${Math.round(minutes)} min`;
        const hrs = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
    })();

    return (
        <div className={'md:flex gap-5 justify-between p-5 rounded-2xl shadow'}>
            <div className={'flex flex-col gap-3'}>
                <h2 className={'font-bold text-3xl'}>{title}</h2>
                <p className={'line-clamp-2 text-gray-500'}>{description}</p>
                <div className={'grid grid-cols-1 md:grid-cols-3 gap-3'}>
                    <div className={'flex gap-5 items-center p-3 rounded-lg shadow'}>
                        <Clock className={'text-blue-500'}/>
                        <section>
                            <h2 className={'font-bold'}>Duration</h2>
                            <h2>{totalDuration}</h2>
                        </section>
                    </div>
                    <div className={'flex gap-5 items-center p-3 rounded-lg shadow'}>
                        <Book className={'text-green-500'}/>
                        <section>
                            <h2 className={'font-bold'}>Chapters</h2>
                            <h2>{chaptersCount}</h2>
                        </section>
                    </div>
                    <div className={'flex gap-5 items-center p-3 rounded-lg shadow'}>
                        <Gauge className={'text-red-500'}/>
                        <section>
                            <h2 className={'font-bold'}>Difficulty Level</h2>
                            <h2>{level}</h2>
                        </section>
                    </div>
                </div>
                {!viewCourse ?  <Button onClick={GenerateCourseContent} disabled={loading}>
                    {loading ? (<><Loader2 className="animate-spin" /> Generating...</>) : 'Generate Content'}
                </Button> : <Link href={'/course/' + course?.cid}><Button><PlayCircle />Continue Learning</Button></Link>}
            </div>
            {bannerUrl && (
                <Image src={bannerUrl} alt={'Course banner image'} width={400} height={400}
                       className={'w-full mt-5 md: mt-0 object-cover aspect-auto h-[240px] object-cover rounded-lg'}/>
            )}
        </div>
    )
}

export default CourseInfo