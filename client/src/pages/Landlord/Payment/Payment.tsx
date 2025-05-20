import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PaymentInfo } from './components/PaymentInfo'
import PaymentHistory from './components/PaymentHistory'

export default function Payment() {
    return (
        <div className="max-w-2xl mx-auto  p-4">
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="info">Thông tin thanh toán</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử thanh toán</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <PaymentInfo />
                </TabsContent>

                <TabsContent value="history">
                    <PaymentHistory />
                </TabsContent>
            </Tabs>
        </div>
    )
}
