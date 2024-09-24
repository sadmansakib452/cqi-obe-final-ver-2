import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import s3 from "@/lib/minio";
import { NextResponse } from "next/server";

// Disable Next.js's default body parsing to handle multipart data
export const config = {
  api: { bodyParser: false },
};

// Helper function to generate unique file names based on course information
function generateFileName(courseFileName, fileType, extension = "pdf") {
  return `${courseFileName}.${fileType}.${extension}`;
}

// Helper function to upload file to MinIO
async function uploadToMinIO(file, courseFileName, fileName) {
  const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer for upload

  const params = {
    Bucket: "course-files", // MinIO bucket where files are stored
    Key: `${courseFileName}/${fileName}`, // Path in the bucket (e.g., '2024.1.CSE487-3/2024.1.CSE487-3.OBE-SUMMARY.pdf')
    Body: buffer, // The file content
    ContentType: file.type, // File MIME type (e.g., 'application/pdf')
  };

  try {
    // Upload file to MinIO
    await s3.send(new PutObjectCommand(params));
    console.log(`✅ File uploaded successfully to MinIO: ${params.Key}`);
    return { success: true, message: "File uploaded successfully" };
  } catch (error) {
    console.error("❌ MinIO upload error:", error.message);
    throw new Error("File upload to MinIO failed.");
  }
}

// Helper function to delete existing files that match the base name
async function deleteMatchingFiles(courseFileName, baseFileName) {
  try {
    // List all files in the course folder
    const listParams = {
      Bucket: "course-files",
      Prefix: `${courseFileName}/`, // List all files in this folder
    };
    const listResult = await s3.send(new ListObjectsV2Command(listParams));

    // Filter files that match the base file name (ignoring extensions)
    const matchingFiles = listResult.Contents.filter((file) =>
      file.Key.startsWith(`${courseFileName}/${baseFileName}`),
    );

    if (matchingFiles.length > 0) {
      console.log(
        `🔍 Found ${matchingFiles.length} matching file(s) to delete:`,
      );
      for (const file of matchingFiles) {
        console.log(`🗑️ Deleting file: ${file.Key}`);
        const deleteParams = {
          Bucket: "course-files",
          Key: file.Key,
        };
        await s3.send(new DeleteObjectCommand(deleteParams));
      }
    } else {
      console.log(`❌ No matching files found for base name: ${baseFileName}`);
    }
  } catch (error) {
    console.error("❌ Error deleting files in MinIO:", error.message);
  }
}

// API handler for file/text upload
export async function POST(req, { params }) {
  const { courseFileName } = params; // Get dynamic course file name from URL
  console.log(`📥 Received upload request for course: ${courseFileName}`);

  try {
    // Parse formData from request (handles both text and file uploads)
    const formData = await req.formData();

    // Get the file (if present) or the text
    const file = formData.get("file");
    const textData = formData.get("text");

    // Define the type of file upload (e.g., 'OBE-SUMMARY', 'Instructor-Feedback', etc.)
    const fileType = formData.get("fileType"); // Expecting the frontend to send this for each type of upload

    // Ensure fileType is provided
    if (!fileType) {
      console.error("❌ File type is missing in the request");
      return NextResponse.json(
        { error: "File type is required" },
        { status: 400 },
      );
    }

    // Generate the base file name (without extension)
    const baseFileName = `${courseFileName}.${fileType}`;

    // Delete any existing files with the same base file name (e.g., PDF or text)
    console.log(
      `🔍 Checking for existing files with base name: ${baseFileName}`,
    );
    await deleteMatchingFiles(courseFileName, baseFileName);

    // Handle file uploads (PDF or text)
    if (file) {
      const pdfFileName = generateFileName(courseFileName, fileType, "pdf");
      console.log(`📂 File received: ${file.name}`);

      // Upload the new PDF file to MinIO
      const uploadResult = await uploadToMinIO(
        file,
        courseFileName,
        pdfFileName,
      );
      return NextResponse.json(
        { message: uploadResult.message },
        { status: 200 },
      );
    }
    // Handle text uploads (e.g., .txt files)
    else if (textData) {
      console.log(`📄 Text data received: ${textData}`);
      const textBuffer = Buffer.from(textData, "utf-8");
      const textFileName = generateFileName(courseFileName, fileType, "txt");

      // Upload the new text file to MinIO
      const textParams = {
        Bucket: "course-files",
        Key: `${courseFileName}/${textFileName}`, // Path in MinIO
        Body: textBuffer,
        ContentType: "text/plain",
      };

      await s3.send(new PutObjectCommand(textParams));
      console.log(`✅ Text data uploaded successfully as ${textFileName}`);
      return NextResponse.json(
        { message: "Text uploaded successfully" },
        { status: 200 },
      );
    }
    // No file or text provided
    else {
      console.error("❌ No file or text provided in the request");
      return NextResponse.json(
        { error: "No file or text uploaded" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 },
    );
  }
}
