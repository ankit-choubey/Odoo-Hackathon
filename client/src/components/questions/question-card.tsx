import { formatDistanceToNow } from "date-fns";
import { Eye, MessageSquare, TrendingUp, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Question } from "@shared/schema";
import { getUserById } from "@/lib/mock-data";

interface QuestionCardProps {
  question: Question;
  onClick: (question: Question) => void;
}

export const QuestionCard = ({ question, onClick }: QuestionCardProps) => {
  const author = getUserById(question.authorId);

  return (
    <Card
      className="question-card transition-shadow cursor-pointer hover:shadow-md"
      onClick={() => onClick(question)}
    >
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Vote Stats */}
          <div className="flex sm:flex-col items-center justify-center sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2 sm:w-16 lg:w-20">
            <div className="text-center">
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{question.votes}</div>
              <div className="text-xs text-gray-500">votes</div>
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-accent">{question.answerCount}</div>
              <div className="text-xs text-gray-500">answers</div>
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600">{question.views}</div>
              <div className="text-xs text-gray-500">views</div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-primary line-clamp-2">
                {question.title}
              </h3>
              {question.acceptedAnswerId && (
                <Badge variant="default" className="bg-accent hover:bg-accent/80 w-fit">
                  <Check className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">ACCEPTED</span>
                  <span className="sm:hidden">✓</span>
                </Badge>
              )}
            </div>
            
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
              {question.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
              {question.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="tag-pill text-xs">
                  {tag}
                </Badge>
              ))}
              {question.tags.length > 3 && (
                <Badge variant="secondary" className="tag-pill text-xs">
                  +{question.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 gap-2">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span>
                  asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                </span>
                {author && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-4 w-4 sm:h-6 sm:w-6">
                      <AvatarImage src={author.avatar || undefined} alt={author.username} />
                      <AvatarFallback>
                        {author.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{author.username}</span>
                    <span className="hidden sm:inline">{author.reputation}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs">
                  modified {formatDistanceToNow(question.updatedAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
