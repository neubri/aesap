import { Outlet, useNavigate } from "react-router";
import { NavbarCms } from "../components/NavbarCms";
import { useEffect } from "react";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

export default function AuthLayout() {
  const token = localStorage.getItem("access_token");

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Oops...",
        text: "You have to login",
        icon: "info",
      });

      navigate("/login");
    }
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCms />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
