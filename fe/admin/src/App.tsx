import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layouts/Layout";
import "./styles/app.scss";
import "./styles/reset.scss";
import "./styles/root.scss";
import PrivateRoute from "./components/PrivateRoute";
import ManageLayout from "./layouts/ManageLayout";
import ManageCar from "./pages/ManageCar/ManageCar";
import DetailCar from "./pages/ManageCar/DetailCar";
import AddCar from "./pages/ManageCar/AddCar";
import UpdateCar from "./pages/ManageCar/UpdateCar";
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
