import React from 'react'
// import {useParams} from "next/navigation";
import EditCourse from "@/app/workspace/edit-course/[courseId]/page";

function ViewCourse() {
    // const {courseId} = useParams();
    return (
        <div>
            <EditCourse viewCourse={true}/>
        </div>
    )
}

export default ViewCourse