import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClientWidth from "./hooks/useClientWidth.util";
import Layout from "./layouts/Layout";
import ManageLayout from "./layouts/ManageLayout";
import AddAdmin from "./pages/AdminManage/AddAdmin";
import DetailAdmin from "./pages/AdminManage/DetailAdmin";
import ManageAdmin from "./pages/AdminManage/ManageAdmin";
import UpdateAdmin from "./pages/AdminManage/UpdateAdmin";
import AddCar from "./pages/BusManage/AddBus";
import BusManage from "./pages/BusManage/BusManage";
import DetailCar from "./pages/BusManage/DetailBus";
import UpdateCar from "./pages/BusManage/UpdateBus";
import AddCoDriver from "./pages/CoDriverManage/AddCoDriver";
import DetailCoDriver from "./pages/CoDriverManage/DetailCoDriver";
import ManageCoDriver from "./pages/CoDriverManage/ManageCoDriver";
import UpdateCoDriver from "./pages/CoDriverManage/UpdateCoDriver";
import AddCustomer from "./pages/CustomerManage/AddCustomer";
import DetailCustomer from "./pages/CustomerManage/DetailCustomer";
import ManageCustomer from "./pages/CustomerManage/ManageCustomer";
import UpdateCustomer from "./pages/CustomerManage/UpdateCustomer";
import AddDriver from "./pages/DriverManage/AddDriver";
import DetailDriver from "./pages/DriverManage/DetailDriver";
import ManageDriver from "./pages/DriverManage/ManageDriver";
import UpdateDriver from "./pages/DriverManage/UpdateDriver";
import Login from "./pages/Login";
import AddTrip from "./pages/TripManage/AddTrip";
import TripManage from "./pages/TripManage/TripManage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/app.scss";
import "./styles/reset.scss";
import "./styles/root.scss";
import { handleTokenExpiration } from "./utils/handleTokenExpiration ";
import DetailTrip from "./pages/TripManage/DetailTrip";
import UpdateTrip from "./pages/TripManage/UpdateTrip";
import ManagePromotion from "./pages/PromotionManage/ManagePromotion";
import AddPromotion from "./pages/PromotionManage/AddPromotion";
import DetailPromotion from "./pages/PromotionManage/DetailPromotion";
import UpdatePromotion from "./pages/PromotionManage/UpdatePromotion";
import Dashboard from "./pages/Dashboard";

function App() {
  useClientWidth();

  useEffect(() => {
    const interval = setInterval(() => {
      const status = localStorage.getItem("status");
      if (status === "OK") {
        handleTokenExpiration();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Route bảo vệ */}
            <Route element={<ManageLayout />}>
              <Route index element={<Dashboard />} />
            </Route>

            {/* Car Manage */}
            <Route path="/bus-manage" element={<ManageLayout />}>
              <Route index element={<BusManage />} />
              <Route path="detail/:licensePlate" element={<DetailCar />} />
              <Route path="add" element={<AddCar />} />
              <Route path="update/:licensePlate" element={<UpdateCar />} />
            </Route>

            {/* Customer Manage */}
            <Route path="/customer-manage" element={<ManageLayout />}>
              <Route index element={<ManageCustomer />} />
              <Route path="page/:page" element={<ManageCustomer />} />
              <Route path="detail/:id" element={<DetailCustomer />} />
              <Route path="add" element={<AddCustomer />} />
              <Route path="update/:id" element={<UpdateCustomer />} />
            </Route>

            {/* Co-driver Manage */}
            <Route path="/co-driver-manage" element={<ManageLayout />}>
              <Route index element={<ManageCoDriver />} />
              <Route path="page/:page" element={<ManageCoDriver />} />
              <Route path="detail/:id" element={<DetailCoDriver />} />
              <Route path="add" element={<AddCoDriver />} />
              <Route path="update/:id" element={<UpdateCoDriver />} />
            </Route>

            {/* Driver Manage */}
            <Route path="/driver-manage" element={<ManageLayout />}>
              <Route index element={<ManageDriver />} />
              <Route path="page/:page" element={<ManageDriver />} />
              <Route path="detail/:id" element={<DetailDriver />} />
              <Route path="add" element={<AddDriver />} />
              <Route path="update/:id" element={<UpdateDriver />} />
            </Route>

            {/* Admin Manage */}
            <Route path="/admin-manage" element={<ManageLayout />}>
              <Route index element={<ManageAdmin />} />
              <Route path="page/:page" element={<ManageAdmin />} />
              <Route path="detail/:id" element={<DetailAdmin />} />
              <Route path="add" element={<AddAdmin />} />
              <Route path="update/:id" element={<UpdateAdmin />} />
            </Route>

            {/* Trip Manage */}
            <Route path="/trip-manage" element={<ManageLayout />}>
              <Route index element={<TripManage />} />
              <Route path="page/:page" element={<TripManage />} />
              <Route path="add" element={<AddTrip />} />
              <Route path="detail/:id" element={<DetailTrip />} />
              <Route path="update/:id" element={<UpdateTrip />} />
            </Route>

            {/* Promotion */}
            <Route path="/promotion-manage" element={<ManageLayout />}>
              <Route index element={<ManagePromotion />} />
              <Route path="page/:page" element={<ManagePromotion />} />
              <Route path="add" element={<AddPromotion />} />
              <Route path="detail/:id" element={<DetailPromotion />} />
              <Route path="update/:id" element={<UpdatePromotion />} />
            </Route>
          </Routes>
        </Layout>

        <ToastContainer
          className="custom-toast"
          position="top-center"
          autoClose={700}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </>
  );
}

export default App;
