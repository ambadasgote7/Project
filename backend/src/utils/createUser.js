import crypto from "crypto";
import User from "../models/User.js";

const createUserWithToken = async ({
  email,
  role,
  referenceId,
  referenceModel,
  createdBy,
  expiresInHours = 48
}) => {
  // Generate raw token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash token for DB storage
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expireDate = new Date(
    Date.now() + expiresInHours * 60 * 60 * 1000
  );

  const user = await User.create({
    email,
    role,
    referenceId,
    referenceModel,
    createdBy,

    password: null,
    isRegistered: false,
    isVerified: false,

    passwordSetupToken: hashedToken,
    passwordSetupExpires: expireDate
  });

  return {
    user,
    rawToken // send this via email
  };
};

export default createUserWithToken;