// src/app/api/course/create/route.js
import s3 from "@/lib/minio";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req) {
  try {
    const { courseFileName } = await req.json();

    // Parameters for creating an empty folder in MinIO
    const params = {
      Bucket: "course-files", // Bucket name
      Key: `${courseFileName}/`, // Create a folder with the course name (folders are created by adding "/" to the key)
    };

    // Use PutObjectCommand to create the folder
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Return success response
    return new Response(JSON.stringify({ message: "Folder created" }), {
      status: 200,
    });
  } catch (error) {
    // Handle error during upload
    console.error("Error creating folder in MinIO:", error);
    return new Response(JSON.stringify({ error: "Failed to create folder" }), {
      status: 500,
    });
  }
}
