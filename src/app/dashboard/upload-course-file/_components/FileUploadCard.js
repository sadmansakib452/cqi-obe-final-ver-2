// src/app/dashboard/upload-course-file/_components/FileUploadCard.js
import { useState } from "react";
import FileUploadDialog from "./FileUploadDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Ensure correct imports for Card sub-components

export default function FileUploadCard({ courseFileName, label, type }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Toggle dialog open/close state
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  return (
    <div>
      {/* Card to represent each file upload option */}
      <Card
        className="hover:cursor-pointer hover:bg-gray-100"
        onClick={toggleDialog}
      >
        <CardHeader>
          <CardTitle>{label}</CardTitle>
        </CardHeader>
        <CardContent>Click to upload {label}</CardContent>
      </Card>

      {/* Show dialog when card is clicked */}
      {isDialogOpen && (
        <FileUploadDialog
          courseFileName={courseFileName}
          label={label}
          type={type}
          closeDialog={toggleDialog}
        />
      )}
    </div>
  );
}
