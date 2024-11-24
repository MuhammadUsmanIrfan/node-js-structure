import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    upload_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_user",
    },
    single_upload_path: {
      type: String,
      default: "",
    },
    multi_upload_path: [
      {
        path:{
        type: String,
        default: "",
        }
      },
  ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UploadModel = mongoose.model("tbl_upload", uploadSchema);

export default UploadModel;
