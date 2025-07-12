import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

interface VoteButtonsProps {
  itemId: number;
  itemType: "question" | "answer";
  initialVoteCount: number;
  initialUserVote?: "up" | "down" | null;
  isAccepted?: boolean;
  canAccept?: boolean;
  onAccept?: () => void;
  className?: string;
}

export function VoteButtons({
  itemId,
  itemType,
  initialVoteCount,
  initialUserVote,
  isAccepted,
  canAccept,
  onAccept,
  className,
}: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(initialUserVote || null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (voteType: "up" | "down") => {
      const endpoint = itemType === "answer" 
        ? `/api/answers/${itemId}/vote`
        : `/api/questions/${itemId}/vote`;
      
      const response = await apiRequest("POST", endpoint, { voteType });
      return response.json();
    },
    onSuccess: (data) => {
      setVoteCount(data.voteCount);
      setUserVote(data.userVote);
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
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
        description: "Failed to vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (itemType !== "answer") return;
      const response = await apiRequest("POST", `/api/questions/${itemId}/accept`, {});
      return response.json();
    },
    onSuccess: () => {
      onAccept?.();
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({
        title: "Success",
        description: "Answer accepted successfully!",
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
        description: "Failed to accept answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteType: "up" | "down") => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to vote.",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate(voteType);
  };

  const handleAccept = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to accept answers.",
        variant: "destructive",
      });
      return;
    }

    acceptMutation.mutate();
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 text-muted-foreground hover:text-primary transition-all",
          userVote === "up" && "text-primary",
          "hover:scale-110"
        )}
        onClick={() => handleVote("up")}
        disabled={voteMutation.isPending}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>

      <span className="text-xl font-semibold text-foreground">
        {voteCount}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 text-muted-foreground hover:text-primary transition-all",
          userVote === "down" && "text-primary",
          "hover:scale-110"
        )}
        onClick={() => handleVote("down")}
        disabled={voteMutation.isPending}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>

      {itemType === "answer" && (canAccept || isAccepted) && (
        <div className="mt-2">
          {isAccepted ? (
            <div className="text-green-600" title="Accepted Answer">
              <Check className="h-6 w-6" />
            </div>
          ) : canAccept ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600 transition-all hover:scale-110"
              onClick={handleAccept}
              disabled={acceptMutation.isPending}
              title="Accept Answer"
            >
              <Check className="h-6 w-6" />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
