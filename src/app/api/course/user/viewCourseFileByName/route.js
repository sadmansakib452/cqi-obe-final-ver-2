// File: /app/api/course/user/viewCourseFileByName.js
import { auth } from "@/auth"; // Authentication function
import db from "prisma/index"; // Database connection

// API to search for a specific course file based on the user's session and courseFileName
export async function GET(request) {
  const url = new URL(request.url);
  const courseFileName = url.searchParams.get("courseFileName");

  try {
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;

    // Retrieve the specified course file, including its related exam data
    const courseFile = await db.courseFiles.findFirst({
      where: { userId, courseFileName },
      include: {
        midExams: true,
        quizExams: true,
        finalExam: true,
      },
    });

    // If the course file isn't found, return an appropriate message
    if (!courseFile) {
      return new Response(
        JSON.stringify({ message: "Course file not found" }),
        { status: 404 },
      );
    }

    return new Response(JSON.stringify({ courseFile }), { status: 200 });
  } catch (error) {
    console.error("Error retrieving course file:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve course file" }),
      { status: 500 },
    );
  }
}
