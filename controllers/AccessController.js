import asyncHandler from "express-async-handler";
import UserModel from "../models/UserModel.js";
import AuthController from "./AuthController.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import QrAuthData from "../utils/QrCodeGenerater.js";
import userOtpVerification from "../utils/OtpVerification.js";
import {
  passwordEncrypt,
  passwordVerification,
} from "../utils/PasswordHandler.js";
import twilio from "twilio";
import fs from "fs";

export default class AccessController {
  static userRegisterion = asyncHandler(async (req, res) => {
    try {
      const { first_name, last_name, email, password, phone_num } = req.body;

      if (!first_name || !last_name || !email || !password) {
        res.status(404);
        throw new Error("all fields are required");
      }

      const query = {
        email,
        status: true,
        is_deleted: false,
      };

      if (req.body?.phone_num) {
        query["phone_num.number"] = req.body.phone_num;
      }

      const checkUser = await UserModel.findOne({ email, is_deleted: false });

      if (checkUser) {
        res.status(409);
        throw new Error("user with this details already exist");
      }
      if (checkUser?.phone_num?.number == phone_num) {
        res.status(409);
        throw new Error("user with this phone number already exist");
      }

      const user = await UserModel.create({
        first_name,
        last_name,
        email,
        password,
        profile_image: req?.file?.filename
          ? `uploads/${req?.file?.filename}`
          : "",
        phone_num: phone_num ? { number: phone_num } : { number: 0 },
      });

      res.status(201);
      res.json(
        AuthController.generateResponse(
          201,
          "User has been created successfully",
          {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_image: user.profile_image,
            phone_num: user.phone_num.number,
            google_auth: user.google_auth,
          }
        )
      );
    } catch (error) {
      throw new Error(error);
    }
  });

