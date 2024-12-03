import express from "express";
import TodoController from "../controllers/TodoController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const TodoRoutes = express.Router();

TodoRoutes.get("/gettodos", AuthMiddleware, TodoController.getTodos);

TodoRoutes.post("/searchtodo", AuthMiddleware, TodoController.searchTodos);

TodoRoutes.post("/addtodo", AuthMiddleware, TodoController.addTodo);

TodoRoutes.patch("/edittodo", AuthMiddleware, TodoController.editTodo);

TodoRoutes.patch("/setcompleted", AuthMiddleware, TodoController.setCompleted);

TodoRoutes.delete("/deletetodo", AuthMiddleware, TodoController.deleteTodo);

export default TodoRoutes;
