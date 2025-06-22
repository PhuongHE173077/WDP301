const multer = require("multer")
const { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } = require("~/utils/validators")

const customizFileFilter = (req, file, cb) => {

  return cb(null, true)
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customizFileFilter
})



export const multerUploadMiddlewares = { upload }