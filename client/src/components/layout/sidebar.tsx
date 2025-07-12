import { Home, HelpCircle, Tag, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTags } from "@/lib/mock-data";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const popularTags = mockTags.slice(0, 4);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "questions", label: "Questions", icon: HelpCircle },
    { id: "tags", label: "Tags", icon: Tag },
    { id: "users", label: "Users", icon: Users },
    { id: "favorites", label: "Favorites", icon: Star },
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Popular Tags */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Popular Tags</h3>
        <div className="space-y-2">
          {popularTags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between">
              <Badge variant="secondary" className="tag-pill">
                {tag.name}
              </Badge>
              <span className="text-xs text-gray-500">{tag.questionCount}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
