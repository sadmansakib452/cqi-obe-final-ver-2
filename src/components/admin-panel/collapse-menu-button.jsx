"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Dot, LucideIcon } from "lucide-react";

import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";

import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
}) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState(isSubmenuActive);

  return (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Button
          variant={active ? "secondary" : "ghost"}
          className="w-full justify-start h-10"
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                <Icon size={18} />
              </span>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0",
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0",
              )}
            >
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map((submenu, index) =>
          submenu.submenus && submenu.submenus.length > 0 ? (
            <CollapseMenuButton
              key={index}
              icon={Dot} // You can change the icon if needed
              label={submenu.label}
              active={submenu.active}
              submenus={submenu.submenus}
              isOpen={isOpen}
            />
          ) : (
            <Button
              key={index}
              variant={submenu.active ? "secondary" : "ghost"}
              className="w-full justify-start h-10 mb-1"
              asChild
            >
              <Link href={submenu.href}>
                <span className="mr-4 ml-2">
                  <Dot size={18} />
                </span>
                <p
                  className={cn(
                    "max-w-[170px] truncate",
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0",
                  )}
                >
                  {submenu.label}
                </p>
              </Link>
            </Button>
          ),
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
