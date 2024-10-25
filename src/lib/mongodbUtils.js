import db from "prisma/index"; // Use your utility

// Utility: Update metadata for single file uploads in MongoDB
export async function updateSingleFileMetadata(
  courseFileName,
  userId,
  fileType,
  filePath,
) {
  if (!fileType || !filePath) {
    throw new Error("File type and file path are required for MongoDB update.");
  }

  // Convert fileType to match schema (FINAL-GRADES, COURSE-OUTLINE, etc.)
  const fieldName = mapFileTypeToSchemaField(fileType);

  if (!fieldName) {
    throw new Error(`Unknown fileType: ${fileType}`);
  }

  const updateData = {};
  updateData[fieldName] = filePath; // Dynamically sets the relevant field in the schema

  try {
    await db.courseFiles.update({
      where: { courseFileName_userId: { courseFileName, userId } },
      data: {
        ...updateData,
        updatedAt: new Date(), // Always update the timestamp
      },
    });
    console.log(
      `✅ MongoDB updated successfully for course: ${courseFileName}`,
    );
  } catch (error) {
    console.error(
      `❌ MongoDB update error for course ${courseFileName}:`,
      error.message,
    );
    throw new Error("Failed to update MongoDB with file metadata.");
  }
}

// Utility to handle metadata update in MongoDB for multiple files (e.g., midExams, quizExams, finalExam)
export async function updateMultipleFileMetadata(
  courseFileName,
  userId,
  examType,
  filesMetadata,
) {
  try {
    console.log("GET METADATA: ", filesMetadata);
    console.log(
      `📂 Updating MongoDB with multiple file metadata for ${examType}`,
    );

    // Step 1: Fetch the courseFilesId based on courseFileName and userId
    const courseFile = await db.courseFiles.findUnique({
      where: {
        courseFileName_userId: {
          courseFileName,
          userId,
        },
      },
      select: { id: true }, // We only need the ID
    });

    if (!courseFile || !courseFile.id) {
      throw new Error(
        "Failed to find courseFilesId for the given courseFileName and userId.",
      );
    }

    const courseFilesId = courseFile.id;
    console.log("course files id ", courseFilesId);

    // Step 2: Get the correct model reference based on examType
    let model;
    if (examType === "midExams") {
      model = db.midExam; // Referencing the midExam model directly
    } else if (examType === "quizExams") {
      model = db.quizExam; // Referencing the quizExam model directly
    } else if (examType === "finalExam") {
      model = db.finalExam; // FinalExam is a separate case (1-to-1 relation)
    } else {
      throw new Error("Invalid examType provided");
    }

    // Step 3: Handle finalExam differently (without index)
    if (examType === "finalExam") {
      // Consolidate filesMetadata into a single object for finalExam
      const consolidatedMetadata = filesMetadata.reduce((acc, file) => {
        return { ...acc, ...file };
      }, {});

      const existingExam = await model.findUnique({
        where: { courseFilesId: courseFilesId },
      });

      if (existingExam) {
        console.log(`Updating existing finalExam entry`);
        await model.update({
          where: { courseFilesId: courseFilesId },
          data: {
            ...consolidatedMetadata, // Use consolidated metadata
            timestamp: new Date(),
          },
        });
      } else {
        console.log(`Creating new finalExam entry`);
        await model.create({
          data: {
            courseFilesId: courseFilesId,
            ...consolidatedMetadata, // Use consolidated metadata
            timestamp: new Date(),
          },
        });
      }
    } else {
      // Step 4: Handle midExams and quizExams with index
      for (let i = 0; i < filesMetadata.length; i++) {
        const file = filesMetadata[i];
        const stringIndex = file.index; // Ensure we use the correct index from filesMetadata
        console.log(`Processing index: ${stringIndex} for ${examType}`);

        const existingExam = await model.findFirst({
          where: {
            courseFilesId: courseFilesId,
            index: stringIndex,
          },
        });

        if (existingExam) {
          console.log(
            `Updating existing ${examType} entry for index ${stringIndex}`,
          );
          await model.update({
            where: {
              id: existingExam.id, // Update by the unique ID
            },
            data: {
              ...file, // Spread the metadata from file
              timestamp: new Date(),
            },
          });
        } else {
          console.log(
            `Creating new ${examType} entry for index ${stringIndex}`,
          );
          await model.create({
            data: {
              courseFilesId: courseFilesId,
              index: stringIndex, // Use the correct index here
              ...file, // Spread the metadata from file
              timestamp: new Date(), // Set the timestamp
            },
          });
        }
      }
    }

    console.log(`✅ MongoDB metadata updated successfully for ${examType}`);
  } catch (error) {
    console.error(`❌ MongoDB update error for ${examType}:`, error.message);
    throw new Error("Failed to update MongoDB metadata for multiple files.");
  }
}

// Helper function to map file type to the correct schema field in MongoDB
function mapFileTypeToSchemaField(fileType) {
  const mapping = {
    "FINAL-GRADES": "finalGrades",
    "OBE-SUMMARY": "summaryObe",
    "INSTRUCTOR-FEEDBACK": "insFeedback",
    "COURSE-OUTLINE": "courseOutline",
    ASSIGNMENT: "assignment",
    LAB: "labExperiment",
    // Add more mapping as needed for mid-exams, quizzes, etc.
  };
  return mapping[fileType] || null;
}
