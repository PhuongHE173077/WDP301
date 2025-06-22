import React from 'react';
import { Camera, MapPin, Calendar, Mail, Phone, Edit3, Settings, Star, Users, Heart, MessageCircle, User, CreditCard, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, updateUserAPIs } from '@/store/slice/userSlice';

const ProfileScreen = () => {
    const userData = useSelector(selectCurrentUser);

    // Format ngày tháng
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };


    const updateUser = async () => {
        const data = { name: "userName", avatar: "avatar", address: "address", phone: "phone", dateOfBirth: "dateOfBirth", displayName: "displayName" }
        await updateUserAPIs(data)

    }

    // Tính tuổi
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    if (!userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
                <div className="text-xl text-red-600">Không tìm thấy dữ liệu hồ sơ</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
            {/* Header */}
            {/* <div className="bg-gradient-to-r from-blue-400 to-sky-400 pt-8 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-bold text-white">Hồ Sơ Cá Nhân</h1>
                    </div>
                </div>
            </div> */}

            {/* Profile Card */}
            <div className="max-w-4xl mx-auto px-6 -mt-16">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                                <img
                                    src={userData.avatar}
                                    alt={userData.displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors shadow-lg">
                                <Camera className="w-4 h-4 text-white" />
                            </button>
                            {userData.isActive && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-gray-800">{userData.displayName}</h2>
                                <button className="p-1.5 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                    <Edit3 className="w-4 h-4 text-blue-600" />
                                </button>
                            </div>
                            <p className="text-lg text-blue-600 mb-3 font-medium capitalize">{userData.role}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span>@{userData.userName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>Tham gia từ {formatDate(userData.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Sections */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Email</p>
                                    <p className="text-gray-600">{userData.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Điện thoại</p>
                                    <p className="text-gray-600">{userData.phone || "Chưa cập nhật"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Địa chỉ</p>
                                    <p className="text-gray-600">{userData.address || "Chưa cập nhật"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Ngày sinh</p>
                                    <p className="text-gray-600">{formatDate(userData.dateOfBirth)} ({calculateAge(userData.dateOfBirth)} tuổi)</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">CCCD</p>
                                    <p className="text-gray-600">{userData.CCCD}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Trạng thái tài khoản</p>
                                    <p className={`font-medium ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {userData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-100 p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Chi tiết tài khoản</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">ID tài khoản:</span>
                                <span className="ml-2 text-gray-600 font-mono">{userData._id}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Vai trò:</span>
                                <span className="ml-2 text-gray-600 capitalize">{userData.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-sky-600 transition-all duration-200 shadow-lg">
                        Chỉnh sửa hồ sơ
                    </button>
                    <button className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold border-2 border-blue-200 hover:bg-blue-50 transition-colors">
                        Chia sẻ hồ sơ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;

