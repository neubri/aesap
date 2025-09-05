const { Product } = require("../models");

function isAdmin(req, res, next) {
  try {
    if (req.user.role !== "Admin") {
      throw { name: "Forbidden", message: "You are not authorized" };
    }

    next();
  } catch (error) {
    console.log(error, "<<<<<");

    next(error);
  }
}

async function isAdminOrStaff(req, res, next) {
  try {
    if (req.user.role === "Admin") {
      return next();
    }

    const productId = req.params.id;

    // console.log(productId, "<<<<<<");

    const userId = req.user.id;

    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        name: "Not Found",
        message: `Product with id ${productId} not found`,
      };
    }

    if (product.authorId !== userId) {
      throw { name: "Forbidden", message: "You are not authorized" };
    }

    next();
  } catch (error) {
    console.log(error);

    next(error);
  }
}

module.exports = {
  isAdmin,
  isAdminOrStaff,
};
