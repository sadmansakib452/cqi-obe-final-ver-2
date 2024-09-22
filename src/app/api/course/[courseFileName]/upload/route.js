import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/minio";
import { NextResponse } from "next/server";
import path from "path";

// Disable Next.js's default body parsing to handle multipart data
export const config = {
  api: { bodyParser: false },
};

// Helper function to upload file to MinIO
async function uploadToMinIO(file, courseFileName) {
  const buffer = Buffer.from(await file.arrayBuffer()); // Convert the file to a buffer for upload

  const params = {
    Bucket: "course-files", // MinIO bucket where files are stored
    Key: `${courseFileName}/${file.name.replaceAll(" ", "_")}`, // Path in the bucket (e.g., course-folder/file-name)
    Body: buffer, // The file content
    ContentType: file.type, // File MIME type (e.g., application/pdf, text/plain)
  };

  try {
    // Upload file to MinIO
    await s3.send(new PutObjectCommand(params));
    console.log(`File uploaded successfully to MinIO: ${params.Key}`);
    return { success: true, message: "File uploaded successfully" };
  } catch (error) {
    console.error("MinIO upload error:", error.message);
    throw new Error("File upload to MinIO failed.");
  }
}

// API handler for file/text upload
export async function POST(req, { params }) {
  const { courseFileName } = params; // Get dynamic course file name from URL
  console.log(`Received upload request for course: ${courseFileName}`);

  try {
    // Parse formData from request (this handles both text and file uploads)
    const formData = await req.formData();

    // Get the file (if present) or the text
    const file = formData.get("file");
    const textData = formData.get("text");

    // Check if there is a file or text data
    if (file) {
      console.log(`File received: ${file.name}`);
      // Upload file to MinIO
      const uploadResult = await uploadToMinIO(file, courseFileName);
      return NextResponse.json(
        { message: uploadResult.message },
        { status: 200 },
      );
    } else if (textData) {
      console.log(`Text data received: ${textData}`);
      // Handle text uploads (convert to a .txt file and upload to MinIO)
      const textBuffer = Buffer.from(textData, "utf-8");
      const textFileName = `text_${Date.now()}.txt`; // Name the text file with timestamp

      const textParams = {
        Bucket: "course-files",
        Key: `${courseFileName}/${textFileName}`,
        Body: textBuffer,
        ContentType: "text/plain",
      };

      // Upload text file to MinIO
      await s3.send(new PutObjectCommand(textParams));
      console.log(`Text data uploaded successfully as ${textFileName}`);
      return NextResponse.json(
        { message: "Text uploaded successfully" },
        { status: 200 },
      );
    } else {
      // No file or text provided
      return NextResponse.json(
        { error: "No file or text uploaded" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error.message);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 },
    );
  }
}
