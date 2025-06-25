import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteRoom } from "@/apis/roomApi";
import { addRoomToBlog } from "@/apis/blog.apis";
import dayjs from "dayjs";

interface ServiceFee {
  name: string;
  price: number;
  unit: string;
}

interface Room {
  _id: string;
  roomId: string;
  image: string[] | string;
  price: number;
  area: string;
  utilities: string;
  serviceFee: ServiceFee[];
  status: boolean;
  post: boolean;
  type: string;
}

interface RoomTableProps {
  rooms: Room[];
  departmentName: string;
  onRoomDeleted?: (deletedRoomId: string) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, departmentName, onRoomDeleted }) => {
  const navigate = useNavigate();

  const confirmDelete = async (roomId: string) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắc không?',
      text: "Bạn không thể quay lại sau khi thực hiện hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá!',
      cancelButtonText: 'Huỷ',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          await deleteRoom(roomId);
          return true;
        } catch (error) {
          Swal.showValidationMessage('Xoá phòng thất bại!');
          return false;
        }
      }
    });

    if (result.isConfirmed) {
      Swal.fire('Đã xoá!', 'Phòng đã bị xoá thành công.', 'success');

      // Reload hoặc cập nhật danh sách
      if (onRoomDeleted) {
        onRoomDeleted(roomId);
      } else {
        window.location.reload();
      }
    }
  };

const handleAddToBlog = async (roomId: string) => {
  try {
    // Gọi lần đầu để kiểm tra trạng thái phòng
    const res = await addRoomToBlog(roomId);
    const data = res.data;

    console.log(data);
    
    // Nếu phòng đã tồn tại trong blog
    if (data.existed) {
      Swal.fire("Thông báo", "Phòng đã có trong blog!", "info");
      return;
    }

    // Nếu phòng đang được thuê => hỏi người dùng có muốn tiếp tục không
    if (data.warning) {
      const result = await Swal.fire({
        title: "Phòng đang có người thuê",
        html: `Phòng đang được thuê đến <strong>${dayjs(data.endAt).format("DD/MM/YYYY")}</strong>.<br>Bạn vẫn muốn đăng vào blog không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Vẫn đăng",
        cancelButtonText: "Huỷ"
      });

      if (result.isConfirmed) {
        // Loading khi xác nhận
        Swal.fire({
          title: "Đang xử lý...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Gửi lại request với force: true
        const confirmRes = await addRoomToBlog(roomId, true);

        Swal.fire("Thành công", "Phòng đã được thêm vào blog.", "success");
      }
    } else {
      // Nếu phòng trống, thêm blog ngay
      Swal.fire("Thành công", "Phòng đã được thêm vào blog.", "success");
    }

  } catch (err: any) {
    Swal.fire("Lỗi", err?.response?.data?.message || "Có lỗi xảy ra", "error");
  }
};



  return (
    <div className="mt-8 w-full">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-xl font-bold mb-4 text-blue-800">
          Danh sách phòng thuộc toà nhà: {departmentName}
        </h3>
        <Button
          onClick={() => navigate('/rooms/create')}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span> Tạo phòng</span>
        </Button>
      </div>
      {rooms.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Ảnh</th>
                <th className="py-2 px-4 border-b">Mã phòng</th>
                <th className="py-2 px-4 border-b">Giá (VNĐ)</th>
                <th className="py-2 px-4 border-b">Diện tích</th>
                <th className="py-2 px-4 border-b">Tiện ích</th>
                <th className="py-2 px-4 border-b">Phí dịch vụ</th>
                <th className="py-2 px-4 border-b">Cho thuê</th>
                <th className="py-2 px-4 border-b">Loại</th>
                <th className="py-2 px-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {Array.isArray(room.image) && room.image.length > 0 ? (
                      <img src={room.image[0]} alt="room" className="w-16 h-16 object-cover rounded" />
                    ) : typeof room.image === "string" && room.image ? (
                      <img src={room.image} alt="room" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </td>

                  <td className="py-2 px-4 border-b">{room.roomId}</td>
                  <td className="py-2 px-4 border-b">{room.price.toLocaleString()}₫</td>
                  <td className="py-2 px-4 border-b">{room.area} </td>

                  <td className="py-2 px-4 border-b">
                    <div className="bg-green-100 p-2 rounded ">
                      <div className="list-disc list-inside text-sm">
                        {room.utilities?.split(",").map((item, idx) => (
                          <div key={idx}>{item.trim()}</div>
                        ))}
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-4 border-b">
                    <div className="bg-blue-100 p-2 rounded">
                      <ul className="list-inside space-y-1 text-sm">
                        {room.serviceFee?.map((fee, idx) => (
                          <li key={idx}>
                            <strong>{fee.name}</strong>: {fee.price.toLocaleString()}đ/{fee.unit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>

                  <td className="py-2 px-4 border-b">
                    {room.status ? (
                      <span className="text-green-600 font-medium">Đang cho thuê</span>
                    ) : (
                      <span className="text-red-500 font-medium">Trống</span>
                    )}
                  </td>

                  <td className="py-2 px-4 border-b">{room.type}</td>

                  <td className="py-2 px-4 border-b space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/rooms/edit/${room._id}`)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(room._id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={room.post ? "outline" : "secondary"}
                      size="sm"
                      disabled={room.post}
                      onClick={() => !room.post && handleAddToBlog(room._id)}
                    >
                      <UploadCloud className="w-4 h-4 mr-1" />
                      {room.post ? "Đã đăng" : "Blog"}
                    </Button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Không có phòng nào cho tòa nhà này.</p>
      )}
    </div>
  );
};

export default RoomTable;
