const { Product, User } = require("../models");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary").v2;

class productController {
  static async postProduct(req, res, next) {
    try {
      const userId = +req.user.id;

      const { name, description, price, stock, imgUrl, categoryId } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        imgUrl,
        authorId: userId,
        categoryId,
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getProduct(req, res, next) {
    try {
      console.log(req.query);
      const { search, filter, sort } = req.query;

      const where = {}; // Inisialisasi object kosong

      // Filtering
      if (filter) {
        where.categoryId = filter;
      }

      // Searching
      if (search) {
        where.name = {
          [Op.iLike]: `%${search}%`,
        };
      }

      const paramsQuerySQL = { where };

      // Sorting
      if (sort) {
        const ordering = sort[0] === "-" ? "DESC" : "ASC";
        const columnName = ordering === "DESC" ? sort.slice(1) : sort;
        paramsQuerySQL.order = [[columnName, ordering]];
      }

      // Default limit and page number
      let limit = 10; // Default limit
      let pageNumber = 1;

      // Pagination
      if (req.query["page[size]"]) {
        limit = +req.query["page[size]"];
      }
      paramsQuerySQL.limit = limit; // Apply the limit to the query

      if (req.query["page[number]"]) {
        pageNumber = +req.query["page[number]"];
      }
      paramsQuerySQL.offset = limit * (pageNumber - 1); // Apply the offset to the query

      // Add include to get User data
      paramsQuerySQL.include = {
        model: User,
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      };

      const { count, rows } = await Product.findAndCountAll(paramsQuerySQL);

      res.json({
        page: pageNumber,
        data: rows,
        totalData: count,
        totalPage: Math.ceil(count / limit),
        dataPerPage: limit,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "Not Found", message: `Product with id ${id} not found` };
      }

      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "Not Found", message: `Product with id ${id} not found` };
      }

      await Product.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({ message: `${product.name} success to delete` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async putProductById(req, res, next) {
    try {
      const { id } = req.params;

      const userId = req.user.id;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "Not Found", message: `Product with id ${id} not found` };
      }

      const { name, description, price, stock, imgUrl, categoryId } = req.body;

      if (!name) {
        throw { name: "Bad Request", message: "Name is required" };
      }

      if (!description) {
        throw { name: "Bad Request", message: "Description is required" };
      }

      if (!price) {
        throw { name: "Bad Request", message: "Price is required" };
      }

      if (!stock) {
        throw { name: "Bad Request", message: "Stock is required" };
      }

      if (!imgUrl) {
        throw { name: "Bad Request", message: "ImageUrl is required" };
      }

      if (!categoryId) {
        throw { name: "Bad Request", message: "CategoryId is required" };
      }

      await product.update({
        name,
        description,
        price,
        stock,
        imgUrl,
        categoryId,
        authorId: userId,
      });

      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async patchProductImageUrlById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "Not Found", message: `Product with id ${id} not found` };
      }

      if (!req.file) {
        throw { name: "Bad Request", message: "ImageURL file is required" };
      }

      const uploadPromise = new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream((error, uploadResult) => {
            //uploadResult adalah informasi dari claudinary ketika upload berhasil anjaay

            //resolve buat nandain prosesnya kalo udh beres
            return resolve(uploadResult);

            //.end untuk ngasih data / file yang mau diupload
          })
          .end(req.file.buffer);
      });

      const result = await uploadPromise;

      await product.update({ imgUrl: result.secure_url });

      res.json({ message: `ImageURL for Product id ${id} has been updated` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = productController;
