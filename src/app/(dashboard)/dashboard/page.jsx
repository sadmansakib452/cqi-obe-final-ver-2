import Link from "next/link";



import { ContentLayout } from "@/components/admin-panel/content-layout";
import PlaceholderContent from "@/components/demo/placeholder-content";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  return (
    <ContentLayout title="Dashboard">
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
        <h1 className="font-extrabold">Hello! {session?.user?.name || session?.user?.email}</h1>
      </PlaceholderContent>
      
    </ContentLayout>
  );
}
