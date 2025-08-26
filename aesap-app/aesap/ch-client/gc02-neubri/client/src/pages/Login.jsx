import { useEffect, useState } from "react";
import http from "../lib/http";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import "../styles/aesop.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      Swal.fire({
        title: "Oops...",
        text: "You're already logged in.",
        icon: "info",
      });
      navigate("/cms");
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await http({
        method: "POST",
        url: "/login",
        data: {
          email,
          password,
        },
      });

      localStorage.setItem(`access_token`, response.data.access_token);

      navigate("/cms");

      await Swal.fire({
        title: "Success",
        text: "Login successful",
        icon: "success",
      });
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
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="h3 mb-2 fw-bold">Aēsap</h1>
                  <p className="text-muted small">Content Management System</p>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label small fw-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label small fw-medium"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>

                {/* Back to Home Button */}
                <div className="text-center mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="text-muted"
                  >
                    ← Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
