import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { HomeLayout } from "./layouts/Landlord/layouts/home-page";
import Index from "./pages/Index";
import { Rooms } from "./pages/Landlord/Rooms";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/auth/Login";
import { ProtectedRoute } from "./routers/ProtectedRoute";
import { injectStore } from "./service/axios.customize";
import { store } from "./store/store";
import Tenants from "./pages/Landlord/Tenants/Tenant";

import { OrderRooms } from "./pages/Landlord/OrderRooms";
import { TenantLayout } from "./layouts/Tenant/layouts/home-page";
import { TenantRooms } from "./pages/Tenant/Rooms";
import { Contracts } from "./pages/Tenant/Contracts";
import DepartmentList from "./pages/Landlord/Rooms/DepartmentList";
import DepartmentDetail from "./pages/Landlord/Rooms/DepartmentDetail";
import Feedback from "./pages/Landlord/Feedback/Feedback";

const persistor = persistStore(store);
injectStore(store);
const App = () => (

  <Provider store={store}>
    <PersistGate persistor={persistor}>

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Index />} />

          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>

            {/* Landlord router */}
            <Route element={<HomeLayout />} >
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/order-rooms" element={<OrderRooms />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/departments/:id" element={<DepartmentDetail />} />
              <Route path="/feedback" element={<Feedback />} />
            </Route>
          </Route>

          {/* Tenant router */}
          <Route element={<TenantLayout />} >
            <Route path="/tenant-rooms" element={<TenantRooms />} />
            <Route path="/contracts" element={<Contracts />} />

          </Route>



          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

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
