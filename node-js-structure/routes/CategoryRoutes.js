import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/getcategories", AuthMiddleware, CategoryController.getCategories);

categoryRoutes.post( "/addcategory", AuthMiddleware, CategoryController.addCategory);

categoryRoutes.patch( "/editcategory", AuthMiddleware, CategoryController.editCategory);

categoryRoutes.delete("/deletecategory",AuthMiddleware,CategoryController.deleteCategory);

export default categoryRoutes;
