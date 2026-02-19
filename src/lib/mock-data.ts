import type { Blog, Event, Story, Testimonial, User } from "@/lib/types";

export const users: User[] = [
  { id: "u1", name: "Amara Nwosu",   avatar: "https://i.pravatar.cc/150?img=47", role: "admin",  bio: "Founder & Executive Director", joinedAt: "Jan 2024" },
  { id: "u2", name: "Kelvin Osei",    avatar: "https://i.pravatar.cc/100?img=33", role: "member", bio: "Storyteller from Accra",          joinedAt: "Mar 2024" },
  { id: "u3", name: "Maya Patel",     avatar: "https://i.pravatar.cc/100?img=41", role: "member", bio: "Writer & community healer",       joinedAt: "Apr 2024" },
  { id: "u4", name: "Fatima Hassan",  avatar: "https://i.pravatar.cc/100?img=5",  role: "member", bio: "Youth advocate, Lagos",           joinedAt: "Jun 2024" },
  { id: "u5", name: "David Okonkwo",  avatar: "https://i.pravatar.cc/100?img=8",  role: "member", bio: "Poet and educator",               joinedAt: "Jul 2024" },
  { id: "u6", name: "Zara Ahmed",     avatar: "https://i.pravatar.cc/100?img=21", role: "member", bio: "Safe-space facilitator",          joinedAt: "Sep 2024" },
  { id: "u7", name: "Samuel Bah",     avatar: "https://i.pravatar.cc/100?img=15", role: "ngo",    bio: "NGO partner coordinator",       joinedAt: "Oct 2024" },
];

