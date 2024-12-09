import express from "express";
import UploadController from "../controllers/UploadController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import {sinleUpload, multiUpload} from "../middlewares/FileUploadMiddleware.js";

const UploadRoutes = express.Router();

UploadRoutes.post("/uploadfile", AuthMiddleware ,sinleUpload.single("file"), UploadController.uploadFile)
UploadRoutes.post("/uploadmultifile", AuthMiddleware ,multiUpload.array("files", 10), UploadController.multiUploadFile)



export default UploadRoutes