import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_user",
    },
    category_name: {
      type: String,
      require: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("tbl_category", categorySchema);

export default CategoryModel;