export const stories: Story[] = [
  {
    id: "s1",
    authorId: "u2",
    title: "How one book changed my village",
    excerpt: "A shared story circle sparked a reading movement among children.",
    body: "Every Friday, we sat under the mango tree and took turns reading aloud. What began with five children became thirty. Parents started staying, then volunteering. The story circle gave us language for hope and courage.\n\nThe village chief noticed. He donated a small plot of land. Last month we laid the foundation for the first proper library our community has ever had. It started with one book and the willingness to share it.",
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
      {
        id: "c2",
        userId: "u6",
        content: "A library born from a story circle — this is exactly what Tell A Story is about.",
        createdAt: "30m ago",
        replies: [],
      },
    ],
  },
  {
    id: "s2",
    authorId: "u3",
    title: "My first safe space workshop",
    excerpt: "I walked in scared and left with a family of listeners.",
    body: "The workshop was simple: write one page about your turning point. Hearing others read made me feel seen. We cried, laughed, and promised to keep meeting monthly.\n\nSix months later I facilitate workshops myself. Watching someone read their story aloud for the first time — the courage it takes — reminds me why this work is sacred.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    tags: ["healing", "storytelling"],
    likes: 84,
    createdAt: "5h ago",
    comments: [
      {
        id: "c3",
        userId: "u4",
        content: "Thank you for sharing this. I'm thinking about attending my first workshop — you've made it feel less scary.",
        createdAt: "3h ago",
        replies: [{ id: "r2", userId: "u3", content: "Please come. The first step is always the hardest and the most worth it.", createdAt: "2h ago" }],
      },
    ],
  },
  {
    id: "s3",
    authorId: "u4",
    title: "Finding my voice through grief",
    excerpt: "Losing my mother made me silent. Writing brought me back.",
    body: "After my mother died I stopped speaking at family gatherings. The words felt too heavy to carry out of my mouth. A neighbour gave me a notebook and said: write to her.\n\nI wrote every morning for forty days. Slowly the grief stopped living only inside me. It had a home on the page. When I finally read a piece aloud at a Tell A Story circle, three women wept with me. That shared grief was the beginning of my healing.",
    image: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1200&q=80",
    tags: ["grief", "healing", "writing"],
    likes: 211,
    createdAt: "1d ago",
    comments: [
      {
        id: "c4",
        userId: "u5",
        content: "\"That shared grief was the beginning of my healing\" — I will carry this sentence with me.",
        createdAt: "20h ago",
        replies: [],
      },
    ],
  },
  {
    id: "s4",
    authorId: "u5",
    title: "Letters to the future",
    excerpt: "I teach poetry to boys who have never read a poem about themselves.",
    body: "In my class of fifteen-year-olds, no one has ever seen their name or face in a poem. So we wrote them ourselves — to our future selves, ten years ahead.\n\nOne student wrote: 'Dear David at 25, I hope you learned how to stay.' He cried when he read it. But he stayed in class the rest of that week. Letters to ourselves can sometimes be the permission we forgot to give.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    tags: ["youth", "education", "poetry"],
    likes: 97,
    createdAt: "2d ago",
    comments: [],
  },
  {
    id: "s5",
    authorId: "u6",
    title: "The night we kept talking",
    excerpt: "A power cut became our best community meeting ever.",
    body: "The electricity went out during our community event. People expected us to reschedule. Instead we sat in the dark and someone said 'let's just talk'.\n\nFor three hours we shared without screens, without notes, without roles. The community director spoke about his own fear of failure. A teenager told us she had been homeless for two months and no one knew. By end of night we had three volunteers, two new safe-space hosts, and a plan. Sometimes the light going out is an invitation.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    tags: ["community", "connection"],
    likes: 143,
    createdAt: "3d ago",
    comments: [
      {
        id: "c5",
        userId: "u2",
        content: "That teenager deserved to be found. Thank you for being the people who found her.",
        createdAt: "2d ago",
        replies: [],
      },
    ],
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
  {
    id: "b2",
    slug: "five-ways-to-facilitate-a-story-circle",
    title: "Five Ways to Facilitate a Story Circle",
    summary: "A practical guide for anyone who wants to create safe storytelling spaces in their community.",
    cover: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Feb 19, 2026",
    content: `## Anyone can hold this space\n\nYou do not need a therapist's licence to host a story circle. You need presence, curiosity, and the courage to go first.\n\n### 1. Set the container\n\nOpen with a simple agreement: what is said here stays here. Confidentiality is the soil that stories grow in.\n\n### 2. Use a prompt, not a question\n\nQuestions can feel like interrogation. A prompt like *"tell us about a moment when you felt truly heard"* invites rather than demands.\n\n### 3. Model vulnerability first\n\nFacilitators share a small, real moment before asking others. This signals that the space is genuinely safe.\n\n### 4. Receive without fixing\n\nAfter someone shares, resist advice. A simple *"thank you for trusting us with that"* is more powerful than any solution.\n\n### 5. Close with gratitude\n\nEnd each session by naming one thing you noticed in the room — the courage, the honesty, the laughter. This seals the circle.\n\n> The world changes one story at a time. Start your circle this week.`,
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

export function findEvent(eventId: string) {
  return events.find((event) => event.id === eventId);
}

export const events: Event[] = [
  {
    id: "e1",
    title: "Community Story Circle",
    description: "Join our monthly gathering where members share personal stories in a safe, facilitated space.",
    date: "Mar 8, 2026",
    time: "10:00 AM",
    location: "Accra Community Hall, Ghana",
    type: "community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop",
  },
  {
    id: "e2",
    title: "Storytelling for Healing — Workshop",
    description: "A hands-on workshop exploring how writing your story can be a powerful tool for mental wellness.",
    date: "Mar 15, 2026",
    time: "2:00 PM",
    location: "Online (Zoom)",
    type: "workshop",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=250&fit=crop",
  },
  {
    id: "e3",
    title: "Annual Fundraiser Gala",
    description: "An evening of stories, music, and celebration to raise funds for our next chapter of programmes.",
    date: "Apr 3, 2026",
    time: "6:30 PM",
    location: "Lagos, Nigeria",
    type: "fundraiser",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Fatima Yusuf",
    role: "Community member, Kano",
    avatar: "https://i.pravatar.cc/150?img=5",
    quote: "Before Tell A Story I thought my life was too ordinary to matter. Now I know every ordinary life is extraordinary. My story was published and three strangers said it changed their week.",
    country: "Nigeria",
  },
  {
    id: "t2",
    name: "David Mensah",
    role: "Youth facilitator, Accra",
    avatar: "https://i.pravatar.cc/150?img=15",
    quote: "I use the workshops with my youth group every month. The transformation in confidence and empathy among teenagers is something I could not have produced with any other tool.",
    country: "Ghana",
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "Survivor & storyteller",
    avatar: "https://i.pravatar.cc/150?img=29",
    quote: "Writing my story here was the first time I chose my own narrative. The comments from strangers who felt seen by my words healed something in me I didn't know was broken.",
    country: "Kenya",
  },
];
