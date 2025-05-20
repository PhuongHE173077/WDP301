
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import DashboardShowcase from '@/components/DashboardShowcase';
import Benefits from '@/components/Benefits';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slice/userSlice';
import { USER_ROLE } from '@/utils/contanst';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    document.title = "RoomRentPro";
  }, []);

  const currentUser = useSelector(selectCurrentUser);

  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === USER_ROLE.ADMIN) {
        navigate("/dashboard");
      } else if (currentUser.role === USER_ROLE.OWNER_1 || currentUser.role === USER_ROLE.OWNER_2 || currentUser.role === USER_ROLE.OWNER_3) {
        navigate("/home-page");
      }
    }
  }, [currentUser])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DashboardShowcase />
        <Benefits />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
