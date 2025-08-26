import { useEffect, useState } from "react";
import http from "../lib/http";
import Swal from "sweetalert2";
import "../styles/aesop.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await http({
        method: "GET",
        url: "/categories",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setCategories(response.data.data || response.data);
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
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    try {
      await http({
        method: "POST",
        url: "/categories",
        data: { name: newCategory },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Category added successfully",
      });

      setNewCategory("");
      fetchCategories();
    } catch (error) {
      let message = "Something went wrong";

      if (error?.response?.data) {
        const errorData = error.response.data;

        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationMessages = errorData.errors.map(
            (err) => err.message || err.msg
          );
          message = validationMessages.join("\n");
        } else if (errorData.message) {
          message = errorData.message;
        } else if (Array.isArray(errorData)) {
          message = errorData.join("\n");
        }
      }

      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await http({
        method: "PUT",
        url: `/categories/${id}`,
        data: { name: editName },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Category updated successfully",
      });

      setEditingCategory(null);
      setEditName("");
      fetchCategories();
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
  };

  const startEdit = (category) => {
    setEditingCategory(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="h3 mb-2">Categories</h1>
        <p className="text-muted">
          Manage product categories for your store. Categories help organize
          your products and make them easier to find.
        </p>
      </div>

      {/* Add New Category Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <h2 className="h5 mb-3">Add New Category</h2>
          <form onSubmit={handleAddCategory}>
            <div className="row align-items-end">
              <div className="col-md-8">
                <label htmlFor="categoryName" className="form-label fw-medium">
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  className="form-control"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-dark w-100">
                  Add Category
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Categories List */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h5 mb-3">Existing Categories</h2>

          {categories.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">
                No categories found. Add your first category above.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th width="150">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="align-middle">{category.id}</td>
                      <td className="align-middle">
                        {editingCategory === category.id ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateCategory(category.id);
                              } else if (e.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span>{category.name}</span>
                        )}
                      </td>
                      <td className="align-middle">
                        <div className="btn-group btn-group-sm">
                          {editingCategory === category.id ? (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleUpdateCategory(category.id)
                                }
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => startEdit(category)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
