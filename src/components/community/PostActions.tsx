import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Flag } from "lucide-react";

interface PostActionsProps {
  postId: string;
  votesUp: number;
  votesDown: number;
  commentsCount: number;
  flagsCount: number;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
}

export const PostActions = ({
  postId,
  votesUp,
  votesDown,
  commentsCount,
  flagsCount,
  onVote,
}: PostActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote(postId, 'up')}
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        {votesUp}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote(postId, 'down')}
      >
        <ThumbsDown className="h-4 w-4 mr-2" />
        {votesDown}
      </Button>
      <Button variant="ghost" size="sm">
        <MessageSquare className="h-4 w-4 mr-2" />
        {commentsCount}
      </Button>
      <Button variant="ghost" size="sm">
        <Flag className="h-4 w-4 mr-2" />
        {flagsCount}
      </Button>
    </div>
  );
};