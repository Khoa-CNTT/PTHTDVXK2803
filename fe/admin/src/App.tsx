import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layouts/Layout";
import "./styles/app.scss";
import "./styles/reset.scss";
import "./styles/root.scss";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            {/* Route bảo vệ */}
            <Route element={<PrivateRoute />}>
              <Route index element={<div>Home</div>} />
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
