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
function generateFileName(
  courseFileName,
  fileType,
  index = null,
  extension = "pdf",
) {
  return index !== null
    ? `${courseFileName}.${fileType}-${index}.${extension}` // Handle multiple files with index
    : `${courseFileName}.${fileType}.${extension}`; // Handle single file
}

// Helper function to upload file to MinIO
async function uploadToMinIO(file, courseFileName, fileName) {
  const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer for upload

  const params = {
    Bucket: "course-files", // MinIO bucket where files are stored
    Key: `${courseFileName}/${fileName}`, // Path in the bucket
    Body: buffer, // The file content
    ContentType: file.type, // File MIME type
  };

  try {
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
    const listParams = {
      Bucket: "course-files",
      Prefix: `${courseFileName}/`, // List all files in this folder
    };
    const listResult = await s3.send(new ListObjectsV2Command(listParams));

    const matchingFiles = listResult.Contents.filter((file) =>
      file.Key.startsWith(`${courseFileName}/${baseFileName}`),
    );

    if (matchingFiles.length > 0) {
      console.log(
        `🔍 Found ${matchingFiles.length} matching file(s) to delete:`,
      );
      for (const file of matchingFiles) {
        console.log(`🗑️ Deleting file: ${file.Key}`);
        const deleteParams = { Bucket: "course-files", Key: file.Key };
        await s3.send(new DeleteObjectCommand(deleteParams));
      }
    } else {
      console.log(`❌ No matching files found for base name: ${baseFileName}`);
    }
  } catch (error) {
    console.error("❌ Error deleting files in MinIO:", error.message);
  }
}

// Helper function to handle file uploads (single or multiple)
async function handleFileUpload(
  fileData,
  courseFileName,
  baseFileName,
  isSingleFileUpload,
) {
  const files = fileData ? Object.entries(fileData) : [];

  if (isSingleFileUpload) {
    // Handle single file upload
    const [key, file] = files[0];
    if (file instanceof File) {
      const fileName = generateFileName(
        courseFileName,
        baseFileName,
        null,
        "pdf",
      );
      console.log(`📂 Uploading single file: ${file.name} as ${fileName}`);
      await uploadToMinIO(file, courseFileName, fileName);
    }
  } else {
    // Handle multiple file upload
    for (let [key, file] of files) {
      if (file instanceof File) {
        const fileName = generateFileName(courseFileName, key, null, "pdf");
        console.log(`📂 Uploading file: ${file.name} as ${fileName}`);
        await uploadToMinIO(file, courseFileName, fileName);
      }
    }
  }
}

// API handler for file/text upload
export async function POST(req, { params }) {
  const { courseFileName } = params;
  console.log(`📥 Received upload request for course: ${courseFileName}`);

  try {
    // Parse formData from request
    const formData = await req.formData();

    // Log all formData entries to inspect incoming data
    for (const [key, value] of formData.entries()) {
      console.log(
        `🔍 FormData entry: ${key} = ${value instanceof File ? "[File]" : value}`,
      );
    }

    // Extract file type
    const fileType = formData.get("fileType");

    if (!fileType) {
      console.error("❌ File type is missing in the request");
      return NextResponse.json(
        { error: "File type is required" },
        { status: 400 },
      );
    }

    const baseFileName = `${courseFileName}.${fileType}`;

    // Delete existing files if necessary
    await deleteMatchingFiles(courseFileName, baseFileName);

    // Determine whether it's a single file upload or multiple file uploads
    let isSingleFileUpload = false;

    const fileData = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Collect all file entries into fileData
        fileData[key] = value;
        if (key === "file") {
          isSingleFileUpload = true; // If "file" key is present, it's a single file upload
        }
      }
    }

    if (Object.keys(fileData).length > 0) {
      console.log(
        `📂 Processing ${Object.keys(fileData).length} file(s) for upload...`,
      );
      await handleFileUpload(
        fileData,
        courseFileName,
        fileType,
        isSingleFileUpload,
      );

      return NextResponse.json(
        { message: "Files uploaded successfully" },
        { status: 200 },
      );
    }

    // Handle text uploads
    const textData = formData.get("text");
    if (textData) {
      console.log(`📄 Text data received: ${textData}`);
      const textBuffer = Buffer.from(textData, "utf-8");
      const textFileName = generateFileName(
        courseFileName,
        fileType,
        null,
        "txt",
      );

      const textParams = {
        Bucket: "course-files",
        Key: `${courseFileName}/${textFileName}`,
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
    console.error("❌ No file or text provided in the request");
    return NextResponse.json(
      { error: "No file or text uploaded" },
      { status: 400 },
    );
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 },
    );
  }
}
