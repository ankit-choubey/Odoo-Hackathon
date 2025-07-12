import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Questions from "@/pages/Questions";
import QuestionDetail from "@/pages/QuestionDetail";
import AskQuestion from "@/pages/AskQuestion";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/questions" component={Questions} />
          <Route path="/questions/:id" component={QuestionDetail} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/questions" component={Questions} />
          <Route path="/questions/:id" component={QuestionDetail} />
          <Route path="/ask" component={AskQuestion} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
