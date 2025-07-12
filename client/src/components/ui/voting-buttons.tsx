import { useState } from "react";
import { ChevronUp, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VotingButtonsProps {
  initialVotes: number;
  initialUserVote?: "up" | "down" | null;
  onVote: (voteType: "up" | "down") => void;
  onFavorite?: () => void;
  showFavorite?: boolean;
  isFavorited?: boolean;
}

export const VotingButtons = ({
  initialVotes,
  initialUserVote = null,
  onVote,
  onFavorite,
  showFavorite = false,
  isFavorited = false,
}: VotingButtonsProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleVote = (voteType: "up" | "down") => {
    let newVotes = votes;
    let newUserVote = userVote;

    // Remove previous vote if exists
    if (userVote === "up") {
      newVotes -= 1;
    } else if (userVote === "down") {
      newVotes += 1;
    }

    // Apply new vote if different from current
    if (userVote !== voteType) {
      if (voteType === "up") {
        newVotes += 1;
        newUserVote = "up";
      } else {
        newVotes -= 1;
        newUserVote = "down";
      }
    } else {
      newUserVote = null;
    }

    setVotes(newVotes);
    setUserVote(newUserVote);
    onVote(voteType);
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-16">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("up")}
        className={cn(
          "vote-btn transition-transform hover:scale-110",
          userVote === "up" && "text-green-600"
        )}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
      <span className="text-xl font-semibold text-gray-900">{votes}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("down")}
        className={cn(
          "vote-btn transition-transform hover:scale-110",
          userVote === "down" && "text-red-600"
        )}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>
      {showFavorite && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFavorite}
          className={cn(
            "mt-4 transition-colors",
            isFavorited ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
          )}
        >
          <Star className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
