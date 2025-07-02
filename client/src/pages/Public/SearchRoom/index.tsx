"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { logoutUserAPIs, selectCurrentUser } from "@/store/slice/userSlice"
import { EllipsisVerticalIcon, Filter, Grid, List, MapPin, Maximize, Search, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
"use client"

import {
    ChevronDownIcon,
    CreditCardIcon,
    LogOutIcon,
    UserCircleIcon
} from "lucide-react"

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
import {
    SidebarMenuButton
} from "@/components/ui/sidebar"
import { fetchAPIsBlog } from "@/apis/blog.apis"



// Utility function to remove Vietnamese tones
function removeVietnameseTones(str: string) {
    return str
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export default function RentalSearch() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProvince, setSelectedProvince] = useState("Tất cả")
    const [selectedDistrict, setSelectedDistrict] = useState("Tất cả")
    const [selectedRoomType, setSelectedRoomType] = useState("Tất cả")
    const [priceRange, setPriceRange] = useState([0, 10000000])
    const [areaRange, setAreaRange] = useState([0, 50])
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const [rooms, setRooms] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const handleLogout = () => {
        const result = dispatch(logoutUserAPIs());
    }

    useEffect(() => {
        setLoading(true)
        fetchAPIsBlog()
            .then((res) => {
                // Assuming res.data is an array of blogs
                const filtered = (res.data || []).filter((room: any) => !room._destroy)
                setRooms(filtered)
            })
            .finally(() => setLoading(false))
    }, [])

    // Aggregate all unique utilities from all rooms
    const allUtilities = Array.from(new Set(
        rooms
            .map(blog => blog.roomId?.utilities)
            .filter(Boolean)
            .flatMap((utils: string) => utils.split(',').map(u => u.trim()))
    ));
    const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);

    // Filter rooms based on criteria
    const filteredRooms = rooms.filter((blog) => {
        const room = blog.roomId || {};
        const department = room.departmentId || {};
        // Compose address: village, commune, district, province
        const address = [department.village, department.commune, department.district, department.province].filter(Boolean).join(", ");
        const title = `${room.type || "Phòng"} ${room.area ? room.area + "m²" : ""} - ${address}`;

        // Normalize for accent-insensitive search
        const search = removeVietnameseTones(searchTerm.toLowerCase());
        const normTitle = removeVietnameseTones(title.toLowerCase());
        const normAddress = removeVietnameseTones(address.toLowerCase());
        const normProvince = removeVietnameseTones((department.province || '').toLowerCase());
        const normDistrict = removeVietnameseTones((department.district || '').toLowerCase());
        const normRoomType = removeVietnameseTones((room.type || '').toLowerCase());
        const selectedNormProvince = removeVietnameseTones(selectedProvince.toLowerCase());
        const selectedNormDistrict = removeVietnameseTones(selectedDistrict.toLowerCase());
        const selectedNormRoomType = removeVietnameseTones(selectedRoomType.toLowerCase());

        // Utilities filter
        const roomUtils = (room.utilities || '').split(',').map((u: string) => u.trim());
        const matchesUtilities = selectedUtilities.length === 0 || selectedUtilities.every(util => roomUtils.includes(util));

        const matchesSearch =
            normTitle.includes(search) ||
            normAddress.includes(search);
        const matchesProvince = selectedProvince === "Tất cả" || normProvince === selectedNormProvince;
        const matchesDistrict = selectedDistrict === "Tất cả" || normDistrict === selectedNormDistrict;
        const matchesRoomType = selectedRoomType === "Tất cả" || normRoomType === selectedNormRoomType;
        const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
        const areaNum = parseFloat(room.area) || 0;
        const matchesArea = areaNum >= areaRange[0] && areaNum <= areaRange[1];

        return matchesSearch && matchesProvince && matchesDistrict && matchesRoomType && matchesPrice && matchesArea && matchesUtilities;
    });

    // Pagination
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const navigate = useNavigate();

    // Generate dropdown options dynamically from loaded data
    const provinceOptions = [
        "Tất cả",
        ...Array.from(new Set(rooms.map(blog => blog.roomId?.departmentId?.province).filter(Boolean)))
    ];
    const districtOptions = [
        "Tất cả",
        ...Array.from(new Set(rooms.map(blog => blog.roomId?.departmentId?.district).filter(Boolean)))
    ];
    const roomTypeOptions = [
        "Tất cả",
        ...Array.from(new Set(rooms.map(blog => blog.roomId?.type).filter(Boolean)))
    ];

    const AdvancedFilters = () => (
        <div className="space-y-6">
            <div>
                <Label className="text-sm font-medium mb-3 block">Khoảng giá (VNĐ)</Label>
                <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000000}
                    min={0}
                    step={100000}
                    className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                </div>
            </div>

            <div>
                <Label className="text-sm font-medium mb-3 block">Diện tích (m²)</Label>
                <Slider value={areaRange} onValueChange={setAreaRange} max={50} min={0} step={1} className="mb-2" />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{areaRange[0]}m²</span>
                    <span>{areaRange[1]}m²</span>
                </div>
            </div>

            {/* Utilities filter */}
            {allUtilities.length > 0 && (
                <div className="flex flex-col gap-2 mb-4">
                    <span className="text-sm font-medium mr-2">Tiện ích:</span>
                    {allUtilities.map(util => (
                        <div key={util} className="flex items-center space-x-2">
                            <Checkbox
                                id={`util-${util}`}
                                checked={selectedUtilities.includes(util)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedUtilities([...selectedUtilities, util]);
                                    } else {
                                        setSelectedUtilities(selectedUtilities.filter(u => u !== util));
                                    }
                                }}
                            />
                            <Label htmlFor={`util-${util}`} className="text-sm cursor-pointer">
                                {util}
                            </Label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">

                            <div className="p-4 flex items-center gap-2 cursor-auto">
                                <img
                                    src='/favicon.ico'
                                    alt="Logo"
                                    className="h-8 w-8"
                                />
                                <span className="font-bold text-xl text-rental-500 ">RoomPro</span>
                            </div>

                            <div className="hidden md:flex space-x-6">
                                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Trang chủ
                                </a>
                                <a href="/tim-kiem-tro" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Tìm phòng
                                </a>

                                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Hỗ trợ
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div> */}

                            <div className="hidden md:flex items-center space-x-2">
                                {!currentUser ?
                                    <> <Button variant="outline" onClick={() => navigate("/login")}>Đăng nhập</Button>
                                        <Button>Đăng ký</Button></>
                                    :
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                className="relative p-0 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-10 w-10 rounded-lg">
                                                        <AvatarImage src={currentUser?.avatar} alt="" />
                                                        <AvatarFallback className="rounded-lg">
                                                            {currentUser?.displayName?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="">
                                                        {currentUser?.displayName}
                                                    </div>
                                                </div>
                                                <div>
                                                    <EllipsisVerticalIcon className="h-4 w-4" />
                                                </div>

                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                            side={"bottom"}
                                            align="end"
                                            sideOffset={4}
                                        >
                                            <DropdownMenuLabel className="p-0 font-normal">
                                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                    <Avatar className="h-4 w-4 rounded-lg">
                                                        <AvatarImage src={currentUser?.avatar} alt={''} />
                                                        <AvatarFallback className="rounded-lg">{currentUser?.displayName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                                        <span className="truncate font-medium">{currentUser?.displayName}</span>
                                                        <span className="truncate text-xs text-muted-foreground">
                                                            {currentUser?.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem className="flex gap-2" onClick={() => navigate("/tenant-rooms")}>
                                                    <UserCircleIcon />
                                                    Trang quản lý
                                                </DropdownMenuItem>

                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem onClick={() => handleLogout()}>
                                                <LogOutIcon />
                                                Log out
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                }
                            </div>

                            {/* Mobile menu button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="md:hidden">
                                        Menu
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col space-y-4 mt-6">
                                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                            Trang chủ
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                            Tìm phòng
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                            Đăng tin
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                            Hỗ trợ
                                        </a>
                                        <div className="pt-4 border-t">
                                            <Button variant="outline" className="w-full mb-2">
                                                Đăng nhập
                                            </Button>
                                            <Button className="w-full">Đăng ký</Button>

                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Search Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    {/* Main Search Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tỉnh/Thành" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinceOptions.map((province) => (
                                    <SelectItem key={province} value={province}>
                                        {province}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                            <SelectTrigger>
                                <SelectValue placeholder="Quận/Huyện" />
                            </SelectTrigger>
                            <SelectContent>
                                {districtOptions.map((district) => (
                                    <SelectItem key={district} value={district}>
                                        {district}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Loại phòng" />
                            </SelectTrigger>
                            <SelectContent>
                                {roomTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Bộ lọc
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Bộ lọc nâng cao</SheetTitle>
                                    <SheetDescription>Tùy chỉnh tiêu chí tìm kiếm của bạn</SheetDescription>
                                </SheetHeader>
                                <div className="mt-6">
                                    <AdvancedFilters />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>


                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block w-80">
                        <Card className="sticky top-6">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Bộ lọc nâng cao</h3>
                                <AdvancedFilters />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Tìm thấy <span className="font-semibold">{filteredRooms.length}</span> kết quả
                            </p>
                        </div>

                        {/* Room Listings */}
                        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                            {paginatedRooms.map((blog: any) => {
                                const room = blog.roomId || {};
                                const department = room.departmentId || {};
                                // Compose address: village, commune, district, province
                                const address = [department.village, department.commune, department.district, department.province].filter(Boolean).join(", ");
                                // Compose title: type + area + address
                                const title = `${room.type || "Phòng"} ${room.area ? room.area + "m²" : ""} - ${address}`;
                                return (
                                    <Card key={blog._id} className="overflow-hidden hover:shadow-lg transition-shadow" >
                                        <div className={viewMode === "list" ? "flex" : ""}>
                                            <div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
                                                <img
                                                    src={room.image && room.image.length > 0 ? room.image[0] : "/placeholder.svg"}
                                                    alt={title}
                                                    width={300}
                                                    height={200}
                                                    className={`object-cover ${viewMode === "list" ? "h-full" : "w-full h-48"}`}
                                                />
                                            </div>
                                            <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {room.type}
                                                    </Badge>
                                                    <span className="text-lg font-bold text-blue-600">{formatPrice(room.price)}</span>
                                                </div>

                                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>

                                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span className="line-clamp-1">{address}</span>
                                                </div>

                                                {/* Utilities badges - show above description */}
                                                {room.utilities && (
                                                    <div className="flex flex-wrap gap-1 mb-2 items-center">
                                                        <span className="text-xs text-gray-500 mr-2">Tiện ích:</span>
                                                        {room.utilities.split(',').map((util: string, idx: number) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                {util.trim()}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center">
                                                        <Maximize className="w-4 h-4 mr-1" />
                                                        <span>{room.area}m²</span>
                                                    </div>
                                                </div>

                                                <div className="mb-3 text-sm text-gray-500">
                                                    {blog.description}
                                                </div>


                                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate(`/tro/${room._id || room.roomId || ""}`)}>Xem chi tiết</Button>
                                            </CardContent>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Trước
                                </Button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentPage(page)}
                                        className="w-10"
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                </Button>
                            </div>
                        )}

                        {/* Load More Button Alternative */}
                        <div className="text-center mt-6">
                            <Button variant="outline" className="px-8">
                                Tải thêm phòng trọ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
