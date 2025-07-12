import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      }
    }, 0);
  };

  const handleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        insertText('**', '**', 'bold text');
        break;
      case 'italic':
        insertText('*', '*', 'italic text');
        break;
      case 'strikethrough':
        insertText('~~', '~~', 'strikethrough text');
        break;
      case 'ordered-list':
        insertText('\n1. ', '', 'List item');
        break;
      case 'unordered-list':
        insertText('\n- ', '', 'List item');
        break;
      case 'link':
        insertText('[', '](https://example.com)', 'link text');
        break;
      case 'image':
        insertText('![', '](https://example.com/image.jpg)', 'alt text');
        break;
      case 'emoji':
        insertText('😊', '', '');
        break;
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: 'bold', label: 'Bold' },
    { icon: Italic, action: 'italic', label: 'Italic' },
    { icon: Strikethrough, action: 'strikethrough', label: 'Strikethrough' },
    { separator: true },
    { icon: ListOrdered, action: 'ordered-list', label: 'Numbered List' },
    { icon: List, action: 'unordered-list', label: 'Bullet List' },
    { separator: true },
    { icon: Link, action: 'link', label: 'Link' },
    { icon: Image, action: 'image', label: 'Image' },
    { icon: Smile, action: 'emoji', label: 'Emoji' },
    { separator: true },
    { icon: AlignLeft, action: 'align-left', label: 'Align Left' },
    { icon: AlignCenter, action: 'align-center', label: 'Align Center' },
    { icon: AlignRight, action: 'align-right', label: 'Align Right' },
  ];

  return (
    <div className={cn("border border-border rounded-md", className)}>
      {/* Toolbar */}
      <div className="border-b border-border p-3 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.separator) {
            return <div key={index} className="h-6 w-px bg-border mx-1" />;
          }

          const Icon = button.icon!;
          return (
            <Button
              key={button.action}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
                activeFormats.has(button.action!) && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleFormat(button.action!)}
              title={button.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-48 resize-y border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
