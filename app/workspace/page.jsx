import React from 'react'
import WelcomeBanner from "@/app/workspace/_components/WelcomeBanner";
import CourseList from "@/app/workspace/_components/CourseList";
import EnrollCourseList from "@/app/workspace/_components/EnrollCourseList";
function Workspace() {
    return(
        <div>
            <WelcomeBanner />
            <EnrollCourseList />
            <CourseList />
        </div>
    )
}

export default Workspace