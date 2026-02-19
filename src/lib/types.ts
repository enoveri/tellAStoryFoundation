export type User = {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  joinedAt?: string;
  role?: "member" | "ngo" | "admin";
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
  cover: string;
  publishedAt: string;
  content: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "webinar" | "community" | "fundraiser";
  image: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  country: string;
};
