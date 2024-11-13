"use client"
import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";


import { Menu } from "./menu";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ProfileSection } from "./sidebar";
import { useSession } from "next-auth/react";

export function SheetMenu() {

    const { data: session } = useSession();
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <ProfileSection session={session} isOpen={true} />
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
