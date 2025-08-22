import React, { useState } from 'react'
import Image from "next/image";
import {Book, PlayCircle, ImageIcon, Settings, LoaderCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import {toast} from "sonner";
function CourseCard({ course }) {
    const courseJson = course?.courseJson?.course;
    const banner = typeof course?.bannerImageUrl === 'string' ? course.bannerImageUrl.trim() : '';
    const hasBanner = !!banner;
    const altText = course?.name || courseJson?.name || 'Course banner';
    const [loading, setLoading] = useState(false)
    const onEnrollCourse = async() => {
        try {
            setLoading(true)
            const result = await axios.post('/api/enroll-course', {
                courseId: course?.cid,
            })
            console.log(result.data)
            if(result.data.resp){
                toast.warning('Already Enrolled!')
                setLoading(false)
                return;
            }
            toast.success('Enrolled!')
            setLoading(false)
        } catch (e) {
            setLoading(false)
            toast.error('Server side error')
        }
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
                <div className={'flex justify-between items-center'}>
                    <h2 className={'flex items-center text-sm gap-2'}><Book className={'text-primary h-5 w-5'}/>{courseJson?.noOfChapters} Chapters</h2>
                    {course?.courseContent?.length ? <Button size={'sm'} onClick={onEnrollCourse} disabled={loading}>{loading ? (<LoaderCircle className={'animate-spin'} />) : (<><PlayCircle /> Enroll course</>)}</Button> :
                       <Link href={'/workspace/edit-course/' + course?.cid}> <Button size={'sm'} variant={'outline'}> <Settings />Generate Course</Button></Link>}
                </div>
            </div>
        </div>
    )
}
export default CourseCard