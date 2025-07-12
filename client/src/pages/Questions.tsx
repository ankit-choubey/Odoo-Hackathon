import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Eye, MessageSquare, Calendar, SquareStack as StackOverflow } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface Question {
  id: number;
  title: string;
  content: string;
  authorId: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    reputation: number;
  };
  tags?: Array<{ id: number; name: string }>;
  answerCount?: number;
}

interface Stats {
  questions: number;
  answers: number;
  users: number;
  tags: number;
}

export default function Questions() {
  const { isAuthenticated } = useAuth();

  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["/api/questions"],
    retry: false,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["/api/tags"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const getDisplayName = (author?: Question['author']) => {
    if (!author) return "Unknown User";
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author.firstName || author.lastName || "Unknown User";
  };

  const popularTags = tags.slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated ? (
        <Header />
      ) : (
        // Guest header
        <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center">
                <div className="text-orange-500 text-2xl mr-2">
                  <StackOverflow className="h-8 w-8" />
                </div>
                <h1 className="text-xl font-bold text-foreground">StackIt</h1>
              </Link>
              <div className="flex items-center space-x-4">
                <Button onClick={() => window.location.href = "/api/login"}>
                  Login to Ask Questions
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">All Questions</h1>
              {isAuthenticated && (
                <Link href="/ask">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Ask Question
                  </Button>
                </Link>
              )}
            </div>

            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  You're browsing as a guest. 
                  <Button 
                    variant="link" 
                    className="text-blue-600 dark:text-blue-400 p-0 ml-1"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Login
                  </Button> 
                  to ask questions, vote, and participate in discussions.
                </p>
              </div>
            )}

            {questionsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : questions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">No questions yet</h2>
                  <p className="text-muted-foreground mb-4">
                    Be the first to ask a question and start the conversation!
                  </p>
                  {isAuthenticated ? (
                    <Link href="/ask">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        Ask the First Question
                      </Button>
                    </Link>
                  ) : (
                    <Button onClick={() => window.location.href = "/api/login"}>
                      Login to Ask Questions
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {questions.map((question: Question) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/questions/${question.id}`}>
                          <h2 className="text-lg font-semibold text-foreground hover:text-orange-600 cursor-pointer">
                            {question.title}
                          </h2>
                        </Link>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {question.content.replace(/[#*`]/g, '').substring(0, 200)}...
                      </p>

                      {question.tags && question.tags.length > 0 && (
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
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{question.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{question.answerCount || 0} answers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span>by {getDisplayName(question.author)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Popular Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {popularTags.length === 0 && (
                    <p className="text-muted-foreground text-sm">No tags yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-foreground">Community Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions</span>
                      <span className="font-medium text-foreground">{stats.questions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Answers</span>
                      <span className="font-medium text-foreground">{stats.answers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Users</span>
                      <span className="font-medium text-foreground">{stats.users.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tags</span>
                      <span className="font-medium text-foreground">{stats.tags.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}