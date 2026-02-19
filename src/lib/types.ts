export type User = {
  id: string;
  name: string;
  avatar: string;
  role?: "member" | "ngo";
};

export type Reply = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  replies: Reply[];
};

export type Story = {
  id: string;
  authorId: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  tags: string[];
  likes: number;
  createdAt: string;
  comments: Comment[];
};

export type Blog = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover: string;
  publishedAt: string;
};
