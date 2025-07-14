import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const DialogCreateBill = ({ open, setOpen, orderRooms, departments }: { open: boolean, setOpen: (value: boolean) => void, orderRooms: any, departments: any }) => {
    const [date, setDate] = useState("");
    const [house, setHouse] = useState("all");
    const [room, setRoom] = useState("all");
    const [recalculate, setRecalculate] = useState(false);

    // Dummy data for houses and rooms, replace with real data
    const houses = [
        { value: "all", label: "Tất cả" },
        { value: "house1", label: "Nhà 1" },
        { value: "house2", label: "Nhà 2" },
    ];
    const rooms = [
        { value: "all", label: "Tất cả" },
        { value: "room1", label: "Phòng 1" },
        { value: "room2", label: "Phòng 2" },
    ];

    const handleSubmit = () => {
        // Xử lý logic tính tiền ở đây
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="mb-2">TÍNH TIỀN</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="month" className="mb-1"><span className="text-red-500">*</span> Tháng:</Label>
                        <Input
                            id="month"
                            type="month"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="house" className="mb-1"><span className="text-red-500">*</span> Tòa:</Label>
                        <Select value={house} onValueChange={setHouse}>
                            <SelectTrigger id="house">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"all"}>Tất cả</SelectItem>

                                {departments.map(h => (
                                    <SelectItem key={h._id} value={h._id}>{h.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="room" className="mb-1"><span className="text-red-500">*</span> Phòng:</Label>
                        <Select value={room} onValueChange={setRoom}>
                            <SelectTrigger id="room">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"all"}>Tất cả</SelectItem>
                                {orderRooms.map(r => (
                                    <SelectItem key={r._id} value={r.room._id}>{r.room.roomId}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <Checkbox id="recalculate" checked={recalculate} onCheckedChange={setRecalculate} />
                        <Label htmlFor="recalculate">Tính lại các nhà trong tháng</Label>
                    </div> */}
                </div>
                <DialogFooter className="mt-4 flex gap-2 justify-center">
                    <Button type="button" onClick={handleSubmit} className="flex items-center gap-2" size='sm'>
                        <span className="i-mdi-calculator" /> Tính tiền
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => setOpen(false)} size='sm'>
                        X Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
