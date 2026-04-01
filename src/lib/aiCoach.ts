// ─── AI Career Coach Brain ────────────────────────────────────────────────────
// A fully self-contained, intelligent career coach with rich, detailed responses.
// No external API or key needed.

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Knowledge Base ─────────────────────────────────────────────────────────

const knowledgeBase: { patterns: RegExp[]; responses: string[] }[] = [
  // ── Greetings & small talk ───────────────────────────────────────────────
  {
    patterns: [/^(hi|hello|hey|howdy|sup|what'?s up|good (morning|afternoon|evening))/i],
    responses: [
      "Hey there! 👋 I'm your AI Career Coach. I'm here to help you level up your skills, prep for interviews, plan your learning journey, or navigate your career path. What are you working on today?",
      "Hello! Great to see you. I can help with skill roadmaps, interview prep, portfolio tips, salary negotiation, and much more. Where do you want to start?",
    ],
  },
  {
    patterns: [/how are you|how('?re| are) you doing/i],
    responses: [
      "I'm doing great and ready to help you crush your career goals! 🚀 What can I assist you with today?",
    ],
  },
  {
    patterns: [/thank(s| you)/i],
    responses: [
      "You're welcome! 😊 Don't hesitate to ask if you have more questions. Good luck with your journey!",
      "Anytime! Keep up the momentum — consistency is everything in tech. Anything else I can help with?",
    ],
  },

  // ── Frontend Skills ──────────────────────────────────────────────────────
  {
    patterns: [/frontend|front.end|react|next\.?js|vue|angular|svelte|web dev/i],
    responses: [
      `**Frontend Developer Roadmap (2026 Edition)** 🎨

Here are the most critical skills to focus on:

**Foundations (Non-negotiable)**
- **HTML5 semantics** — Accessibility, SEO, screen readers
- **CSS3 & layout** — Flexbox, Grid, custom properties, animations
- **JavaScript (ES2024+)** — Async/await, closures, modules, Promises

**Core Framework**
- **React** (most jobs) or **Vue 3** (growing fast)
- Learn hooks deeply: \`useState\`, \`useEffect\`, \`useContext\`, \`useReducer\`
- **TypeScript** — Now basically required at any serious company

**Ecosystem**
- **Next.js** or **Vite** — App routing, SSR, RSC
- **TanStack Query** — Server state management
- **Tailwind CSS** or **CSS Modules**
- **Testing** — Vitest, RTL, Playwright

**Performance**
- Core Web Vitals (LCP, CLS, INP)
- Code splitting, lazy loading, image optimization

Want a detailed week-by-week learning plan for any of these?`,
    ],
  },

  // ── Backend Skills ───────────────────────────────────────────────────────
  {
    patterns: [/backend|back.end|node|express|django|flask|spring|api|rest|graphql|database/i],
    responses: [
      `**Backend Developer Roadmap (2026)** ⚙️

**Core Language — Pick one to master:**
- **Node.js/TypeScript** — Most in demand for startups & scale-ups
- **Python (FastAPI/Django)** — AI integrations, data-heavy apps
- **Go** — High-performance microservices
- **Java (Spring Boot)** — Enterprise / fintech

**APIs**
- REST (master it first) → GraphQL → gRPC
- OpenAPI/Swagger documentation
- Rate limiting, versioning, authentication (JWT, OAuth2)

**Databases**
- **PostgreSQL** — Primary relational DB 
- **MongoDB** — Flexible documents
- **Redis** — Caching, sessions, pub/sub
- Learn indexing, query optimization, transactions

**DevOps Basics (Expected of backend devs)**
- Docker & Docker Compose
- CI/CD with GitHub Actions
- Basic cloud (AWS S3, Lambda, RDS)

**Architecture Patterns**
- MVC, Repository pattern
- Microservices vs monolith trade-offs
- Event-driven with Kafka or RabbitMQ

What stack are you currently building with?`,
    ],
  },

  // ── System Design ────────────────────────────────────────────────────────
  {
    patterns: [/system design|architecture|scalab|distributed|microservice|load balanc/i],
    responses: [
      `**System Design Interview Masterplan** 🏗️

**Step-by-Step Framework for Any Question:**

1. **Clarify requirements** (2-3 min)
   - How many users? Reads vs. writes ratio?
   - Latency tolerance? Consistency needs?

2. **High-level design** (5 min)
   - Draw client → LB → API → DB flow
   - Identify main components

3. **Deep dive** (15 min)
   - Database schema & choice (SQL vs. NoSQL)
   - Caching strategy (Redis, CDN)
   - API design & contracts

4. **Scale it** (5 min)
   - Horizontal scaling, sharding, replication
   - Async processing, message queues

**Must-Know Concepts:**
- CAP theorem & BASE vs. ACID
- Consistent hashing
- Rate limiting (Token bucket, sliding window)
- CDNs, DNS, Load Balancers
- Database indexing, sharding, replication

**Practice Problems (by difficulty):**
- 🟢 URL shortener (TinyURL)
- 🟡 Twitter/Instagram feed
- 🟡 WhatsApp messaging
- 🔴 Google Search autocomplete
- 🔴 YouTube / Netflix streaming

Want me to walk through any of these end-to-end?`,
    ],
  },

  // ── Data Structures & Algorithms ─────────────────────────────────────────
  {
    patterns: [/dsa|data structure|algorithm|leetcode|coding interview|problem solving/i],
    responses: [
      `**DSA Interview Prep Guide** 💡

**High-ROI Topics (in priority order):**

**🔥 Must-Master (covers ~80% of interview questions):**
1. Arrays & Strings — sliding window, two pointers
2. Hash Maps/Sets — frequency counting, lookups
3. Trees — DFS, BFS, traversal patterns
4. Dynamic Programming — tabulation, memoization
5. Graphs — BFS/DFS, topological sort, Dijkstra

**Week-by-Week Plan:**
- **Week 1:** Arrays, Strings, Hash Maps (50+ problems)
- **Week 2:** Linked Lists, Stacks, Queues
- **Week 3:** Trees, Heaps, Priority Queues
- **Week 4:** Graphs, Backtracking
- **Week 5-6:** DP patterns, Mock Interviews

**Pattern Recognition Cheat Sheet:**
- "Max/Min of a subarray" → Sliding Window
- "Top K elements" → Heap
- "All permutations/subsets" → Backtracking
- "Shortest path" → BFS/Dijkstra
- "Optimal substructure" → DP

**Recommended resources:**
- NeetCode 150 (structured list)
- Blind 75 (quick prep)
- LeetCode company-specific lists
- "Cracking the Coding Interview" book

Which pattern should we dive into?`,
    ],
  },

  // ── Interview Prep ───────────────────────────────────────────────────────
  {
    patterns: [/interview|behavioral|STAR|tell me about yourself|weakness|strength/i],
    responses: [
      `**Complete Interview Preparation Guide** 🎯

**Technical Round:**
- Study the job description & match your stories to it
- Know the company's tech stack & products
- Have 3-5 projects you can discuss in depth
- Practice coding out loud — narrate your thought process

**Behavioral Round (STAR Method):**
- **S**ituation: Set the scene briefly
- **T**ask: What was your responsibility?
- **A**ction: What specific steps did YOU take?
- **R**esult: What was the measurable outcome?

**Top 10 Questions to Prepare:**
1. "Tell me about yourself" → 90-sec elevator pitch
2. "Why this company?" → Research + genuine reason
3. "Biggest challenge you overcame" → Show resilience
4. "Conflict with a teammate" → Show maturity
5. "Failure or mistake" → Show growth mindset
6. "Why are you leaving?" → Keep it positive
7. "Where do you see yourself in 5 years?" → Align with role
8. "What's your greatest strength?" → Back it with a story
9. "Tell me about a project you're proud of" → Your best work
10. "Do you have any questions?" → Always have 3 good ones!

**Questions to ask them:**
- "What does success look like in this role in 90 days?"
- "What are the biggest challenges the team is facing?"
- "How does the team handle technical debt?"

Want me to do a mock interview Q&A with you?`,
    ],
  },

  // ── Learning Plans ───────────────────────────────────────────────────────
  {
    patterns: [/plan|roadmap|learn|study|course|curriculum|30.day|week|schedule/i],
    responses: [
      `**Custom Learning Plan Framework** 📅

Here's how to build an effective study plan:

**The 3-Phase Approach:**

**Phase 1 — Foundation (Weeks 1-2)**
- Cover core concepts, not everything
- One resource only (avoid "tutorial hell")
- Build something tiny every day

**Phase 2 — Application (Weeks 3-4)**
- Build 2-3 real projects
- No more tutorials — figure things out yourself
- Document your work on GitHub

**Phase 3 — Polish & Ship (Weeks 5-6)**
- Deploy your projects live
- Write a case study for each
- Start applying while still learning

**30-Day React Mastery Plan:**
📅 **Days 1-5:** Hooks, JSX, state management basics  
📅 **Days 6-10:** Routing, API calls, form handling  
📅 **Days 11-17:** TypeScript, context, custom hooks  
📅 **Days 18-24:** Next.js, SSR, performance  
📅 **Days 25-30:** Ship a capstone project to production

**Golden Rule:** 20% consuming content, 80% building things.

Tell me your current level and what you want to learn — I'll tailor a plan for you!`,
    ],
  },

  // ── Portfolio ────────────────────────────────────────────────────────────
  {
    patterns: [/portfolio|project|github|showcase|demo|personal site/i],
    responses: [
      `**Portfolio Strategy That Gets You Hired** 🖥️

**Quality over quantity — 3 great projects beat 10 mediocre ones.**

**Project Formula (each project should have):**
- Live demo link (Vercel, Netlify, or Railway)
- Clean GitHub repo with a great README
- A "case study" explaining WHY you built it and WHAT challenges you solved
- Tech stack clearly listed
- Screenshots or a short video walkthrough

**Project Ideas by Level:**

🟢 **Junior (Demonstrating fundamentals):**
- Full-stack todo/task manager with auth
- Weather app with location + dark mode
- E-commerce product page with cart

🟡 **Mid-level (Demonstrating depth):**
- Real-time chat application (WebSockets)
- Dashboard with charting & filters
- REST API with auth, caching, and rate limiting

🔴 **Senior (Demonstrating architecture):**
- Multi-tenant SaaS with subscription billing
- Microservices app with a Message Queue
- An open-source library with 10+ GitHub stars

**Personal Website Must-Haves:**
- Fast load time (< 2s)
- Mobile responsive
- Clear CTAs (View Project, Contact Me)
- A short, confident bio (no "aspiring developer"!)

What projects are you currently building?`,
    ],
  },

  // ── Career & Jobs ────────────────────────────────────────────────────────
  {
    patterns: [/job|career|salary|promotion|offer|apply|resume|cv|linkedin|job search/i],
    responses: [
      `**Job Search & Career Strategy (2026)** 💼

**Resume that gets past ATS:**
- Use keywords from the job description
- Quantify achievements: "reduced load time by 40%" not "improved performance"
- 1 page for < 5 years experience
- Use a clean, simple format (no tables, no headers as images)
- Include: Summary, Skills, Experience, Projects, Education

**LinkedIn Optimization:**
- Profile photo (gets 21x more views)
- Strong headline — not just your title: "Frontend Engineer | React & TypeScript | Building fast, accessible web apps"
- "Open to Work" frame (yes, it works)
- Post technical content 1-2x per week
- Connect with recruiters and engineers at target companies

**Job Search Strategy:**
- Apply to 5-10 roles/day (not more, aim for quality)
- 60% job boards (LinkedIn, Indeed, Wellfound)
- 30% direct outreach / referrals (highest success rate)
- 10% networking events, meetups, Twitter/X

**Salary Negotiation:**
- Always negotiate (90% of employers expect it)
- Anchor high — you can always come down
- "I'm very excited about this role. Based on my research and experience, I was expecting something closer to $X."
- Get the offer in writing before giving notice

What specific part of your job search can I help with?`,
    ],
  },

  // ── AI / ML ──────────────────────────────────────────────────────────────
  {
    patterns: [/ai|machine learning|deep learning|llm|gpt|ml|data science|python/i],
    responses: [
      `**AI/ML Engineer Roadmap (2026)** 🤖

This is the hottest field in tech right now. Here's how to break in:

**Foundation (6-8 weeks):**
- **Python** (NumPy, Pandas, Matplotlib)
- **Math**: Linear algebra, calculus basics, probability/stats
- **ML fundamentals**: Supervised, unsupervised, reinforcement learning

**Core Machine Learning (8-10 weeks):**
- Regression, classification, clustering (scikit-learn)
- Train/test splits, evaluation metrics, cross-validation
- Feature engineering and selection

**Deep Learning (8-10 weeks):**
- Neural networks, backpropagation
- CNNs (images), RNNs/LSTMs (sequences)
- **Transformers & Attention** — the foundation of LLMs
- PyTorch (preferred by research) or TensorFlow/Keras

**LLM / Generative AI (Current Hottest Skill):**
- Fine-tuning with Hugging Face
- RAG (Retrieval Augmented Generation)
- LangChain, LlamaIndex for AI apps
- Prompt engineering
- Vector databases (Pinecone, Weaviate)

**Best Projects to Build:**
- Sentiment analysis app
- Image classifier with CNN
- Chatbot with Retrieval Augmented Generation
- Resume parser using NLP

What's your current Python level?`,
    ],
  },

  // ── Salary & Negotiation ─────────────────────────────────────────────────
  {
    patterns: [/salary|negotiat|pay|compensation|raise|package|ctc|offer/i],
    responses: [
      `**Salary Negotiation Playbook** 💰

**The #1 Rule: Never give a number first.**

When asked "What are your salary expectations?":
> *"I'd love to learn more about the role and responsibilities first so I can give you an informed answer. What's the budgeted range for this position?"*

**When you receive an offer:**
1. Don't accept on the spot — "Thank you! I'd like to take a day or two to review it."
2. Research market rates (levels.fyi, Glassdoor, LinkedIn Salary)
3. Negotiate the base first, then equity + bonus

**The Negotiation Script:**
> *"I'm really excited about this opportunity and the team. I was hoping we could get to $[X] on the base. Based on my experience with [specific skills], and the market rates I've researched, I think that's fair. Is there room to get there?"*

**What's negotiable beyond salary:**
- Signing bonus (great for bridging gaps)
- Remote work flexibility
- Extra PTO days
- Learning & development budget
- Equity (ISOs vs RSUs)
- Later start date

**Indian Market Context (2026):**
- Freshers: ₹8-20 LPA depending on company tier
- 2-3 years: ₹20-40 LPA
- 5+ years: ₹40-80+ LPA
- FAANG/unicorn premium: 2-4x typical market

Want to role-play a negotiation conversation?`,
    ],
  },

  // ── Soft Skills & Leadership ─────────────────────────────────────────────
  {
    patterns: [/soft skill|communication|leadership|team|management|senior|staff|principal/i],
    responses: [
      `**From IC to Senior/Staff Engineer** 🌟

Technical skills get you hired. Soft skills get you promoted.

**Skills that differentiate seniors from juniors:**

**Technical Impact:**
- You don't just solve assigned problems — you *find* problems worth solving
- You write code that others can read, maintain, and extend
- You think about edge cases, failure modes, and scalability upfront

**Communication:**
- Write clear technical documents (RFCs, ADRs)
- Give feedback in code reviews that's helpful, not critical
- Translate technical complexity to non-technical stakeholders

**Influence Without Authority:**
- Build trust through consistent delivery
- Share knowledge — pair program, present at team syncs, write eng blog posts
- Mentor junior developers

**Thinking Like a Senior:**
- "What is the *right* problem to solve?" before jumping to code
- Understand business context, not just technical requirements
- Propose options with trade-offs, let the team decide

**Path to Staff/Principal:**
1. Consistent delivery at senior level
2. Own a domain end-to-end
3. Lead cross-functional projects
4. Define technical strategy (roadmaps, standards)

What's your current level and where do you want to get to?`,
    ],
  },

  // ── Burnout & Motivation ─────────────────────────────────────────────────
  {
    patterns: [/burnout|motivat|stuck|overwhelm|tired|stress|imposter|confidence/i],
    responses: [
      `**Dealing with Burnout & Imposter Syndrome** 💙

First: you're not alone. Even the best engineers feel this.

**Signs you're burning out:**
- Dreading opening your laptop
- Can't focus for more than 20 minutes
- Everything feels pointless

**What actually helps:**

**Short-term (this week):**
- Take a real day off — no code, no Twitter
- Go for a 30-min walk daily (genuinely works)
- Write down 3 things you've accomplished recently

**Medium-term (this month):**
- Set hard boundaries — no work after 7 PM
- Protect your weekends fiercely
- Find a "fun side project" with zero pressure

**For imposter syndrome:**
- Keep a "wins log" — write down every win, big or small
- Remember: everyone Googles things, even senior engineers
- Compare yourself to yourself 6 months ago, not Instagram devs

**A reframe that helps:**
> "I don't need to know everything. I need to know *how to learn* anything."

The fact that you feel imposter syndrome often means you're growing and taking on challenges outside your comfort zone. That's a good thing.

What's been making you feel this way? Let's talk through it.`,
    ],
  },

  // ── Open Source ──────────────────────────────────────────────────────────
  {
    patterns: [/open source|contribute|github|pr|pull request|open.source/i],
    responses: [
      `**Getting Started with Open Source** 🌍

Contributing to open source is one of the best ways to accelerate your career.

**Why it matters:**
- Real-world code reviews from experienced engineers
- Public proof of your skills (better than a portfolio site)
- Builds your network
- Many contributors get hired by the projects they contribute to

**How to start:**

**Step 1: Find the right project**
- Tools you already use daily
- Look for \`good first issue\` and \`help wanted\` labels on GitHub
- Start small: documentation, tests, bug fixes

**Step 2: Your first contribution**
1. Fork the repo, clone locally
2. Read CONTRIBUTING.md carefully
3. Run the project locally to understand it
4. Make a small, focused PR
5. Follow the code style of the existing project

**Step 3: Level up**
- Fix real bugs (not just typos)
- Add features from the roadmap/issues
- Review other PRs — you learn a ton
- Write blog posts about your contributions

**Good starter projects:**
- \`freeCodeCamp\` — beginner-friendly everything
- \`React\` — great for reading production-level code
- \`VS Code extensions\` — lower barrier, high impact
- Any library in your stack on GitHub

Want me to help you identify a project to contribute to based on your interests?`,
    ],
  },

  // ── Freelancing ──────────────────────────────────────────────────────────
  {
    patterns: [/freelanc|consultant|client|upwork|fiverr|contract|independent/i],
    responses: [
      `**Freelancing as a Developer (2026 Guide)** 🧑‍💻

**Getting your first client:**

**Option 1: Warm network (fastest)**
- Tell everyone you know you're available
- Ex-colleagues, college friends, local businesses
- "I'm taking on a few projects — do you know anyone who needs a website?"

**Option 2: Platforms**
- **Upwork** — competitive but quality clients exist
- **Toptal** — premium, vetted, higher rates
- **LinkedIn** — underrated for B2B consulting
- **Twitter/X** — building in public attracts clients

**Pricing your work:**

| Experience | Hourly Rate (USD) |
|---|---|
| Beginner | $25-50/hr |
| Mid-level | $75-125/hr |
| Senior | $150-250/hr |

- Don't sell yourself cheap (low rates attract bad clients)
- Project rates > hourly rates (earn more, less admin)
- Add a 20-30% buffer for revisions

**The Business Side:**
- Get a contract (always!) — use Bonsai or Honeybook
- Milestone-based payments
- 50% upfront from new clients
- Track income for taxes (Hurdlr, Wave)

**What clients actually want:**
- Clear communication > technical skills
- On-time delivery
- Proactive updates (don't go silent)

Want a freelancer's proposal template?`,
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────
];

// ─── Exports ─────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const fallbackResponses = [
  `That's a great area to explore! Here are some broad career coaching tips while I process your question:

**If you're learning:**
- Focus on depth over breadth — master one thing before spreading out
- Build projects, not just watch tutorials
- Consistency beats intensity (30 min/day > 5 hours on weekends)

**If you're job hunting:**
- Tailor every resume to the JD (keywords matter for ATS)
- Apply broadly but follow up strategically
- Your network is your #1 asset

Could you give me a bit more detail on what you're looking for? For example:
- Are you looking for skill-building advice?
- Interview prep?
- Career transition guidance?
- Project ideas?

I can give you much more targeted help!`,

  `Good question! Let me help you think through this.

The best career advice is always tailored. Tell me a bit more:
- **Where are you now?** (e.g., student, junior dev, mid-level, career switcher)
- **Where do you want to be?** (e.g., senior engineer, freelancer, FAANG, startup)
- **What's blocking you?** (e.g., skills, interviews, motivation, clarity)

I'm ready to give you a personalized action plan!`,
];

export async function getAIResponse(
  userMessage: string,
  _history: ConversationMessage[]
): Promise<string> {
  // Simulate a realistic thinking delay
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

  const lower = userMessage.toLowerCase();

  for (const entry of knowledgeBase) {
    if (entry.patterns.some((p) => p.test(lower))) {
      return pickRandom(entry.responses);
    }
  }

  return pickRandom(fallbackResponses);
}
