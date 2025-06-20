"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
    Bed, BellIcon,
    CreditCardIcon, Grid3X3, Heart, HeartIcon, List, LogOutIcon, MapPin, MoreVerticalIcon, Search, SettingsIcon, UserCircleIcon
} from 'lucide-react'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUserAPIs, selectCurrentUser } from "@/store/slice/userSlice"
import { useDispatch, useSelector } from "react-redux"
const mockTroData = [
    {
        id: 1,
        title: "Phòng trọ cao cấp gần ĐH Bách Khoa",
        price: 3500000,
        area: 25,
        address: "123 Lý Thường Kiệt, Quận 10, TP.HCM",
        image: "https://imgs.search.brave.com/6gsoJ8w1o3w5sH6Z0atkh1rWE5Ks-uNFD5QHiIJHD38/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LnBob25ndHJvLnZu/LzIvcGhvbmd0cm9f/MTc0OTQ3OTUxMDI2/My5qcGc",
        amenities: ["Wifi", "Điều hòa", "Bảo vệ", "Thang máy"],
        type: "Phòng đơn",
        available: true
    },
    {
        id: 2,
        title: "Nhà trọ sinh viên giá rẻ",
        price: 2200000,
        area: 20,
        address: "456 Nguyễn Văn Cừ, Quận 5, TP.HCM",
        image: "https://imgs.search.brave.com/fZBmUxcnm-7QX6tsYlKcSNrN6wxGg9qLOn-adT5lU5c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LnBob25ndHJvLnZu/LzIvQkRfNl83NTZm/NDkxMWExLmpwZw",
        amenities: ["Wifi", "Bảo vệ", "Giặt ủi"],
        type: "Phòng đơn",
        available: true
    },
    {
        id: 3,
        title: "Phòng trọ có gác lửng rộng rãi",
        price: 4200000,
        area: 30,
        address: "789 Võ Văn Tần, Quận 3, TP.HCM",
        image: "https://imgs.search.brave.com/nquZV3Xj_AQYuKlNHRKkOyDdUa4f3LUuwcIe0FG-o6o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y2hvdG90LmNvbS9i/UlpLenltRDU2RE9Z/RFdzYklYS3VlN1ly/Ym52c2I3SXlhTTBK/SERHVkpRL3ByZXNl/dDpsaXN0aW5nL3Bs/YWluLzljYTFjOTRm/N2NhZDQwNGE3MGQz/YzllM2U0ZGIzZWE5/LTI5MjcwMjkyODMy/MDc1ODA2NTEuanBn",
        amenities: ["Wifi", "Điều hòa", "Bếp riêng", "WC riêng"],
        type: "Phòng có gác",
        available: false
    },
    {
        id: 4,
        title: "Căn hộ mini full nội thất",
        price: 6500000,
        area: 35,
        address: "321 Cách Mạng Tháng 8, Quận 1, TP.HCM",
        image: "https://imgs.search.brave.com/Ub0Gd8YI_5gaqGgmHPdoml4Qp9JGWljLfuZsWogSVBs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y2hvdG90LmNvbS90/blZ2WEU3eHV1bEhQ/QW8tZ1JVdlY1eU1p/Y2ItTzFkRkY5QVdw/R1dYZVdrL3ByZXNl/dDpsaXN0aW5nL3Bs/YWluL2ZiMzUwMWEy/YWMyYTgwMmFlN2Yz/MzUwZGY3ODczYjk5/LTI5MTg4NTk1OTE0/MTM0MTg5NTAuanBn",
        amenities: ["Wifi", "Điều hòa", "Bếp riêng", "WC riêng", "Thang máy", "Bảo vệ"],
        type: "Căn hộ mini",
        available: true
    },
    {
        id: 5,
        title: "Phòng trọ gần chợ Bến Thành",
        price: 3800000,
        area: 22,
        address: "654 Lê Lợi, Quận 1, TP.HCM",
        image: "https://imgs.search.brave.com/W2vv_Xyvgj3mS9QqQiVQrJ_VXpFkoIqC3f2su2Hl1zE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/bG96aWRvLmNvbS9p/bWFnZS9wb3N0L3Ro/dW1iLzY3ZjE4YmUw/YThlNjEtMTc0Mzg4/MzIzMi0wMDEuanBn",
        amenities: ["Wifi", "Điều hòa", "Bảo vệ"],
        type: "Phòng đơn",
        available: true
    },
    {
        id: 6,
        title: "Nhà trọ cao cấp có thang máy",
        price: 5200000,
        area: 28,
        address: "987 Nguyễn Huệ, Quận 1, TP.HCM",
        image: "https://imgs.search.brave.com/bAbthm92DhNOOzfIQf5GzMos533su_FTaH4bUIIkUVA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9iYW5k/b24udm4vdXBsb2Fk/cy90aGlldC1rZS1u/aGEtdHJvLWRlcC0y/MDIwLWJhbmRvbi0y/Mi5qcGc",
        amenities: ["Wifi", "Điều hòa", "Thang máy", "Bảo vệ", "Giặt ủi"],
        type: "Phòng cao cấp",
        available: true
    }
]

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [priceRange, setPriceRange] = useState([1000000, 10000000])
    const [selectedDistrict, setSelectedDistrict] = useState("all")
    const [selectedType, setSelectedType] = useState("all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [favorites, setFavorites] = useState<number[]>([])
    const user = useSelector(selectCurrentUser)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(fav => fav !== id)
                : [...prev, id]
        )
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const filteredTro = mockTroData.filter(tro => {
        const matchesSearch = tro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tro.address.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPrice = tro.price >= priceRange[0] && tro.price <= priceRange[1]
        const matchesDistrict = selectedDistrict === "all" || tro.address.includes(selectedDistrict)
        const matchesType = selectedType === "all" || tro.type === selectedType

        return matchesSearch && matchesPrice && matchesDistrict && matchesType
    })

    const handleLogout = () => {
        const result = dispatch(logoutUserAPIs());
    }

    return (

        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                src='/favicon.ico'
                                alt="Logo"
                                className="h-8 w-8"
                            />
                            <h1 className="text-2xl font-bold text-rental-500">RoomPro</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {user ?
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex items-center gap-2 p-2 hover:bg-gray-100"
                                        >
                                            <Avatar className="h-8 w-8 rounded-lg ">
                                                <AvatarImage src={user.avatar} alt={user.displayName} />
                                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                            </Avatar>
                                            <div className="hidden md:block text-left text-sm leading-tight">
                                                <div className="font-medium truncate">{user.displayName}</div>
                                            </div>
                                            <MoreVerticalIcon className="ml-1 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        className="min-w-56 rounded-lg"
                                        align="end"
                                        sideOffset={4}
                                    >
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex items-center gap-2 px-3 py-2 text-sm">
                                                <Avatar className="h-8 w-8 rounded-lg">
                                                    <AvatarImage src={user.avatar} alt={user.displayName} />
                                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                                </Avatar>
                                                <div className="text-left">
                                                    <div className="font-medium truncate">{user.displayName}</div>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => navigate('/tenant-rooms')}>
                                                <UserCircleIcon className="mr-2 h-4 w-4" />
                                                Trang quản trị
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <HeartIcon className="mr-2 h-4 w-4" />
                                                Yêu thích
                                            </DropdownMenuItem>

                                        </DropdownMenuGroup>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOutIcon className="mr-2 h-4 w-4" />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                :
                                <>
                                    <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900">
                                        Đăng ký
                                    </Link>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Tìm kiếm phòng trọ</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm theo địa chỉ, tên trường học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn quận/huyện" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả quận</SelectItem>
                                    <SelectItem value="Quận 1">Quận 1</SelectItem>
                                    <SelectItem value="Quận 3">Quận 3</SelectItem>
                                    <SelectItem value="Quận 5">Quận 5</SelectItem>
                                    <SelectItem value="Quận 10">Quận 10</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Loại phòng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả loại</SelectItem>
                                    <SelectItem value="Phòng đơn">Phòng đơn</SelectItem>
                                    <SelectItem value="Phòng có gác">Phòng có gác</SelectItem>
                                    <SelectItem value="Căn hộ mini">Căn hộ mini</SelectItem>
                                    <SelectItem value="Phòng cao cấp">Phòng cao cấp</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá thuê</label>
                                <Slider
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    max={10000000}
                                    min={1000000}
                                    step={500000}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{formatPrice(priceRange[0])}</span>
                                    <span>{formatPrice(priceRange[1])}</span>
                                </div>
                            </div>

                            <div className="flex items-end space-x-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Header */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">
                        Tìm thấy <span className="font-semibold">{filteredTro.length}</span> kết quả
                    </p>
                </div>

                {/* Results Grid/List */}
                <div className={viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                    {filteredTro.map((tro) => (
                        <Card key={tro.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <img
                                    src={tro.image || "/placeholder.svg"}
                                    alt={tro.title}
                                    className="w-full h-48 object-cover"
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                    onClick={() => toggleFavorite(tro.id)}
                                >
                                    <Heart
                                        className={`h-4 w-4 ${favorites.includes(tro.id)
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-600"
                                            }`}
                                    />
                                </Button>
                                {!tro.available && (
                                    <Badge className="absolute top-2 left-2 bg-red-500">
                                        Đã thuê
                                    </Badge>
                                )}
                            </div>

                            <CardHeader className="pb-2">
                                <h3 className="font-semibold text-lg line-clamp-2">{tro.title}</h3>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="line-clamp-1">{tro.address}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-2xl font-bold text-red-600">
                                        {formatPrice(tro.price)}
                                    </span>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Bed className="h-4 w-4 mr-1" />
                                        <span>{tro.area}m²</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {tro.amenities.slice(0, 3).map((amenity, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {amenity}
                                        </Badge>
                                    ))}
                                    {tro.amenities.length > 3 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{tro.amenities.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0">
                                <Link to={`/tro/${tro.id}`} className="w-full">
                                    <Button className="w-full" disabled={!tro.available}>
                                        {tro.available ? "Xem chi tiết" : "Đã thuê"}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {filteredTro.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Không tìm thấy kết quả phù hợp</p>
                        <p className="text-gray-400">Thử thay đổi bộ lọc tìm kiếm</p>
                    </div>
                )}
            </div>
        </div>
    )
}
