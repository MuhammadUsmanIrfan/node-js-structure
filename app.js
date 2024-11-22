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
app.use(passport.initialize())
app.use(passport.session())

// Login with google config---------------------------------------------------------------------
passport.use(new googleStrategy({
  clientID:process.env.Client_ID,
  clientSecret:process.env.Client_Secert,
  callbackURL:`${process.env.CALLBACK_URL}${process.env.PORT}/auth/google/callback`,
},(accessToken, refreshToken, profile, done)=>{

   const user = {
    accessToken,
    profile
   } 
  return done(null, user)
}))
// ----------------------------------------------------------------------------------------------

passport.serializeUser((user, done)=> done(null, user))
passport.deserializeUser((user, done)=> done(null, user))



db_conntion();

app.use("/", routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
