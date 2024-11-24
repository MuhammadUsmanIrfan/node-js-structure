import asyncHandler from "express-async-handler";
import CategoryModel from "../models/CategoryModel.js";
import AuthController from "./AuthController.js";

export default class CategoryController {
  static getCategories = asyncHandler(async (req, res) => {
    try {
      let page = req.query.page ? req.query.page : 1;
      let limit =
        req.query.limit && req.query.limit <= 20 ? req.query.limit : 2;

      page = Number(page);
      limit = Number(limit);

      let skip = 0;
      if (page >= 1) {
        skip = (page - 1) * limit;
      } else {
        res.status(400);
        throw new Error("Page should be greater than 0");
      }

      const getCategory = await CategoryModel.aggregate([
        {
          $match: {
            created_by: req.user._id,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 1,
            category_name: 1,
            created_by: 1,
            is_deleted: 1,
          },
        },
      ]);

      if (getCategory) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            201,
            "categories get successfuly",
            getCategory
          )
        );
      } else {
        res.status(400);
        throw new Error("Falied to create category");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static addCategory = asyncHandler(async (req, res) => {
    try {
      const { category_name } = req.body;

      if (!category_name) {
        res.status(404);
        throw new Error("name is required");
      }

      // check category already exist or not
      const checkCategory = await CategoryModel.findOne({
        category_name,
        is_deleted: false,
      });

      if (checkCategory) {
        res.status(400);
        throw new Error("category already existed");
      }

      const category = await CategoryModel.create({
        created_by: req.user._id,
        category_name,
      });

      if (category) {
        res.status(201);
        res.json(
          AuthController.generateResponse(
            201,
            "category has been created successfully",
            {
              id: category._id,
              created_by: category.created_by,
              category_name: category.category_name,
            }
          )
        );
      } else {
        res.status(400);
        throw new Error("Falied to create category");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static editCategory = asyncHandler(async (req, res) => {
    try {
      const { category_name, new_name } = req.body;

      if (!category_name || !new_name) {
        res.status(404);
        throw new Error("name is required");
      }

      const category = await CategoryModel.findOneAndUpdate(
        {
          category_name,
          created_by: req.user._id,
          is_deleted: false,
        },
        {
          category_name: new_name,
        },
        {
          new: true,
        }
      );

      if (category) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            201,
            "category updated successfully",
            {
              id: category._id,
              created_by: category.created_by,
              category_name: category.category_name,
            }
          )
        );
      } else {
        res.status(400);
        throw new Error("Falied to update category");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static deleteCategory = asyncHandler(async (req, res) => {
    try {
      const { category_name } = req.body;

      if (!category_name) {
        res.status(404);
        throw new Error("name is required");
      }

      const category = await CategoryModel.findOneAndUpdate(
        {
          category_name,
          created_by: req.user._id,
          is_deleted: false,
        },
        {
          is_deleted: true,
        },
        {
          new: true,
        }
      );

      if (category) {
        res.status(200);
        res.json(
          AuthController.generateResponse(201, "category delete successfully", {
            id: category._id,
            created_by: category.created_by,
            category_name: category.category_name,
            is_deleted: category.is_deleted,
          })
        );
      } else {
        res.status(400);
        throw new Error("Falied to delete category");
      }
    } catch (error) {
      throw new Error(error);
    }
  });
}
