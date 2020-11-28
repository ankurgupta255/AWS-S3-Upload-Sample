const AWS = require("aws-sdk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;

const BUCKET_NAME = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: REGION,
});

// const params = {
//     Bucket: BUCKET_NAME,
//     CreateBucketConfiguration: {
//         // Set your region here
//         LocationConstraint: process.env.AWS_REGION
//     }
// };

// s3.createBucket(params, (err, data) => {
//     if (err) console.log(err, err.stack);
//     else console.log('Bucket Created Successfully', data.Location);
// });

exports.uploadFile = async (
  fileBuffer,
  folderLocation = process.env.AWS_S3_ROOT_PATH
) => {
  return new Promise((resolve, reject) => {
    // Read content from the file
    const fileName = uuidv4();
    // Setting up S3 upload parameters

    const extension = fileBuffer.mimetype.replace("image/", "");

    const params = {
      Bucket: BUCKET_NAME,
      Key: `${folderLocation}${fileName}.${extension}`, // File name you want to save as in S3
      Body: fileBuffer.buffer,
      ACL: "public-read",
      ContentType: fileBuffer.mimetype,
    };

    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }
      console.log(
        `File uploaded successfully. ${folderLocation}${fileName}.${extension}`
      );
      resolve(`${folderLocation}${fileName}.${extension}`);
    });
  });
};
