const { User } = require("../../../models/");
const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV;
const config = require("../../../config/config")[env];

describe("User Authentication", () => {
  afterEach(async () => {
    await User.destroy({ where: { username: "John Doe" } });
  });

  it("should return a valid access token", async () => {
    const user = await User.create({
      username: "John Doe",
      password: "johndoe",
      email: "johndoe@gmail.com",
    });
    const token = user.generateAccessToken();
    const decoded = jwt.verify(token, config.secret);
    expect(decoded).toMatchObject({ id: user.id });
  });

  it("should return a valid refresh token", async () => {
    const user = await User.create({
      username: "John Doe",
      password: "johndoe",
      email: "johndoe@gmail.com",
    });
    const token = user.generateRefreshToken();
    const decoded = jwt.verify(token, config.rtSecret);
    expect(decoded).toMatchObject({ id: user.id });
  });

  it("should return a valid verification token", async () => {
    const user = await User.create({
      username: "John Doe",
      password: "johndoe",
      email: "johndoe@gmail.com",
    });
    const token = user.generateVerificationToken();
    const decoded = jwt.verify(token, config.veriSecret);
    expect(decoded).toMatchObject({ id: user.id });
  });
});
