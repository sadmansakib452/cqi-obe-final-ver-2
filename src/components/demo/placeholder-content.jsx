import Link from "next/link";
import Image from "next/image";


export default function PlaceholderContent({children}) {
  return (
    <div className="rounded-lg border-none mt-6">
      <div className="p-6">
        <div className="min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
