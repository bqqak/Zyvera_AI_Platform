"use client"
import React, { useEffect, useMemo, useState } from 'react'
import WelcomeBanner from "@/app/workspace/_components/WelcomeBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import EnrollCourseCard from "@/app/workspace/_components/EnrollCourseCard";
import { Skeleton } from "@/components/ui/skeleton";

function MyLearning() {
    const [enrolledCourseList, setEnrolledCourseList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            GetEnrolledCourse();
        }
    }, [user]);

    const GetEnrolledCourse = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get('/api/enroll-course');
            const data = Array.isArray(result.data) ? result.data : [];
            setEnrolledCourseList(data);
        } catch (e) {
            console.error('Failed to fetch enrolled courses:', e);
            setEnrolledCourseList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCourses = useMemo(() => {
        const t = searchTerm.trim().toLowerCase();
        if (!t) return enrolledCourseList;
        return enrolledCourseList.filter((item) => {
            const course = item?.courses || item?.coursesTable || item?.course || item;
            const courseJson = course?.courseJson?.course;
            const title = (course?.name || courseJson?.name || "").toLowerCase();
            const desc = (course?.description || courseJson?.description || "").toLowerCase();
            return title.includes(t) || desc.includes(t);
        });
    }, [enrolledCourseList, searchTerm]);

    if (!user) return null;

    return (
        <div className="relative">

            {/* Ambient gradient blobs in the background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-500/20 to-emerald-500/20 blur-3xl animate-pulse" />
            </div>

            {/* Header / Intro card */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/40 p-6 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-black/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                            My Learning
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Continue where you left off. Search within your enrolled courses.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/50 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-md dark:bg-zinc-900/60 dark:text-zinc-300">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Keep learning
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-xl">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search your courses"
                            className="h-12 w-full rounded-xl border-zinc-200/60 bg-white/70 pl-10 text-sm shadow-inner transition focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:border-zinc-800/60 dark:bg-zinc-900/60"
                        />
                    </div>
                    <Button
                        onClick={() => { /* reserved for possible future server-side search */ }}
                        className="group h-12 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 px-5 text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]"
                    >
                        <Search className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Search
                    </Button>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="rounded-2xl border border-white/10 bg-white/40 p-4 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <div className="mt-4 space-y-3">
                                <Skeleton className="h-4 w-3/5" />
                                <Skeleton className="h-4 w-2/5" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                        </div>
                    ))
                ) : filteredCourses && filteredCourses.length > 0 ? (
                    filteredCourses.map((item, index) => {
                        const course = item?.courses || item?.coursesTable || item?.course || item;
                        const enroll = item?.enrollCourse || item?.enrollcoursetable || item?.enroll_course || item?.enrollcoursetable || course?.enrollCourse;
                        return (
                            <div
                                key={index}
                                className="group rounded-2xl border border-white/10 bg-white/60 p-0 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/5 dark:bg-zinc-900/50"
                            >
                                <EnrollCourseCard course={course} enrollCourse={enroll} />
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full">
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300/60 bg-white/40 p-10 text-center shadow-inner backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-900/40">
                            <Sparkles className="mb-3 h-8 w-8 text-violet-500" />
                            <h3 className="text-lg font-semibold">No enrolled courses found</h3>
                            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                Try a different keyword, or clear your search to see all your enrolled courses.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default MyLearning