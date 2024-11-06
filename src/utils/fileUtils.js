import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const generateSignedUrl = async (bucketName, filePath) => {
  const client = new S3Client();
  const command = new GetObjectCommand({ Bucket: bucketName, Key: filePath });
  const signedUrl = await client.getSignedUrl(command, { expiresIn: 900 });
  return signedUrl;
};

// File: src/utils/fileUtils.js

/**
 * Checks if a file is viewable based on its extension.
 *
 * @param {string} filePath - The path or URL of the file.
 * @returns {boolean} - True if the file is viewable, else false.
 */
export const isViewable = (filePath) => {
  const viewableExtensions = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".bmp",
  ];
  return viewableExtensions.some((ext) =>
    filePath.toLowerCase().endsWith(ext)
  );
};

