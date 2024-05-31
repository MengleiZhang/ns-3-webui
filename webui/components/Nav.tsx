import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Form } from "@/lib/form";
import logout from "@/components/lucia-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, Menu, User } from "lucide-react";
import { validateRequest } from "@/lib/auth";

export default async function Nav({ children }) {
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/simulation"
            className="text-muted-foreground transition-colors hover:text-foreground hover:bg"
          >
            Simulation
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground hover:bg"
          >
            Dashboard
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/simulation"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Simulation
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto">
            <a
              className="pointer-events-none flex place-items-center gap-2 lg:pointer-events-auto lg:p-0"
              href="https://www.nsnam.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/ns3.png"
                alt="ns-3"
                className="dark:invert"
                width={80}
                height={20}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </a>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuLabel>
                <div className="flex gap-1 items-center">
                  <User className="h-4 w-4" /> {children}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Form action={logout}>
                <button className="w-full text-left">
                  <DropdownMenuItem>Logout </DropdownMenuItem>
                </button>
              </Form>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </header>
    </>
  );
}
