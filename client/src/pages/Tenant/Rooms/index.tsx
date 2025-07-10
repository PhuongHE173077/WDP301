import { useEffect, useState } from "react";
import { getTenantRooms } from "@/apis/order.apis";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";

export const TenantRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getTenantRooms()
      .then(res => {
        console.log("Rooms fetched:", res.data);
        setRooms(res.data || []);
      })
      .catch(err => {
        toast.error("Không thể tải danh sách phòng đã thuê");
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.length === 0 && (
        <p className="text-center col-span-full text-gray-500">
          Bạn chưa thuê phòng nào!
        </p>
      )}
      {rooms.map(room => (
        <Card key={room._id}>
          <CardContent>
            <img
              src={room.image?.[0] || "/default-room.jpg"} // fallback ảnh mặc định
              alt="Phòng trọ"
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">
              Mã phòng: {room.roomId || "Không rõ"}
            </h2>
            <p>Giá: {room.price ? room.price.toLocaleString() : "Chưa cập nhật"} VND</p>
            <p>Diện tích: {room.area || "Chưa cập nhật"}</p>
            <p>
              Tiện ích:{" "}
              {Array.isArray(room.utilities)
                ? room.utilities.join(", ")
                : "Không có"}
            </p>
            <div className="text-sm text-gray-600 mt-1">
              <p className="font-medium">Dịch vụ:</p>
              {Array.isArray(room.serviceFee) && room.serviceFee.length > 0 ? (
                room.serviceFee.map((fee, idx) => (
                  <div key={idx}>
                    {fee.name}: {fee.price}/{fee.unit}
                  </div>
                ))
              ) : (
                <div>Không có dịch vụ</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
