import { useParams } from "react-router";
import http from "../lib/http";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Button from "../components/Button";
import "../styles/aesop.css";

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  async function fetchProductById() {
    try {
      setLoading(true);
      setError(null);
      const response = await http({
        method: "GET",
        url: "/pub/products/" + id,
      });

      setProduct(response.data || {});
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

  useEffect(() => {
    fetchProductById();
  }, [id]);

  if (loading) {
    return (
      <div className="container pt-5 pb-4 mt-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product.name) {
    return (
      <div className="container pt-5 pb-4 mt-5">
        <div
          className="text-center"
          style={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 className="mb-3">Product Not Found</h2>
          <p className="text-muted mb-4">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <div className="d-flex justify-content-center">
            <Button
              variant="aesop"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          {/* Breadcrumb */}
          <nav className="mb-4 pb-3 border-bottom">
            <a href="/" className="text-muted text-decoration-none me-2 small">
              Home
            </a>
            <span className="text-muted small">/ {product.name}</span>
          </nav>

          <div className="row g-5">
            {/* Product Image */}
            <div className="col-lg-6">
              <div className="sticky-lg-top" style={{ top: "2rem" }}>
                <div className="product-image-container">
                  <img
                    src={
                      product.imgUrl ||
                      "https://images.unsplash.com/photo-1556228578-dd14b0afc37c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    }
                    alt={product.name || "Product"}
                    className="img-fluid w-100 product-detail-image"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1556228578-dd14b0afc37c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="col-lg-6">
              <div className="d-flex flex-column h-100">
                {/* Product Name */}
                <h1 className="display-6 fw-normal mb-3">{product.name}</h1>

                {/* Product Price */}
                <div className="mb-4">
                  <span className="h4 fw-medium text-dark">
                    {product.price
                      ? `$${Number(product.price).toFixed(2)}`
                      : "Price not available"}
                  </span>
                </div>

                {/* Product Description */}
                <div className="mb-4 flex-grow-1">
                  <p className="text-muted lh-lg mb-4">
                    {product.content ||
                      product.description ||
                      "No description available"}
                  </p>

                  {/* Product Meta Information */}
                  <div className="border-top pt-4">
                    {product.Category && (
                      <div className="row mb-3">
                        <div className="col-4">
                          <small className="text-uppercase text-muted fw-medium">
                            Category
                          </small>
                        </div>
                        <div className="col-8">
                          <small className="text-dark">
                            {product.Category.name}
                          </small>
                        </div>
                      </div>
                    )}

                    {product.User && (
                      <div className="row mb-3">
                        <div className="col-4">
                          <small className="text-uppercase text-muted fw-medium">
                            Author
                          </small>
                        </div>
                        <div className="col-8">
                          <small className="text-dark">
                            {product.User.email}
                          </small>
                        </div>
                      </div>
                    )}

                    {product.slug && (
                      <div className="row mb-3">
                        <div className="col-4">
                          <small className="text-uppercase text-muted fw-medium">
                            Product Code
                          </small>
                        </div>
                        <div className="col-8">
                          <small className="text-dark text-uppercase">
                            {product.slug}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-auto">
                  <Button variant="aesop" block className="py-3">
                    Add to Cart
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
