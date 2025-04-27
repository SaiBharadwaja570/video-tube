import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadOnCloudinary = async (localFilePath) => {
    try {
      if(!localFilePath){
        return null;
      }
      
      // Upload on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      })
      // has been uploaded successfully
      console.log("File uploaded successfully!!!")
      console.log(response.url);

      // debugging
      fs.unlink(localFilePath, (err) => {
        if (err) {
            console.error("Error deleting local file:", err);
        } else {
            console.log("Local file deleted successfully.");
        }
    });


      return response;
    } catch (error) {
      fs.unlinkSync(localFilePath); // remove the locally saved temporay file
      return null;
    }
  }

export {uploadOnCloudinary}