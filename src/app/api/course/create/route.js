// src/app/api/course/create/route.js
import s3 from "@/lib/minio"; // Import the MinIO client configured with credentials
import { Upload } from "@aws-sdk/lib-storage"; // Import the Upload helper
import db from "prisma/index";

// Helper function to check if a course file already exists in MongoDB
async function courseFileExists(courseFileName, userId) {
  // Add userId here
  console.log(
    `🔍 Task 1.1: Checking if courseFileName exists in MongoDB: ${courseFileName} for user: ${userId}`,
  );
  const existingCourseFile = await db.courseFiles.findUnique({
    where: {
      courseFileName_userId: {
        courseFileName: courseFileName,
        userId: userId, // Include userId in the query
      },
    },
  });
  return existingCourseFile;
}

// Helper function to create a folder in MinIO
async function createFolderInMinIO(courseFileName) {
  console.log(`📂 Task 2.1: Creating folder "${courseFileName}" in MinIO`);
  const params = {
    Bucket: "course-files", // MinIO bucket
    Key: `${courseFileName}/`, // "Folder" in MinIO (ending with '/')
    Body: "", // Empty body to create a folder
  };

  const upload = new Upload({
    client: s3, // MinIO S3 client
    params: params,
  });

  await upload.done();
  console.log(`✅ Folder "${courseFileName}" created successfully in MinIO`);
}

// Helper function to create a course file entry in MongoDB
async function createCourseFileInMongoDB(courseFileName, userId) {
  console.log(
    `🗄️ Task 3.1: Creating a new course file entry in MongoDB for: ${courseFileName}`,
  );

  const newCourseFile = await db.courseFiles.create({
    data: {
      courseFileName: courseFileName,
      userId: userId, // Associate with user
      finalGrades: null,
      summaryObe: null,
      insFeedback: null,
      courseOutline: null,
      isCompleted: false, // Initial state
      // Omit empty arrays for nested fields at creation
    },
  });

  console.log(
    `✅ Course file "${courseFileName}" created successfully in MongoDB`,
  );
  return newCourseFile;
}

export async function POST(req) {
  try {
    // Parse request body to extract courseFileName and userId
    const { courseFileName, userId } = await req.json();

    // Task 1: Validate the inputs
    if (!courseFileName || typeof courseFileName !== "string") {
      console.error("❌ Task 1.2: Invalid or missing courseFileName.");
      return new Response(
        JSON.stringify({ error: "Invalid or missing courseFileName" }),
        { status: 400 },
      );
    }

    if (!userId || typeof userId !== "string") {
      console.error("❌ Task 1.2: Invalid or missing userId.");
      return new Response(
        JSON.stringify({ error: "Invalid or missing userId" }),
        { status: 400 },
      );
    }

    // Task 1.1: Check if the course file already exists in MongoDB
    const existingCourseFile = await courseFileExists(courseFileName, userId); // Pass userId here

    // If the course file already exists, return a conflict response
    if (existingCourseFile) {
      console.error(
        `❌ Task 1.3: Course file "${courseFileName}" already exists in MongoDB.`,
      );
      return new Response(
        JSON.stringify({ error: "Course file already exists." }),
        { status: 409 }, // Conflict status
      );
    }

    // Task 2: Proceed to create the folder in MinIO
    try {
      await createFolderInMinIO(courseFileName); // Task 2.1: Create folder in MinIO
    } catch (minioError) {
      console.error(
        "❌ Task 2.2: Failed to create folder in MinIO:",
        minioError.message,
      );
      return new Response(
        JSON.stringify({
          error: "Failed to create folder in MinIO",
          details: minioError.message,
        }),
        { status: 500 },
      );
    }

    // Task 3: Proceed to create the course file entry in MongoDB
    try {
      const newCourseFile = await createCourseFileInMongoDB(
        courseFileName,
        userId,
      ); // Task 3.1
      return new Response(
        JSON.stringify({
          message: `Course file "${courseFileName}" created successfully`,
          courseFile: newCourseFile,
        }),
        { status: 201 }, // Created status
      );
    } catch (mongoError) {
      console.error(
        "❌ Task 3.2: Failed to create course file in MongoDB:",
        mongoError.message,
      );
      return new Response(
        JSON.stringify({
          error: "Failed to create course file in MongoDB",
          details: mongoError.message,
        }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(
      "❌ Unexpected error during course file creation:",
      error.message,
    );
    return new Response(
      JSON.stringify({
        error: "Unexpected error occurred",
        details: error.message,
      }),
      { status: 500 },
    );
  }
}
