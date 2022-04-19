const request = require("supertest");
const { User, Store } = require("../../models");

let server;

describe("/api/stores", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(() => {
    server.close();
  });

  describe("GET /", () => {
    it("should return all stores by current user", async () => {
      const user = await User.findByPk(1);
      const res = await request(server)
        .get("/api/stores/")
        .set("Authorization", `Bearer ${user.generateAccessToken()}`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("should return a store if valid id is passed", async () => {
      const res = await request(server).get("/api/stores/1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("currency");
      expect(res.body).toHaveProperty("userId");
      expect(res.body).toHaveProperty("products");
    });

    it("should return 404 if no store with given id exists", async () => {
      const res = await request(server).get("/api/stores/10000");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let store;
    let token;

    const exec = async () => {
      return await request(server)
        .post("/api/stores/")
        .set("Authorization", `Bearer ${token}`)
        .send(store);
    };

    beforeEach(async () => {
      const user = await User.findByPk(1);
      token = user.generateAccessToken();
      store = { name: "MF Stores" };
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if store already exists", async () => {
      store = { name: "MF Inc" };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if validation fails", async () => {
      store = { name: "MF" };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return the store if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name", store.name);
    });

    it("should save store if it is valid", async () => {
      await exec();
      store = await Store.findOne({ where: { name: "MF Stores" } });
      expect(store).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    let newName;
    let token;
    let id;

    const exec = async () => {
      const user = await User.findByPk(1);
      return await request(server)
        .put("/api/stores/" + id)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: newName });
    };

    beforeEach(async () => {
      const user = await User.findByPk(1);
      token = user.generateAccessToken();
      id = 2;
      newName = "MF Stores Inc.";
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if store ID is invalid", async () => {
      id = 1000;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if validation fails", async () => {
      newName = "MF";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should update the store if it is valid", async () => {
      await exec();
      store = await Store.findOne({ where: { name: "MF Stores Inc." } });
      expect(store).not.toBeNull();
    });

    it("should return the updated store if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /:id", () => {
    let id;
    let token;

    const exec = async () => {
      const user = await User.findByPk(1);
      return await request(server)
        .delete("/api/stores/" + id)
        .set("Authorization", `Bearer ${token}`)
        .send();
    };

    beforeEach(async () => {
      const user = await User.findByPk(1);
      token = user.generateAccessToken();
      id = 2;
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if store ID is invalid", async () => {
      id = 1000;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 200 if store is valid", async () => {
      const res = await exec();
      store = await Store.findByPk(id);
      expect(res.status).toBe(200);
      expect(store).toBeNull();
    });

    it("should return 200 if store is deleted", async () => {
      const res = await exec();
    });
  });
});
