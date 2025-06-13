
import { fetchAllUserAPIs } from '@/apis';
import Benefits from '@/components/Benefits';
import CTA from '@/components/CTA';
import DashboardShowcase from '@/components/DashboardShowcase';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import { selectCurrentUser } from '@/store/slice/userSlice';
import { USER_ROLE } from '@/utils/contanst';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
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
        navigate("/rooms");
      }
    }

  }, [])

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
