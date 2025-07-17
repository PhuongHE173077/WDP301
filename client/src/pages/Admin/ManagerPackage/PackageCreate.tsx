import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, MinusCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { createPackageAPIs, getPackagesAPIs, updatePackageAPIs } from '@/apis/package.apis';

const PackageManager = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    price: '',
    availableTime: ''
  });

  const [descriptions, setDescriptions] = useState<string[]>(['']);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await getPackagesAPIs();
        const found = res.data.find((pkg: any) => pkg._id === id);
        if (found) {
          setForm({
            name: found.name,
            price: found.price,
            availableTime: found.availableTime
          });
          setDescriptions(found.description.length ? found.description : ['']);
        }
      } catch (error) {
        console.error('Error loading package:', error);
      }
    };
    if (isEdit) fetchPackage();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescChange = (index: number, value: string) => {
    const newDescs = [...descriptions];
    newDescs[index] = value;
    setDescriptions(newDescs);
  };

  const addDescription = () => {
    setDescriptions([...descriptions, '']);
  };

  const removeDescription = (index: number) => {
    if (descriptions.length <= 1) return;
    const newDescs = descriptions.filter((_, i) => i !== index);
    setDescriptions(newDescs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: descriptions,
      price: Number(form.price),
      availableTime: Number(form.availableTime)
    };
    try {
      if (isEdit) {
        await updatePackageAPIs(id as string, data);
        Swal.fire('Thành công', 'Đã cập nhật gói dịch vụ.', 'success');
      } else {
        await createPackageAPIs(data);
        Swal.fire('Thành công', 'Đã tạo gói dịch vụ mới.', 'success');
      }
      navigate('/package');
    } catch (error) {
      console.error('Lỗi khi tạo/cập nhật:', error);
      Swal.fire('Lỗi', 'Không thể tạo/cập nhật gói.', 'error');
    }
  };

  return (
<div className="w-full max-w-2xl mx-auto px-6 py-10 bg-white shadow-md border rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isEdit ? 'Cập nhật gói dịch vụ' : 'Tạo gói dịch vụ mới'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Tên gói</label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tên gói"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Mô tả</label>
          {descriptions.map((desc, index) => (
            <div key={index} className="flex items-start gap-2 mb-3">
              {index === 0 || descriptions.length > 1 ? (
                <Textarea
                  className="flex-1"
                  value={desc}
                  onChange={(e) => handleDescChange(index, e.target.value)}
                  placeholder={`Mô tả dòng ${index + 1}`}
                  required
                />
              ) : null}
              {index > 0 && (
                <button
                  title='huỷ'
                  type="button"
                  className="text-red-600 mt-2"
                  onClick={() => removeDescription(index)}
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {descriptions.length < 5 && (
            <button
              type="button"
              className="text-blue-600 flex items-center gap-1 mt-1"
              onClick={addDescription}
            >
              <PlusCircle className="w-5 h-5" /> Thêm mô tả
            </button>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block mb-1 font-medium">Giá (VNĐ)</label>
          <Input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Giá (VNĐ)"
            required
          />
        </div>

        <div>
          <label htmlFor="availableTime" className="block mb-1 font-medium">Thời hạn (tháng)</label>
          <Input
            id="availableTime"
            name="availableTime"
            type="number"
            value={form.availableTime}
            onChange={handleChange}
            placeholder="Thời hạn (tháng)"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/package')}>Huỷ</Button>
          <Button type="submit">{isEdit ? 'Cập nhật' : 'Tạo mới'}</Button>
        </div>
      </form>
    </div>
  );
};

export default PackageManager;
