import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { QuestionCard } from "@/components/questions/question-card";
import { AskQuestionModal } from "@/components/questions/ask-question-modal";
import { QuestionDetailModal } from "@/components/questions/question-detail-modal";
import { mockQuestions } from "@/lib/mock-data";
import { Question, InsertQuestion } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState(mockQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);
  const [activeTab, setActiveTab] = useState("home");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);
  const [filterBy, setFilterBy] = useState("newest");



  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    setShowDetailModal(true);
    
    // Update view count
    const updatedQuestions = questions.map(q =>
      q.id === question.id ? { ...q, views: q.views + 1 } : q
    );
    setQuestions(updatedQuestions);
    setFilteredQuestions(updatedQuestions);
  };

  const handleSubmitQuestion = async (questionData: InsertQuestion) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newQuestion: Question = {
      ...questionData,
      id: questions.length + 1,
      votes: 0,
      views: 0,
      answerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    setFilteredQuestions(updatedQuestions);
  };

  const handleVote = (type: "question" | "answer", id: number, voteType: "up" | "down") => {
    if (type === "question") {
      const updatedQuestions = questions.map(q => {
        if (q.id === id) {
          const voteChange = voteType === "up" ? 1 : -1;
          return { ...q, votes: q.votes + voteChange };
        }
        return q;
      });
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
      
      if (selectedQuestion && selectedQuestion.id === id) {
        setSelectedQuestion(prev => prev ? { ...prev, votes: prev.votes + (voteType === "up" ? 1 : -1) } : null);
      }
    }
    
    toast({
      title: "Vote recorded",
      description: `Your ${voteType}vote has been recorded.`,
    });
  };

  const handleAcceptAnswer = (answerId: number) => {
    if (selectedQuestion) {
      const updatedQuestion = { ...selectedQuestion, acceptedAnswerId: answerId };
      setSelectedQuestion(updatedQuestion);
      
      const updatedQuestions = questions.map(q =>
        q.id === selectedQuestion.id ? updatedQuestion : q
      );
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
      
      toast({
        title: "Answer accepted",
        description: "The answer has been marked as accepted.",
      });
    }
  };

  const handleSubmitAnswer = async (questionId: number, content: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? { ...q, answerCount: q.answerCount + 1 } : q
    );
    setQuestions(updatedQuestions);
    setFilteredQuestions(updatedQuestions);
  };

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "active", label: "Active" },
    { value: "votes", label: "Votes" },
    { value: "unanswered", label: "Unanswered" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when questions change
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredQuestions(questions);
      setCurrentPage(1);
      return;
    }

    const filtered = questions.filter(
      (question) =>
        question.title.toLowerCase().includes(query.toLowerCase()) ||
        question.content.toLowerCase().includes(query.toLowerCase()) ||
        question.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    const sorted = [...filteredQuestions].sort((a, b) => {
      switch (sortType) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "active":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "votes":
          return b.votes - a.votes;
        case "unanswered":
          return a.answerCount - b.answerCount;
        default:
          return 0;
      }
    });
    setFilteredQuestions(sorted);
    setCurrentPage(1);
  };

  // Apply filter from header dropdown
  const applyFilter = (filter: string) => {
    let filtered = [...questions];
    
    switch (filter) {
      case "unanswered":
        filtered = filtered.filter(q => q.answerCount === 0);
        break;
      case "frequent":
        filtered = filtered.filter(q => q.views > 100);
        break;
      case "votes":
        filtered = filtered.sort((a, b) => b.votes - a.votes);
        break;
      case "active":
        filtered = filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "newest":
      default:
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  };

  // Apply filter whenever filterBy changes
  useEffect(() => {
    let filtered = [...questions];
    
    switch (filterBy) {
      case "unanswered":
        filtered = filtered.filter(q => q.answerCount === 0);
        break;
      case "frequent":
        filtered = filtered.filter(q => q.views > 100);
        break;
      case "votes":
        filtered = filtered.sort((a, b) => b.votes - a.votes);
        break;
      case "active":
        filtered = filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "newest":
      default:
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [filterBy, questions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAskQuestion={() => setShowAskModal(true)}
        onSearch={handleSearch}
        onFilterChange={setFilterBy}
        currentFilter={filterBy}
      />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4 lg:gap-8">
          <div className="hidden lg:block">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          <main className="min-w-0">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Questions</h2>
                <span className="text-xs sm:text-sm text-gray-500">
                  {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSort(option.value)}
                    className="text-xs sm:text-sm whitespace-nowrap"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {currentQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={handleQuestionClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <nav className="flex items-center space-x-1 sm:space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    const isCurrentPage = pageNum === currentPage;
                    
                    // Show first page, last page, current page, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={isCurrentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="text-xs sm:text-sm px-2 sm:px-3 min-w-[32px] sm:min-w-[36px]"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    
                    // Show ellipsis for gaps
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <span key={pageNum} className="px-1 sm:px-2 py-2 text-gray-500 text-xs sm:text-sm">
                          ...
                        </span>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                  </Button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AskQuestionModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSubmit={handleSubmitQuestion}
      />
      
      <QuestionDetailModal
        question={selectedQuestion}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onVote={handleVote}
        onAcceptAnswer={handleAcceptAnswer}
        onSubmitAnswer={handleSubmitAnswer}
      />
    </div>
  );
}
