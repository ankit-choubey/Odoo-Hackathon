import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Share, Flag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VotingButtons } from "@/components/ui/voting-buttons";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Header } from "@/components/layout/header";
import { Question, Answer } from "@shared/schema";
import { getQuestionById, getUserById, getAnswersByQuestionId } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface QuestionDetailProps {
  params: {
    id: string;
  };
}

export default function QuestionDetail({ params }: QuestionDetailProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const questionId = parseInt(params.id);
    const foundQuestion = getQuestionById(questionId);
    
    if (foundQuestion) {
      setQuestion(foundQuestion);
      setAnswers(getAnswersByQuestionId(questionId));
      
      // Simulate incrementing view count
      const updatedQuestion = { ...foundQuestion, views: foundQuestion.views + 1 };
      setQuestion(updatedQuestion);
    }
    
    setLoading(false);
  }, [params.id]);

  const handleVote = (type: "question" | "answer", id: number, voteType: "up" | "down") => {
    if (type === "question" && question) {
      const voteChange = voteType === "up" ? 1 : -1;
      setQuestion(prev => prev ? { ...prev, votes: prev.votes + voteChange } : null);
    } else if (type === "answer") {
      setAnswers(prev => 
        prev.map(answer => 
          answer.id === id 
            ? { ...answer, votes: answer.votes + (voteType === "up" ? 1 : -1) }
            : answer
        )
      );
    }
    
    toast({
      title: "Vote recorded",
      description: `Your ${voteType}vote has been recorded.`,
    });
  };

  const handleAcceptAnswer = (answerId: number) => {
    if (question) {
      setQuestion(prev => prev ? { ...prev, acceptedAnswerId: answerId } : null);
      setAnswers(prev => 
        prev.map(answer => 
          answer.id === answerId 
            ? { ...answer, isAccepted: true }
            : { ...answer, isAccepted: false }
        )
      );
      
      toast({
        title: "Answer accepted",
        description: "The answer has been marked as accepted.",
      });
    }
  };

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAnswer: Answer = {
        id: answers.length + 1,
        content: answerContent.trim(),
        questionId: question!.id,
        authorId: user.id,
        votes: 0,
        isAccepted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setAnswers(prev => [...prev, newAnswer]);
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

  const handleSearch = (query: string) => {
    // Implement search functionality or navigate to search results
    console.log("Search:", query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAskQuestion={() => {}} onSearch={handleSearch} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAskQuestion={() => {}} onSearch={handleSearch} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
            <p className="text-gray-600 mb-8">The question you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const author = getUserById(question.authorId);
  const isQuestionOwner = user?.id === question.authorId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAskQuestion={() => {}} onSearch={handleSearch} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {question.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
                <span>Modified {formatDistanceToNow(question.updatedAt, { addSuffix: true })}</span>
                <span>Viewed {question.views} times</span>
              </div>
            </div>
            
            {/* Question Content */}
            <div className="flex gap-6 mb-6">
              <VotingButtons
                initialVotes={question.votes}
                onVote={(voteType) => handleVote("question", question.id, voteType)}
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
          </div>
        </div>
        
        {/* Answers Section */}
        {answers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {answers.length} Answer{answers.length !== 1 ? "s" : ""}
            </h2>
            
            {answers.map((answer) => {
              const answerAuthor = getUserById(answer.authorId);
              return (
                <div
                  key={answer.id}
                  className={`mb-6 p-6 rounded-lg ${
                    answer.isAccepted 
                      ? "accepted-answer bg-green-50 border-l-4 border-green-500" 
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex gap-6">
                    <VotingButtons
                      initialVotes={answer.votes}
                      onVote={(voteType) => handleVote("answer", answer.id, voteType)}
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
                              onClick={() => handleAcceptAnswer(answer.id)}
                              className="bg-accent hover:bg-accent/80 text-white border-accent"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept Answer
                            </Button>
                          )}
                          {answer.isAccepted && (
                            <Badge variant="default" className="bg-accent hover:bg-accent/80">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <RichTextEditor
                value={answerContent}
                onChange={setAnswerContent}
                placeholder="Write your answer here..."
              />
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setAnswerContent("")}
                >
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
    </div>
  );
}
