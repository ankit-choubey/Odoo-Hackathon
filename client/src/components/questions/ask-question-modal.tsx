import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { TagInput } from "@/components/ui/tag-input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { InsertQuestion } from "@shared/schema";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: InsertQuestion) => void;
}

export const AskQuestionModal = ({ isOpen, onClose, onSubmit }: AskQuestionModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to ask a question",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || title.trim().length < 10) {
      toast({
        title: "Error",
        description: "Title must be at least 10 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive",
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Error",
        description: "At least one tag is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const question: InsertQuestion = {
        title: title.trim(),
        content: content.trim(),
        authorId: user.id,
        tags,
        acceptedAnswerId: null,
      };

      await onSubmit(question);
      
      // Reset form
      setTitle("");
      setContent("");
      setTags([]);
      onClose();
      
      toast({
        title: "Success",
        description: "Your question has been posted successfully!",
      });
    } catch (error) {
      console.error("Error posting question:", error);
      toast({
        title: "Error",
        description: "Failed to post question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Ask a Question</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Share your knowledge and help others by asking a detailed question
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Be specific and imagine you're asking a question to another person"
              className="mt-2 text-sm sm:text-base"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="content" className="text-sm sm:text-base">Description</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Include all the information someone would need to answer your question. Add relevant details, code examples, error messages, what you've tried, and expected vs actual behavior."
              className="mt-2"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags" className="text-sm sm:text-base">Tags</Label>
            <div className="mt-2">
              <TagInput
                tags={tags}
                onTagsChange={setTags}
                placeholder="Add tags..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
