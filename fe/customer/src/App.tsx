import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.scss";
import "./styles/Root.scss";
import "./styles/Reset.scss";
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import useClientWidth from "./utils/useClientWidth";
import Schedule from "./components/Schedule";
import Lookup from "./components/Lookup";
import RentalCar from "./components/RentalCar";
import News from "./components/News";
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import VerifyOTP from "./components/VerifyOTP";

function App() {
  useClientWidth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/schedule"
          element={
            <Layout>
              <Schedule />
            </Layout>
          }
        />
        <Route
          path="/lookup"
          element={
            <Layout>
              <Lookup />
            </Layout>
          }
        />

        <Route
          path="/rental-car"
          element={
            <Layout>
              <RentalCar />
            </Layout>
          }
        />

        <Route
          path="/news"
          element={
            <Layout>
              <News />
            </Layout>
          }
        />

        <Route
          path="/about-us"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route path="/verify-otp" element={<VerifyOTP />}/>
      </Routes>
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
  );
}

export default App;
