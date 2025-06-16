import React, { useEffect, useState } from 'react'
import { getDepartmentsByOwner } from '@/apis/departmentApi'
import { createRoom } from '@/apis/roomApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { PlusCircle, XCircle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const defaultServiceFees = [
  { name: 'Tiền điện', price: '', unit: 'kWh' },
  { name: 'Tiền nước', price: '', unit: 'm³' },
  { name: 'Tiền vệ sinh', price: '', unit: 'phòng/tháng' }
]

const defaultUtilities = ['Quạt trần', 'Điều hoà', 'Tủ lạnh']

const CreateRoom = () => {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    roomId: '',
    image: '',
    price: '',
    area: '',
    utilities: [...defaultUtilities],
    serviceFee: [...defaultServiceFees],
    departmentId: ''
  })

  const [newUtility, setNewUtility] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartmentsByOwner()
        setDepartments(res.data)
        if (res.data.length > 0) {
          setForm(prev => ({
            ...prev,
            departmentId: res.data[0]._id
          }))
        }
      } catch (err) {
        toast.error('Không thể tải danh sách tòa nhà')
      }
    }

    fetchDepartments()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleServicePriceChange = (index, value) => {
    const updatedFees = [...form.serviceFee]
    updatedFees[index].price = value
    setForm(prev => ({ ...prev, serviceFee: updatedFees }))
  }

  const handleAddUtility = () => {
    if (newUtility.trim() && !form.utilities.includes(newUtility.trim())) {
      setForm(prev => ({
        ...prev,
        utilities: [...prev.utilities, newUtility.trim()]
      }))
      setNewUtility('')
    }
  }

  const handleRemoveUtility = (index) => {
    const updatedUtilities = [...form.utilities]
    updatedUtilities.splice(index, 1)
    setForm(prev => ({ ...prev, utilities: updatedUtilities }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
    ...form,
    utilities: form.utilities.join(', '), // 🔥 chuyển mảng thành chuỗi
    price: Number(form.price),
    serviceFee: form.serviceFee.map(fee => ({
      ...fee,
      price: Number(fee.price)
    }))
  }
    try {
      await createRoom(payload)
      toast.success('Tạo phòng thành công')
      navigate('/rooms')
    } catch (err) {
      toast.error('Tạo phòng thất bại')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Nút quay lại */}
      <Button
        variant="outline"
        onClick={() => navigate('/departments')}
        className="flex items-center gap-2 mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Button>

      <h2 className="text-2xl font-bold text-center text-gray-800">Tạo phòng mới</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mã phòng + Giá phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã phòng</label>
            <Input
              name="roomId"
              placeholder="VD: P101"
              value={form.roomId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá phòng</label>
            <Input
              name="price"
              type="number"
              placeholder="Nhập giá"
              value={form.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Diện tích + Ảnh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Diện tích (m²)</label>
            <Input
              name="area"
              placeholder="VD: 20"
              value={form.area}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ảnh (URL)</label>
            <Input
              name="image"
              placeholder="Link ảnh (tuỳ chọn)"
              value={form.image}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Chọn tòa nhà */}
        <div>
          <label className="block text-sm font-medium mb-1">Chọn tòa nhà</label>
          <select
          title='department'
            name="departmentId"
            value={form.departmentId}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            {departments.map(dep => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phí dịch vụ */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Phí dịch vụ</h3>
          <div className="space-y-2">
            {form.serviceFee.map((fee, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <Input value={fee.name} readOnly />
                <Input
                  type="number"
                  placeholder="Nhập giá"
                  value={fee.price}
                  onChange={(e) => handleServicePriceChange(index, e.target.value)}
                  required
                />
                <Input value={fee.unit} readOnly />
              </div>
            ))}
          </div>
        </div>

        {/* Tiện ích */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tiện ích</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.utilities.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-full px-4 py-1 flex items-center gap-2"
              >
                <span>{item}</span>
                <XCircle
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => handleRemoveUtility(index)}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Thêm tiện ích"
              value={newUtility}
              onChange={(e) => setNewUtility(e.target.value)}
            />
            <Button type="button" onClick={handleAddUtility}>
              <PlusCircle className="w-4 h-4 mr-1" /> Thêm
            </Button>
          </div>
        </div>

        {/* Nút Submit ở giữa và màu xanh lá */}
        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Tạo phòng
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateRoom
