import asyncHandler from "express-async-handler";
import AuthController from "./AuthController.js";
import TodoModel from "../models/TodoModel.js";
import CategoryModel from "../models/CategoryModel.js";
import  mongoose from 'mongoose';

class TodoController {
  static getTodos = asyncHandler(async (req, res) => {
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

      const getTodos = await TodoModel.aggregate([
        {
          $match: {
            created_by: req.user._id,
            is_deleted: false,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "tbl_categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
            pipeline: [
              {
                $match: {
                  is_deleted: false,
                },
              },
              {
                $project: {
                  is_deleted: 0,
                  __v: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            is_deleted: 0,
            __v: 0,
          },
        },
      ]);
      const totalTodoCount = await TodoModel.aggregate([
        {
          $match: {
            created_by: req.user._id,
            is_deleted: false
          },
        },
        {
          $count : "total_Todos"
        },
      ])

      const nbPages = Math.ceil( totalTodoCount[0].total_Todos / limit)
      if (getTodos) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            201,
            "todos get successfuly",
            { getTodos,
              total_Todos:totalTodoCount[0]?.total_Todos,
              nbPages
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

  static searchTodos = asyncHandler(async (req, res) => {
    try {
      
      const {search_todo} = req.body
      const search_query = {}

      if(search_todo)
      {
        search_query.todo = { $regex: search_todo, $options: "i"}
      }
      const getTodos = await TodoModel.aggregate([
        {
          $match: {
            created_by: req.user._id,
            is_deleted: false,
            ...search_query
          },
        },
        {
          $lookup: {
            from: "tbl_categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
            pipeline: [
              {
                $match: {
                  is_deleted: false,
                },
              },
              {
                $project: {
                  is_deleted: 0,
                  __v: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            is_deleted: 0,
            __v: 0,
          },
        },
      ]);

      
      if (getTodos) {
        res.status(200);
        res.json(
          AuthController.generateResponse(
            201,
            "todos search is successfuly",
            {getTodos}
          )
        );
      } else {
        res.status(400);
        throw new Error("Falied to search todos");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static addTodo = asyncHandler(async (req, res) => {
    try {
      const { content, category } = req.body;

      if (!content || !category) {
        res.status(404);
        throw new Error("content and category are required");
      }

      const currentCategory = await CategoryModel.findOne({
        category_name: category,
        created_by: req.user._id,
        is_deleted: false,
      });
      if (currentCategory) {
        const todo = await TodoModel.create({
          created_by: req.user._id,
          category: currentCategory._id,
          todo: content,
        });

        res.status(201);
        res.json(
          AuthController.generateResponse(201, `Todo successfully added`, {
            _id: todo._id,
            created_by: todo.created_by,
            category: todo.category,
            todo: todo.todo,
          })
        );
      } else {
        res.status(404);
        throw new Error("category not found");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static editTodo = asyncHandler(async (req, res) => {
    try {
      const { editTodoID, newTodo } = req.body;

      if (!editTodoID || !newTodo) {
        res.status(404);
        throw new Error("todo id and new todo are required");
      }

      const todo = await TodoModel.findOneAndUpdate(
        { _id: editTodoID, created_by: req.user._id, is_deleted: false },
        { todo: newTodo },
        { new: true }
      );

      if (todo) {
        res.status(200);
        res.json(
          AuthController.generateResponse(200, `Edit todo is Successful`, {
            _id: todo._id,
            created_by: todo.created_by,
            category: todo.category,
            todo: todo.todo,
          })
        );
      } else {
        res.status(400);
        throw new Error("failed to edit todo");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static setCompleted = asyncHandler(async (req, res) => {
    try {
      let { editTodoID, value } = req.body;

      if (!editTodoID || !value) {
        res.status(404);
        throw new Error("todo id and value are required");
      }

      // if (value !== "true" && value !== "false") {
      //   res.status(400);
      //   throw new Error("value can only be true or false");
      // }

      // if (value == "true") {
      //   value = true;
      // } else if (value == "false") {
      //   value = false;
      // }

      const todo = await TodoModel.findOneAndUpdate(
        { _id: editTodoID, created_by: req.user._id, is_deleted: false },
        { is_completed: value },
        { new: true }
      );

      if (todo) {
        res.status(200);
        res.json(
          AuthController.generateResponse(200, `todo is completed`, {
            _id: todo._id,
            created_by: todo.created_by,
            category: todo.category,
            todo: todo.todo,
            is_completed: todo.is_completed,
          })
        );
      } else {
        res.status(400);
        throw new Error("failed to set todo");
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  static deleteTodo = asyncHandler(async (req, res) => {
    try {
      const { todoID } = req.body;

      if (!todoID) {
        res.status(404);
        throw new Error("todo id is required");
      }

     const todo = await TodoModel.findOneAndUpdate(
      {_id: todoID, created_by: req.user._id, is_deleted: false},
      { is_deleted: true },
      { new: true} 
    );
    
    if (todo) {
        res.status(200);
        res.json(
          AuthController.generateResponse(200, `todo deleted Successful`, {
            _id: todo._id,
            created_by: todo.created_by,
            category: todo.category,
            todo: todo.todo,
            is_deleted: todo.is_deleted,
          })
        );
      } else {
        res.status(400);
        throw new Error("failed to edit todo");
      }
    } catch (error) {
      console.log("error ",error);      throw new Error(error);
    }
  });
}
export default TodoController;
