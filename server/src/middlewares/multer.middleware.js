import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, "job_portal_" + Date.now()+ "_" + file.originalname ) 
    }
  })
  
export const upload = multer({ 
    storage, 
})