const app = require("../app");
const request = require("supertest");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;

const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

let access_token_valid_admin;
let access_token_valid_staff;
let access_token_invalid = "chainsawchainsawchainsawchainsaw";

beforeAll(async () => {
  try {
    //seeding untuk users
    const users = require("../data/users.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.password = hashPassword(el.password);
      return el;
    });

    //seeding untuk categories
    const categories = require("../data/categories.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    //seeding untuk articles
    const products = require("../data/products.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Users", users);
    await queryInterface.bulkInsert("Categories", categories);
    await queryInterface.bulkInsert("Products", products);
    //skema admin atau staff?
    const admin = await User.findOne({ where: { role: "Admin" } });
    access_token_valid_admin = signToken({ id: admin.id });

    const staff = await User.findOne({ where: { role: "Staff" } });
    access_token_valid_staff = signToken({ id: staff.id });
  } catch (error) {
    console.log(error, " dari before all <<<<<");
  }
});

describe("Create", () => {
  describe("Berhasil membuat entitas utama ", () => {
    test("Should return status 201 and of object (id, name, description, price, stock, imgUrl, categoryId )", async () => {
      const product = {
        name: "Test Parsley Seed Cleanser",
        description: "Test cleanser with gentle properties.",
        price: 100000,
        stock: 10,
        imgUrl:
          "https://dummyimage.com/600x400/cccccc/000000&text=Test+Cleanserg",
        categoryId: 1,
      };

      let { status, body } = await request(app)
        .post("/products")
        .send(product)
        .set("Authorization", `Bearer ${access_token_valid_admin}`);
      expect(status).toBe(201);
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("name", product.name);
      expect(body).toHaveProperty("description", product.description);
      expect(body).toHaveProperty("price", product.price);
      expect(body).toHaveProperty("stock", product.stock);
      expect(body).toHaveProperty("imgUrl", product.imgUrl);
      expect(body).toHaveProperty("categoryId", product.categoryId);
      expect(body).toHaveProperty("authorId", expect.any(Number));
    });
  });

  describe("Gagal menjalankan fitur karena belum login", () => {
    test("Should return status 401 and Invalid Token", async () => {
      let { status, body } = await request(app).post("/products").send({
        name: "Test Parsley Seed Cleanser",
        description: "Test cleanser with gentle properties.",
        price: 100000,
        stock: 10,
        imgUrl:
          "https://dummyimage.com/600x400/cccccc/000000&text=Test+Cleanserg",
        categoryId: 1,
      });
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });
  });

  describe("Gagal menjalankan fitur karena token yang diberikan tidak valid", () => {
    test("Should return status 401 and Invalid Toke", async () => {
      let { status, body } = await request(app)
        .post("/products")
        .send({
          name: "Test Parsley Seed Cleanser",
          description: "Test cleanser with gentle properties.",
          price: 100000,
          stock: 10,
          imgUrl:
            "https://dummyimage.com/600x400/cccccc/000000&text=Test+Cleanserg",
          categoryId: 1,
        })
        .set("Authorization", `Bearer ${access_token_invalid}`);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });
  });

  describe("Gagal ketika request body tidak sesuai (validation required)", () => {
    test("Should return status 400 and Title is required!", async () => {
      let { status, body } = await request(app)
        .post("/products")
        .send({
          description: "Test cleanser with gentle properties.",
          price: 100000,
          stock: 10,
          imgUrl:
            "https://dummyimage.com/600x400/cccccc/000000&text=Test+Cleanserg",
          categoryId: 1,
        })
        .set("Authorization", `Bearer ${access_token_valid_admin}`);
      expect(status).toBe(400);
      expect(body).not.toHaveProperty("name");
      expect(body).toHaveProperty("message", "Name is required");
    });
  });
});

