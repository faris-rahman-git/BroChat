import Sidebar from "@client/components/customUi/user/panels/Sidebar"
import React from "react"

function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-screen bg-white flex flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-row h-full">
                {children}
            </div>
        </div>

    )
}

export default HomeLayout