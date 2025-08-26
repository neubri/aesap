import { useNavigate } from "react-router";
import Button from "./Button";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg aesop-nav fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          Aēsap
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Button
                variant="dark"
                size="s"
                text="Login"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
