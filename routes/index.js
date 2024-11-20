import express from "express";
import categoryRoutes from "./CategoryRoutes.js";
import userRoutes from "./UserRoutes.js";
import todoRoutes from "./TodoRoutes.js";
import UploadRoutes from "./UploadRoutes.js";

const app = express();

app.use("/", userRoutes); 
app.use("/category", categoryRoutes);
app.use("/todoroutes", todoRoutes);
app.use("/uploadroutes", UploadRoutes);

export default app;
