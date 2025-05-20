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
import { fetchBills, fetchOrders, fetchTenants } from "@/apis"

export function SectionCards() {
    const [bills, setBills] = useState([])
    const [tenants, setTenants] = useState([])

    useEffect(() => {
        fetchBills().then((res) => {
            setBills(res.data)
        })
        fetchTenants().then((res) => {
            setTenants(res.data)
        })
    }, [])

    function totalPriceRoomInCurrentMonth(dataArray) {
        const now = new Date()
        const currentMonth = now.getUTCMonth()
        const currentYear = now.getUTCFullYear()

        return dataArray.reduce((total, item) => {
            const durationDate = new Date(item.duration)
            if (
                durationDate.getUTCMonth() === currentMonth &&
                durationDate.getUTCFullYear() === currentYear &&
                item.status === 'paid'
            ) {
                return total + (item.priceRoom || 0)
            }
            return total
        }, 0)
    }

    function totalPriceRoomInPreviousMonth(dataArray) {
        const now = new Date()
        let previousMonth = now.getUTCMonth() - 1
        let year = now.getUTCFullYear()

        if (previousMonth < 0) {
            previousMonth = 11
            year -= 1
        }

        return dataArray.reduce((total, item) => {
            const durationDate = new Date(item.duration)
            if (
                durationDate.getUTCMonth() === previousMonth &&
                durationDate.getUTCFullYear() === year &&
                item.status === 'paid'
            ) {
                return total + (item.priceRoom || 0)
            }
            return total
        }, 0)
    }

    const current = totalPriceRoomInCurrentMonth(bills)
    const previous = totalPriceRoomInPreviousMonth(bills)
    const phầnTrăm = previous > 0 ? (current / previous) * 100 - 100 : 0
    const tăngHayGiảm = phầnTrăm >= 0 ? '↑ Tăng' : '↓ Giảm'

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6">
            {/* Tổng hóa đơn */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Tổng thu về:</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {bills.reduce((a, b) => a + b.total, 0).toLocaleString()} VND
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Đang tăng trong tháng này <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Dữ liệu trong 6 tháng gần nhất
                    </div>
                </CardFooter>
            </Card>

            {/* Tổng tiền thuê phòng (không tính điện nước) */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Tổng tiền thuê phòng:</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {bills.reduce((a, b) => a + b.total - b.waterbill - b.electricityBill, 0).toLocaleString()} VND
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingDownIcon className="size-3" />
                            ↓ Giảm
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Giảm nhẹ trong kỳ <TrendingDownIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Cần cải thiện thu tiền phòng
                    </div>
                </CardFooter>
            </Card>

            {/* Tài khoản đang thuê */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Người đang thuê:</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {tenants.length}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Giữ chân khách tốt <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Tăng trưởng ổn định</div>
                </CardFooter>
            </Card>

            {/* Tiền phòng tháng này */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Tiền phòng tháng này:</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {current.toLocaleString()} VND
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            {Math.abs(phầnTrăm).toFixed(2)}%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Doanh thu tháng <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Đang đạt đúng mục tiêu dự kiến
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
