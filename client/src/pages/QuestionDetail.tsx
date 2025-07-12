import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { VoteButtons } from "@/components/VoteButtons";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Calendar, Share, Flag, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QuestionDetails {
  id: number;
  title: string;
  content: string;
  authorId: string;
  acceptedAnswerId?: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    reputation: number;
  };
  tags: Array<{ id: number; name: string }>;
}

interface Answer {
  id: number;
  content: string;
  authorId: string;
  questionId: number;
  isAccepted: boolean;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    reputation: number;
  };
  voteCount: number;
}

export default function QuestionDetail() {
  const [, params] = useRoute("/questions/:id");
  const questionId = params?.id ? parseInt(params.id) : null;
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [answerContent, setAnswerContent] = useState("");
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: question, isLoading: questionLoading } = useQuery<QuestionDetails>({
    queryKey: ["/api/questions", questionId],
    enabled: isAuthenticated && !!questionId,
  });

  const { data: answers = [], isLoading: answersLoading } = useQuery<Answer[]>({
    queryKey: ["/api/questions", questionId, "answers"],
    enabled: isAuthenticated && !!questionId,
  });

  const answerMutation = useMutation({
    mutationFn: async () => {
      if (!answerContent.trim()) {
        throw new Error("Answer content is required");
      }
      const response = await apiRequest("POST", `/api/questions/${questionId}/answers`, {
        content: answerContent,
      });
      return response.json();
    },
    onSuccess: () => {
      setAnswerContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/questions", questionId, "answers"] });
      toast({
        title: "Success",
        description: "Your answer has been posted!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to post answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !questionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  const getDisplayName = (author: any) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author.firstName || author.lastName || "Unknown User";
  };

  const getInitials = (author: any) => {
    if (!author.firstName && !author.lastName) return "U";
    return `${author.firstName?.[0] || ""}${author.lastName?.[0] || ""}`.toUpperCase();
  };

  if (questionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Question not found</h2>
              <p className="text-muted-foreground">The question you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === question.authorId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Question */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-semibold text-foreground">{question.title}</h1>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>Viewed {question.views} times</span>
                  </div>
                </div>

                <div className="prose max-w-none mb-4">
                  <div className="whitespace-pre-wrap text-foreground">{question.content}</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4 mr-1" />
                      Flag
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={question.author.profileImageUrl} />
                      <AvatarFallback>{getInitials(question.author)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{getDisplayName(question.author)}</p>
                      <p className="text-muted-foreground">{question.author.reputation} reputation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vote and Answers Section */}
            <div className="flex items-start space-x-4 mb-6">
              <VoteButtons
                itemId={questionId}
                itemType="question"
                initialVoteCount={0}
                className="sticky top-20"
              />
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                </h2>
              </div>
            </div>

            {/* Answers */}
            <div className="space-y-4 mb-6">
              {answersLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                answers.map((answer) => (
                  <Card 
                    key={answer.id} 
                    className={answer.isAccepted ? "border-l-4 border-green-500" : ""}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <VoteButtons
                          itemId={answer.id}
                          itemType="answer"
                          initialVoteCount={answer.voteCount}
                          isAccepted={answer.isAccepted}
                          canAccept={isAuthor && !question.acceptedAnswerId}
                          onAccept={() => {
                            queryClient.invalidateQueries({ queryKey: ["/api/questions", questionId] });
                            queryClient.invalidateQueries({ queryKey: ["/api/questions", questionId, "answers"] });
                          }}
                        />
                        
                        <div className="flex-1">
                          <div className="prose max-w-none mb-4">
                            <div className="whitespace-pre-wrap text-foreground">{answer.content}</div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm">
                                <Share className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Flag className="h-4 w-4 mr-1" />
                                Flag
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={answer.author.profileImageUrl} />
                                <AvatarFallback>{getInitials(answer.author)}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <p className="font-medium text-foreground">{getDisplayName(answer.author)}</p>
                                <p className="text-muted-foreground">{answer.author.reputation} reputation</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Answer Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Answer</h3>
                
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here..."
                  className="mb-4"
                />
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Please ensure your answer is helpful and follows community guidelines.
                  </p>
                  <Button
                    onClick={() => answerMutation.mutate()}
                    disabled={answerMutation.isPending || !answerContent.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {answerMutation.isPending ? "Posting..." : "Post Your Answer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Related Questions - placeholder for now */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Related Questions</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Related questions will appear here based on tags and content similarity.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