describe("Update PUT", () => {
  describe("Berhasil mengupdate data Entitas Utama berdasarkan params id yang diberikan", () => {
    test("Should return status 200 and object  (id, name, description, price, stock, imgUrl, categoryId, authorId)", async () => {
      let { status, body } = await request(app)
        .put("/products/1")
        .send({
          name: "Test Parsley Seed Cleanser",
          description: "Test cleanser with gentle properties.",
          price: 100000,
          stock: 10,
          imgUrl:
            "https://dummyimage.com/600x400/cccccc/000000&text=Test+Cleanserg",
          categoryId: 1,
        })
        .set("Authorization", `Bearer ${access_token_valid_admin}`);
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("name", expect.any(String));
      expect(body).toHaveProperty("description", expect.any(String));
      expect(body).toHaveProperty("price", expect.any(Number));
      expect(body).toHaveProperty("stock", expect.any(Number));
      expect(body).toHaveProperty("imgUrl", expect.any(String));
      expect(body).toHaveProperty("categoryId", expect.any(Number));
      expect(body).toHaveProperty("authorId", expect.any(Number));
    });
  });

  describe("Gagal menjalankan fitur karena belum login", () => {
    test("Should return status 401 and Invalid Token", async () => {
      let { status, body } = await request(app).put("/products/1").send({
        name: "Test Parsley Seed Cleanser",
        description: "Test cleanser with gentle properties.",
      });
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });
  });

  describe("Gagal menjalankan fitur karena token yang diberikan tidak valid", () => {
    test("Should return status 401 and Invalid Token", async () => {
      let { status, body } = await request(app)
        .put("/products/1")
        .send({
          name: "Test Parsley Seed Cleanser",
          description: "Test cleanser with gentle properties.",
        })
        .set("Authorization", `Bearer ${access_token_invalid}`);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });
  });

  describe("Gagal karena id entity yang dikirim tidak terdapat di database", () => {
    test("Should return status 404 and Data not found", async () => {
      let { status, body } = await request(app)
        .put("/products/100")
        .send({
          name: "Test Parsley Seed Cleanser",
          description: "Test cleanser with gentle properties.",
        })
        .set("Authorization", `Bearer ${access_token_valid_admin}`);
      expect(status).toBe(404);
      expect(body).toHaveProperty("message", "Product with id 100 not found");
    });
  });

  describe("Gagal menjalankan fitur ketika Staff mengolah data entity yang bukan miliknya", () => {
    test("Should return status 403 and Forbidden access", async () => {
      let { status, body } = await request(app)
        .put("/products/1")
        .send({
          name: "Test Parsley Seed Cleanser",
          description: "Test cleanser with gentle properties.",
          price: 150000,
          stock: 8,
          imgUrl:
            "https://dummyimage.com/600x400/cccccc/000000&text=Test+Cleanserg",
          categoryId: 1,
        })
        .set("Authorization", `Bearer ${access_token_valid_staff}`);
      expect(status).toBe(403);
      expect(body).toHaveProperty("message", "You are not authorized");
    });
  });

  describe("Gagal ketika request body yang diberikan tidak sesuai", () => {
    test("Should return status 400 and Title is required!", async () => {
      let { status, body } = await request(app)
        .put("/products/5")
        .send({
          name: "",
          description: "Test cleanser with gentle properties.",
          price: 100000,
          stock: 10,
          imgUrl:
            "https://dummyimage.com/600x400/cccccc/000000&text=Test+Cleanserg",
          categoryId: 1,
        })
        .set("Authorization", `Bearer ${access_token_valid_admin}`);
      expect(status).toBe(400);
      expect(body).not.toHaveProperty("name", expect.any(String));
      expect(body).toHaveProperty("message", "Name is required");
    });
  });
});

describe("Delete", () => {
  describe("Berhasil menghapus data Entitas Utama berdasarkan params id yang diberikan", () => {
    test("Should return status 200 and Article with id 2 has been delete", async () => {
      let { status, body } = await request(app)
        .delete("/products/1")
        .set("Authorization", `Bearer ${access_token_valid_admin}`);
      expect(status).toBe(200);
      expect(body).not.toHaveProperty("id", expect.any(Number));
      expect(body).not.toHaveProperty("name", expect.any(String));
      expect(body).not.toHaveProperty("description", expect.any(String));
      expect(body).not.toHaveProperty("price", expect.any(Number));
      expect(body).not.toHaveProperty("stock", expect.any(Number));
      expect(body).not.toHaveProperty("imgUrl", expect.any(String));
      expect(body).not.toHaveProperty("categoryId", expect.any(Number));
      expect(body).not.toHaveProperty("authorId", expect.any(Number));
      expect(body).not.toHaveProperty(
        "message",
        `Product with id 1 has been deleted`
      );
    });
  });

  describe("Gagal menjalankan fitur karena belum login", () => {
    test("Should return status 401 and Invalid Token", async () => {
      let { status, body } = await request(app).delete("/products/2");
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", `Invalid token`);
    });
  });

  describe("Gagal menjalankan fitur karena token yang diberikan tidak valid", () => {
    test("Should return status 401 and Invalid Token", async () => {
      let { status, body } = await request(app)
        .delete("/products/2")
        .set("Authorization", `Bearer ${access_token_invalid}`);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", `Invalid token`);
    });
  });

  describe("Gagal karena id entity yang dikirim tidak terdapat di database", () => {
    test("Should return status 404 and Data not found", async () => {
      let { status, body } = await request(app)
        .delete("/products/100")
        .set("Authorization", `Bearer ${access_token_valid_admin}`);
      expect(status).toBe(404);
      expect(body).toHaveProperty("message", "Product with id 100 not found");
    });
  });

  describe("Gagal menjalankan fitur ketika Staff menghapus entity yang bukan miliknya", () => {
    test("Should return status 403 and Forbidden access", async () => {
      let { status, body } = await request(app)
        .delete("/products/2")
        .set("Authorization", `Bearer ${access_token_valid_staff}`);
      expect(status).toBe(403);
      expect(body).toHaveProperty("message", "You are not authorized");
    });
  });
});

