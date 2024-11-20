import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/UserModel.js";

const TokenVerification = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization ?? "";

    if (authHeader && authHeader.startsWith("Bearer")) {
      const bearerToken = authHeader.split(" ")[1];
      const tokenDecode = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);

      const user = await UserModel.findOne({
        _id: tokenDecode.id,
        status: true,
        is_deleted: false,
      });

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404);
        throw new Error("user not found");
      }
    } else {
      res.status(404);
      throw new Error("no token found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

export default TokenVerification;
