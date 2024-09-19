// minioClient.js
const Minio = require("minio");

// Configuration for MinIO local instance (you can change these settings for AWS S3 later)
const minioClient = new Minio.Client({
  endPoint: "localhost", // Change this to your AWS S3 endpoint for cloud deployment
  port: 9000, // MinIO default port; set to null for AWS
  useSSL: false, // Set to true for AWS or any SSL-enabled MinIO deployment
  accessKey: "minioadmin", // Replace with your AWS_ACCESS_KEY when moving to AWS
  secretKey: "minioadmin", // Replace with your AWS_SECRET_KEY when moving to AWS
});

// Bucket name (this will hold all your course files)
const bucketName = "course-files";

// Function to ensure the bucket exists, or create it if not
minioClient.bucketExists(bucketName, (err, exists) => {
  if (err) {
    console.error("Error checking bucket existence:", err);
    return;
  }

  if (!exists) {
    // Create the bucket if it doesn't exist
    minioClient.makeBucket(bucketName, "us-east-1", (err) => {
      if (err) {
        console.error("Error creating bucket:", err);
        return;
      }
      console.log(`Bucket '${bucketName}' created successfully.`);
    });
  } else {
    console.log(`Bucket '${bucketName}' already exists.`);
  }
});

// Export the MinIO client for use in your Next.js API routes
module.exports = minioClient;
