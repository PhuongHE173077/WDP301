import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash, UploadCloud, HousePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteRoom } from "@/apis/roomApi";
import { addRoomToBlog, checkRoomStatus, removeRoomFromBlog } from "@/apis/blog.apis";
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
  const [localRooms, setLocalRooms] = useState<Room[]>(rooms);

  useEffect(() => {
    setLocalRooms(rooms);
  }, [rooms]);

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

      if (onRoomDeleted) {
        onRoomDeleted(roomId);
      } else {
        setLocalRooms((prev) => prev.filter((room) => room._id !== roomId));
      }
    }
  };

const showBlogFormDialog = async (defaultDate: Date) => {
  const minDate = dayjs(defaultDate).format("YYYY-MM-DD");

  const { value: formValues } = await Swal.fire({
    title: '<span style="font-size: 20px; font-weight: 600;"> Thêm phòng vào blog</span>',
    html: `
  <div style="padding: 0 16px; box-sizing: border-box;">
    <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
      <div style="display: flex; flex-direction: column;">
        <label for="title" style="font-size: 13px; font-weight: 500; margin-bottom: 2px;">Tiêu đề <span style="color: red;">*</span></label>
        <input id="title" class="swal2-input" placeholder="Nhập tiêu đề blog"
          style="padding: 4px 8px; height: 32px; font-size: 14px; width: 100%; box-sizing: border-box;" />
      </div>
      <div style="display: flex; flex-direction: column;">
        <label for="description" style="font-size: 13px; font-weight: 500; margin-bottom: 2px;">Mô tả</label>
        <textarea id="description" class="swal2-textarea" placeholder="Nhập mô tả " rows="3"
          style="padding: 4px 8px; font-size: 14px; width: 100%; box-sizing: border-box;"></textarea>
      </div>
      <div style="display: flex; flex-direction: column;">
        <label for="availableFrom" style="font-size: 13px; font-weight: 500; margin-bottom: 2px;">Ngày bắt đầu</label>
        <input id="availableFrom" type="date" class="swal2-input" value="${minDate}" min="${minDate}"
          style="padding: 4px 8px; height: 32px; font-size: 14px; width: 100%; box-sizing: border-box;" />
      </div>
    </div>
  </div>
`
,
    confirmButtonText: 'Thêm',
    showCancelButton: true,
    cancelButtonText: 'Hủy',
    focusConfirm: false,
    
    preConfirm: () => {
      const title = (document.getElementById("title") as HTMLInputElement).value.trim();
      const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
      const availableFrom = (document.getElementById("availableFrom") as HTMLInputElement).value;

      if (!title) {
        Swal.showValidationMessage("⚠️ Tiêu đề là bắt buộc");
        return false;
      }

      if (dayjs(availableFrom).isBefore(minDate)) {
        Swal.showValidationMessage(`⚠️ Ngày bắt đầu không được trước ${dayjs(minDate).format("DD/MM/YYYY")}`);
        return false;
      }

      return { title, description, availableFrom };
    }
  });

  return formValues;
};


  const updateRoomPostStatus = (roomId: string) => {
    setLocalRooms((prev) =>
      prev.map((room) =>
        room._id === roomId ? { ...room, post: true } : room
      )
    );
  };

  const handleAddToBlog = async (roomId: string) => {
    try {
      const res = await checkRoomStatus(roomId);
      const data = res.data;

      if (data.existed) {
        Swal.fire("Thông báo", "Phòng đã có trong blog!", "info");
        return;
      }

      let form = null;

      if (data.warning) {
        const result = await Swal.fire({
          title: "Phòng đang có người thuê",
          html: `Phòng đang được thuê đến <strong>${dayjs(data.endAt).format("DD/MM/YYYY")}</strong>.<br>Bạn vẫn muốn đăng vào blog không?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Vẫn đăng",
          cancelButtonText: "Huỷ"
        });

        if (!result.isConfirmed) return;

        form = await showBlogFormDialog(new Date(data.endAt));
      } else {
        form = await showBlogFormDialog(new Date());
      }

      if (!form) return;

      Swal.fire({
        title: "Đang thêm phòng vào blog...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const confirmRes = await addRoomToBlog(roomId, {
        force: true,
        ...form
      });

      if (confirmRes.status === 201) {
        updateRoomPostStatus(roomId);
        Swal.fire("Thành công", "Phòng đã được thêm vào blog.", "success");
      }

    } catch (err: any) {
      Swal.fire("Lỗi", err?.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  const handleRemoveFromBlog = async (roomId: string) => {
    const confirm = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn gỡ phòng khỏi blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Gỡ",
      cancelButtonText: "Huỷ"
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Đang xử lý...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await removeRoomFromBlog(roomId);

      setLocalRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, post: false } : room
        )
      );

      Swal.fire("Thành công", "Phòng đã được gỡ khỏi blog.", "success");
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
      {localRooms.length > 0 ? (
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
              {localRooms.map((room) => (
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
                  <td className="py-2 px-4 border-b">{room.area}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="bg-green-100 p-2 rounded">
                      {room.utilities?.split(",").map((item, idx) => (
                        <div key={idx}>{item.trim()}</div>
                      ))}
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
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        room.post ? handleRemoveFromBlog(room._id) : handleAddToBlog(room._id)
                      }
                    >
                      <UploadCloud className="w-4 h-4 mr-1" />
                      {room.post ? "Gỡ blog" : "Blog"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <HousePlus className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-semibold">Không có phòng nào cho toà nhà này.</p>
          <p className="text-sm">Vui lòng thêm phòng để quản lý thông tin.</p>
        </div>
      )}
    </div>
  );
};

export default RoomTable;
