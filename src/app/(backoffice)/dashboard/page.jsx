import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const session = await auth();

  console.log(session?.user)
  return (
    <h1>
      hello <b>{session?.user?.name || session?.user?.email}</b>
    </h1>
  );
}
