const { User } = require("../../../models");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
  it("should populate req.user with the payload of the valid JWT", async () => {
    const user = await User.findByPk(1);
    token = user.generateAccessToken();

    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${token}`),
      originalUrl: "",
    };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);
    expect(req.user.id).toBe(user.id);
  });
});
