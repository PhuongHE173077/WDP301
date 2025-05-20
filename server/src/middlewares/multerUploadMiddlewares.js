const multer = require("multer")
const { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } = require("~/utils/validators")

const customizFileFilter = (req, file, cb) => {
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    cb(errorMessage, null)
  }
  return cb(null, true)
}

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customizFileFilter
})

export const multerUploadMiddlewares = { upload }