import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

export const uploadImageWithDetail = async (
  folder: string,
  fileBuffer: Express.Multer.File
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    // Read content from the file
    const fileName = uuidv4();

    const extension = fileBuffer.mimetype.replace("image/", "");

    // Setting up S3 upload parameters
    const params: any = {
      Bucket: BUCKET_NAME,
      Key: `${folder + fileName}.${extension}`, // File name you want to save as in S3
      Body: fileBuffer.buffer,
      ACL: "public-read",
      ContentType: fileBuffer.mimetype,
    };

    // Uploading files to the bucket
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        reject(err);
      }

      resolve(`${folder + fileName}.${extension}`);
    });
  });
};

export const uploadFileWithDetail = async (
  folder: string,
  fileBuffer: Express.Multer.File
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    // Read content from the file
    const fileName = uuidv4();

    const extension = fileBuffer.mimetype.replace("application/", "");

    // Setting up S3 upload parameters
    const params: any = {
      Bucket: BUCKET_NAME,
      Key: `${folder + fileName}.${extension}`, // File name you want to save as in S3
      Body: fileBuffer.buffer,
      ACL: "public-read",
      ContentType: fileBuffer.mimetype,
    };

    // Uploading files to the bucket
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        reject(err);
      }

      resolve(`${folder + fileName}.${extension}`);
    });
  });
};

export const uploadMultiFilesWithDetail = async (
  folder: string,
  fileBuffer: Express.Multer.File[],
  project_id: number
) => {
  //let links: string[] = [];
  let data: any = [];

  for (let i = 0; i < fileBuffer.length; ++i) {
    let link = await uploadFileWithDetail(folder, fileBuffer[i]);
    data.push({
      name: fileBuffer[i].originalname,
      type: "pdf",
      path: link,
      project_id,
    });
  }
  return data;
};

export const uploadAttachmentFileOrImage = async (
  folder: string,
  fileBuffer: Express.Multer.File
): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    // Read content from the file
    const fileName = uuidv4();

    const extension = fileBuffer.originalname.endsWith(".pdf")
      ? fileBuffer.mimetype.replace("application/", "")
      : fileBuffer.mimetype.replace("image/", "");

    // Setting up S3 upload parameters
    const params: any = {
      Bucket: BUCKET_NAME,
      Key: `${folder + fileName}.${extension}`, // File name you want to save as in S3
      Body: fileBuffer.buffer,
      ACL: "public-read",
      ContentType: fileBuffer.mimetype,
    };

    // Uploading files to the bucket
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        reject(err);
      }

      resolve({
        name: fileBuffer.originalname,
        type: extension,
        path: `${folder + fileName}.${extension}`,
      });
    });
  });
};
