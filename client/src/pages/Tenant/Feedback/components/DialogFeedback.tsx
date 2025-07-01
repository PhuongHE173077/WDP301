import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { createFeedbackAPIs, uploadImageAPIs } from '@/apis/feedback.apis'

import { CirclePlus, ImagePlus, X, XCircle } from "lucide-react"
import { singleFileValidator } from "@/utils/validators"

const [formData, setFormData] = useState({
    description: ""
  });
export default function FeedbackForm({ open, setOpen, fetchData }: { open: boolean, setOpen: (val: boolean) => void, fetchData: () => void }) {

    const [message, setMessage] = useState('')
    const [image, setImage] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    
const handleSubmit = async () => {
    
  };

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
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 ">
                <Card className="w-full max-w-xl shadow-xl rounded-2xl">
                    <CardContent className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800">💬 Gửi phản hồi</h2>
                        <p className="text-center text-sm text-gray-500">Hãy cho chúng tôi biết ý kiến của bạn về dịch vụ!</p>
                        <form onClick={handleSubmit} className="space-y-4">
                            <Textarea
                                placeholder="Nội dung phản hồi..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="min-h-[120px]"
                            />
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
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-br from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-xl py-2"
                            >
                                🚀 Gửi phản hồi
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Dialog>
    )
}
