import type { Blog, Story, User } from "@/lib/types";

export const users: User[] = [
  { id: "u1", name: "Amina", avatar: "https://i.pravatar.cc/100?img=12", role: "ngo" },
  { id: "u2", name: "Kelvin", avatar: "https://i.pravatar.cc/100?img=33", role: "member" },
  { id: "u3", name: "Maya", avatar: "https://i.pravatar.cc/100?img=41", role: "member" },
];

export const stories: Story[] = [
  {
    id: "s1",
    authorId: "u2",
    title: "How one book changed my village",
    excerpt: "A shared story circle sparked a reading movement among children.",
    body: "Every Friday, we sat under the mango tree and took turns reading aloud. What began with five children became thirty. Parents started staying, then volunteering. The story circle gave us language for hope and courage.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    tags: ["community", "education"],
    likes: 128,
    createdAt: "2h ago",
    comments: [
      {
        id: "c1",
        userId: "u3",
        content: "This is powerful. Did you keep a list of the books used?",
        createdAt: "1h ago",
        replies: [{ id: "r1", userId: "u2", content: "Yes, I can share our starter list soon.", createdAt: "48m ago" }],
      },
    ],
  },
  {
    id: "s2",
    authorId: "u3",
    title: "My first safe space workshop",
    excerpt: "I walked in scared and left with a family of listeners.",
    body: "The workshop was simple: write one page about your turning point. Hearing others read made me feel seen. We cried, laughed, and promised to keep meeting monthly.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    tags: ["healing", "storytelling"],
    likes: 84,
    createdAt: "5h ago",
    comments: [],
  },
];

export const blogs: Blog[] = [
  {
    id: "b1",
    slug: "why-storytelling-heals-communities",
    title: "Why Storytelling Heals Communities",
    summary: "How personal narratives build trust, belonging, and practical change.",
    cover: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Feb 14, 2026",
    content: `## Story is memory in motion\n\nAt Tell A Story, we have seen that when one person shares honestly, another person feels permission to do the same.\n\n### What changes after stories are shared\n\n- People listen with empathy\n- Youth gain confidence to speak up\n- Communities identify practical local solutions\n\n> Stories don't replace action; they activate it.\n\nWe continue creating circles where stories become bridges between people who previously felt unseen.`,
  },
];

export function findUser(userId: string) {
  return users.find((user) => user.id === userId);
}

export function findStory(storyId: string) {
  return stories.find((story) => story.id === storyId);
}

export function findBlog(slug: string) {
  return blogs.find((blog) => blog.slug === slug);
}
