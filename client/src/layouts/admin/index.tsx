import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./components/app-sidebar"
import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { SectionCards } from "./components/section-cards"
import { SiteHeader } from "./components/site-header"
import { Outlet, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/store/slice/userSlice"
import { useEffect } from "react"
import { USER_ROLE } from "@/utils/contanst"

export default function LayoutAdmin() {
    const currentUser = useSelector(selectCurrentUser);

    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role !== USER_ROLE.ADMIN) {
                navigate("/not-found");
            }
        }
    }, [])
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
