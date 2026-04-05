import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    req.userId = decode.userId;
    next();
  } catch {
    return res
      .status(401)
      .json({ status: 401, msg: "Token expired or Invalid" });
  }
};
