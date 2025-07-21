import React, { useEffect, useState } from 'react'
import { getDepartmentsByOwner } from '@/apis/departmentApi'
import { createRoom } from '@/apis/roomApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { PlusCircle, XCircle, ArrowLeft, MinusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { singleFileValidator } from '@/utils/validators'
import { createImageUrl } from '@/apis'

const defaultUtilities = ['Quạt trần', 'Điều hoà', 'Tủ lạnh']
const defaultServiceFees = [
  { name: 'Tiền điện', price: '', unit: 'kWh' },
  { name: 'Tiền nước', price: '', unit: 'm³' },
  { name: 'Tiền vệ sinh', price: '', unit: 'phòng/tháng' }
]

const CreateRoom = () => {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    roomId: '',
    image: [],
    price: '',
    area: '',
    utilities: [...defaultUtilities],
    serviceFee: [...defaultServiceFees],
    departmentId: '',
    post: false,
    status: false,
    type: 'Phòng trọ'
  })

  const [newUtility, setNewUtility] = useState('')
  const [newService, setNewService] = useState({ name: '', price: '', unit: '' })
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartmentsByOwner()
        setDepartments(res.data)

        if (res.data.length > 0) {
          const first = res.data[0]
          setForm(prev => ({
            ...prev,
            departmentId: first._id,
            serviceFee: [
              { name: 'Tiền điện', price: first.electricPrice || '', unit: 'kWh' },
              { name: 'Tiền nước', price: first.waterPrice || '', unit: 'm³' },
            ]
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

  const handleDepartmentChange = (e) => {
    const selectedId = e.target.value
    const dep = departments.find(d => d._id === selectedId)

    setForm(prev => ({
      ...prev,
      departmentId: selectedId,
      serviceFee: [
        { name: 'Tiền điện', price: dep?.electricPrice || '', unit: 'kWh' },
        { name: 'Tiền nước', price: dep?.waterPrice || '', unit: 'm³' },
      ]
    }))
  }

  const handleServicePriceChange = (index, value) => {
    const updated = [...form.serviceFee]
    updated[index].price = value
    setForm(prev => ({ ...prev, serviceFee: updated }))
  }

  const handleAddService = () => {
    if (!newService.name.trim() || !newService.unit.trim()) return
    setForm(prev => ({
      ...prev,
      serviceFee: [...prev.serviceFee, { ...newService }]
    }))
    setNewService({ name: '', price: '', unit: '' })
  }

  const handleRemoveService = (index) => {
    if (index <= 1) return // Không cho xóa 2 loại mặc định
    const updated = [...form.serviceFee]
    updated.splice(index, 1)
    setForm(prev => ({ ...prev, serviceFee: updated }))
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
    const updated = [...form.utilities]
    updated.splice(index, 1)
    setForm(prev => ({ ...prev, utilities: updated }))
  }

  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files;
    if (!files || files.length === 0) return;

    const fileNames = Array.from(files).map(file => file.name);
    setSelectedFileNames(prev => [...prev, ...fileNames]); // 👈 Lưu danh sách tên file

    for (const file of files) {
      const error = singleFileValidator(file);
      if (error) {
        toast.error(error);
        continue;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await toast.promise(createImageUrl(formData), {
          pending: 'Đang tải ảnh lên...'
        });

        setForm(prev => ({
          ...prev,
          image: [...prev.image, response.data]
        }));
      } catch (err) {
        toast.error('Upload ảnh thất bại');
      }
    }

    event.target.value = ''; // Reset để có thể chọn lại ảnh giống nhau
  };




  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      utilities: form.utilities.join(', '),
      price: Number(form.price),
      serviceFee: form.serviceFee.map(f => ({ ...f, price: Number(f.price) }))
    }

    try {
      await createRoom(payload)
      toast.success('Tạo phòng thành công')
      navigate('/rooms')
    } catch {
      toast.error('Tạo phòng thất bại')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <Button variant="outline" onClick={() => navigate('/rooms')} className="flex items-center gap-2 mb-2">
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Button>

      <h2 className="text-2xl font-bold text-center text-gray-800">Tạo phòng mới</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Mã + Giá */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Mã phòng</label>
            <Input name="roomId" required placeholder="VD: P101" value={form.roomId} onChange={handleInputChange} />
          </div>
          <div>
            <label className="text-sm font-medium">Giá phòng</label>
            <Input name="price" type="number" required value={form.price} onChange={handleInputChange} />
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Diện tích */}
          <div>
            <label className="text-sm font-medium">Diện tích (m²)</label>
            <Input name="area" value={form.area} onChange={handleInputChange} />
          </div>

          {/* Ảnh phòng */}
          <div>
            <label className="text-sm font-medium mb-1">Ảnh phòng</label>

            <div className="flex gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                className="px-3 py-2"
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                📷
              </Button>

              <div className="flex flex-wrap gap-2">
                {selectedFileNames.length > 0 ? (
                  selectedFileNames.map((name, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-sm border rounded bg-gray-100 text-gray-700"
                    >
                      {name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">Chưa chọn ảnh nào</span>
                )}
              </div>
            </div>


            {/* Input ẩn để upload ảnh */}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={handleImage}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chọn tòa nhà */}
          <div>
            <label className="text-sm font-medium">Chọn tòa nhà</label>
            <select
              title='Toà nhà'
              name="departmentId"
              value={form.departmentId}
              onChange={handleDepartmentChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              {departments.map(dep => (
                <option key={dep._id} value={dep._id}>{dep.name}</option>
              ))}
            </select>
          </div>
          {/* Chọn loại phòng */}
          <div>
            <label className="block text-sm font-medium mb-1">Loại phòng</label>
            <select
              title='Loại phòng'
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Phòng trọ">Phòng trọ</option>
              <option value="Căn hộ mini">Căn hộ mini</option>
            </select>
          </div>
        </div>
        {/* Phí dịch vụ */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Phí dịch vụ</h3>
          <div className="space-y-2">
            {form.serviceFee.map((fee, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input readOnly value={fee.name} className="w-1/3" />
                <Input
                  type="number"
                  placeholder="Giá"
                  value={fee.price}
                  onChange={(e) => handleServicePriceChange(index, e.target.value)}
                  className="w-1/3"
                  required
                />
                <Input readOnly value={fee.unit} className="w-1/4" />
                {index > 1 && (
                  <MinusCircle className="text-red-500 w-5 h-5 cursor-pointer" onClick={() => handleRemoveService(index)} />
                )}
              </div>
            ))}
            {/* Thêm dịch vụ */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Input placeholder="Tên dịch vụ " value={newService.name} onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))} />
              <Input placeholder="Giá" value={newService.price} type="number" onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} />
              <Input placeholder="Đơn vị" value={newService.unit} onChange={e => setNewService(prev => ({ ...prev, unit: e.target.value }))} />
            </div>
            <Button type="button" onClick={handleAddService} className="mt-2 flex items-center gap-1">
              <PlusCircle className="w-4 h-4" /> Thêm dịch vụ
            </Button>
          </div>
        </div>

        {/* Tiện ích */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tiện ích</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.utilities.map((item, index) => (
              <div key={index} className="bg-gray-100 rounded-full px-4 py-1 flex items-center gap-2">
                <span>{item}</span>
                <XCircle className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => handleRemoveUtility(index)} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Thêm tiện ích" value={newUtility} onChange={(e) => setNewUtility(e.target.value)} />
            <Button type="button" onClick={handleAddUtility}>
              <PlusCircle className="w-4 h-4 mr-1" /> Thêm
            </Button>
          </div>
        </div>

        {/* Nút Submit */}
        <div className="flex justify-center mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            Tạo phòng
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateRoom
