// src/components/ui/FileUploadCard.js
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { UploadCloud } from "lucide-react"; // Icons for feedback

export default function FileUploadCard({
  courseFileName,
  label,
  description,
  onClick,
}) {
  return (
    <div>
      <Card
        className="p-4 border hover:cursor-pointer hover:bg-gray-100 transition-all"
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="text-md font-semibold">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-blue-500">
            <UploadCloud size={20} className="mr-2" />
            <span>Click to upload</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
