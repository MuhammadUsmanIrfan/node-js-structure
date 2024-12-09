import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as googleStrategy} from "passport-google-oauth20";
import path from "path";
import { fileURLToPath } from "url";
import db_conntion from "./config/DbConnection.js";
import errorHandler from "./middlewares/ErrorMiddleware.js";
import routes from "./routes/index.js";
import cors from "cors";
// import UserModel from "./models/UserModel.js";
// import AccessController from "./controllers/AccessController.js";

const app = express();
const port = process.env.PORT;

const currentPath = fileURLToPath(import.meta.url);
const curentDirname = path.dirname(currentPath);

const corsOpts = {
  origin: "*",
};

app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "25mb" }));
app.use("/uploads",  express.static(path.join(curentDirname, "uploads")));

app.use(session({
  secret:"MYSECRETKEY",
  resave:false,
  saveUninitialized:true
}))

// Login with google config---------------------------------------------------------------------
app.use(passport.initialize())
app.use(passport.session())

// passport.use(new googleStrategy({
//   clientID:process.env.Client_ID,
//   clientSecret:process.env.Client_Secert,
//   callbackURL:`${process.env.CALLBACK_URL}${process.env.PORT}/auth/google/callback`,
//   scope:["profile", "email"]
// },async(accessToken, refreshToken, profile, done)=>{
      
//       try {
       
//         const user =await UserModel.findOne({googleId: profile.id})
//         if(!user)
//         {
//           const user = await UserModel.create({
//             googleId: String(profile.id),
//             first_name: profile.displayName,
//             last_name: profile.displayName,
//             email: profile.emails[0].value,
//             password: "google-login-password",
//             is_verified: true,
//             profile_image: profile.photos[0].value
//           });
//         } 

//         return done(null, user)

//       } catch (error) {
//         return done(error, null)
//       }
    
//   }
// ))
passport.use(new googleStrategy({
  clientID:process.env.Client_ID,
  clientSecret:process.env.Client_Secert,
  callbackURL:`${process.env.CALLBACK_URL}${process.env.PORT}/auth/google/callback`,
  scope:["profile", "email"],
},(accessToken, refreshToken, profile, done)=>{

   const user = {
    accessToken,
    profile
   } 
  return done(null, user)
}))

passport.serializeUser((user, done)=> done(null, user))
passport.deserializeUser((user, done)=> done(null, user))

// ----------------------------------------------------------------------------------------------




db_conntion();

app.use("/", routes);

// Testing google login User data---------------
// app.get("/googlelogin/sucess",(req,res)=>{
//       console.log("req is--->", req.user)
// })
// --------------------------------

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
