import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchAllUserAPIs } from "@/apis"

export function SectionCards() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchData();
    }, [])
    const fetchData = async () => {
        const users = await fetchAllUserAPIs();
        setUsers(users.data);
    };
    function filterUsers(dataArray) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0 = Jan, 11 = Dec

        return dataArray.filter(item => {
            const createdAt = new Date(item.createdAt?.$date || item.createdAt);
            return (
                createdAt.getFullYear() === currentYear &&
                createdAt.getMonth() === currentMonth &&
                item.role !== 'admin'
            );
        });
    }
    function filterUsersLastMonth(dataArray) {
        const now = new Date();
        let lastMonth = now.getMonth() - 1;
        let year = now.getFullYear();

        if (lastMonth < 0) {
            lastMonth = 11;
            year -= 1;
        }

        const count = dataArray.filter(item => {
            const createdAt = new Date(item.createdAt?.$date || item.createdAt);
            return (
                createdAt.getFullYear() === year &&
                createdAt.getMonth() === lastMonth &&
                item.role !== 'admin'
            );
        }).length;
        return count > 0 ? count : 1
    }



    return (
        <div className="flex flex-wrap gap-4 px-4 lg:px-6">
            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>Total Revenue</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        $1,250.00
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        Trending up this month <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>

            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>New Customers</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        {filterUsers(users).length}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            {filterUsers(users).length / filterUsersLastMonth(users) * 100 - 100 > 0 ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
                            {filterUsers(users).length / filterUsersLastMonth(users) * 100 - 100}%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        {filterUsers(users).length / filterUsersLastMonth(users) * 100 - 100 > 0 ? `Up ${filterUsers(users).length / filterUsersLastMonth(users) * 100 - 100}% compared to last month` : `Down ${Math.abs(filterUsers(users).length / filterUsersLastMonth(users) * 100 - 100)}% compared to last month`}
                    </div>
                    <div className="text-muted-foreground">
                        Acquisition needs attention
                    </div>
                </CardFooter>
            </Card>

            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>Active Accounts</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        {users.filter(user => user.role !== 'admin').length}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        Strong user retention <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Engagement exceed targets
                    </div>
                </CardFooter>
            </Card>

            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>Growth Rate</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        4.5%
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +4.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        Steady performance <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Meets growth projections
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
