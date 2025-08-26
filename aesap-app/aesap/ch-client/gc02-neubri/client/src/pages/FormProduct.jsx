import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import http from "../lib/http";
import Swal from "sweetalert2";
import "../styles/aesop.css";

export default function FormProduct({ type }) {
  const { id } = useParams();
  const isEdit = type === "edit" || !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const navigate = useNavigate();

  async function fetchProductsById() {
    try {
      setInitialLoading(true);

      const response = await http({
        method: "GET",
        url: "/products/" + id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const product = response?.data?.data || response?.data;

      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
      setImgUrl(product.imgUrl || "");
      setCategoryId(product.categoryId || "");
    } catch (error) {
      let message = "Something went wrong";

      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });

      navigate("/cms");
    } finally {
      setInitialLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await http({
        method: "GET",
        url: "/categories",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCategories(response?.data);
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
    }
  }

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchProductsById();
    }
  }, [id, isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imgUrl,
        categoryId: categoryId ? Number(categoryId) : null,
      };

      if (isEdit) {
        await http({
          method: "PUT",
          url: `/products/${id}`,
          data: productData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product updated successfully",
        });
      } else {
        await http({
          method: "POST",
          url: "/products",
          data: productData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product created successfully",
        });
      }

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

  if (initialLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-4">
            <h1 className="h3 mb-2">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted">
              {isEdit
                ? "Update product information and details"
                : "Create a new product for your store"}
            </p>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label fw-medium">
                    Product Name
                  </label>
                  <input
                    id="productName"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label fw-medium">
                        Price ($)
                      </label>
                      <input
                        id="price"
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="stock" className="form-label fw-medium">
                        Stock
                      </label>
                      <input
                        id="stock"
                        type="number"
                        className="form-control"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="imgUrl" className="form-label fw-medium">
                    Image URL
                  </label>
                  <input
                    id="imgUrl"
                    type="url"
                    className="form-control"
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {imgUrl && (
                    <div className="mt-3">
                      <img
                        src={imgUrl}
                        alt="Product preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label fw-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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
                        {isEdit ? "Updating..." : "Creating..."}
                      </>
                    ) : isEdit ? (
                      "Update Product"
                    ) : (
                      "Create Product"
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
