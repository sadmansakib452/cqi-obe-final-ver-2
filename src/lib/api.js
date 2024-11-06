// File: /src/lib/api.js

export async function fetchCourseFileByName(courseFileName, userId) {
  const response = await fetch(
    `/api/course/user/viewCourseFileByName?courseFileName=${encodeURIComponent(courseFileName)}`,
  );
  if (!response.ok) throw new Error("Failed to fetch course file");
  const data = await response.json();
  return data.courseFile;
}
