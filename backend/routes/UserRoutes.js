import express from "express";
import AccessController from "../controllers/AccessController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import {profileUpload} from "../middlewares/FileUploadMiddleware.js";
import passport from "passport";



const userRoutes = express.Router();

userRoutes.post("/signup",profileUpload.single("file") ,AccessController.userRegisterion);

userRoutes.post("/signin", AccessController.userLogin); 

userRoutes.post("/validate",AuthMiddleware,AccessController.validate); 


// send SMS OTP routes---------------------------------------------------
userRoutes.post("/getsmsotp",AuthMiddleware ,AccessController.getSmsOtp);

userRoutes.post("/verifynumber",AuthMiddleware ,AccessController.verifyNumber);
//------------------------------------------------------------------------

// Google auth routes--------------------------------------------------------------------------
userRoutes.get("/loginwithgoogle",passport.authenticate("google", {scope : ['profile', 'email']}));

userRoutes.get("/logoutfromgoogle", AccessController.logoutFromGoogle);

// userRoutes.get("/auth/google/callback", passport.authenticate('google', { successRedirect: `${process.env.FRONT_END_URL}login`, failureRedirect:`${process.env.FRONT_END_URL}login`}))

userRoutes.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/loginwithgoogle"}), AccessController.userLoginWithGoogle)
// ------------------------------------------------------------------------------------------------------------

// Authenticator app routes----------------------------------------
userRoutes.get("/getqrcode", AuthMiddleware, AccessController.getQrCode);

// userRoutes.post("/otpverification",AccessController.OtpVerification);
userRoutes.post("/otpverification", AuthMiddleware, AccessController.OtpVerification);

userRoutes.patch("/setusergoogleauth", AuthMiddleware, AccessController.setUserGoogleAuth);
//-----------------------------------------------------------------

userRoutes.get("/getuserdetails" ,AuthMiddleware, AccessController.getUserDetails);

userRoutes.patch("/edituserdetails" ,AuthMiddleware,profileUpload.single('file') ,AccessController.editUserDetails);

userRoutes.patch("/changeuserpassowrd" ,AuthMiddleware ,AccessController.changeUserPassowrd);

userRoutes.post("/emailverfication", AccessController.sendVerficationEmail);

userRoutes.get("/verify/:token", AccessController.verifyEmail);

userRoutes.delete("/deleteuser",AuthMiddleware, AccessController.deleteUser);

export default userRoutes;
