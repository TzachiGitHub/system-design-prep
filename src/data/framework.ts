export interface FrameworkStep {
  letter: string;
  name: string;
  description: string;
  timeMinutes: number;
  tips: string[];
}

export interface InterviewFramework {
  steps: FrameworkStep[];
  commonMistakes: string[];
  communicationTips: string[];
  questionsToAsk: string[];
}

export const framework: InterviewFramework = {
  steps: [
    {
      letter: 'R',
      name: 'Requirements',
      description: 'Clarify functional and non-functional requirements. Ask questions to narrow scope. Don\'t assume — interviewers deliberately leave things vague to see if you ask.',
      timeMinutes: 5,
      tips: [
        'Ask: "Who are the users? How many?" (scale)',
        'Ask: "What are the core features?" (prioritize 2-3 for 45 min)',
        'Ask: "Read-heavy or write-heavy?" (drives architecture)',
        'Ask: "What consistency guarantees do we need?" (strong vs eventual)',
        'Ask: "What\'s the expected latency?" (p99 target)',
        'Write requirements down visibly — shows organization',
        'Non-functional: availability, scalability, latency, durability, consistency',
        'State assumptions explicitly: "I\'ll assume 100M DAU..."',
      ],
    },
    {
      letter: 'E',
      name: 'Estimation',
      description: 'Back-of-envelope calculations for traffic, storage, bandwidth, and compute. This proves you think about scale.',
      timeMinutes: 5,
      tips: [
        'Start with DAU → calculate QPS (DAU × actions / 86400)',
        'Peak QPS = average × 3 (typical peak factor)',
        'Estimate storage: data per record × records per day × retention',
        'Estimate bandwidth: data per request × QPS',
        'Round aggressively: 86400 ≈ 100K. It\'s about order of magnitude.',
        'Mention read:write ratio — it drives caching and replication strategy',
        'End with a summary: "So we need ~10K QPS, ~1TB storage/year, ~100Mbps bandwidth"',
      ],
    },
    {
      letter: 'S',
      name: 'Storage Schema',
      description: 'Design your data model. Choose databases. Define key entities and relationships. This is where SQL vs NoSQL decisions happen.',
      timeMinutes: 5,
      tips: [
        'Start with core entities (User, Post, Message, etc.)',
        'Define relationships (1:1, 1:N, N:M)',
        'Choose SQL for relational data with ACID needs, NoSQL for flexible/high-throughput',
        'Think about access patterns: "How will we query this?"',
        'Mention indexing strategy for common queries',
        'Consider polyglot persistence: different stores for different needs',
        'Don\'t over-design — focus on the 2-3 most important tables/collections',
      ],
    },
    {
      letter: 'H',
      name: 'High-Level Design',
      description: 'Draw the big picture: clients, load balancers, application servers, databases, caches, message queues. Show the request flow.',
      timeMinutes: 5,
      tips: [
        'Start simple: Client → LB → App Servers → DB',
        'Add components as needed: Cache, CDN, Message Queue, Search',
        'Draw arrows showing data flow direction',
        'Label each component with its purpose',
        'Show read path and write path separately if they differ',
        'This is your "north star" — you\'ll zoom into each component later',
        'Mention API Gateway if microservices',
      ],
    },
    {
      letter: 'A',
      name: 'API Design',
      description: 'Define the key API endpoints. RESTful design with clear request/response formats. Shows you think about the interface contract.',
      timeMinutes: 3,
      tips: [
        'Define 3-5 most important endpoints',
        'Use RESTful conventions: GET for reads, POST for creates, PUT for updates',
        'Include pagination for list endpoints (cursor-based > offset-based)',
        'Mention authentication (API key, JWT, OAuth)',
        'Consider rate limiting per endpoint',
        'Include response format: what fields are returned',
        'For real-time: mention WebSocket or SSE endpoints',
      ],
    },
    {
      letter: 'D',
      name: 'Detailed Design',
      description: 'Deep dive into 2-3 critical components. This is where you show depth. Pick the most interesting/challenging parts.',
      timeMinutes: 12,
      tips: [
        'Pick components that are unique to this problem (not generic LB discussion)',
        'Show detailed data flow within the component',
        'Discuss algorithms: consistent hashing, fan-out, ranking',
        'Address concurrency: how to handle race conditions',
        'Discuss caching strategy: what to cache, TTL, invalidation',
        'Show how you handle edge cases and failures',
        'This is where you differentiate yourself — go deep!',
      ],
    },
    {
      letter: 'E',
      name: 'Evaluation',
      description: 'Discuss bottlenecks, scaling strategies, failure scenarios, and trade-offs. Show you think about production realities.',
      timeMinutes: 5,
      tips: [
        'Identify the bottleneck: "The database will be the first bottleneck at 10K QPS"',
        'Propose scaling solutions: read replicas, sharding, caching',
        'Discuss failure scenarios: "What if the cache goes down?" → graceful degradation',
        'Mention monitoring and alerting',
        'Trade-offs: "I chose eventual consistency here because..."',
        'Single points of failure: identify and propose redundancy',
      ],
    },
    {
      letter: 'D',
      name: 'Distinct / Extensions',
      description: 'Discuss unique features, extensions, and follow-up considerations. Shows you can think beyond the initial requirements.',
      timeMinutes: 5,
      tips: [
        'Mention features you\'d add with more time',
        'Discuss multi-region deployment for global users',
        'Mention security: encryption at rest/transit, input validation, SQL injection prevention',
        'Analytics and ML opportunities',
        'Cost optimization strategies',
        'Disaster recovery and backup strategy',
        'Address interviewer\'s specific follow-up questions thoroughly',
      ],
    },
  ],
  commonMistakes: [
    'Jumping straight into detailed design without clarifying requirements — ALWAYS start with questions',
    'Not doing capacity estimation — you\'re designing blind without knowing the scale',
    'Over-engineering from the start — don\'t propose microservices + Kafka + Kubernetes for a 100-user app',
    'Under-communicating — silent thinking is the #1 killer. Think out loud!',
    'Not discussing trade-offs — every design decision has pros and cons. State them.',
    'Ignoring non-functional requirements (availability, latency, consistency)',
    'Getting stuck on one component — manage your time, cover the full design',
    'Not drawing diagrams — visual design is much easier to discuss and evaluate',
    'Designing for the average case only — discuss peak load, failure scenarios, edge cases',
    'Using buzzwords without understanding — "we use Kafka" without explaining WHY',
    'Ignoring data model — schema design is fundamental and often overlooked',
    'Not mentioning monitoring/observability — shows you haven\'t run production systems',
  ],
  communicationTips: [
    'Think out loud: "I\'m considering X because... but it has the downside of Y..."',
    'Use a structured approach: "First, let me clarify requirements. Then estimate scale. Then design."',
    'Signal transitions: "Now that we have the high-level design, let me dive deep into the feed generation..."',
    'Check in with the interviewer: "Does this make sense so far? Any area you\'d like me to go deeper on?"',
    'When unsure, say so: "I\'m not sure about the exact number, but I believe it\'s on the order of..."',
    'Explicitly state trade-offs: "I\'m choosing AP over CP here because..."',
    'Use real-world references: "Similar to how Netflix handles this..."',
    'Don\'t be afraid to revise: "Actually, given the read-heavy workload, let me add a cache here..."',
    'Prioritize: "Given our time, I\'ll focus on the feed generation algorithm since that\'s the most unique part"',
    'Use concrete numbers: "At 10K QPS, a single PostgreSQL instance can handle this" (not just "it scales")',
  ],
  questionsToAsk: [
    'What\'s the expected scale? (DAU, data volume)',
    'Who are the primary users? (mobile, web, API consumers)',
    'What are the most important features to focus on?',
    'Read-heavy or write-heavy workload?',
    'What consistency guarantees are needed?',
    'What\'s the acceptable latency for key operations?',
    'Is this a greenfield design or extending existing system?',
    'Any geographic distribution requirements? (multi-region)',
    'What\'s the data retention policy?',
    'Are there any existing systems we need to integrate with?',
    'What\'s the expected growth rate?',
    'Any compliance or security requirements?',
  ],
};
