import { useState } from "react";
import { Search, Bell, User, LogOut, Settings, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

interface HeaderProps {
  onAskQuestion: () => void;
  onSearch: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  currentFilter?: string;
}

export const Header = ({ onAskQuestion, onSearch, onFilterChange, currentFilter = "newest" }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications(user?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">StackIt</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 w-full text-sm sm:text-base h-8 sm:h-10"
              />
            </form>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Filters Dropdown - Mobile Priority */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-sm"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onFilterChange?.("newest")}>
                  <span className={currentFilter === "newest" ? "font-medium" : ""}>
                    Newest
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange?.("unanswered")}>
                  <span className={currentFilter === "unanswered" ? "font-medium" : ""}>
                    Unanswered
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange?.("frequent")}>
                  <span className={currentFilter === "frequent" ? "font-medium" : ""}>
                    Frequent
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange?.("votes")}>
                  <span className={currentFilter === "votes" ? "font-medium" : ""}>
                    Votes
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange?.("active")}>
                  <span className={currentFilter === "active" ? "font-medium" : ""}>
                    Active
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onFilterChange?.("more")}>
                  <span className={currentFilter === "more" ? "font-medium" : ""}>
                    More
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs notification-badge"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              {showNotifications && (
                <NotificationDropdown
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-3">
                    <div className="text-xs sm:text-sm text-right hidden sm:block">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-gray-500">
                        {user.role} • {user.reputation} rep
                      </div>
                    </div>
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.username} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Ask Question Button */}
            <Button onClick={onAskQuestion} className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2 sm:px-4">
              <span className="hidden sm:inline">Ask Question</span>
              <span className="sm:hidden">Ask</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
