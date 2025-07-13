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
import "react-datepicker/dist/react-datepicker.css"
import { LandlordContracts } from "./pages/Landlord/Contracts";
import { ContractDetail } from "./pages/Tenant/Contracts/components/ContractDetail";
import CreateDepartment from "./pages/Landlord/Rooms/CreateDepartment";
import CreateRoom from "./pages/Landlord/Rooms/CreateRoom";
import TroDetailPage from "./pages/Public/RoomDetail";
import RentalSearch from "./pages/Public/SearchRoom";
import ProfileScreen from "./pages/me/ProfileScreen";
import EditRoom from "./pages/Landlord/Rooms/EditRoom";
import LayoutAdmin from "./layouts/admin";
import Page from "./pages/Admin/Dashboard";
import { ManagerUser } from "./pages/Admin/Manager-User";
import { BookRoom } from "./pages/Tenant/BookRooms";
import { BookRoomManager } from "./pages/Landlord/BookRooms";
import { PaymentReturn } from "./pages/Tenant/Payment";
import { ErrorPayment } from "./pages/Tenant/Payment/ErrorPayment";
import { PaymentSuccess } from "./pages/Tenant/Payment/PaymentSuccess";
import RegisterPage from "./pages/auth/Register";
import TenanFeedback from "./pages/Tenant/Feedback/TenantFeedback"
import { ManagementPackage } from "./pages/Admin/ManagerPackage";
import PackageManager from "./pages/Admin/ManagerPackage/PackageCreate";
import { PackageList } from "./pages/Landlord/Packages/Package";

const persistor = persistStore(store);
injectStore(store);
const App = () => (

  <Provider store={store}>
    <PersistGate persistor={persistor}>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tim-kiem-tro" element={<RentalSearch />} />
          <Route path="/tro/:id" element={<TroDetailPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/error" element={<ErrorPayment />} />
          <Route element={<ProtectedRoute />}>

            {/* Landlord router */}
            <Route element={<HomeLayout />} >
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/order-rooms" element={<OrderRooms />} />
              <Route path="/landlord/contract" element={<LandlordContracts />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/departments/:id" element={<DepartmentDetail />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/book-room-manager" element={<BookRoomManager />} />
              <Route path="/departments/create" element={<CreateDepartment />} />
              <Route path="/rooms/create" element={<CreateRoom />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/edit/:id" element={<EditRoom />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/packages" element={<PackageList />} />

            </Route>

            {/* Tenant router */}
            <Route element={<TenantLayout />} >
              <Route path="/tenant-rooms" element={<TenantRooms />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contract-detail/:id" element={<ContractDetail />} />
              <Route path="/book-rooms" element={<BookRoom />} />

              <Route path="/feedback-tenant" element={<TenanFeedback />} />
            </Route>

            <Route element={<LayoutAdmin />} >
              <Route path="/dashboard" element={<Page />} />
              <Route path="/manage-user" element={<ManagerUser />} />
              <Route path = "/package" element={<ManagementPackage/>}/>
              <Route path = "/packages/create" element={<PackageManager/>}/>
              <Route path = "/packages/edit/:id" element={<PackageManager/>}/>

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
