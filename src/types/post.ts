export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  votes_up: number;
  votes_down: number;
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