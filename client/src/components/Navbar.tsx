
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-4 flex items-center gap-2 cursor-auto">
              <img
                src='/favicon.ico'
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="font-bold text-xl text-rental-500 ">RoomPro</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Tính năng</a>
            <a href="#benefits" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Lợi ích</a>
            <a href="#pricing" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Giá cả</a>
            <a href="#testimonials" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Đánh giá</a>
          </div>

          <div className="hidden md:flex space-x-4">
            <Button variant="outline" className="border-rental-500 text-rental-700 hover:bg-rental-50" onClick={() => navigate('/tim-kiem-tro')}>
              <SearchIcon className="mr-2" />
              Tìm kiếm trọ</Button>
            <Button variant="outline" className="border-rental-500 text-rental-700 hover:bg-rental-50" onClick={() => navigate('/login')}>Đăng nhập</Button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3 flex flex-col">
            <a href="#features" className="font-medium text-gray-700 hover:text-rental-600 py-2">Tính năng</a>
            <a href="#benefits" className="font-medium text-gray-700 hover:text-rental-600 py-2">Lợi ích</a>
            <a href="#pricing" className="font-medium text-gray-700 hover:text-rental-600 py-2">Giá cả</a>
            <a href="#testimonials" className="font-medium text-gray-700 hover:text-rental-600 py-2">Đánh giá</a>
            <div className="pt-2 flex flex-col space-y-3">
              <Button variant="outline" className="border-rental-500 text-rental-700 w-full" onClick={() => navigate('/login')}>Đăng nhập</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
