import { useLanguage } from "@/context/LanguageContext";
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
  LogOut,
  Shield,
  Instagram,
  PlusSquare,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { lang, setLang } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = (
    <>
      {isAdmin && (
        <Link to="/admin" className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Button>
        </Link>
      )}
  {/* Request a Quote removed for admin */}
      <a
        href="https://www.instagram.com/kadhalin_kaadhali/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <Instagram className="h-5 w-5 text-pink-600" />
        kadhalin_kaadhali
      </a>
    </>
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/profile.jpeg" alt="Kadhalin kaadhali" className="h-8 w-8 rounded-full" />
          <h1 className="text-xl font-bold">Kadhalin kaadhali</h1>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {isAdmin ? "Admin" : "User"}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <img src={user.user_metadata.avatar_url || '/placeholder.svg'} alt="User avatar" className="h-8 w-8 rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-normal">
                      <div className="font-semibold">{user.user_metadata.full_name || user.email}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    {/* Request a Quote removed for admin */}
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Language</div>
                      <div className="flex gap-2">
                        <button
                          className={`px-2 py-1 text-xs rounded ${lang === 'ta' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                          onClick={() => setLang('ta')}
                          type="button"
                        >தமிழ்</button>
                        <button
                          className={`px-2 py-1 text-xs rounded ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                          onClick={() => setLang('en')}
                          type="button"
                        >English</button>
                      </div>
                    </div>
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 p-4">
                {navLinks}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
