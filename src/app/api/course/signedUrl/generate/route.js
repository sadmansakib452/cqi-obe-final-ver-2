import { auth } from "@/auth"; // v5 call
import s3 from "@/lib/minio"; // MinIO client
import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import the correct presigner function

// Helper function to generate a signed URL
async function generateSignedUrl(bucketName, filePath) {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: filePath });

  // Generate a signed URL with a 15-minute expiration using the getSignedUrl function
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

  return signedUrl;
}

export async function POST(req) {
  try {
    // Use the new `auth()` function from next-auth to get session data
    const session = await auth();

    // Check if the user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Extract the filePath from the request body
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 },
      );
    }

    // Generate the signed URL for the requested file path
    const signedUrl = await generateSignedUrl("course-files", filePath);

    return NextResponse.json({ signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating signed URL: ", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 },
    );
  }
}
