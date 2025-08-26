import { useState } from "react";
import { useNavigate } from "react-router";
import http from "../lib/http";
import Swal from "sweetalert2";
import "../styles/aesop.css";

export default function AddStaff() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await http({
        method: "POST",
        url: `/add-user`,
        data: {
          email,
          password,
          phoneNumber,
          address,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Staff member added successfully",
      });

      navigate("/cms");
    } catch (error) {
      let message = "Something went wrong";

      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }

      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-4">
            <h1 className="h3 mb-2">Add Staff Member</h1>
            <p className="text-muted">
              Create a new staff account with administrative access to the
              content management system.
            </p>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter staff email address"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-medium">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter contact phone number"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="form-label fw-medium">
                    Address
                  </label>
                  <textarea
                    id="address"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter staff address"
                    rows={4}
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/cms")}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Adding Staff...
                      </>
                    ) : (
                      "Add Staff Member"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
