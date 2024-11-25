import { auth } from "@/auth"; // v5 call for session handling
import db from "prisma/index"; // Database connection

// Explicitly mark the route as dynamic to avoid static rendering issues
export const dynamic = "force-dynamic";

// Route to fetch course files based on the authenticated user's session
export async function GET() {
  try {
    // Authenticate the request and retrieve the session
    const session = await auth();

    // If the session is invalid or the user is not authenticated, return 401 Unauthorized
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the userId from the session
    const userId = session.user.id;

    // Fetch the course files for the authenticated user
    const courseFiles = await db.courseFiles.findMany({
      where: { userId },
      include: {
        midExams: true,
        quizExams: true,
        finalExam: true,
      },
    });

    // If no course files are found, return an appropriate message
    if (!courseFiles || courseFiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No course files found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Return the course files in the response
    return new Response(JSON.stringify({ courseFiles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching course files:", error.message);

    // Return a generic error response to avoid exposing sensitive details
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
