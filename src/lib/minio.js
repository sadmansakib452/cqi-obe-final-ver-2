// src/lib/minio.js
import { S3Client } from "@aws-sdk/client-s3";

// Initialize MinIO (S3 compatible) client using AWS SDK v3
const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000", // MinIO server URL
  region: "us-east-1", // Set a region (doesn't matter for MinIO but required by AWS SDK)
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  },
  forcePathStyle: true, // Required for MinIO to handle bucket path correctly
});

export default s3;
