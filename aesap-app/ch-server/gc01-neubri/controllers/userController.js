const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class userController {
  static async addUser(req, res, next) {
    try {
      const { email, password, phoneNumber, address } = req.body;

      if (!email) {
        throw { name: "Bad Request", message: "Email is required" };
      }

      if (!password) {
        throw { name: "Bad Request", message: "Password is required" };
      }

      const user = await User.create({
        email,
        password,
        phoneNumber,
        address,
      });

      const cleanUser = user.toJSON();
      delete cleanUser.password;

      res.status(201).json(cleanUser);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "Bad Request", message: "Email is required" };
      }

      if (!password) {
        throw { name: "Bad Request", message: "Password is required" };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw { name: "Unauthorized", message: "Invalid email/password" };
      }

      const isPasswordMatch = comparePassword(password, user.password);

      if (!isPasswordMatch) {
        throw { name: "Unauthorized", message: "Invalid email/password" };
      }

      const access_token = signToken({ id: user.id });

      const cleanUser = user.toJSON();
      delete cleanUser.password;
      delete cleanUser.address;
      delete cleanUser.role;
      delete cleanUser.phoneNumber;
      delete cleanUser.createdAt;
      delete cleanUser.updatedAt;

      res.status(200).json({ access_token, user: cleanUser });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
