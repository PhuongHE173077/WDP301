import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { createFeedbackAPIs } from '@/apis'

export default function FeedbackForm() {

    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        await toast.promise(
            createFeedbackAPIs({
                message
            }),
            {
                pending: 'Đang gửi phản hồi...',
                success: 'Gửi phản hồi thành công',
                error: 'Gửi phản hồi thất bại'
            }

        )


        setMessage('')
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 ">
            <Card className="w-full max-w-xl shadow-xl rounded-2xl">
                <CardContent className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">💬 Gửi phản hồi</h2>
                    <p className="text-center text-sm text-gray-500">Hãy cho chúng tôi biết ý kiến của bạn về dịch vụ!</p>
                    <form onSubmit={handleSubmit} className="space-y-4">


                        <Textarea
                            placeholder="Nội dung phản hồi..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="min-h-[120px]"
                        />
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
    )
}
