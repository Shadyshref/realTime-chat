"use client";

import useCurrentUser from "@/services/supabase/hooks/useCurrentUser";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "@/services/supabase/components/logout-button";

export default function NavBar() {
  const { user, isLoading } = useCurrentUser();

  return (
    <div className="border-b bg-background h-header">
      <nav className="mx-auto container px-4 flex justify-between items-center h-full gap-4">
        <Link href="/" className="font-bold text-xl  ">
          Supachat
        </Link>
        {isLoading || user == null ? (
          <Button>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        ) : (
          <div className=" flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {user.user_metadata.preferred_username || user.email}
            </span>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
}
