import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Flag } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  votes_up: number | null;
  votes_down: number | null;
  author_id: string | null;
  author: {
    full_name: string | null;
  } | null;
  comments: {
    count: number;
  }[];
  flags: {
    count: number;
  }[];
}

export const PostList = () => {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log('Fetching posts...');
      const { data, error } = await supabase
        .from('content_posts')
        .select(`
          *,
          author:profiles!content_posts_author_id_fkey(full_name),
          comments:content_comments(count),
          flags:content_flags(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      console.log('Posts fetched:', data);
      return data;
    },
  });

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      const { error } = await supabase
        .from('content_votes')
        .upsert({
          post_id: postId,
          vote_type: voteType,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Posted by {post.author?.full_name || 'Anonymous'} on {format(new Date(post.created_at), 'PPP')}
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{post.content}</p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(post.id, 'up')}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {post.votes_up || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(post.id, 'down')}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                {post.votes_down || 0}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments?.[0]?.count || 0}
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                {post.flags?.[0]?.count || 0}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};