import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { fetchBills } from "@/apis"

const chartConfig = {
    total: {
        label: "Tổng tiền",
        color: "green",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("6m")
    const [data, setData] = React.useState<{ date: string; total: number }[]>([])

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("3m")
        }

        fetchBills().then((res) => {
            const rawBills = res.data

            const monthlyTotals: Record<string, number> = {}

            rawBills
                .filter(item => item.status === "paid")
                .forEach(item => {
                    const date = new Date(item.duration)
                    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
                    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + (item.total || 0)
                })

            const transformed = Object.entries(monthlyTotals)
                .map(([month, total]) => ({ date: month, total }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

            setData(transformed)
        })
    }, [isMobile])

    const filteredData = data.filter((item) => {
        const date = new Date(item.date + "-01")
        const now = new Date()
        const monthsBack = timeRange === "6m" ? 6 : timeRange === "3m" ? 3 : 1
        const pastDate = new Date()
        pastDate.setMonth(now.getMonth() - monthsBack)
        return date >= pastDate
    })

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardTitle>Doanh thu theo tháng </CardTitle>
                <CardDescription>
                    Tổng tiền hóa đơn đã thanh toán mỗi tháng (tính cả tiền điện, nước)
                </CardDescription>
                <div className="absolute right-4 top-4">
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="@[767px]/card:flex hidden"
                    >
                        <ToggleGroupItem value="6m" className="h-8 px-2.5">
                            6 tháng
                        </ToggleGroupItem>
                        <ToggleGroupItem value="3m" className="h-8 px-2.5">
                            3 tháng
                        </ToggleGroupItem>
                        <ToggleGroupItem value="1m" className="h-8 px-2.5">
                            1 tháng
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="@[767px]/card:hidden flex w-40">
                            <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="6m">6 tháng</SelectItem>
                            <SelectItem value="3m">3 tháng</SelectItem>
                            <SelectItem value="1m">1 tháng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const [year, month] = value.split("-")
                                return `${month}/${year}`
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const [year, month] = value.split("-")
                                        return `Tháng ${month}/${year}`
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="total"
                            type="monotone"
                            fill="url(#fillTotal)"
                            stroke="#10b981"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
