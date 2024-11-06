// File: /api/course/signedurl/generate/route.js

import { auth } from "@/auth"; // Authentication function
import s3 from "@/lib/minio"; // MinIO client setup
import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // AWS SDK for generating signed URLs
import { MINIO_FILE_EXPIARY_TIME } from "@/config";

async function generateSignedUrl(bucketName, filePath) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: filePath,
    
  });

  // Generate a signed URL with a 15-minute expiration
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: MINIO_FILE_EXPIARY_TIME,
  });
  console.log("Generated Signed URL:", signedUrl);
  return signedUrl;
}

/**
 * Handler function for POST requests to generate viewer and direct URLs.
 * Expects a JSON body with 'filePath'.
 */
export async function POST(req) {
  try {
    // Authenticate the user
    const session = await auth();

    if (!session) {
      console.log("Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Extract filePath from the request body
    const { filePath } = await req.json();

    if (!filePath) {
      console.log("No filePath provided in the request.");
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 },
      );
    }

    // Generate the direct signed URL
    const directUrl = await generateSignedUrl("course-files", filePath);

    // Encode the direct URL to use it as a parameter in the viewer URL
    const encodedDirectUrl = encodeURIComponent(directUrl);

    // Construct the Google Docs Viewer URL with the encoded direct URL
    const viewerUrl = `https://docs.google.com/viewerng/viewer?url=${encodedDirectUrl}&embedded=true`;
    console.log("Generated Viewer URL:", viewerUrl);

    // Return both viewerUrl and directUrl in the response
    return NextResponse.json({ viewerUrl, directUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate URLs" },
      { status: 500 },
    );
  }
}
