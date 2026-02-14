# System Design Interview Prep — Interactive Learning Platform

## Goal
Help a developer prepare for a system design / architecture interview TOMORROW.
Must be comprehensive, visual, interactive, and educational.

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS for styling
- React Router for navigation
- Recharts for diagrams
- No backend needed — all content is static/client-side

## Pages

### 1. Dashboard (`/`)
- Quick overview: "Your Interview Prep" progress tracker
- Links to all sections with completion checkboxes (localStorage)
- "Random Question" button for practice
- Countdown timer to interview

### 2. Architecture Patterns (`/patterns`)
Interactive cards for each pattern with:
- Visual diagram (built with React components, not images)
- When to use / When NOT to use
- Real-world examples (Netflix, Uber, Twitter, etc.)
- Trade-offs table (pros/cons)
- Key interview buzzwords

**Patterns to cover:**
1. Monolithic
2. Microservices
3. Event-Driven (Pub/Sub)
4. CQRS (Command Query Responsibility Segregation)
5. Event Sourcing
6. Serverless / FaaS
7. Layered (N-Tier)
8. Hexagonal (Ports & Adapters)
9. Service Mesh
10. Saga Pattern
11. API Gateway
12. Strangler Fig (Migration)
13. Circuit Breaker
14. Sidecar
15. Data Mesh

### 3. Building Blocks (`/blocks`)
Core components you need to know:
- Load Balancers (L4 vs L7, algorithms)
- Caches (Redis, Memcached, CDN, write-through vs write-back vs write-around)
- Databases (SQL vs NoSQL, sharding, replication, partitioning)
- Message Queues (Kafka, RabbitMQ, SQS)
- CDN (push vs pull)
- DNS & Domain resolution
- Proxies (forward vs reverse)
- Consistent Hashing
- Rate Limiting (token bucket, leaky bucket, sliding window)
- Blob Storage (S3)
- Search (Elasticsearch)
- Monitoring & Logging

### 4. Classic Problems (`/problems`)
Step-by-step design walkthroughs:
1. Design a URL Shortener (TinyURL)
2. Design Twitter/X Feed
3. Design a Chat System (WhatsApp/Messenger)
4. Design a Video Platform (YouTube/Netflix)
5. Design a Ride-Sharing Service (Uber)
6. Design a Notification System
7. Design a Rate Limiter
8. Design a Key-Value Store
9. Design a Web Crawler
10. Design a News Feed
11. Design Google Maps
12. Design a Payment System

Each problem has:
- Requirements gathering (functional + non-functional)
- Capacity estimation (back-of-envelope math)
- High-level design (interactive diagram)
- Detailed component design
- Scaling discussion
- Common follow-up questions

### 5. Concepts & Trade-offs (`/concepts`)
- CAP Theorem (interactive triangle)
- ACID vs BASE
- Consistency models (strong, eventual, causal)
- Availability patterns (failover, replication)
- Scalability (vertical vs horizontal)
- Latency vs Throughput
- SQL vs NoSQL decision tree
- Synchronous vs Asynchronous
- Stateful vs Stateless
- Batch vs Stream processing
- Back-of-envelope estimation guide

### 6. Interview Framework (`/framework`)
- The RESHADED framework (Requirements, Estimation, Storage, High-level, API, Detailed, Evaluation, Distinct)
- How to structure your 45-minute answer
- Common mistakes to avoid
- Questions to ask the interviewer
- Communication tips

### 7. Quick Reference (`/cheat-sheet`)
- One-page cheat sheet with all key numbers
- Latency numbers every programmer should know
- Powers of 2 table
- Common estimation shortcuts
- Architecture decision flowchart

### 8. Quiz Mode (`/quiz`)
- Random architecture questions
- "Which pattern would you use for X?" scenarios
- Trade-off comparison questions
- Timed mock question mode

## Components
- `InfoTip` — tooltip component for all technical terms
- `DiagramBox` — reusable architecture diagram building blocks
- `TradeoffTable` — pros/cons comparison table
- `StepWalkthrough` — step-by-step problem solver
- `InteractiveDiagram` — clickable system diagrams
- `ProgressTracker` — localStorage-based completion tracking

## GLOSSARY
85+ terms covering: distributed systems, databases, caching, networking, scaling, architecture patterns, interview-specific terminology.

## Port
- Client: 5175
