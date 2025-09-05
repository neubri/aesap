import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function MainLayout() {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      Swal.fire({
        title: "Oops...",
        text: "You are already logged in as Admin/Staff.",
        icon: "info",
      });

      navigate("/cms");
    }
  }, []);

  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}
