"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import {Button} from "@/components/ui/button";
import {LayoutDashboard, Book, Compass, WalletCards, UserCircle2Icon} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import AddNewCourseDialog from "@/app/workspace/_components/AddNewCourseDialog";

const SideBarOptions = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        path: '/workspace'
    },
    {
        title: 'My Learning',
        icon: Book,
        path: '/workspace/my-learning'
    },
    {
        title: 'Explore Courses',
        icon: Compass,
        path: '/workspace/explore'
    },
    {
        title: 'Billing',
        icon: WalletCards,
        path: '/workspace/billing'
    },
    {
        title: 'Profile',
        icon: UserCircle2Icon,
        path: '/workspace/profile',
    }

]
export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className={'p-4'}>
                <Image src={'/logo.svg'} alt={'logo'} width={200} height={150} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup >
                    <AddNewCourseDialog>
                        <Button>Create New Course</Button>
                    </AddNewCourseDialog>

                </SidebarGroup>
                <SidebarGroup >
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {SideBarOptions.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild className={'p-5'}>
                                        <Link href={item.path} className={`text-[17px]
                                        ${((item.path === '/workspace') ? (path === '/workspace') : (path === item.path || path.startsWith(item.path + '/'))) && 'text-primary bg-blue-100'}`}>
                                            <item.icon className={"h-7 w-7"}/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

