import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Heart,
  User,
  LogOut,
  Shield,
  Instagram,
  Star,
  MessageSquare,
  Lightbulb,
  PlusSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/profile.jpeg" alt="Kadhalin kaadhali" className="h-6 w-6" />

          <h1 className="text-xl font-bold">Kadhalin kaadhali</h1>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/kadhalin_kaadhali/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Instagram className="h-6 w-6 text-pink-600" />
            <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              kadhalin_kaadhali
            </span>
          </a>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}

              <div className="flex items-center gap-2">
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {isAdmin ? "Admin" : "User"}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/feedback" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 mr-2" /> Feedback
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Suggestion
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PlusSquare className="h-4 w-4 mr-2" />
                      Request a Quote
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};