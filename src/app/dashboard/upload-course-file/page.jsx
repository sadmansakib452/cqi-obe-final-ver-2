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

export default function CourseFilePage() {
  // const session = await auth();
  //  if (session?.user?.role !== "admin") {
  //    return <UnauthorizedPage />;
  //  }

   const [courseName, setCourseName] = useState("");

   const handleCourseNameSubmit = (name) => {
     setCourseName(name);
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
        
      </PlaceholderContent>
    </ContentLayout>
  );
}
