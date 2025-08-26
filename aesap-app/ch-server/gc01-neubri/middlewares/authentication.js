const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw { name: "Unauthorized", message: "Invalid token" };
  }

  const rawToken = authorization.split(" ");
  const tokenType = rawToken[0];
  const tokenValue = rawToken[1];

  if (tokenType !== "Bearer" || !tokenValue) {
    throw { name: "Unauthorized", message: "Invalid token" };
  }

  const result = verifyToken(tokenValue);

  const user = await User.findByPk(result.id);

  if (!user) {
    throw { name: "Unauthorized", message: "Invalid token" };
  }

  req.user = user;

  next();
}

module.exports = authentication;
