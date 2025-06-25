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
import "react-datepicker/dist/react-datepicker.css"
import { LandlordContracts } from "./pages/Landlord/Contracts";
import { ContractDetail } from "./pages/Tenant/Contracts/components/ContractDetail";
import CreateDepartment from "./pages/Landlord/Rooms/CreateDepartment";
import CreateRoom from "./pages/Landlord/Rooms/CreateRoom";
import TroDetailPage from "./pages/Public/RoomDetail";
import RentalSearch from "./pages/Public/SearchRoom";
import ProfileScreen from "./pages/me/ProfileScreen";
import EditRoom from "./pages/Landlord/Rooms/EditRoom";

const persistor = persistStore(store);
injectStore(store);
const App = () => (

  <Provider store={store}>
    <PersistGate persistor={persistor}>

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Index />} />

          <Route path="/login" element={<Login />} />
          <Route path="/tim-kiem-tro" element={<RentalSearch />} />
          <Route path="/tro/:id" element={<TroDetailPage />} />

          <Route element={<ProtectedRoute />}>

            {/* Landlord router */}
            <Route element={<HomeLayout />} >
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/order-rooms" element={<OrderRooms />} />
              <Route path="/landlord/contract" element={<LandlordContracts />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/departments/:id" element={<DepartmentDetail />} />
              <Route path="/departments/create" element={<CreateDepartment />} />
              <Route path="/rooms/create" element={<CreateRoom />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/edit/:id" element={<EditRoom />} />
              <Route path="/profile" element={<ProfileScreen />} />

            </Route>

            {/* Tenant router */}
            <Route element={<TenantLayout />} >
              <Route path="/tenant-rooms" element={<TenantRooms />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contract-detail/:id" element={<ContractDetail />} />

            </Route>

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
