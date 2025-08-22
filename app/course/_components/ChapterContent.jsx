import React, {useContext, useState} from 'react';
import {SelectedChapterIndexContext} from "@/context/SelectedChapterIndexContext";
import {CheckCircle, Loader2Icon, Video, X} from "lucide-react";
import YouTube from "react-youtube";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useParams} from "next/navigation";
import {toast} from "sonner";
function ChapterContent({courseInfo, refreshData}) {
    // Guard against undefined courseInfo on initial render
    const {courseId} = useParams();
    const course = courseInfo?.course || courseInfo?.courses;
    const enrollCourse = courseInfo?.enrollCourse;
    const courseContent = Array.isArray(course?.courseContent) ? course.courseContent : [];
    const {selectedChapterIndex} = useContext(SelectedChapterIndexContext);
    const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo
    const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics ?? []
    const completedChapters = enrollCourse?.completedChapters ?? [];
    const [loading, setLoading] = useState(false)
    if (!courseInfo) {
        return <div className={'p-10'}>Loading course...</div>;
    }

    const markChapterCompleted = async () => {
        setLoading(true)
        try {
            const updated = Array.isArray(completedChapters) ? [...completedChapters] : [];
            if (!updated.includes(selectedChapterIndex)) {
                updated.push(selectedChapterIndex);
            }
            const result = await axios.put('/api/enroll-course', {
                courseId: courseId,
                completedChapter: updated
            });
            console.log(result);
            if (typeof refreshData === 'function') {
                await refreshData();
            }
            toast.success('Chapter marked as completed!');
        } catch (e) {
            console.error(e);
            toast.error('Failed to mark as completed');
        }
        setLoading(false)
    };

    const markChapterIncomplete = async () => {
        setLoading(true)
        try {
            const updated = (Array.isArray(completedChapters) ? completedChapters : []).filter(
                (idx) => idx !== selectedChapterIndex
            );
            const result = await axios.put('/api/enroll-course', {
                courseId: courseId,
                completedChapter: updated
            });
            console.log(result);
            if (typeof refreshData === 'function') {
                await refreshData();
            }
            toast.success('Chapter marked as incomplete');
        } catch (e) {
            console.error(e);
            toast.error('Failed to mark as incomplete');
        }
        setLoading(false)
    };

    return(
        <div className={'p-10 mt-20'}>
            <div className={'flex justify-between items-center'}>
                <h2 className={'font-bold text-2xl'}>{selectedChapterIndex +1}. {courseContent?.[selectedChapterIndex]?.courseData?.chapterName || 'Chapter'}</h2>
                {!completedChapters?.includes(selectedChapterIndex) ? (
                    <Button onClick={markChapterCompleted} disabled={loading}>{loading ? <Loader2Icon className={'animate-spin'}/> : <CheckCircle/>} Mark as Completed</Button>
                ) : (
                    <Button variant={"outline"} onClick={markChapterIncomplete} disabled={loading}>{loading ? <Loader2Icon className={'animate-spin'}/> : <X />} Mark incomplete</Button>
                )}
            </div>
            <div className={'flex items-center gap-2'}>
                <h2 className={'my-2 font-bold text-lg'}>Related Videos </h2>
                <Video />
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-5'}>
                {videoData?.map((video, index) => index < 2 && (
                    <div key={index}>
                        <YouTube videoId={video?.videoId}
                        opts={{
                            height: '250',
                            width: '400',
                        }}/>
                    </div>
                ))}
            </div>
            <div className={'mt-7'}>
                {topics.map((topic, index) => (
                    <div key={index} className={'mt-10 p-5 bg-secondary rounded-2xl'}>
                        <h2 className={'font-bold text-2xl text-primary'}>{index + 1}. {topic?.topic}</h2>
                        {/*<p>{topic?.content}</p>*/}
                        <div dangerouslySetInnerHTML={{__html: topic?.content}} style={{
                            lineHeight: '2.5'
                        }}>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ChapterContent