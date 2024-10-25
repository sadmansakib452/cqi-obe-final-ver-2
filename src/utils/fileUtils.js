import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const generateSignedUrl = async (bucketName, filePath) => {
  const client = new S3Client();
  const command = new GetObjectCommand({ Bucket: bucketName, Key: filePath });
  const signedUrl = await client.getSignedUrl(command, { expiresIn: 900 });
  return signedUrl;
};
