"use client"

import { fetchAPIsBlogById } from "@/apis/blog.apis"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { logoutUserAPIs, selectCurrentUser } from "@/store/slice/userSlice"
import {
    ArrowLeft,
    Bed,
    DollarSign,
    Droplets,
    DropletsIcon,
    Home,
    LogOut,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Shield,
    User,
    UserCircleIcon,
    UserPlus,
    Wifi,
    Wind,
    Zap,
    ZapIcon
} from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import FormAuth from "../auth/Auth"
import RentDateDialog from "./components/DialogAdd"



export default function TroDetailPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [blog, setBlog] = useState<any>(null)
    const [open, setOpen] = useState(false)
    const [openLogin, setOpenLogin] = useState(false)
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchAPIsBlogById(id).then(res => setBlog(res.data))
        }
    }, [id])

    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const handleBookRoom = () => {
        if (!currentUser) {
            setOpenLogin(true)
        }
        else {
            setOpen(true)
        }
    }

    const handleLogout = () => {
        const result = dispatch(logoutUserAPIs());
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/tim-kiem-tro">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Quay lại
                                </Button>
                            </Link>
                            <h1 className="text-xl font-semibold text-gray-900">Chi tiết phòng trọ</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            {currentUser ? <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 font-bold">
                                        <User className="w-4 h-4" />
                                        {currentUser?.displayName}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-40 p-2">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start "
                                        onClick={() => navigate("/tenant-rooms")}
                                    >
                                        <UserCircleIcon className="w-4 h-4 mr-2" />
                                        Trang quản lý
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-500"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Đăng xuất
                                    </Button>
                                </PopoverContent>
                            </Popover> :
                                <>
                                    <Button variant="ghost" className="flex items-center gap-2 font-bold">
                                        <User className="w-4 h-4" />
                                        Đăng nhập
                                    </Button>
                                    <Button variant="ghost" className="flex items-center gap-2 font-bold">
                                        <UserPlus className="w-4 h-4" />
                                        Đăng ký
                                    </Button>
                                </>

                            }


                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <Card className="overflow-hidden">
                            <div className="relative">
                                <img
                                    src={blog?.room?.image[0] || "/placeholder.svg"}
                                    alt={blog?.room?.roomId}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {blog?.room?.image.length}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex space-x-2 overflow-x-auto">
                                    {blog?.room?.images?.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image || "/placeholder.svg"}
                                            alt={`Ảnh ${index + 1}`}
                                            className={`w-20 h-20 object-cover rounded cursor-pointer flex-shrink-0 ${index === currentImageIndex ? "ring-2 ring-blue-500" : ""
                                                }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">{blog?.room?.type}</CardTitle>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{blog?.room?.departmentId?.commune + ", " + blog?.room?.departmentId?.district + ", " + blog?.room?.departmentId?.province}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Đăng ngày: {new Date(blog?.createdAt).toLocaleDateString("vi-VN")}</span>
                                            <Badge variant={blog?.room?.available ? "default" : "destructive"}>
                                                Còn trống
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-red-600 mb-1">{formatPrice(blog?.room?.price)}</div>
                                        <div className="text-sm text-gray-500">Cọc: {formatPrice(blog?.room?.deposit)}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Bed className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Diện tích</div>
                                        <div className="font-semibold">{blog?.room?.area}</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <DollarSign className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Giá thuê</div>
                                        <div className="font-semibold">{formatPrice(blog?.room?.price)}</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <ZapIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Giá Điện</div>
                                        <div className="font-semibold">{formatPrice(blog?.room?.departmentId?.electricPrice)}/kWh</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <DropletsIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Giá nước</div>
                                        <div className="font-semibold ">{formatPrice(blog?.room?.departmentId?.waterPrice)}/m³</div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Mô tả</h3>
                                    <p className="text-gray-700 leading-relaxed">{blog?.room?.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Amenities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tiện ích</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(Array.isArray(blog?.room?.utilities)
                                        ? blog?.room?.utilities
                                        : typeof blog?.room?.utilities === "string"
                                            ? blog?.room?.utilities.split(",")
                                            : []
                                    ).map((util: any, index: number) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            {util?.icon && typeof util.icon === "function" ? (
                                                <util.icon className="h-5 w-5 text-blue-600" />
                                            ) : null}
                                            <span className="text-sm">{util?.name || (typeof util === "string" ? util.trim() : "")}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Utilities Cost */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Chi phí dịch vụ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    {Array.isArray(blog?.room?.serviceFee) && blog.room.serviceFee.length > 0 ? (
                                        blog.room.serviceFee.map((fee: any, idx: number) => (
                                            <div className="flex justify-between py-2" key={idx}>
                                                <span>{fee.name}:</span>
                                                <span className="font-semibold">{formatPrice(fee.price)}{fee.unit ? ` / ${fee.unit}` : ''}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="col-span-2 text-gray-500">Không có dữ liệu chi phí dịch vụ</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rules */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Nội quy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {blog?.room?.rules?.map((rule, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-sm">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card> */}

                        {/* Nearby Places */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Địa điểm lân cận</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {mockTroDetail.nearby.map((place, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{place}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card> */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Liên hệ chủ trọ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={blog?.owner?.avatar || "/placeholder.svg"}
                                        alt={blog?.owner?.displayName}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{blog?.owner?.displayName}</span>

                                            <Badge variant="secondary" className="text-xs">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Đã xác thực
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-600">Chủ trọ</div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Button className="w-full" size="lg">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {blog?.owner.phone}
                                    </Button>
                                    <Button variant="outline" className="w-full" size="lg" onClick={() => {
                                        window.open(`https://zalo.me/${blog?.owner.phone}`)
                                    }}>
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Nhắn tin
                                    </Button>

                                    <Button variant="outline" className="w-full bg-blue-300 hover:bg-blue-400" size="lg" onClick={() => handleBookRoom()}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Đặt Phòng
                                    </Button>
                                </div>

                                <div className="text-xs text-gray-500 text-center">Liên hệ để xem phòng và thương lượng giá</div>
                            </CardContent>
                        </Card>

                        {/* Map Placeholder */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Vị trí</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-sm">Bản đồ vị trí</p>
                                        <p className="text-xs">{mockTroDetail.address}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                </div>
            </div>
            <RentDateDialog open={open} setOpen={setOpen} id={id} />
            <FormAuth open={openLogin} setOpen={setOpenLogin} />
        </div >
    )
}
