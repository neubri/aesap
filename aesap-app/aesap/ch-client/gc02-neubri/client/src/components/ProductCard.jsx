import { Link } from "react-router";

export default function ProductCard(props) {
  const { product } = props;

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="aesop-card product-card h-100 d-flex flex-column">
        <Link
          to={`/products/${product?.id || 1}`}
          className="text-decoration-none text-dark d-flex flex-column h-100"
        >
          <div className="product-card-image">
            <img
              src={
                product?.imgUrl ||
                product?.imageUrl ||
                product?.image ||
                "https://www.aesop.com/u1nb1km7t5q7/2mbTpk5LmPKU9YBxKMDXgX/46c5c4db2aa7f12ee81ed9c3849b501e/Aesop_Skin_Lucent_Facial_Refiner_60mL_Web_Front_Large_1800x955px.png"
              }
              alt={product?.name || "Product"}
              className="img-fluid"
              onError={(e) => {
                e.target.src =
                  "https://www.aesop.com/u1nb1km7t5q7/2mbTpk5LmPKU9YBxKMDXgX/46c5c4db2aa7f12ee81ed9c3849b501e/Aesop_Skin_Lucent_Facial_Refiner_60mL_Web_Front_Large_1800x955px.png";
              }}
            />
          </div>

          <div className="product-card-content p-4 d-flex flex-column">
            <h3 className="product-card-title">
              {product?.name || "Facial Cleanser"}
            </h3>

            <p className="product-card-description flex-grow-1">
              {product?.content || product?.description ||
                "A gentle, foaming gel cleanser to refresh and purify the complexion."}
            </p>

            <div className="d-flex justify-content-between align-items-center mt-auto">
              <span className="product-card-price">
                ${product?.price || "42.00"}
              </span>
              <button className="btn btn-aesop btn-sm">Discover</button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
