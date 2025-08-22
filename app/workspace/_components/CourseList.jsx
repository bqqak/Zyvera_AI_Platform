'use client'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import AddNewCourseDialog from "@/app/workspace/_components/AddNewCourseDialog";
import CourseCard from "@/app/workspace/_components/CourseCard";
import { Sparkles, PlusCircle, Library } from "lucide-react";

function CourseList() {
    const [courseList, setCourseList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            GetCourseList();
        }
    }, [user]);

    const GetCourseList = async () => {
        try {
            const result = await axios.get('/api/courses');
            const data = Array.isArray(result.data) ? result.data : [];
            console.log('Courses fetched:', data);
            setCourseList(data);
        } catch (e) {
            console.error('Failed to fetch courses:', e);
            setCourseList([]);
        }
    };

    if (!user) return null;

    return (
        <div className={'mt-10'}>
            <h2 className={'font-bold text-xl mb-5'}>Course List</h2>
            {courseList?.length === 0 ? (
                <div className={'relative overflow-hidden p-10 md:p-12 rounded-2xl mt-2 border bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-900'}>
                    <div className={'pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-purple-300/30 blur-3xl'} />
                    <div className={'pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl'} />

                    <div className={'relative z-10 flex flex-col items-center text-center gap-4'}>
                        <div className={'inline-flex items-center justify-center h-14 w-14 rounded-xl bg-white/80 backdrop-blur border shadow-sm dark:bg-zinc-800/80'}>
                            <Sparkles className={'h-7 w-7 text-purple-600 dark:text-purple-300'} />
                        </div>

                        <div>
                            <h2 className={'text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300'}>
                                Looks like you haven't created any courses yet
                            </h2>
                            <p className={'mt-2 text-sm md:text-base text-muted-foreground dark:text-zinc-300'}>
                                Kickstart your learning journey by crafting your first course with the help of AI.
                            </p>
                        </div>

                        <AddNewCourseDialog>
                            <Button className={'mt-1 group inline-flex items-center gap-2 px-5 py-5 text-base font-medium shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'}>
                                <PlusCircle className={'h-5 w-5 transition-transform group-hover:scale-110'} />
                                Create your first course
                            </Button>
                        </AddNewCourseDialog>

                        <div className={'mt-4 flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400'}>
                            <Library className={'h-4 w-4'} />
                            <span>No worries—you can always edit chapters, topics, and media later.</span>
                        </div>
                    </div>
                </div>
            ) : <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cole-3 xl:grid-cols-3 gap-5'}>
                {courseList?.map((course, index) => (
                    <CourseCard key={index} course={course} />
                    ))}
            </div>}
        </div>
    );
}

export default CourseList