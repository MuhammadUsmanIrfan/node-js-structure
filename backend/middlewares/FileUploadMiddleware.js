import multer from "multer"
import path from "path"
import md5 from "md5";

  const singleStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
     // Naming the file
    filename: function (req, file, cb) {
        const uniqueFileName = md5(Date.now() + req.user_id)
        cb(null, uniqueFileName + path.extname(file.originalname));
    }
    });

  const multiStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
  
    filename: function (req, file, cb) {
        const uniqueFileName = md5(Date.now())
        cb(null, uniqueFileName + path.extname(file.originalname));
    }
    });

    const sinleUpload = multer({
        storage: singleStorage,
        limits: { fileSize: 20 * 1024 * 1024 }, 
        fileFilter: (req, file, cb) => {
         
          const fileTypes = /jpeg|jpg|png|gif/;
          const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
          const mimetype = fileTypes.test(file.mimetype);
      
          if (extname && mimetype) {
            return cb(null, true);
          } else {
            cb(new Error("Only image files are allowed"), false);
          }
        }
      });

    const profileUpload = multer({
        storage: multiStorage,
        limits: { fileSize: 20 * 1024 * 1024 }, 
        fileFilter: (req, file, cb) => {
         
          const fileTypes = /jpeg|jpg|png|gif/;
          const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
          const mimetype = fileTypes.test(file.mimetype);
      
          if (extname && mimetype) {
            return cb(null, true);
          } else {
            cb(new Error("Only image files are allowed"), false);
          }
        }
      });

    const multiUpload = multer({
        storage: multiStorage,
        limits: { fileSize: 20 * 1024 * 1024 }, 
        fileFilter: (req, file, cb) => {
         
          const fileTypes = /jpeg|jpg|png|gif/;
          const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
          const mimetype = fileTypes.test(file.mimetype);
      
          if (extname && mimetype) {
            return cb(null, true);
          } else {
            cb(new Error("Only image files are allowed"), false);
          }
        }
      });

export  {sinleUpload, multiUpload, profileUpload}
