"use client"
import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import PlaceholderContent from "@/components/demo/placeholder-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { auth } from "@/auth";

import { useState } from "react";

import CourseFileForm from "./_components/CourseFileForm";
import FileUploadCard from "./_components/FileUploadCard";


export default function CourseFilePage() {
  // const session = await auth();
  //  if (session?.user?.role !== "admin") {
  //    return <UnauthorizedPage />;
  //  }

   const [courseFileName, setCourseFileName] = useState("");
   const [isCourseCreated, setIsCourseCreated] = useState(false);

   const handleCourseFileSubmit = async (data) => {
     const res = await fetch("/api/course/create", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ courseFileName: data.courseFileName }),
     });

     if (res.ok) {
       setCourseFileName(data.courseFileName);
       setIsCourseCreated(true);
     } else {
       console.error("Error creating course folder");
     }
   };
  return (
    <ContentLayout title="Upload Course File">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent>
        <div className="container mx-auto p-4">
          {!isCourseCreated ? (
            <CourseFileForm onSubmit={handleCourseFileSubmit} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <FileUploadCard
                courseFileName={courseFileName}
                label="Upload Text File"
                type="text"
              />
              <FileUploadCard
                courseFileName={courseFileName}
                label="Upload File 1"
                type="file"
              />
              <FileUploadCard
                courseFileName={courseFileName}
                label="Upload File 2"
                type="file"
              />
            </div>
          )}
        </div>
      </PlaceholderContent>
    </ContentLayout>
  );
}
