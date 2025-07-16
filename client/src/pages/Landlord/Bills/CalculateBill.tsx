import { fetchBillByIdAPIs, updateBillAPIs } from "@/apis/bill.apis";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const CalculateBill = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState<any>(null);
    const [oldElectricity, setOldElectricity] = useState(0);
    const [newElectricity, setNewElectricity] = useState(0);
    const [oldWater, setOldWater] = useState(0);
    const [newWater, setNewWater] = useState(0);
    const [electricityPrice, setElectricityPrice] = useState(0);
    const [waterPrice, setWaterPrice] = useState(0);
    const [prepay, setPrepay] = useState(0);
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        if (!id) return navigate('/not-found');
        fetchBillByIdAPIs(id).then(res => {
            const data = res.data;
            setBill(data);
            setOldElectricity(data.oldElectricity || 0);
            setNewElectricity(data.newElectricity || 0);
            setNewWater(data.newWater || 0);
            setOldWater(data.oldWater || 0);
            setPrepay(data.prepay || 0);
            setDeadline(data.duration || data.time?.slice(0, 10));
            const elec = data.serviceFee.find((s: any) => s.name === "Điện");
            const water = data.serviceFee.find((s: any) => s.name === "Nước");
            setElectricityPrice(elec?.price || 0);
            setWaterPrice(water?.price || 0);
        });
    }, []);

    const serviceList = bill?.serviceFee?.filter((s: any) => s.name !== "Điện" && s.name !== "Nước") || [];
    const dien = bill?.serviceFee?.find((s: any) => s.name === "Điện");
    const nuoc = bill?.serviceFee?.find((s: any) => s.name === "Nước");

    const allServices = [
        ...serviceList,
        { name: "Phòng", price: bill?.roomId?.price || 0, _id: "room" },
        ...(dien ? [dien] : []),
        ...(nuoc ? [nuoc] : [])
    ];

    const totalElectricity = (newElectricity - oldElectricity) * electricityPrice;
    const totalWater = (newWater - oldWater) * waterPrice;
    const roomPrice = bill?.roomId?.price || 0;
    const otherTotal = serviceList.reduce((sum: number, s: any) => sum + s.price, 0);
    const total = totalElectricity + totalWater + roomPrice + otherTotal;
    const remain = total - prepay;

    const handleSave = async () => {
        const payload = {
            oldElectricity,
            newElectricity,
            oldWater,
            newWater,
            prepay,
            deadline,
            total
        }
        console.log("🚀 ~ handleSave ~ payload:", payload)

        await updateBillAPIs(id, payload)
            .then(() => {
                toast.success("Cập nhật hóa đơn thành công!");
                setTimeout(() => {
                    navigate("/bills");
                }, 500);
            })
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-lg font-semibold">Hóa đơn thanh toán</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>Phòng: <strong className="text-foreground">{bill?.roomId?.roomId}</strong></span>
                        <span>Người thuê: <strong className="text-foreground">{bill?.tenantId?.displayName}</strong></span>
                    </div>
                </div>
                <div className="text-sm text-right">
                    <div>Ngày tạo: <strong>{bill?.createdAt?.slice(0, 10)}</strong></div>
                    <div className="flex items-center gap-2 mt-1">
                        <Label className="text-xs">Hạn thanh toán:</Label>
                        <Input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="h-8 text-xs w-36"
                        />
                    </div>
                </div>
            </div>

            {/* Services Table */}
            <Card className="overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead>Nội dung</TableHead>
                            <TableHead className="text-right">Đơn giá</TableHead>
                            <TableHead className="text-center">Chỉ số cũ</TableHead>
                            <TableHead className="text-center">Chỉ số mới</TableHead>
                            <TableHead className="text-center">Số lượng</TableHead>
                            <TableHead className="text-right">Thành tiền</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allServices.map((service, idx) => {
                            let oldIdx = 0, newIdx = 0, qty = 1, total = service.price;
                            if (service.name === "Điện") {
                                oldIdx = oldElectricity;
                                newIdx = newElectricity;
                                qty = newElectricity - oldElectricity;
                                total = qty * electricityPrice;
                            } else if (service.name === "Nước") {
                                oldIdx = oldWater;
                                newIdx = newWater;
                                qty = newWater - oldWater;
                                total = qty * waterPrice;
                            }

                            return (
                                <TableRow key={service._id}>
                                    <TableCell className="font-medium">{idx + 1}</TableCell>
                                    <TableCell>{service.name}</TableCell>
                                    <TableCell className="text-right">
                                        {service.price?.toLocaleString()} VNĐ
                                    </TableCell>
                                    <TableCell>
                                        {service.name === "Điện" || service.name === "Nước" ? (
                                            <Input
                                                type="number"
                                                className="w-16 h-7 text-sm text-center"
                                                value={oldIdx}
                                                onChange={e => service.name === "Điện"
                                                    ? setOldElectricity(+e.target.value)
                                                    : setOldWater(+e.target.value)}
                                            />
                                        ) : (
                                            <div className="text-center text-sm">-</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {service.name === "Điện" || service.name === "Nước" ? (
                                            <Input
                                                type="number"
                                                className="w-16 h-7 text-sm text-center"
                                                value={newIdx}
                                                onChange={e => service.name === "Điện"
                                                    ? setNewElectricity(+e.target.value)
                                                    : setNewWater(+e.target.value)}
                                            />
                                        ) : (
                                            <div className="text-center text-sm">-</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {service.name === "Điện" || service.name === "Nước" ? qty : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {total?.toLocaleString()} VNĐ
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Summary Section */}
            <div className="space-y-2">
                <div className="flex justify-end items-center p-3 gap-2 bg-gray-50 rounded-md">
                    <Label className="text-sm">Tổng cộng:</Label>
                    <span className="font-semibold text-blue-600">
                        {total.toLocaleString()} VNĐ
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                        <Label className="text-sm">Trả trước:</Label>
                        <Input
                            type="number"
                            value={prepay}
                            onChange={e => setPrepay(+e.target.value)}
                            className="w-24 h-8 text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label className="text-sm text-red-600">Còn lại:</Label>
                        <span className="font-semibold text-red-600">
                            {remain.toLocaleString()} VNĐ
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    Lưu hóa đơn
                </Button>
            </div>
        </div>
    );
};