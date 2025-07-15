import { fetchBillByIdAPIs } from "@/apis/bill.apis";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
    const handleSave = () => {
        // TODO: Xử lý lưu bill, có thể gọi API cập nhật bill ở đây
        alert("Đã lưu hóa đơn!");
    };
    useEffect(() => {
        if (!id) {
            navigate('/not-found');
        }
        fetchBillByIdAPIs(id)
            .then(response => {
                setBill(response.data);
                // Set initial values from bill
                setOldElectricity(response.data.oldElectricity || 0);
                setOldWater(response.data.oldWater || 0);
                setPrepay(response.data.prepay || 0);
                setDeadline(response.data.time ? response.data.time.slice(0, 10) : "");
                // Find service prices
                if (response.data.serviceFee) {
                    const elec = response.data.serviceFee.find((s: any) => s.name === "Điện");
                    const water = response.data.serviceFee.find((s: any) => s.name === "Nước");
                    setElectricityPrice(elec?.price || 0);
                    setWaterPrice(water?.price || 0);
                }
            })
    }, [])

    const totalElectricity = (newElectricity - oldElectricity) * electricityPrice;
    const totalWater = (newWater - oldWater) * waterPrice;
    const otherServices = bill?.serviceFee?.filter((s: any) => s.name !== "Điện" && s.name !== "Nước") || [];
    const otherServicesTotal = otherServices.reduce((sum: number, s: any) => sum + s.price, 0);
    const total = totalElectricity + totalWater + otherServicesTotal - prepay;

    return (
        <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle className="text-blue-700">Chi tiết hóa đơn phòng trọ</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
                {bill ? (
                    <>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <Label className="font-semibold">Phòng:</Label> {bill.roomId?.roomId}
                            </div>
                            <div>
                                <Label className="font-semibold">Người thuê:</Label> {bill.tenantId?.displayName}
                            </div>
                            <div>
                                <Label className="font-semibold">Chủ nhà:</Label> {bill.ownerId?.displayName}
                            </div>
                            <div>
                                <Label className="font-semibold">Ngày tạo:</Label> {bill.createdAt?.slice(0, 10)}
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2 text-gray-700">Điện</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Số điện cũ</Label>
                                    <Input type="number" value={oldElectricity} onChange={e => setOldElectricity(Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label>Số điện mới</Label>
                                    <Input type="number" value={newElectricity} onChange={e => setNewElectricity(Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label>Giá điện (VNĐ/kWh)</Label>
                                    <Input type="number" value={electricityPrice} onChange={e => setElectricityPrice(Number(e.target.value))} />
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold">Thành tiền:</span> <span className="ml-2 text-blue-600">{totalElectricity.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2 text-gray-700">Nước</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Số nước cũ</Label>
                                    <Input type="number" value={oldWater} onChange={e => setOldWater(Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label>Số nước mới</Label>
                                    <Input type="number" value={newWater} onChange={e => setNewWater(Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label>Giá nước (VNĐ/m³)</Label>
                                    <Input type="number" value={waterPrice} onChange={e => setWaterPrice(Number(e.target.value))} />
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold">Thành tiền:</span> <span className="ml-2 text-blue-600">{totalWater.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2 text-gray-700">Dịch vụ khác</h3>
                            <ul className="list-disc ml-6">
                                {otherServices.map((s: any) => (
                                    <li key={s._id} className="flex justify-between">
                                        <span>{s.name}</span>
                                        <span className="text-blue-600">{s.price.toLocaleString()} VNĐ</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-2 font-semibold">Tổng dịch vụ khác: <span className="text-blue-600">{otherServicesTotal.toLocaleString()} VNĐ</span></div>
                        </div>
                        <Separator className="my-4" />
                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div>
                                <Label>Hạn ngày nhập</Label>
                                <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                            </div>
                            <div>
                                <Label>Tiền đã trả trước</Label>
                                <Input type="number" value={prepay} onChange={e => setPrepay(Number(e.target.value))} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500">Đang tải hóa đơn...</div>
                )}
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between items-center">
                <div>
                    <span className="font-semibold text-lg">Tổng tiền cần thanh toán:</span>
                    <span className="text-2xl text-green-600 font-bold ml-4">{total.toLocaleString()} VNĐ</span>
                </div>
                <Button onClick={handleSave} className="ml-auto">Lưu</Button>
            </CardFooter>
        </Card>
    )
}
