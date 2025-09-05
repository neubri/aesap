const { Category } = require("../models");

class categoryController {
  static async getCategory(req, res, next) {
    try {
      const category = await Category.findAll();

      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        throw {
          name: "Bad Request",
          message: `Category with id ${id} not found`,
        };
      }

      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async putCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        throw {
          name: "Bad Request",
          message: `Category with id ${id} not found`,
        };
      }

      const { name } = req.body;

      await category.update({
        name,
      });

      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async postCategory(req, res, next) {
    try {
      const { name } = req.body;

      const category = await Category.create({ name });

      res.status(201).json(category);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = categoryController;
