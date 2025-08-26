import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import AddStaff from "./pages/AddStaff";
import FormProduct from "./pages/FormProduct";
import Categories from "./pages/Categories";
import UpdateImage from "./pages/UpdateImage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>

        <Route path="/cms" element={<AuthLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<FormProduct type="add" />} />
          <Route path="edit/:id" element={<FormProduct type="edit" />} />
          <Route path="add-staff" element={<AddStaff />} />
          <Route path="categories" element={<Categories />} />
          <Route path="update-image/:id" element={<UpdateImage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
