const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const { env } = require('~/config/environment')

// Configuration
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

const streamUpload = (fileBuffer, forderName) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: forderName },
      (error, result) => {
        if (result) {
          resolve(result)
        } else {
          reject(error)
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

const streamUploadFile = (fileBuffer, folderName, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        public_id: fileName, // ✅ đặt tên file ở đây
        resource_type: 'raw' // hoặc 'raw' nếu là PDF
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


export const cloudinaryProvider = {
  streamUpload,
  streamUploadFile
}