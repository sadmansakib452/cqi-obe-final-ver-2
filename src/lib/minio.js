// // src/lib/minio.js
// import { S3Client } from "@aws-sdk/client-s3";

// // Initialize MinIO (S3 compatible) client using AWS SDK v3
// const s3 = new S3Client({
//   endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000", // MinIO server URL
//   region: "us-east-1", // Set a region (doesn't matter for MinIO but required by AWS SDK)
//   credentials: {
//     accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
//     secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
//   },
//   forcePathStyle: true, // Required for MinIO to handle bucket path correctly
// });

// export default s3;

import { S3Client } from "@aws-sdk/client-s3";

// Initialize MinIO (S3 compatible) client using AWS SDK v3
const s3 = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_MINIO_URL || "http://minio:9000", // Use the public MinIO URL
  region: "us-east-1", // Set a region (doesn't matter for MinIO but required by AWS SDK)
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY || "AdminUser123",
    secretAccessKey:
      process.env.NEXT_PUBLIC_MINIO_SECRET_KEY || "StrongPass#2024!",
  },
  forcePathStyle: true, // Required for MinIO to handle bucket path correctly
});

export default s3;
