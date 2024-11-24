import mongoose, { Schema } from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_user",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_category",
    },
    todo: {
      type: String,
      require: true,
    },
    is_completed: {
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

todoSchema.pre("findOneAndUpdate", function(next) {

   
  try {
    
    const update = this.getUpdate();

    if (update.is_completed === "true" || update.is_completed === "false") {
     
      update.is_completed ==="true" ? update.is_completed === true : update.is_completed === false

    } else
    {
      throw new Error("Invalid value")
    }
    next();  

  } catch (error) {
    throw new Error(error)
  }
  
});



const TodoModel = mongoose.model("tbl_todo", todoSchema);

export default TodoModel;
