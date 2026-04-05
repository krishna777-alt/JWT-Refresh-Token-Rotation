import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token";

export const register = async function (req, res) {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  res.json(user);
};

export const login = async function (req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(403);

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(401).json({ msg: "invalid creds" });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const hashedToken = hashToken(refreshToken);

  user.refreshTokens.push({
    token: hashedToken,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, //true in production
    sameSite: "Strict",
  });

  res.json({ accessToken });
};

export const refresh = async function (req, res) {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ msg: "No token" });

  const hashed = hashToken(token);

  let decode;

  try {
    decode = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired", error });
  }
  const user = await User.findById(decode.userId);

  const storedToken = user.refreshTokens.find((t) => t.token === hashed);
  if (!storedToken) {
    user.refreshTokens = []; //logout everyWhere

    await user.save();

    return res.status(403).json({ msg: "Reuse detected! Logged out" });
  }
  //Remove Old Token(Rotation)
  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashToken);

  const newRefreshToken = generateRefreshToken(user._id);
  const newHashed = hashToken(newRefreshToken);

  user.refreshTokens.push({
    token: newHashed,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  await user.save();

  const newAccessToken = generateAccessToken(user._id);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });

  res.json({ accessToken: newAccessToken });
};

export const logout = async function (req, res) {
  const token = req.cookies.refreshToken;
  const hashed = hashToken(token);

  const user = await User.findOne({
    "refreshTokens.token": hashed,
  });
  if (user) {
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashed);
    await user.save();
  }

  res.clearCookie("refreshToken");
  res.json({ msg: "Logged out" });
};
