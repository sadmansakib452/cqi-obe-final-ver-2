// Import necessary AWS S3 client and Next.js utilities
import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import s3 from "@/lib/minio";
import { NextResponse } from "next/server";
import {
  updateSingleFileMetadata,
  updateMultipleFileMetadata,
} from "@/lib/mongodbUtils"; // Import MongoDB utility functions

// -------- Step 1: Allowed Configurations --------
const allowedFileConfigurations = {
  MID: {
    allowedMimeTypes: ["application/pdf", "application/msword", "text/plain"],
    maxSizeInBytes: 5 * 1024 * 1024, // 5 MB limit
  },
  QUIZ: {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  "FINAL-GRADES": {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  QUESTION: {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  HIGHEST: {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  AVERAGE: {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  MARGINAL: {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  "OBE-SUMMARY": {
    allowedMimeTypes: ["application/pdf", "application/msword", "text/plain"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  ASSIGNMENT: {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  LAB: {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
  "COURSE-OUTLINE": {
    allowedMimeTypes: ["application/pdf", "application/msword"],
    maxSizeInBytes: 3 * 1024 * 1024, // 3 MB limit
  },
};

// -------- Step 2: Utility Functions --------

// Utility: Convert text data to a File-like object
function convertTextToFile(data, fileType) {
  if (typeof data === "string") {
    const fileName = `${fileType}.txt`;
    const file = new File([data], fileName, { type: "text/plain" });
    console.log(`📝 Converted text data to File: ${fileName}`);
    return file;
  }
  return data; // Return as-is if already a File
}

// Utility: Validate file extension and size based on category configuration
function validateFileExtensionAndMimeType(file, category) {
  const config = allowedFileConfigurations[category];

  if (!config) {
    throw new Error(`Unknown file category: ${category}`);
  }

  const { allowedMimeTypes, maxSizeInBytes } = config;

  // Validate file type
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type} for category: ${category}`,
    );
  }

  // Validate file size
  if (file.size > maxSizeInBytes) {
    throw new Error(
      `File size exceeds the limit for category ${category}. Maximum allowed size is ${
        maxSizeInBytes / (1024 * 1024)
      } MB.`,
    );
  }

  console.log(
    `✅ File type and size validation passed for category ${category}`,
  );
  return true;
}

// Utility: Generate a unique file name based on course info and file type
function generateFileName(
  courseFileName,
  fileType,
  index = null,
  extension = null,
) {
  const match = fileType.match(/^(Mid|Quiz|Final)/i);
  const prefix = match ? match[1] : "";
  const actualFileType =
    (fileType.match(/\.(QUESTION|AVERAGE|MARGINAL|HIGHEST)$/i) ||
      [])[1]?.toUpperCase() || null;

  const needsIndex = prefix !== "FINAL"; // Only Mid and Quiz need an index

  const finalExtension = extension || "pdf"; // Default to "pdf" if no extension is provided
  return needsIndex && index !== null
    ? `${courseFileName}.${prefix}-${index}.${actualFileType}.${finalExtension}`
    : `${courseFileName}.${fileType}.${finalExtension}`;
}

// Utility: Upload file to MinIO storage
async function uploadToMinIO(file, bucketName, filePath) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const params = {
    Bucket: bucketName,
    Key: filePath,
    Body: buffer,
    ContentType: file.type,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    console.log(`✅ File uploaded successfully to MinIO: ${filePath}`);
    return { success: true, message: "File uploaded successfully" };
  } catch (error) {
    console.error(`❌ MinIO upload error for ${filePath}:`, error.message);
    throw new Error("File upload to MinIO failed.");
  }
}

// Utility: Delete matching files from MinIO storage
async function deleteMatchingFiles(courseFileName, baseFileName) {
  const bucketName = "course-files";
  try {
    const listParams = { Bucket: bucketName, Prefix: `${courseFileName}/` };
    const listResult = await s3.send(new ListObjectsV2Command(listParams));

    // Filter files that match the base file name
    const matchingFiles = listResult.Contents.filter((file) =>
      file.Key.startsWith(`${courseFileName}/${baseFileName}`),
    );

    if (matchingFiles.length > 0) {
      console.log(
        `🔍 Found ${matchingFiles.length} matching file(s) to delete:`,
      );
      for (const file of matchingFiles) {
        console.log(`🗑️ Deleting file: ${file.Key}`);
        const deleteParams = { Bucket: bucketName, Key: file.Key };
        await s3.send(new DeleteObjectCommand(deleteParams));
      }
    } else {
      console.log(`❌ No matching files found for base name: ${baseFileName}`);
    }
  } catch (error) {
    console.error("❌ Error deleting files in MinIO:", error.message);
  }
}

// -------- Step 3: File Handling Functions --------

// Function: Handle single file upload
async function handleSingleFileUpload(file, courseFileName, fileType) {
  const extension = file.type === "text/plain" ? "txt" : "pdf";
  const fileName = generateFileName(courseFileName, fileType, null, extension);
  console.log(`📂 Uploading single file: ${file.name} as ${fileName}`);
  validateFileExtensionAndMimeType(file, fileType.toUpperCase());
  await uploadToMinIO(file, "course-files", `${courseFileName}/${fileName}`);
}

// Function: Handle multiple file uploads
async function handleMultipleFileUploads(fileData, courseFileName) {
  const files = fileData ? Object.entries(fileData) : [];
  const uploadedFilesMetadata = [];

  for (let [key, file] of files) {
    if (file instanceof File) {
      const fileType = key.split(".")[1];
      const isFinalExam = key.startsWith("FINAL");
      const indexMatch = key.match(/(MID|QUIZ)-(\d+)\./);
      const index = indexMatch ? indexMatch[2] : null;

      validateFileExtensionAndMimeType(file, fileType);
      const extension = file.type === "text/plain" ? "txt" : "pdf";
      const fileName = generateFileName(courseFileName, key, index, extension);
      console.log(`📂 Uploading file: ${file.name} as ${fileName}`);
      await uploadToMinIO(
        file,
        "course-files",
        `${courseFileName}/${fileName}`,
      );

      if (!isFinalExam) {
        uploadedFilesMetadata.push({
          index,
          [fileType.toLowerCase()]: `${courseFileName}/${fileName}`,
        });
      } else {
        uploadedFilesMetadata.push({
          [fileType.toLowerCase()]: `${courseFileName}/${fileName}`,
        });
      }
    }
  }

  return uploadedFilesMetadata;
}

// -------- Step 4: API Handlers --------

// API Handler: Handle POST requests for file uploads
export async function POST(req, { params }) {
  const { courseFileName } = params;
  console.log(`📥 Received upload request for course: ${courseFileName}`);

  try {
    const formData = await req.formData();
    const fileType = formData.get("fileType");
    const userId = formData.get("userId");

    console.log("File Type: ", fileType);
    console.log("User Id: ", userId);

    if (!fileType || !userId) {
      
      console.error("❌ File type or userId is missing in the request");
      return NextResponse.json(
        { error: "File type and userId are required" },
        { status: 400 },
      );
    }

    const baseFileName = `${courseFileName}.${fileType}`;
    await deleteMatchingFiles(courseFileName, baseFileName);

    let isSingleFileUpload = false;
    const fileData = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && key === "text") {
        const convertedFile = convertTextToFile(value, fileType);
        fileData.file = convertedFile;
        isSingleFileUpload = true;
      } else if (value instanceof File) {
        fileData[key] = value;
        if (key === "file") {
          isSingleFileUpload = true;
        }
      }
    }

    let uploadedFilePath;
    if (isSingleFileUpload) {
      console.log("📂 Processing single file upload...");
      const file = fileData.file;
      await handleSingleFileUpload(file, courseFileName, fileType);
      uploadedFilePath = `${courseFileName}/${generateFileName(courseFileName, fileType, null, file.type === "text/plain" ? "txt" : "pdf")}`;
      await updateSingleFileMetadata(
        courseFileName,
        userId,
        fileType,
        uploadedFilePath,
      );
    } else if (Object.keys(fileData).length > 0) {
      console.log(
        `📂 Processing ${Object.keys(fileData).length} file(s) for upload...`,
      );
      const uploadedFilesMetadata = await handleMultipleFileUploads(
        fileData,
        courseFileName,
      );
      const examType = fileType.toLowerCase().includes("mid")
        ? "midExams"
        : fileType.toLowerCase().includes("quiz")
          ? "quizExams"
          : "finalExam";
      await updateMultipleFileMetadata(
        courseFileName,
        userId,
        examType,
        uploadedFilesMetadata,
      );
    } else {
      console.error("❌ No file provided in the request");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Files uploaded successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 },
    );
  }
}

// API Handler: Placeholder for GET requests (can be expanded if needed)
export async function GET(req, { params }) {
  return NextResponse.json(
    { message: "GET request processed" },
    { status: 200 },
  );
}
