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
import ProfileScreen from "./pages/me/ProfileScreen";

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

            <Route element={<ProtectedRoute />}>
              <Route element={<HomeLayout />} >
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>

            </Route>


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
