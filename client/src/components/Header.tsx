import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, SquareStack as StackOverflow } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, isAuthenticated } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getDisplayName = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return "User";
  };

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <div className="text-orange-500 text-2xl mr-2">
                <StackOverflow className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-bold text-foreground">StackIt</h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-foreground hover:text-orange-500 transition-colors font-medium"
              >
                Questions
              </Link>
              <Link
                href="/tags"
                className="text-muted-foreground hover:text-orange-500 transition-colors"
              >
                Tags
              </Link>
              <Link
                href="/users"
                className="text-muted-foreground hover:text-orange-500 transition-colors"
              >
                Users
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden sm:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-orange-100 text-orange-800">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {getDisplayName(user?.firstName, user?.lastName)}
                  </span>
                </div>

                <Link href="/ask">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Ask Question
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = "/api/login"}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
