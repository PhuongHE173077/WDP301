import React from "react";

interface ServiceFee {
  name: string;
  price: number;
  unit: string;
}

interface Room {
  _id: string;
  roomId: string;
  price: number;
  area: string;
  utilities: string;
  serviceFee: ServiceFee[];
}

interface RoomTableProps {
  rooms: Room[];
  departmentName: string;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, departmentName }) => {
  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold mb-4 text-blue-800">
        Danh sách phòng thuộc toà nhà: {departmentName}
      </h3>
      {rooms.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm shadow-md rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left border-b">Mã phòng</th>
                <th className="py-2 px-4 text-left border-b">Giá (VNĐ)</th>
                <th className="py-2 px-4 text-left border-b">Diện tích</th>
                <th className="py-2 px-4 text-left border-b">Tiện ích</th>
                <th className="py-2 px-4 text-left border-b">Phí dịch vụ</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{room.roomId}</td>
                  <td className="py-2 px-4 border-b">{room.price.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{room.area}</td>
                  <td className="py-2 px-4 border-b">{room.utilities}</td>
                  <td className="py-2 px-4 border-b">
                    {room.serviceFee
                      ?.map(
                        (fee) => `${fee.name}: ${fee.price.toLocaleString()}đ/${fee.unit}`
                      )
                      .join(", ")}
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
