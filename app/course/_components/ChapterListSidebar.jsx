import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {SelectedChapterIndexContext} from "@/context/SelectedChapterIndexContext";
import {useContext} from "react";
function ChapterListSidebar({courseInfo}) {
    const course = courseInfo?.course || courseInfo?.courses;
    const enrollCourse = courseInfo?.enrollCourse;
    const courseContent = Array.isArray(course?.courseContent) ? course.courseContent : [];
    const {selectedChapterIndex, setSelectedChapterIndex} = useContext(SelectedChapterIndexContext)
    let completedChapter = enrollCourse?.completedChapters ?? [];
    return (
        <div className={'w-80 bg-secondary h-screen p-5'}>
            <h2 className={'my-3 font-bold text-xl'}>Chapters ({courseContent?.length})</h2>
            <Accordion type="single" collapsible>
                {courseContent.map((chapter, index) => (
                    <AccordionItem value={`item-${index}`} key={index}
                    onClick={() => setSelectedChapterIndex(index)}>
                        <AccordionTrigger className={`text-lg font-medium px-5 ${completedChapter.includes(index) ? 'bg-green-100 text-green-800' : ''}`}>

                            {index + 1}. {chapter?.courseData?.chapterName || `Chapter ${index + 1}`}</AccordionTrigger>
                        <AccordionContent asChild>
                            <div>
                                {(Array.isArray(chapter?.courseData?.topics) ? chapter.courseData.topics : []).map((topic, index_) => (
                                    <h2 key={index_} className={`p-2  my-1 rounded-lg ${completedChapter.includes(index) ? 'bg-green-100 text-green-800' : 'bg-white'}`}>{topic?.topic}</h2>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}

            </Accordion>
        </div>
    )
}

export default ChapterListSidebar