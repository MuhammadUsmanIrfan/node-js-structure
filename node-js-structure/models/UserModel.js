import mongoose from "mongoose";
import { passwordEncrypt} from "../utils/PasswordHandler.js";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    password_2f_secret: {
      type: String,
      default: "",
    },
    profile_image: {
      type: String,
      default: "",
    },
    phone_num: {
      number:{
        type:Number,
        unique: true,
        default:0
      },
      number_verified:{
        type:Boolean,
        default:false
      },
      number_otp:{
        type: Number,
        default: '0000'
      }
    },
    status: {
      type: Boolean,
      default: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  
  if (!this.isModified("password")) {
    return next(); 
  }

  try {
    this.password =  await passwordEncrypt( this.password);
    next();

  } catch (error) {
    throw new Error(error)
  }
});




const UserModel = mongoose.model("tbl_user", userSchema);

export default UserModel;
