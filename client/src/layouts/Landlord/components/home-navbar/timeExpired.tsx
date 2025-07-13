import React, { useMemo } from 'react';
import { Clock4 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '@/store/slice/userSlice';

export const AccountExpireInfo = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const daysLeft = useMemo(() => {
    if (!currentUser?.timeExpired) return null;
    const now = new Date();
    const expired = new Date(currentUser.timeExpired);
    const diff = Math.ceil((expired.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [currentUser?.timeExpired]);

  const isExpiringSoon = daysLeft !== null && daysLeft <= 15;

  return (
    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
      <Clock4 className="w-4 h-4 text-primary" />
      <span>
        Tài khoản của bạn còn
        <span
          className={`ml-1 italic font-semibold ${
            isExpiringSoon ? 'text-red-500' : 'text-blue-600'
          }`}
        >
          {daysLeft ?? '...'} ngày
        </span>
      </span>

      <span
        className="ml-3 text-sky-600 hover:underline cursor-pointer italic"
        onClick={() => navigate('/packages')}
      >
        Mua gói tại đây
      </span>
    </div>
  );
};
