import { useEffect, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import http from "../lib/http";
import Swal from "sweetalert2";
import "../styles/aesop.css";

export default function Home() {
  //for data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  //for pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  //sort filter search
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");

  const fetchProducts = useCallback(
    async (newPage) => {
      try {
        const response = await http({
          method: "GET",
          url: "/pub/products",
          params: {
            search,
            filter,
            sort,
            "page[number]": newPage,
            "page[size]": 6,
          },
        });

        setProducts(response?.data?.data);

        setPage(newPage);

        setTotalPage(response?.data?.totalPage || 1);
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
    },
    [search, filter, sort]
  );

  async function fetchCategories() {
    try {
      const response = await http({
        method: "GET",
        url: "/pub/categories",
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
    fetchProducts(1);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(page);
  }, [fetchProducts, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {/* Hero Section with Carousel */}
      <section className="aesop-hero pt-5 pb-3">
        <div className="container mt-5">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1 mb-5 mb-lg-0">
              <span className="text-muted mb-2 d-block small fw-medium text-uppercase aesop-brand">
                Aēsap
              </span>
              <h1 className="mb-4">Introducing Lucent Facial Refiner</h1>
              <p className="mb-4">
                A new gently exfoliating mask to even the texture and appearance
                of the skin, with a unique combination of ingredients to refine
                and replenish.
              </p>
              <button className="btn btn-aesop">Discover More</button>
            </div>

            <div className="col-lg-6 order-lg-2">
              <div
                id="heroCarousel"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="5000"
              >
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  ></button>
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src="https://www.aesop.com/u1nb1km7t5q7/6cbHTaqlIYVuvmTi1YB2ks/c018cf6b5030668655bcfb6a950965a5/Aesop_Gratitude_Sleeve_2025_TW_Web_Homepage_Secondary_50-50_Desktop_1440x1500px.jpg"
                      className="d-block w-100 aesop-hero-image"
                      alt="Aesop Gratitude Collection"
                      loading="lazy"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://www.aesop.com/u1nb1km7t5q7/6lhT4O2N0Iblwc9PCwEmSP/555f47f25ba422cb21954f7cfdd570cd/Aesop_Lucent_Facial_Refiner_Web_Homepage_4_Primary_50-50_GL_Desktop_1440x810px.jpg"
                      className="d-block w-100 aesop-hero-image"
                      alt="Lucent Facial Refiner"
                      loading="lazy"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://www.aesop.com/u1nb1km7t5q7/BZclAErTPM1JQNYyM3ikb/bcc41c5e1849bba330b5925df1330a77/Aesop_Category_Skin_Care_Primary_Full_Bleed_Desktop_2880x1044px.jpg"
                      className="d-block w-100 aesop-hero-image"
                      alt="Skin Care Collection"
                      loading="lazy"
                    />
                  </div>
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#heroCarousel"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#heroCarousel"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-5 bg-light border-top">
        <div className="container">
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-auto">
              <label htmlFor="search" className="form-label fw-medium small">
                Search
              </label>
            </div>
            <div className="col-auto">
              <input
                id="search"
                type="search"
                className="form-control"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-auto">
              <label htmlFor="filter" className="form-label fw-medium small">
                Category
              </label>
            </div>
            <div className="col-auto">
              <select
                id="filter"
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">No Filter</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-auto">
              <label htmlFor="sort" className="form-label fw-medium small">
                Sort By
              </label>
            </div>
            <div className="col-auto">
              <select
                id="sort"
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="-name">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="mb-3">Our Products</h2>
              <p className="text-muted mb-0">
                Discover our curated collection of premium skincare essentials
              </p>
            </div>
          </div>

          <div className="row g-4 mb-5 equal-height-row">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      {totalPage > 1 && (
        <section className="pb-5">
          <div className="container">
            <nav aria-label="Product pagination">
              <ul className="pagination justify-content-center">
                {page > 1 && (
                  <li className="page-item">
                    <button
                      className="page-link border-0 bg-transparent text-dark"
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                  </li>
                )}

                <li className="page-item disabled">
                  <span className="page-link border-0 bg-transparent text-muted">
                    Page {page} of {totalPage}
                  </span>
                </li>

                {page < totalPage && (
                  <li className="page-item">
                    <button
                      className="page-link border-0 bg-transparent text-dark"
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </section>
      )}
    </>
  );
}
