// src/app/api/course/create/route.js
import s3 from "@/lib/minio"; // Import the MinIO client configured with credentials
import { Upload } from "@aws-sdk/lib-storage"; // Import the Upload helper

export async function POST(req) {
  try {
    // Parse request body to extract courseFileName
    const { courseFileName } = await req.json();

    // Validate that courseFileName is provided
    if (!courseFileName || typeof courseFileName !== "string") {
      console.error("Invalid or missing courseFileName.");
      return new Response(
        JSON.stringify({ error: "Invalid or missing courseFileName" }),
        { status: 400 },
      );
    }

    // Parameters for creating an empty folder in MinIO
    const params = {
      Bucket: "course-files", // Name of the bucket
      Key: `${courseFileName}/`, // The key that creates a "folder" in S3 by ending with '/'
      Body: "", // Empty body to signify folder
    };

    // Use @aws-sdk/lib-storage's Upload function for handling the stream properly
    const upload = new Upload({
      client: s3, // MinIO S3 client
      params: params, // Upload parameters
    });

    // Execute the upload
    await upload.done();

    // Log success and return a success response
    console.log(
      `✅ Folder "${courseFileName}/" created successfully in MinIO.`,
    );
    return new Response(
      JSON.stringify({
        message: `Folder "${courseFileName}/" created successfully`,
      }),
      { status: 200 },
    );
  } catch (error) {
    // Log the actual access key being used
    const accessKey = process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY;

    // Handle errors during the operation
    if (error.name === "InvalidAccessKeyId") {
      console.error(
        `❌ Invalid Access Key ID provided to MinIO: ${error.message}. Access Key used: ${accessKey}`,
      );
      return new Response(
        JSON.stringify({
          error: "Invalid Access Key ID for MinIO",
          accessKeyUsed: accessKey,
        }),
        { status: 403 },
      );
    }

    if (error.name === "AccessDenied") {
      console.error(
        `❌ Access denied for creating folder in MinIO: ${error.message}`,
      );
      return new Response(
        JSON.stringify({ error: "Access denied to create folder" }),
        { status: 403 },
      );
    }

    if (error.name === "NoSuchBucket") {
      console.error("❌ Specified bucket does not exist:", error.message);
      return new Response(JSON.stringify({ error: "Bucket does not exist" }), {
        status: 404,
      });
    }

    // Handle generic or unexpected errors
    console.error("❌ Unexpected error creating folder in MinIO:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create folder",
        details: error.message,
      }),
      { status: 500 },
    );
  }
}
