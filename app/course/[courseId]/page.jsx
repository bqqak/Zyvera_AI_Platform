"use client"
import React, {useEffect, useState} from "react";
import AppHeader from "@/app/workspace/_components/AppHeader";
import ChapterListSidebar from "@/app/course/_components/ChapterListSidebar";
import ChapterContent from "@/app/course/_components/ChapterContent";
import axios from "axios";
import {useParams} from "next/navigation";

function Course() {
    const {courseId} = useParams();
    const [courseInfo, setCourseInfo] = useState();
    useEffect(() => {
        GetEnrolledCourseById();
    }, []);

    const GetEnrolledCourseById = async () => {
        try {
            const result = await axios.get('/api/enroll-course?courseId=' + courseId);
            // API returns a single object for courseId-specific query (result[0] or {})
            setCourseInfo(result.data || null);
        } catch (e) {
            console.error('Failed to fetch enrolled courses:', e);
            setCourseInfo(null);
        }

    };
    return(
        <div>
            <AppHeader hideSidebar={true}/>
            <div className={'flex gap-10'}>
                <ChapterListSidebar courseInfo={courseInfo} />
                <ChapterContent courseInfo={courseInfo} refreshData={GetEnrolledCourseById} />
            </div>
        </div>
    )
}

export default Course
