import asyncHandler from "express-async-handler";
import UploadModel from "../models/UploadsModel.js"
import AuthController from "./AuthController.js";


class UploadController 
{
    static uploadFile = asyncHandler(async (req, res)=>{
        
        try {
           
            const fileUpload = await UploadModel.create({
            upload_by : req.user._id,
            upload_path : `/uploads/${req?.file.filename}`
            })

            if(fileUpload)
            {
                res.status(201)
                res.json(AuthController.generateResponse(
                    201, "File successfuly uploaded",
                    {
                        id : fileUpload._id,
                        upload_by : fileUpload.upload_by, 
                        file_path : fileUpload.upload_path, 
                    }
                ))
            }else
            {
                res.status(400)
                throw new Error("failed to upload file")
            }
            
        } catch (error) {
            throw new Error(error)
        }

    })
    
    static multiUploadFile = asyncHandler(async (req, res)=>{
        
        try {
            const fileUpload = await UploadModel.create({
            upload_by : req.user._id,
            multi_upload_path : req?.files.map((data)=>({
                path: `/uploads/${data.filename}`
            }))
            })

            if(fileUpload)
            {
                res.status(201)
                res.json(AuthController.generateResponse(
                    201, "File successfuly uploaded",
                    {
                        id : fileUpload._id,
                        upload_by : fileUpload.upload_by, 
                        file_path : fileUpload, 
                    }
                ))
            }else
            {
                res.status(400)
                throw new Error("failed to upload file")
            }
            
        } catch (error) {
            throw new Error(error)
        }

    })

    static uploadFile = asyncHandler(async (req, res)=>{
        
        try {
           
            const fileUpload = await UploadModel.create({
            upload_by : req.user._id,
            upload_path : `/uploads/${req?.file.filename}`
            })

            if(fileUpload)
            {
                res.status(201)
                res.json(AuthController.generateResponse(
                    201, "File successfuly uploaded",
                    {
                        id : fileUpload._id,
                        upload_by : fileUpload.upload_by, 
                        file_path : fileUpload.upload_path, 
                    }
                ))
            }else
            {
                res.status(400)
                throw new Error("failed to upload file")
            }
            
        } catch (error) {
            throw new Error(error)
        }

    })
}

export default UploadController