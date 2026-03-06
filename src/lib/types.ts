export type User = {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  joinedAt?: string;
  role?: "member" | "ngo" | "admin";
  isSuspended?: boolean;
};

export type Reply = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  userName?: string;
  userAvatar?: string;
  likes?: number;
};

export type Comment = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  replies: Reply[];
  userName?: string;
  userAvatar?: string;
  likes?: number;
};

export type Story = {
  id: string;
  authorId: string;
  author?: User;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  images?: string[];
  status?: "draft" | "published" | "archived";
  tags: string[];
  likes: number;
  commentsCount?: number;
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
