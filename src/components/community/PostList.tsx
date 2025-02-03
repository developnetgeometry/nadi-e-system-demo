import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Post } from "@/types/post";
import { transformPostData, handleVote } from "@/utils/post-utils";
import { PostActions } from "./PostActions";

export const PostList = () => {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log('Fetching posts...');
      const { data, error } = await supabase
        .from('content_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          votes_up,
          votes_down,
          author_id,
          author:profiles(full_name),
          comments:content_comments(count),
          flags:content_flags(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      
      const transformedData = data.map(transformPostData);
      console.log('Posts fetched:', transformedData);
      return transformedData;
    },
  });

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
            <PostActions
              postId={post.id}
              votesUp={post.votes_up}
              votesDown={post.votes_down}
              commentsCount={post.comments?.[0]?.count || 0}
              flagsCount={post.flags?.[0]?.count || 0}
              onVote={(postId, voteType) => handleVote(supabase, postId, voteType)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};