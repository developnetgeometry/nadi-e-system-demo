import { Post } from "@/types/post";

export const transformPostData = (post: any): Post => ({
  ...post,
  votes_up: post.votes_up || 0,
  votes_down: post.votes_down || 0,
  author: post.author || { full_name: null },
  comments: post.comments || [{ count: 0 }],
  flags: post.flags || [{ count: 0 }]
});

export const handleVote = async (supabase: any, postId: string, voteType: 'up' | 'down') => {
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