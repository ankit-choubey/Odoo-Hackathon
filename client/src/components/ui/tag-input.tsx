import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

export const TagInput = ({
  tags,
  onTagsChange,
  maxTags = 5,
  placeholder = "Add tags...",
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-lg p-3 min-h-[40px] flex flex-wrap gap-3 items-center">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="tag-pill px-3 py-1">
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-4 w-4 p-0 text-secondary hover:text-secondary/80"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {tags.length < maxTags && (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-[100px] border-none shadow-none focus-visible:ring-0 p-0"
          />
        )}
      </div>
      <p className="text-sm text-gray-500">
        Add up to {maxTags} tags to describe what your question is about
      </p>
    </div>
  );
};
