import express from "express";
import AccessController from "../controllers/AccessController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import {profileUpload} from "../middlewares/FileUploadMiddleware.js";
import passport from "passport";
// import { Strategy as googleStrategy} from "passport-google-oauth20";


const userRoutes = express.Router();

userRoutes.get("/",AccessController.homePage);

userRoutes.post("/signup",profileUpload.single("file") ,AccessController.userRegisterion);

userRoutes.post("/signin", AccessController.userLogin);

// Google auth routes------------------------------------------------------------------------------------------
userRoutes.get("/loginwithgoogle",passport.authenticate("google", {scope : ['profile', 'email']}));
userRoutes.get("/logoutfromgoogle", AccessController.logoutFromGoogle);

userRoutes.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/loginwithgoogle"}), AccessController.userLoginWithGoogle)
// ------------------------------------------------------------------------------------------------------------

// Authenticator app routes----------------------------------------
userRoutes.get("/getqrcode", AuthMiddleware, AccessController.getQrCode);

userRoutes.post("/otpverification", AuthMiddleware, AccessController.OtpVerification);
//-----------------------------------------------------------------

userRoutes.get("/getuserdetails" ,AuthMiddleware, AccessController.getUserDetails);

userRoutes.patch("/edituserdetails" ,AuthMiddleware,profileUpload.single('file') ,AccessController.editUserDetails);

userRoutes.post("/emailverfication", AccessController.sendVerficationEmail);

userRoutes.get("/verify/:token", AccessController.verifyEmail);

userRoutes.delete("/deleteuser",AuthMiddleware, AccessController.deleteUser);

export default userRoutes;