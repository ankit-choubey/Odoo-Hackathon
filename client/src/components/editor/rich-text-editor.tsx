import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  Smile,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const insertEmoji = (emoji: string) => {
    execCommand("insertText", emoji);
    setShowEmojiPicker(false);
  };

  // Common emoji list
  const commonEmojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
    "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
    "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
    "🤔", "🤭", "🤫", "🤐", "🥱", "😴", "😪", "😵", "🤤", "😷",
    "🤒", "🤕", "🤢", "🤮", "🤧", "🥴", "😵‍💫", "🤠", "🥸", "🤡",
    "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉",
    "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤛", "🤜",
    "💪", "🦾", "🖕", "✍️", "🙏", "🦶", "🦵", "🦿", "💄", "💋",
    "👄", "🦷", "👅", "👂", "🦻", "👃", "👣", "👁️", "👀", "🧠",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
    "✨", "⭐", "🌟", "💫", "🔥", "💥", "💢", "💨", "💦", "💤"
  ];

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Strikethrough, command: "strikethrough", title: "Strikethrough" },
    { type: "separator" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { type: "separator" },
    { icon: Link, action: insertLink, title: "Insert Link" },
    { icon: Image, action: insertImage, title: "Insert Image" },
    { icon: Smile, isEmojiPicker: true, title: "Insert Emoji" },
    { type: "separator" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
    { type: "separator" },
    { icon: Code, command: "formatBlock", value: "pre", title: "Code Block" },
  ];

  return (
    <div className={cn("border border-gray-300 rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center flex-wrap gap-1">
        {toolbarButtons.map((item, index) => {
          if (item.type === "separator") {
            return <Separator key={index} orientation="vertical" className="h-6 mx-1" />;
          }

          const Icon = item.icon!;
          
          // Special handling for emoji picker
          if (item.isEmojiPicker) {
            return (
              <Popover key={index} open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 editor-toolbar"
                    title={item.title}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2">
                  <div className="grid grid-cols-10 gap-1 max-h-64 overflow-y-auto">
                    {commonEmojis.map((emoji, emojiIndex) => (
                      <Button
                        key={emojiIndex}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg hover:bg-gray-100"
                        onClick={() => insertEmoji(emoji)}
                        title={emoji}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 editor-toolbar"
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.command) {
                  execCommand(item.command, item.value);
                }
              }}
              title={item.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "p-4 min-h-[200px] focus:outline-none prose max-w-none",
          !isEditorFocused && !value && "text-gray-400"
        )}
        onInput={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        data-placeholder={placeholder}
        style={{
          whiteSpace: "pre-wrap",
        }}
      />
      {!isEditorFocused && !value && (
        <div className="absolute pointer-events-none p-4 text-gray-400">
          {placeholder}
        </div>
      )}
    </div>
  );
};