describe("Endpoint  List pada public site", () => {
  describe("Berhasil mendapatkan Entitas Utama tanpa menggunakan query filter parameter", () => {
    test("Should return status 200 and array of object", async () => {
      let { status, body } = await request(app).get("/pub/products");
      expect(status).toBe(200);
      expect(body.data[0]).toHaveProperty("id", expect.any(Number));
      expect(body.data[0]).toHaveProperty("name", expect.any(String));
      expect(body.data[0]).toHaveProperty("description", expect.any(String));
      expect(body.data[0]).toHaveProperty("price", expect.any(Number));
      expect(body.data[0]).toHaveProperty("stock", expect.any(Number));
      expect(body.data[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(body.data[0]).toHaveProperty("categoryId", expect.any(Number));
      expect(body.data[0]).toHaveProperty("authorId", expect.any(Number));
    });
  });

  describe("Berhasil mendapatkan Entitas Utama dengan 1 query filter parameter", () => {
    test("Should return status 200 and array of object", async () => {
      let { status, body } = await request(app).get("/pub/products?filter=3");
      expect(status).toBe(200);
      expect(body.data[0]).toHaveProperty("id", expect.any(Number));
      expect(body.data[0]).toHaveProperty("name", expect.any(String));
      expect(body.data[0]).toHaveProperty("description", expect.any(String));
      expect(body.data[0]).toHaveProperty("price", expect.any(Number));
      expect(body.data[0]).toHaveProperty("stock", expect.any(Number));
      expect(body.data[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(body.data[0]).toHaveProperty("categoryId", expect.any(Number));
      expect(body.data[0]).toHaveProperty("authorId", expect.any(Number));
    });
  });

  describe("Berhasil mendapatkan  Entitas Utama serta panjang yang sesuai ketika memberikan page tertentu", () => {
    test("Should return status 200 and array of object", async () => {
      let { status, body } = await request(app).get(
        "/pub/products?page[size]=3&page[number]=1"
      );
      expect(status).toBe(200);
      expect(body.data[0]).toHaveProperty("id", expect.any(Number));
      expect(body.data[0]).toHaveProperty("name", expect.any(String));
      expect(body.data[0]).toHaveProperty("description", expect.any(String));
      expect(body.data[0]).toHaveProperty("price", expect.any(Number));
      expect(body.data[0]).toHaveProperty("stock", expect.any(Number));
      expect(body.data[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(body.data[0]).toHaveProperty("categoryId", expect.any(Number));
      expect(body.data[0]).toHaveProperty("authorId", expect.any(Number));
    });
  });
});

describe("Endpoint Detail pada public site", () => {
  describe("Berhasil mendapatkan 1  Entitas Utama sesuai dengan params id yang diberikan", () => {
    test("Should return status 200 and array of object", async () => {
      let { status, body } = await request(app).get("/pub/products/10");
      expect(status).toBe(200);
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("name", expect.any(String));
      expect(body).toHaveProperty("description", expect.any(String));
      expect(body).toHaveProperty("price", expect.any(Number));
      expect(body).toHaveProperty("stock", expect.any(Number));
      expect(body).toHaveProperty("imgUrl", expect.any(String));
      expect(body).toHaveProperty("categoryId", expect.any(Number));
      expect(body).toHaveProperty("authorId", expect.any(Number));
    });
  });

  describe("Gagal mendapatkan Entitas Utama karena params id yang diberikan tidak ada di database / invalid", () => {
    test("Should return status 200 and array of object", async () => {
      let { status, body } = await request(app).get("/pub/products/111");
      expect(status).toBe(404);
      expect(body).toHaveProperty("message", "Product with id 111 not found");
    });
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await queryInterface.bulkDelete("Products", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
