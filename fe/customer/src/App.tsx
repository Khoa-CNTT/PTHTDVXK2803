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
import Profile from "./components/Profile";
import UpdatePassword from "./components/UpdatePassword";
import DetailPromotion from "./components/DetailPromotion";
import VerifyOtpForgotPassword from "./components/VerifyOtpForgotPassword";
import UpdateForgotPassword from "./components/UpdateForgotPassword";
import SearchTripPage from "./pages/SearchTripPage";
import HistoryBookTicket from "./components/HistoryBookTicket";
import { useEffect } from "react";
import BookedPage from "./pages/BookedPage";
import { handleTokenExpiration } from "./utils/handleTokenExpiration ";
import useOffline from "./hooks/useOfflie";
import DetailTicket from "./components/DetailTicket";

function App() {
  useOffline();

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

  useClientWidth();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
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
          path="/lich-su-dat-ve"
          element={
            <Layout>
              <HistoryBookTicket />
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
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/update-password"
          element={
            <Layout>
              <UpdatePassword />
            </Layout>
          }
        />
        <Route
          path="/detail-promotion"
          element={
            <Layout>
              <DetailPromotion />
            </Layout>
          }
        />
        <Route
          path="/tim-kiem"
          element={
            <Layout>
              <SearchTripPage />
            </Layout>
          }
        />
        <Route
          path="/dat-ve"
          element={
            <Layout>
              <BookedPage />
            </Layout>
          }
        />

        <Route
          path="/chi-tiet-dat-ve"
          element={
            <Layout>
              <DetailTicket />
            </Layout>
          }
        />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-email-forgot-password" element={<VerifyOtpForgotPassword />} />
        <Route
          path="/update-forgot-password"
          element={
            <Layout>
              <UpdateForgotPassword />
            </Layout>
          }
        />
      </Routes>
      <ToastContainer
        className="custom-toast"
        position="top-right"
        autoClose={2000}
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
