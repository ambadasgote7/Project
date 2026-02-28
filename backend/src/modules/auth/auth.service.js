import crypto from "crypto";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";
import bcrypt from "bcrypt";

//
// LOGIN
//
export const loginService = async ({ email, password }) => {

  if (!email || !password) {
    throw new Error("Email and password are required");
  }
 

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPassword = password.trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) throw new Error("Invalid credentials");

  if (user.accountStatus !== "active") {
    throw new Error("Account is not active");
  }

  if (user.passwordSetupToken) {
    throw new Error("Please complete password setup first");
  }

  if (!user.password) {
    throw new Error("Password not set");
  }

  const isMatch = await user.comparePassword(normalizedPassword);

  console.log("MATCH:", isMatch);

  if (!isMatch) throw new Error("Invalid credentials");

  await User.updateOne(
    { _id: user._id },
    { lastLoginAt: new Date() }
  );

  const token = generateToken(user);

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token,
    user: userObj
  };
};


//
// SET PASSWORD
//
export const setPasswordService = async ({ token, password }) => {
  if (!token || !password) {
    throw new Error("Token and password required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordSetupToken: hashedToken,
    passwordSetupExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  // Pre-save hook will hash
  user.password = password;

  user.passwordSetupToken = undefined;
  user.passwordSetupExpires = undefined;

  user.isRegistered = true;
  user.isVerified = true;

  await user.save();

  return {
    message: "Password set successfully"
  };
};


//
// LOGOUT
//
export const logoutService = async (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax"
  });
};


//
// GET ME
//
export const getMeService = async (user) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};