  static userLogin = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(404);
        throw new Error("all fields are required");
      }

      // check email already exist or not
      const user = await UserModel.findOne({
        email,
        status: true,
        is_deleted: false,
      });

      if (user) {
        const verifyPassword = await passwordVerification(
          password,
          user.password
        );
        if (verifyPassword) {
          const token = AuthController.tokenGenerator(user._id);

          res.status(200);
          res.json(
            AuthController.generateResponse(
              200,
              "User has been login successfully",
              {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                google_auth: user.google_auth,
              },
              token
            )
          );
        } else {
          res.status(400);
          throw new Error("Email or password wrong");
        }
      } else {
        res.status(400);
        throw new Error("Email or password wrong");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static validate = asyncHandler(async (req, res) => {
    try {
      if (req.user) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            200,
            "User has been vlidate successfully",
            {
              id: req.user._id,
              first_name: req.user.first_name,
              last_name: req.user.last_name,
              email: req.user.email,
              profile_image: req.user.profile_image,
              phone_num: req.user.phone_num,
              is_verified: req.user.is_verified,
              status: req.user.status,
              google_auth: req.user.google_auth,
            }
          )
        );
      } else {
        res.status(400);
        throw new Error("invalid token");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  // send SMS OTP logic--------------------------------------------
  static getSmsOtp = asyncHandler(async (req, res) => {
    try {
      const { number } = req.body;

      if (!number) {
        res.status(404);
        throw new Error("number is required");
      }
      const client = new twilio(
        process.env.Account_SID,
        process.env.Auth_Token
      );

      const digits = "0123456789";
      let OTP = "";

      for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }

      const message = await client.messages.create({
        body: `Your OTP is ${OTP} for verification`,
        from: `${process.env.TWILLIO_NUMBER}`,
        to: `${number}`,
      });

      if (message) {
        const user = await UserModel.findOneAndUpdate(
          {
            _id: req.user._id,
            is_deleted: false,
          },
          { $set: { "phone_num.number_otp": Number(OTP) } },
          { new: true }
        );

        if (user) {
          res.status(200);
          res.json(
            AuthController.generateResponse(200, "otp sent successfully", {
              id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              message_id: message.sid,
            })
          );
        } else {
          res.status(400);
          throw new Error("Failed to add otp");
        }
      } else {
        res.status(400);
        throw new Error("Failed to send sms otp");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static verifyNumber = asyncHandler(async (req, res) => {
    try {
      const { otp } = req.body;

      if (!otp) {
        res.status(404);
        throw new Error("otp is required");
      }

      const userOtp = String(req.user.phone_num.number_otp);

      if (Number(otp) === Number(userOtp)) {
        const user = await UserModel.findOneAndUpdate(
          {
            _id: req.user._id,
            is_deleted: false,
          },
          { $set: { "phone_num.number_verified": true } },
          { new: true }
        );

        if (user) {
          res.status(200);
          res.json(
            AuthController.generateResponse(
              200,
              "phone number successfully verified",
              {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                number_verified: user.phone_num.number_verified,
              }
            )
          );
        } else {
          res.status(400);
          throw new Error("Failed to verify");
        }
      } else {
        res.status(400);
        throw new Error("invalid otp");
      }
    } catch (error) {
      throw new Error(error);
    }
  });
  //---------------------------------------------------------------

  // Authenticator app logic---------------------------------------
  static getQrCode = asyncHandler(async (req, res) => {
    try {
      if (QrAuthData) {
        const addKey = await UserModel.findOneAndUpdate(
          { _id: req.user._id, is_deleted: false },
          { password_2f_secret: QrAuthData.key.ascii },
          { new: true }
        );

        const qrcode = QrAuthData.qrcodeData;
        if (addKey) {
          res.status(200);
          res.json(
            AuthController.generateResponse(
              200,
              "Qr code successfuly generated",
              { qrcode }
            )
          );
        } else {
          res.status(400);
          throw new Error("failed to add QR code");
        }
      } else {
        res.status(400);
        throw new Error("Failed to create QR code");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static OtpVerification = asyncHandler(async (req, res) => {
    try {
      const { user_otp } = req.body;
      if (!user_otp) {
        res.status(400);
        throw new Error("otp is required");
      }

      const user = await UserModel.findOne({
        _id: req.user._id,
        is_deleted: false,
      });

      if (user) {
        const key = user.password_2f_secret;

        const verfiy_otp = userOtpVerification(user_otp, key);

        if (verfiy_otp) {
          res.status(200);
          res.json(
            AuthController.generateResponse(200, "user successfuly verified", {
              id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              profile_image: user.profile_image != "" ? user.profile_image : "",
            })
          );
        } else {
          res.status(400);
          throw new Error("user failed to verfiy");
        }
      } else {
        res.status(404);
        throw new Error("user not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  });
  //---------------------------------------------------------------

  // Login with Google logic --------------------------------------------
  static userLoginWithGoogle = asyncHandler(async (req, res) => {
    try {
      if (!req.user) {
        res.status(400);
        throw new Error("Failed to get user details");
      }
      const userEmail = req.user.profile.emails[0].value;

      // Check if email is already exsited in our system or not
      const checkUser = await UserModel.findOne({
        email: userEmail,
        is_deleted: false,
      });

      if (checkUser) {
        const token = AuthController.tokenGenerator(checkUser._id);
        return res.redirect("http://localhost:5173/login?token=" + token);
      } else {
        const user = await UserModel.create({
          first_name: req.user.profile._json.given_name,
          last_name: req.user.profile._json.family_name,
          email: req.user.profile._json.email,
          password: "google-login",
          is_verified: true,
          profile_image: req.user.profile._json.picture,
        });

        const token = AuthController.tokenGenerator(user._id);

        res.redirect("http://localhost:5173?token=" + token);
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static setUserGoogleAuth = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { user_value } = req.body;
      const updateUser = await UserModel.findByIdAndUpdate(
        userId,
        { google_auth: user_value },
        {
          new: true,
        }
      );

      if (updateUser) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            201,
            "User google auth app is successfully set",
            {
              id: updateUser._id,
              first_name: updateUser.first_name,
              last_name: updateUser.last_name,
              email: updateUser.email,
              profile_image: updateUser?.profile_image,
              google_auth: updateUser?.google_auth,
            }
          )
        );
      } else {
        res.status(400);
        throw new Error("failed to update user data");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static logoutFromGoogle = asyncHandler(async (req, res) => {
    try {
      req.logOut(() => {});
      res.status(200);
      res.json(
        AuthController.generateResponse(200, "user sucessfully logout", {})
      );
    } catch (error) {
      throw new Error(error);
    }
  });
  //---------------------------------------------------------------------

  static getUserDetails = asyncHandler(async (req, res) => {
    try {
      const user = await UserModel.findOne({
        _id: req.user._id,
        status: true,
        is_deleted: false,
      });

      if (user) {
        const token = AuthController.tokenGenerator(user._id);

        res.status(200);
        res.json(
          AuthController.generateResponse(
            201,
            "User details get successfully",
            {
              id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              profile: user?.profile_image,
              google_auth: user.google_auth,
            },
            token
          )
        );
      } else {
        res.status(404);
        throw new Error("failed to get user details");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static editUserDetails = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const updateData = {};

      if (req?.file?.filename) {
        updateData["profile_image"] = `uploads/${req.file.filename}`;
        fs.unlink(req?.user?.profile_image, () => {});
      }

      if (req.body?.first_name) {
        updateData["first_name"] = req.body.first_name;
      }

      if (req.body?.last_name) {
        updateData["last_name"] = req.body.last_name;
      }

      for (const key in req.body) {
        if (
          req.body[key] == undefined ||
          req.body[key] == null ||
          req.body[key] == "is_verified" ||
          req.body[key] == "is_deleted" ||
          req.body[key] == "status" ||
          req.body[key] == "password"
        ) {
          res.status(400);
          throw new Error("Invalid user details");
        }
      }

      if (req.body.number) {
        updateData.phone_num = {
          number: req.body.number,
          number_verified: false,
          number_otp: "",
        };
      }

      const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (updateUser) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            200,
            "User details updated successfully",
            {
              id: updateUser._id,
              first_name: updateUser.first_name,
              last_name: updateUser.last_name,
              email: updateUser.email,
              profile_image: updateUser?.profile_image,
            }
          )
        );
      } else {
        res.status(400);
        throw new Error("failed to update user data");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static changeUserPassowrd = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { old_password, new_password } = req.body;

      if (!old_password || !new_password) {
        res.status(404);
        throw new Error("password is required");
      }

      const checkOldPassword = await passwordVerification(
        old_password,
        req.user.password
      );

      if (checkOldPassword) {
        const password = await passwordEncrypt(new_password);

        const updateUser = await UserModel.findByIdAndUpdate(
          userId,
          { $set: { password: password } },
          { new: true }
        );
        if (updateUser) {
          res.status(200);
          res.json(
            AuthController.generateResponse(
              200,
              "User details updated successfully",
              {
                id: updateUser._id,
                first_name: updateUser.first_name,
                last_name: updateUser.last_name,
                email: updateUser.email,
                profile_image: updateUser?.profile_image,
              }
            )
          );
        } else {
          res.status(400);
          throw new Error("failed to update user data");
        }
      } else {
        res.status(400);
        throw new Error("your old password is wrong");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static sendVerficationEmail = asyncHandler(async (req, res) => {
    try {
      const { userEmail } = req.body;
      if (!userEmail) {
        res.status(404);
        throw new Error("user email is required");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      const token = AuthController.tokenGenerator(userEmail);

      const mailConfigurations = {
        from: "borne.heart321@gmail.com",

        to: userEmail,

        subject: "Email Verification",

        text: `Hi! There, You have recently visited 
                   our website and entered your email.
                   Please follow the given link to verify your email
                   http://localhost:${process.env.PORT}/verify/${token} 
                   Thanks`,
      };

      const userEmailSend = await transporter.sendMail(mailConfigurations);

      if (userEmailSend) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            201,
            "verfication email sent successfully",
            {
              mailInfo: userEmailSend?.envelope,
            }
          )
        );
      } else {
        res.status(400);
        throw new Error(`Failed to send verfication email`);
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static verifyEmail = asyncHandler(async (req, res) => {
    try {
      const { token } = req.params;
      if (!token) {
        res.status(404);
        throw new Error("verfication token missing");
      }

      const { id } = jwt.verify(String(token), process.env.JWT_SECRET_KEY);

      if (id) {
        const verifyUserEmail = await UserModel.findOneAndUpdate(
          { email: id },
          { is_verified: true },
          { new: true }
        );

        if (verifyUserEmail) {
          res.status(200);
          res.redirect(`${process.env.FRONT_END_URL}`);
          // res.json(
          // AuthController.generateResponse(
          //     200,
          //     "email is successfully verified",
          //  )
          // );
        } else {
          res.status(400);
          res.redirect(`${process.env.FRONT_END_URL}login`);
        }
      } else {
        res.status(400);
        throw new Error(`something went wrong with verification token`);
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static deleteUser = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const updateUser = await UserModel.findByIdAndUpdate(
        userId,
        { is_deleted: true },
        { new: true }
      );

      if (updateUser) {
        res.status(200);
        res.json(
          AuthController.generateResponse(201, "User deleted successfully")
        );
      } else {
        res.status(400);
        throw new Error("failed to delete data");
      }
    } catch (error) {
      throw new Error(error);
    }
  });
}
