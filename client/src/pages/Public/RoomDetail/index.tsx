"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Heart,
    Share2,
    MapPin,
    Bed,
    Wifi,
    Shield,
    Phone,
    MessageCircle,
    Calendar,
    DollarSign,
    Home,
    Zap,
    Droplets,
    Wind,
} from "lucide-react"
import { Link } from "react-router-dom"

const mockTroDetail = {
    id: 1,
    title: "Phòng trọ cao cấp gần ĐH Bách Khoa",
    price: 3500000,
    deposit: 7000000,
    area: 25,
    address: "123 Lý Thường Kiệt, Phường 7, Quận 10, TP.HCM",
    description:
        "Phòng trọ mới xây, đầy đủ nội thất, an ninh tốt, gần trường học và khu vực tiện ích. Phòng có ban công thoáng mát, ánh sáng tự nhiên. Khu vực yên tĩnh, thuận tiện đi lại.",
    images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
    ],
    amenities: [
        { name: "Wifi miễn phí", icon: Wifi },
        { name: "Điều hòa", icon: Wind },
        { name: "Bảo vệ 24/7", icon: Shield },
        { name: "Thang máy", icon: Home },
        { name: "Điện nước", icon: Zap },
        { name: "Giặt ủi", icon: Droplets },
    ],
    utilities: {
        electricity: "3,500đ/kWh",
        water: "25,000đ/m³",
        internet: "Miễn phí",
        parking: "200,000đ/tháng",
    },
    rules: [
        "Không nuôi thú cưng",
        "Không hút thuốc trong phòng",
        "Giữ gìn vệ sinh chung",
        "Không gây ồn sau 22h",
        "Khách qua đêm phải báo trước",
    ],
    landlord: {
        name: "Chị Nguyễn Thị Lan",
        phone: "0901234567",
        avatar: "/placeholder.svg?height=60&width=60",
        verified: true,
    },
    nearby: [
        "ĐH Bách Khoa TPHCM - 500m",
        "Chợ Bến Thành - 2km",
        "Bệnh viện Chợ Rẫy - 1.5km",
        "Siêu thị Co.opmart - 300m",
    ],
    available: true,
    postedDate: "2024-01-15",
}

export default function TroDetailPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
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
                            <Button variant="outline" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                                Yêu thích
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Chia sẻ
                            </Button>
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
                                    src={mockTroDetail.images[currentImageIndex] || "/placeholder.svg"}
                                    alt={mockTroDetail.title}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {mockTroDetail.images.length}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex space-x-2 overflow-x-auto">
                                    {mockTroDetail.images.map((image, index) => (
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
                                        <CardTitle className="text-2xl mb-2">{mockTroDetail.title}</CardTitle>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{mockTroDetail.address}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Đăng ngày: {new Date(mockTroDetail.postedDate).toLocaleDateString("vi-VN")}</span>
                                            <Badge variant={mockTroDetail.available ? "default" : "destructive"}>
                                                {mockTroDetail.available ? "Còn trống" : "Đã thuê"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-red-600 mb-1">{formatPrice(mockTroDetail.price)}</div>
                                        <div className="text-sm text-gray-500">Cọc: {formatPrice(mockTroDetail.deposit)}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Bed className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Diện tích</div>
                                        <div className="font-semibold">{mockTroDetail.area}m²</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <DollarSign className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Giá thuê</div>
                                        <div className="font-semibold">{formatPrice(mockTroDetail.price)}</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Home className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Cọc trước</div>
                                        <div className="font-semibold">{formatPrice(mockTroDetail.deposit)}</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                        <div className="text-sm text-gray-600">Trạng thái</div>
                                        <div className="font-semibold text-green-600">Còn trống</div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Mô tả</h3>
                                    <p className="text-gray-700 leading-relaxed">{mockTroDetail.description}</p>
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
                                    {mockTroDetail.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <amenity.icon className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm">{amenity.name}</span>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex justify-between py-2">
                                        <span>Điện:</span>
                                        <span className="font-semibold">{mockTroDetail.utilities.electricity}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span>Nước:</span>
                                        <span className="font-semibold">{mockTroDetail.utilities.water}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span>Internet:</span>
                                        <span className="font-semibold">{mockTroDetail.utilities.internet}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span>Gửi xe:</span>
                                        <span className="font-semibold">{mockTroDetail.utilities.parking}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Nội quy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {mockTroDetail.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-sm">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Nearby Places */}
                        <Card>
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
                        </Card>
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
                                        src={mockTroDetail.landlord.avatar || "/placeholder.svg"}
                                        alt={mockTroDetail.landlord.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{mockTroDetail.landlord.name}</span>
                                            {mockTroDetail.landlord.verified && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <Shield className="h-3 w-3 mr-1" />
                                                    Đã xác thực
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">Chủ trọ</div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Button className="w-full" size="lg">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {mockTroDetail.landlord.phone}
                                    </Button>
                                    <Button variant="outline" className="w-full" size="lg">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Nhắn tin
                                    </Button>
                                </div>

                                <div className="text-xs text-gray-500 text-center">Liên hệ để xem phòng và thương lượng giá</div>
                            </CardContent>
                        </Card>

                        {/* Map Placeholder */}
                        <Card>
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
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
