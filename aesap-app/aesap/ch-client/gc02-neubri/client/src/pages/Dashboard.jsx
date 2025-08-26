import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import http from "../lib/http";
import Swal from "sweetalert2";
import Button from "../components/Button";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getCategoryName = (categoryId) => {
    if (!categoryId || !Array.isArray(categories)) return "Uncategorized";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const fetchProducts = useCallback(
    async (newPage = 1) => {
      try {
        const response = await http({
          method: "GET",
          url: "/products",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            search,
            filter,
            sort,
            "page[number]": newPage,
            "page[size]": 8,
          },
        });

        const product = response.data;

        setProducts(product.data || []);

        setTotalPage(product.totalPage || 1);

        setPage(newPage);
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
      } finally {
        setLoading(false);
      }
    },
    [search, filter, sort]
  );

  async function fetchCategories() {
    try {
      const response = await http({
        method: "GET",
        url: "/categories",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      let category = response.data;

      setCategories(category);
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
    }
  }

  async function deleteProduct(id) {
    try {
      await http({
        method: "DELETE",
        url: "/products/" + id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product has been deleted",
      });

      fetchProducts(page);
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
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  return (
    <div className="cms-articles-page">
      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12">
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "16px" }}
            >
              {/* Header with filters */}
              <div className="card-header bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <h5 className="mb-0 fw-bold">Recent Products</h5>
                  </div>
                  <div className="d-flex flex-nowrap gap-2">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search..."
                      style={{ maxWidth: "180px" }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                      className="form-select"
                      style={{ maxWidth: "160px" }}
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="">No Filter</option>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                    <select
                      className="form-select"
                      style={{ maxWidth: "160px" }}
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="">Sort by</option>
                      <option value="name">Name A-Z</option>
                      <option value="-name">Name Z-A</option>
                      <option value="createdAt">Oldest</option>
                      <option value="-createdAt">Newest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />
                    <p className="text-muted mt-3">Loading products...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Products</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Author</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? (
                          products.map((Product) => (
                            <tr key={Product.id} className="border-bottom">
                              <td className="px-4 py-3">{Product.id}</td>
                              <td className="px-4 py-3">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={Product.imgUrl}
                                    alt={Product.name}
                                    className="rounded me-3"
                                    style={{
                                      width: "48px",
                                      height: "48px",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.target.src =
                                        "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80";
                                    }}
                                  />
                                  <div>
                                    <h6
                                      className="mb-1 fw-bold text-dark"
                                      style={{ fontSize: "0.95rem" }}
                                    >
                                      {Product.name.length > 50
                                        ? `${Product.name.substring(0, 50)}...`
                                        : Product.name}
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="badge bg-light text-dark rounded-pill px-3">
                                  {getCategoryName(Product.categoryId)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted">
                                Author {Product.authorId}
                              </td>
                              <td className="px-4 py-3">
                                <div className="d-flex gap-2">
                                  <Link
                                    to={`/cms/edit/${Product.id}`}
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    Edit
                                  </Link>
                                  <Link
                                    to={`/cms/update-image/${Product.id}`}
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    Update Img
                                  </Link>
                                  <button
                                    onClick={() => deleteProduct(Product.id)}
                                    className="btn btn-sm btn-outline-danger"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-5">
                              <i className="fas fa-box fa-3x text-muted mb-3" />
                              <h5 className="text-muted">No products found</h5>
                              <p className="text-muted">
                                Start by creating your first product
                              </p>
                              <Link to="/cms/add" className="btn btn-dark">
                                Create Product
                              </Link>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && products.length > 0 && totalPage > 1 && (
                <div className="card-footer bg-white py-3">
                  <nav className="d-flex justify-content-center">
                    <ul className="pagination mb-0">
                      {page > 1 && (
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => fetchProducts(page - 1)}
                          >
                            Previous
                          </button>
                        </li>
                      )}
                      <li className="page-item disabled">
                        <span className="page-link">Page {page}</span>
                      </li>
                      {page < totalPage && (
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => fetchProducts(page + 1)}
                          >
                            Next
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
