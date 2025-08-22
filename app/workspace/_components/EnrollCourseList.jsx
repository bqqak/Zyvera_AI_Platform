"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnrollCourseCard from "@/app/workspace/_components/EnrollCourseCard";

function EnrollCourseList() {
    const [enrolledCourseList, setEnrolledCourseList] = useState([]);

    useEffect(() => {
        GetEnrolledCourse();
    }, []);

    const GetEnrolledCourse = async () => {
        try {
            const result = await axios.get('/api/enroll-course');
            const data = Array.isArray(result.data) ? result.data : [];
            setEnrolledCourseList(data);
        } catch (e) {
            console.error('Failed to fetch enrolled courses:', e);
            setEnrolledCourseList([]);
        }
    };

    if (!enrolledCourseList?.length) return null;

    return (
        <div className={'mt-3'}>
            <h2 className={'font-bold text-xl mb-5'}>Continue Learning your courses</h2>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cole-3 xl:grid-cols-3 gap-5'}>
            {enrolledCourseList.map((item, index) => {
                // Handle different possible shapes from innerJoin
                const course = item?.courses || item?.coursesTable || item?.course || item;
                const enroll = item?.enrollCourse || item?.enrollcoursetable || item?.enroll_course || item?.enrollcoursetable || course?.enrollCourse;
                return <EnrollCourseCard course={course} enrollCourse={enroll} key={index} />;
            })}
            </div>
        </div>
    );
}

export default EnrollCourseList