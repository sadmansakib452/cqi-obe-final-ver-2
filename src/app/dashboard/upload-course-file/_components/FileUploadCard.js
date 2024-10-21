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
        className="p-4 border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:shadow-lg dark:hover:shadow-zinc-600 transition-all cursor-pointer" // Added cursor-pointer here
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="text-md font-semibold text-gray-900 dark:text-gray-100">
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-blue-500 dark:text-blue-400">
            <UploadCloud size={20} className="mr-2" />
            <span>Click to upload</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
