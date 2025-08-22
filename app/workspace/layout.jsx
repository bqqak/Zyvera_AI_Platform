import React from 'react'
import WorkspaceProvider from "@/app/workspace/provider";

function WorkspaceLayout({children}) {
    return (
        <WorkspaceProvider>
            {children}
        </WorkspaceProvider>
    )
}

export default WorkspaceLayout