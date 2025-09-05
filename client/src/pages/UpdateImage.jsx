import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import http from "../lib/http";
import "../styles/aesop.css";

export default function UpdateImage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchProductById() {
    try {
      setInitialLoading(true);

      const response = await http({
        method: "GET",
        url: "/products/" + id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const product = response.data.data || response.data;

      setImgUrl(product.imgUrl || "");
      setProductName(product.name || "");
      setPreviewUrl(product.imgUrl || "");
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

      navigate("/cms");
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchProductById();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("imageUrl", selectedFile);

      await http({
        method: "PATCH",
        url: `/products/${id}/image-url`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Image updated successfully",
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
            <h1 className="h3 mb-2">Update Product Image</h1>
            <p className="text-muted">Update the image for "{productName}"</p>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Current Image Preview */}
                {imgUrl && (
                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Current Image
                    </label>
                    <div className="text-center">
                      <img
                        src={imgUrl}
                        alt="Current product"
                        className="img-thumbnail"
                        style={{ maxWidth: "300px", maxHeight: "300px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="mb-3">
                  <label htmlFor="imageFile" className="form-label fw-medium">
                    Select New Image
                  </label>
                  <input
                    id="imageFile"
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="form-text">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </div>
                </div>

                {/* New Image Preview */}
                {previewUrl && selectedFile && (
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      New Image Preview
                    </label>
                    <div className="text-center">
                      <img
                        src={previewUrl}
                        alt="New product preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "300px", maxHeight: "300px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

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
                    disabled={loading || !selectedFile}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating Image...
                      </>
                    ) : (
                      "Update Image"
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
