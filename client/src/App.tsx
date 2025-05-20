import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeLayout } from "./layouts/Landlord/layouts/home-page";
import Index from "./pages/Index";
import { HomePage } from "./pages/Landlord/Home/HomePage";
import { Rooms } from "./pages/Landlord/Rooms/Rooms";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/auth/Login";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { persistStore } from "redux-persist";
import { store } from "./store/store";
import { injectStore } from "./service/axios.customize";
import { PersistGate } from "redux-persist/integration/react";
import { ProtectedRoute } from "./routers/ProtectedRoute";
import { OwerRoom } from "./pages/Landlord/OwerRooms/OwerRoom";
import Tenant from "./pages/Landlord/Tenants/Tenant";
import { Bills } from "./pages/Landlord/Bills/Bills";
import UserInfoForm from "./pages/Landlord/Information";
import Payment from "./pages/Landlord/Payment/Payment";
import FeedbackForm from "./pages/Landlord/Feedback";
import LayoutAdmin from "./layouts/admin";
import Page from "./pages/Admin/Dashboard";
import { Users } from "./pages/Admin/User";

const persistor = persistStore(store);
injectStore(store);
const App = () => (

  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <TooltipProvider>

        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Index />} />

            <Route path="/login" element={<Login />} />

            
            <Route path="/tenant/submitInfo" element={<UserInfoForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </PersistGate>
  </Provider>

);

export default App;
