import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CirclePlus, ImagePlus, X, XCircle } from "lucide-react"
import { singleFileValidator } from "@/utils/validators"
import { toast } from "react-toastify"
import { createRoomAPIs, uploadImageAPIs } from "@/apis"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface FormValues {
    id: string
    area: string
    utilities: string
    price: string
}

export default function DialogCreate({ open, setOpen, fetchData }: { open: boolean, setOpen: (val: boolean) => void, fetchData: () => void }) {
    const { register, handleSubmit, reset } = useForm<FormValues>()
    const [image, setImage] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [serviceFee, setServiceFee] = useState([
        { name: "điện", price: 0, unit: "kWh" },
        { name: "nước", price: 0, unit: "m³" }
    ])

    const onSubmit = async (data: FormValues) => {
        const newData = {
            ...data,
            image,
            serviceFee
        }
        await createRoomAPIs(newData).then((res) => {
            fetchData();
            toast.success('Create room successfully');
            setOpen(false);
            setImage('');
            setServiceFee([
                { name: "điện", price: 0, unit: "kWh" },
                { name: "nước", price: 0, unit: "m³" }
            ]);
            reset();


        })

    }

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const image = await uploadImage(e);

        if (image) setImage(image);
    }
    const uploadImage = async (e: any) => {
        const file = e.target?.files?.[0];
        const error = singleFileValidator(file);
        if (error) {
            toast.error(error);
            return null;
        }

        let reqData = new FormData();
        reqData.append('image', file);

        try {
            const response = await toast.promise(
                uploadImageAPIs(reqData),
                { pending: 'Uploading...' }
            );
            e.target.value = '';
            return response.data;
        } catch (err) {
            toast.error("Upload failed");
            return null;
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] overflow-auto scrollbar-custom2">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">Tạo Phòng Mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="id">Mã phòng</Label>
                        <Input id="id" {...register("id", { required: true })} />
                    </div>

                    <div className="space-y-2">
                        <div>Ảnh</div>
                        {image ?
                            <div className="flex justify-center">
                                <div className="relative group">
                                    <img src={image} alt="Selected" className="rounded-md max-w-xs " />
                                    <button
                                        onClick={() => setImage('')}
                                        className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div> : <><div
                                className="cursor-pointer border-2 border-dashed rounded-md p-4 flex items-center justify-center"
                                onClick={handleImageClick}
                            >
                                <ImagePlus className="h-6 w-6" />

                            </div>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                /></>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="area">Diện tích (m²)</Label>
                        <Input id="area" type="number" min="0" {...register("area")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="utilities">Tiện ích</Label>
                        <Textarea id="utilities" rows={3} {...register("utilities")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Giá (VNĐ)</Label>
                        <Input id="price" type="number" min="0" {...register("price")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Phí Dịch Vụ</Label>
                        <div className="flex gap-2">
                            <div className="w-2/12 font-bold">
                                Tên
                            </div>
                            <div className="font-bold w-3/4" >
                                Giá
                            </div>
                            <Tooltip >
                                <TooltipTrigger>
                                    <CirclePlus
                                        className="h-6 w-6 text-green-500 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setServiceFee([...serviceFee, { name: "", price: 0, unit: "tháng" }]);
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Thêm
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {serviceFee.map((item, index) => (
                            <div className="flex gap-2 ">
                                <Input type="text"
                                    value={item.name}
                                    readOnly={index < 2}
                                    className="w-2/12"
                                    onChange={(e) => {
                                        const updatedServiceFee = [...serviceFee];
                                        updatedServiceFee[index] = { ...item, name: e.target.value };
                                        setServiceFee(updatedServiceFee);
                                    }}
                                />
                                <Input
                                    type="number" value={item.price} className="w-2/4"
                                    onChange={(e) => {
                                        const updatedServiceFee = [...serviceFee];
                                        updatedServiceFee[index] = { ...item, price: parseInt(e.target.value) };
                                        setServiceFee(updatedServiceFee);
                                    }}
                                />
                                <div className="w-1/4">
                                    {item.unit}
                                </div>
                                {(item.name !== "điện" && item.name !== "nước") &&
                                    <> <Tooltip>
                                        <TooltipTrigger>
                                            <XCircle className="h-6 w-6 text-red-500" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setServiceFee(serviceFee.filter((_, i) => i !== index));
                                            }} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Xoá
                                        </TooltipContent>
                                    </Tooltip>

                                    </>}
                            </div>
                        ))}

                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button type="submit">Tạo</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
