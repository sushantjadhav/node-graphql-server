const JWT = require("jsonwebtoken");
const keys = require("../configs/keys");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ error: "Toekn is not valid" });
  }

  try {
    const decodedToken = JWT.verify(token, keys.JWTSecret);
    req.user = decodedToken.user;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Toekn is not valid" });
  }
};
