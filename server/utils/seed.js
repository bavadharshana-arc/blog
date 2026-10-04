const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_platform';

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing data
    console.log('[Seed] Clearing existing data (Users, Posts, Comments)...');
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const users = await User.create([
      {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Senior Full Stack Engineer & Cloud Architect. Writing about scalable systems, Node.js, and modern web tech.',
      },
      {
        name: 'Sophia Chen',
        email: 'sophia@example.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        bio: 'Lead UI/UX Designer & Frontend enthusiast. Passionate about design systems, accessibility, and micro-interactions.',
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@example.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        bio: 'AI Researcher & Data Engineer. Exploring agentic workflows, LLMs, and high-performance computing.',
      },
    ]);

    console.log(`[Seed] Created ${users.length} users.`);

    console.log('[Seed] Creating sample blog posts...');
    const posts = await Post.create([
      {
        title: 'Building Resilient Distributed Systems with Node.js and Microservices',
        content: `Building scalable distributed systems requires careful architectural considerations around fault tolerance, observability, and data consistency. In high-traffic environments, single points of failure can cascade rapidly across services.

### Core Architectural Pillars

1. **Circuit Breakers & Graceful Degradation**: When a downstream service experiences latency or failure, circuit breakers prevent caller threads from exhausting memory and timeouts.
2. **Event-Driven Asynchrony**: Utilizing decoupled message queues ensures resilient background processing without blocking critical user-facing HTTP request paths.
3. **Distributed Tracing**: Context propagation via trace IDs allows engineering teams to pinpoint latency bottlenecks across dozens of microservices.

By applying robust error handling, automated health checks, and decentralized storage patterns, modern engineering teams can ensure 99.99% availability even under heavy loads.`,
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        category: 'Technology',
        tags: ['Architecture', 'Nodejs', 'Microservices', 'Backend'],
        author: users[0]._id,
      },
      {
        name: 'Mastering Modern CSS: Anchor Positioning, Subgrid, and View Transitions',
        title: 'Mastering Modern CSS: Anchor Positioning, Subgrid, and View Transitions',
        content: `CSS has undergone a renaissance over the past few years. Features that once required extensive JavaScript libraries or complex polyfills are now natively supported across major browsers.

### Key Innovations in Modern Web Styling

- **Subgrid**: Seamlessly align nested grid children to the parent grid lines, making complex card layouts and multi-column designs effortless.
- **Anchor Positioning**: Position tooltips, floating menus, and popovers relative to an anchor element with pure declarative CSS.
- **View Transitions API**: Deliver app-like, silky-smooth visual morphs between page navigations without bloated single-page router hacks.

Adopting native web platform primitives reduces your bundle size, improves Core Web Vitals (INP and LCP), and gives end users an exceptionally crisp experience.`,
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        category: 'Web Development',
        tags: ['CSS', 'Frontend', 'Design', 'WebStandards'],
        author: users[1]._id,
      },
      {
        title: 'The Rise of Autonomous AI Agents: Architecture Patterns and Practical Pitfalls',
        content: `Autonomous AI agents are transforming how software interprets human intent and executes complex, multi-step workflows. Rather than static prompt-response cycles, agents reason, execute tools, observe feedback, and self-correct.

### Key Architectural Components

- **Plan-and-Solve Loops**: Breaking broad goals into discrete, verifiable subtasks before taking irreversible actions.
- **Dynamic Tool Execution**: Equipping models with typed API schemas, sandbox execution environments, and structured output parsing.
- **Context Memory & State Management**: Managing token windows through progressive compaction and semantic vector retrieval.

While the capabilities are enormous, real-world deployment requires strict safety guardrails, human-in-the-loop validation for high-risk operations, and deterministic fallback routines.`,
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
        category: 'AI & Future',
        tags: ['ArtificialIntelligence', 'MachineLearning', 'LLM', 'Agents'],
        author: users[2]._id,
      },
      {
        title: 'The Philosophy of Micro-Interactions in Modern Product Design',
        content: `Great digital experiences are defined by the subtle details. Micro-interactions are contained product moments that do a single small job: providing feedback, explaining status, or rewarding user accomplishment.

### Principles of Delightful Micro-Interactions

1. **Trigger with Purpose**: Every animation or feedback state must provide meaningful clarity to the user.
2. **Speed & Subtlety**: Animations should feel snappy—typically between 150ms and 300ms. Anything slower causes perceived sluggishness.
3. **Respect Accessibility**: Always support \`prefers-reduced-motion\` for users sensitive to motion effects.

When designed thoughtfully, micro-interactions elevate a utilitarian web application into an intuitive, polished digital product that users love returning to.`,
        coverImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
        category: 'Design & UI',
        tags: ['UIUX', 'Animation', 'ProductDesign', 'Frontend'],
        author: users[1]._id,
      },
      {
        title: 'Step-by-Step Guide to Production JWT Authentication in Node.js',
        content: `JSON Web Tokens (JWT) are widely used for stateless authentication in modern web applications. However, improper token handling can introduce significant security vulnerabilities.

### Best Practices for Secure Authentication

- **Store Secrets Safely**: Never hardcode JWT secrets in source code; always use environment variables.
- **Enforce Expiration**: Use short-lived access tokens (e.g. 15 minutes to 7 days) to limit exposure in case of token leakage.
- **Hash Passwords with Strong Salts**: Always use bcrypt with at least 10 salt rounds before persisting credentials.
- **Granular Authorization**: Verify ownership at the controller level before updating or deleting user resources. Never rely solely on client-side routing.

Follow these rules to protect user data and ensure strict access control across your RESTful endpoints.`,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        category: 'Tutorials',
        tags: ['Security', 'JWT', 'Nodejs', 'Auth'],
        author: users[0]._id,
      },
      {
        title: 'The Deep Work Protocol: Optimizing Engineering Focus & Flow',
        content: `In an era of endless notifications, open channels, and rapid context switching, the ability to concentrate deeply on complex engineering problems is a superpower.

### Strategies for Uninterrupted Focus

- **Time-Block Deep Focus Windows**: Reserve 2 to 3 hour uninterrupted blocks specifically for architectural thinking and coding.
- **Batch Asynchronous Communication**: Check emails and messages at scheduled intervals rather than reacting continuously.
- **Document Decisions in Context**: Writing concise architectural design records reduces repetitive back-and-forth discussions.

Cultivating deep work habits creates higher code quality, fewer production bugs, and greater job satisfaction for development teams.`,
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        category: 'Productivity',
        tags: ['Productivity', 'Engineering', 'Career', 'Focus'],
        author: users[2]._id,
      },
    ]);

    console.log(`[Seed] Created ${posts.length} blog posts.`);

    console.log('[Seed] Creating sample comments...');
    const comments = await Comment.create([
      {
        content: 'Fascinating breakdown on circuit breakers! We implemented something similar with resilience4j and it drastically reduced our cascading outage rates.',
        post: posts[0]._id,
        author: users[1]._id,
      },
      {
        content: 'Great writeup Alex. What are your thoughts on using Redis for rate-limiting distributed microservices alongside circuit breakers?',
        post: posts[0]._id,
        author: users[2]._id,
      },
      {
        content: 'Subgrid has saved me hundreds of lines of hacky flexbox wrapper code. Modern CSS is truly in a golden era!',
        post: posts[1]._id,
        author: users[0]._id,
      },
      {
        content: 'Could not agree more on human-in-the-loop validation for agents. Automated guardrails are mandatory for enterprise adoption.',
        post: posts[2]._id,
        author: users[0]._id,
      },
      {
        content: 'Super clean and practical explanation of JWT auth. The ownership verification step is something a lot of beginners overlook.',
        post: posts[4]._id,
        author: users[1]._id,
      },
      {
        content: 'Time-blocking focus blocks completely transformed our sprint velocity. Great article Marcus!',
        post: posts[5]._id,
        author: users[1]._id,
      },
    ]);

    console.log(`[Seed] Created ${comments.length} comments.`);
    console.log('==============================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Demo Login Credentials:');
    console.log(' 1) alex@example.com   / Password123!');
    console.log(' 2) sophia@example.com / Password123!');
    console.log(' 3) marcus@example.com / Password123!');
    console.log('==============================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedData();
