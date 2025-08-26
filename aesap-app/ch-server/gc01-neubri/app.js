if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const multer = require("multer");
const cors = require("cors");

const userController = require("./controllers/userController");
const productController = require("./controllers/productController");
const categoryController = require("./controllers/categoryController");
const errorHandler = require("./middlewares/errorHandler");
const pubController = require("./controllers/pubController");
const authentication = require("./middlewares/authentication");
const { isAdmin, isAdminOrStaff } = require("./middlewares/authorization");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//router
const productRouter = express.Router();
const categoryRouter = express.Router();
const pubRouter = express.Router();

//credentials
app.post("/login", userController.login);
app.post("/add-user", authentication, isAdmin, userController.addUser);

productRouter.use(authentication);
categoryRouter.use(authentication);

//category
categoryRouter.post("/", categoryController.postCategory);
categoryRouter.get("/", categoryController.getCategory);
categoryRouter.get("/:id", categoryController.getCategoryById);
categoryRouter.put("/:id", categoryController.putCategoryById);

//produt
productRouter.post("/", productController.postProduct);
productRouter.get("/", productController.getProduct);
productRouter.get("/:id", productController.getProductById);
productRouter.put("/:id", isAdminOrStaff, productController.putProductById);
productRouter.delete(
  "/:id",
  isAdminOrStaff,
  productController.deleteProductById
);
productRouter.patch(
  "/:id/image-url",
  isAdminOrStaff,
  upload.single("imageUrl"),
  productController.patchProductImageUrlById
);

//pub
pubRouter.get("/products", pubController.getPubProduct);
pubRouter.get("/products/:id", pubController.getPubProductById);
pubRouter.get("/categories", pubController.getPubCategory);

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/pub", pubRouter);

app.use(errorHandler);

module.exports = app;
