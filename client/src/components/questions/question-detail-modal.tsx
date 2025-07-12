import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { X, Share, Flag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VotingButtons } from "@/components/ui/voting-buttons";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Question, Answer } from "@shared/schema";
import { getUserById, getAnswersByQuestionId } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface QuestionDetailModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (type: "question" | "answer", id: number, voteType: "up" | "down") => void;
  onAcceptAnswer: (answerId: number) => void;
  onSubmitAnswer: (questionId: number, content: string) => void;
}

export const QuestionDetailModal = ({
  question,
  isOpen,
  onClose,
  onVote,
  onAcceptAnswer,
  onSubmitAnswer,
}: QuestionDetailModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!question) return null;

  const author = getUserById(question.authorId);
  const answers = getAnswersByQuestionId(question.id);
  const isQuestionOwner = user?.id === question.authorId;

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to answer a question",
        variant: "destructive",
      });
      return;
    }

    if (!answerContent.trim()) {
      toast({
        title: "Error",
        description: "Answer content is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitAnswer(question.id, answerContent.trim());
      setAnswerContent("");
      toast({
        title: "Success",
        description: "Your answer has been posted successfully!",
      });
    } catch (error) {
      console.error("Error posting answer:", error);
      toast({
        title: "Error",
        description: "Failed to post answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold text-gray-900 mb-2">
                {question.title}
              </DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
                <span>Modified {formatDistanceToNow(question.updatedAt, { addSuffix: true })}</span>
                <span>Viewed {question.views} times</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Question Content */}
          <div className="flex gap-6">
            <VotingButtons
              initialVotes={question.votes}
              onVote={(voteType) => onVote("question", question.id, voteType)}
              showFavorite
            />
            
            <div className="flex-1">
              <div
                className="prose max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: question.content }}
              />
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="tag-pill">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-gray-500">
                    asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                  </div>
                  {author && (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={author.avatar || undefined} alt={author.username} />
                        <AvatarFallback>
                          {author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{author.username}</div>
                        <div className="text-xs text-gray-500">{author.reputation} reputation</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Answers Section */}
          {answers.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {answers.length} Answer{answers.length !== 1 ? "s" : ""}
              </h2>
              
              {answers.map((answer) => {
                const answerAuthor = getUserById(answer.authorId);
                return (
                  <div
                    key={answer.id}
                    className={`mb-8 p-6 rounded-lg ${
                      answer.isAccepted ? "accepted-answer bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-6">
                      <VotingButtons
                        initialVotes={answer.votes}
                        onVote={(voteType) => onVote("answer", answer.id, voteType)}
                      />
                      
                      <div className="flex-1">
                        <div
                          className="prose max-w-none mb-6"
                          dangerouslySetInnerHTML={{ __html: answer.content }}
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isQuestionOwner && !answer.isAccepted && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAcceptAnswer(answer.id)}
                                className="bg-accent hover:bg-accent/80 text-white"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept Answer
                              </Button>
                            )}
                            {answer.isAccepted && (
                              <Badge variant="default" className="bg-accent">
                                <Check className="h-3 w-3 mr-1" />
                                Accepted
                              </Badge>
                            )}
                          </div>
                          
                          {answerAuthor && (
                            <div className="flex items-center space-x-2">
                              <div className="text-xs text-gray-500">
                                answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                              </div>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={answerAuthor.avatar || undefined} alt={answerAuthor.username} />
                                <AvatarFallback>
                                  {answerAuthor.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm text-gray-900">{answerAuthor.username}</div>
                                <div className="text-xs text-gray-500">{answerAuthor.reputation} reputation</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Answer Form */}
          {user && (
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here..."
                />
                
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setAnswerContent("")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Answer"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
