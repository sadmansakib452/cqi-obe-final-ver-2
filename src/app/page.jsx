import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to /auth/signin
  redirect("/auth/signin");
}
