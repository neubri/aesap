const { Product, Category } = require("../models");
const { Op } = require("sequelize");

class pubController {
  static async getPubProduct(req, res, next) {
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

  static async getPubProductById(req, res, next) {
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

  static async getPubCategory(req, res, next) {
    try {
      const category = await Category.findAll();

      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = pubController;
