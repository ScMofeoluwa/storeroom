const request = require("supertest");
const { User } = require("../../../models");

let server;

describe("auth middleware", () => {
  let token;
  beforeEach(async () => {
    server = require("../../../index");
    const user = await User.findByPk(1);
    token = user.generateAccessToken();
  });
  afterEach(() => {
    server.close();
  });

  const exec = () => {
    return request(server)
      .post("/api/stores")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Store" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 201 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });
});
