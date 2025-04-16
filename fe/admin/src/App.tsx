import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./layouts/Layout";
import ManageLayout from "./layouts/ManageLayout";
import AddCustomer from "./pages/CustomerManage/AddCustomer";
import DetailCustomer from "./pages/CustomerManage/DetailCustomer";
import ManageCustomer from "./pages/CustomerManage/ManageCustomer";
import UpdateCustomer from "./pages/CustomerManage/UpdateCustomer";
import AddDriver from "./pages/DriverManage/AddDriver";
import DetailDriver from "./pages/DriverManage/DetailDriver";
import ManageDriver from "./pages/DriverManage/ManageDriver";
import UpdateDriver from "./pages/DriverManage/UpdateDriver";
import AddCar from "./pages/ManageCar/AddCar";
import DetailCar from "./pages/ManageCar/DetailCar";
import ManageCar from "./pages/ManageCar/ManageCar";
import UpdateCar from "./pages/ManageCar/UpdateCar";
import "./styles/app.scss";
import "./styles/reset.scss";
import "./styles/root.scss";
import useClientWidth from "./utils/useClientWidth.util";

function App() {
  useClientWidth();
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            {/* Route bảo vệ */}
            <Route element={<PrivateRoute />}>
              <Route index element={<div>Home</div>} />

              {/* Car Manage */}
              <Route path="/car-manage" element={<ManageLayout />}>
                <Route index element={<ManageCar />} />
                <Route path="page/:page" element={<ManageCar />} />
                <Route path="detail/:id" element={<DetailCar />} />
                <Route path="add" element={<AddCar />} />
                <Route path="update/:id" element={<UpdateCar />} />
              </Route>

              {/* Customer Manage */}
              <Route path="/customer-manage" element={<ManageLayout />}>
                <Route index element={<ManageCustomer />} />
                <Route path="page/:page" element={<ManageCustomer />} />
                <Route path="detail/:id" element={<DetailCustomer />} />
                <Route path="add" element={<AddCustomer />} />
                <Route path="update/:id" element={<UpdateCustomer />} />
              </Route>

              {/* Driver Manage */}
              <Route path="/driver-manage" element={<ManageLayout />}>
                <Route index element={<ManageDriver />} />
                <Route path="page/:page" element={<ManageDriver />} />
                <Route path="detail/:id" element={<DetailDriver />} />
                <Route path="add" element={<AddDriver />} />
                <Route path="update/:id" element={<UpdateDriver />} />
              </Route>
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
