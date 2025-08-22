import React from 'react';
import Image from "next/image";
import {ImageIcon, PlayCircle} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import Link from "next/link";
function EnrollCourseCard({ course, enrollCourse }) {
    const banner = typeof course?.bannerImageUrl === 'string' ? course.bannerImageUrl.trim() : '';
    const courseJson = course?.courseJson?.course;
    const hasBanner = !!banner;
    const altText = course?.name || courseJson?.name || 'Course banner';

    const CalculatePerProgress = () => {
        const completedRaw = enrollCourse?.completedChapters;
        const completed = Array.isArray(completedRaw)
            ? completedRaw.length
            : Array.isArray(completedRaw?.chapters)
                ? completedRaw.chapters.length
                : Number(enrollCourse?.completedChaptersCount) || 0;
        const total = Array.isArray(course?.courseContent)
            ? course.courseContent.length
            : Number(course?.noOfChapters || (courseJson?.noOfChapters)) || 0;
        if (!total || total <= 0) return 0;
        const pct = Math.round((completed / total) * 100);
        return Math.max(0, Math.min(100, pct));
    }
    return (
        <div className={'shadow rounded-xl'}>
            {hasBanner ? (
                <Image
                    src={banner}
                    alt={altText}
                    width={400}
                    height={300}
                    className={'w-full aspect-video rounded-t-xl object-cover'}
                />
            ) : (
                <div className={'w-full aspect-video rounded-t-xl bg-gray-200 dark:bg-zinc-800 flex items-center justify-center'}>
                    <ImageIcon className={'h-10 w-10 text-gray-400 dark:text-zinc-500'} />
                </div>
            )}
            <div className={'p-3 flex flex-col gap-3'}>
                <h2 className={'font-bold text-lg'}>Title: {courseJson?.name}</h2>
                <p className={'line-clamp-3 text-gray-400 text-sm'}>{courseJson?.description}</p>
                <div className={''}>
                    <h2 className={'flex justify-between text-sm text-primary'}>Progress <span>{CalculatePerProgress()}%</span></h2>
                    <Progress value={CalculatePerProgress()} />
                    <Link href={'/workspace/view-course/' + course?.cid}>
                        <Button className={'w-full mt-3'}><PlayCircle />Continue Learning</Button>
                    </Link>

                </div>
            </div>
        </div>
    );
}
export default EnrollCourseCard