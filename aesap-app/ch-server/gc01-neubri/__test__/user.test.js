const app = require("../app");
const request = require("supertest");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;

const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

let access_token_valid_admin;

beforeAll(async () => {
  try {
    //seeding untuk users
    const users = require("../data/users.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.password = hashPassword(el.password);
      return el;
    });

    await queryInterface.bulkInsert("Users", users);

    //skema admin
    const admin = await User.findOne({ where: { role: "Admin" } });
    access_token_valid_admin = signToken({ id: admin.id });
  } catch (error) {
    console.log(error);
  }
});

describe("Login (Admin)", () => {
  describe("Berhasil login dan mengirimkan access_token", () => {
    test("Should return status 200 and access token", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "admin@gmail.com",
        password: "admin123",
      });
      expect(status).toBe(200);
      expect(body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe("Email tidak diberikan / tidak diinput", () => {
    test("Should return status 400 when email is empty", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "",
        password: "admin123",
      });

      expect(status).toBe(400);
      expect(body).not.toHaveProperty("email");
      expect(body).toHaveProperty("message", "Email is required");
    });
  });

  describe("Password tidak diberikan / tidak diinput", () => {
    test("Should return status 400 when password is empty", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "admin@gmail.com",
        password: "",
      });

      expect(status).toBe(400);
      expect(body).not.toHaveProperty("password");
      expect(body).toHaveProperty("message", "Password is required");
    });
  });

  describe("Email diberikan invalid / tidak terdaftar", () => {
    test("Should return status 401 and message Invalid email/password", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "admingalak@gmail.com",
        password: "admin123",
      });

      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid email/password");
    });
  });

  describe("Password diberikan salah / tidak match", () => {
    test("Should return status 401 and message Invalid email/password", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "admin@gmail.com",
        password: "admin999",
      });

      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid email/password");
    });
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
