import type { QuizQuestion } from '../../types';

export const microservicesQuiz: QuizQuestion[] = [
  {
    question: "What is the primary motivation for decomposing a monolith into microservices?",
    options: [
      "To reduce the total lines of code in the system",
      "To enable independent deployment and scaling of services",
      "To eliminate the need for a database",
      "To ensure all teams use the same programming language"
    ],
    correctIndex: 1,
    explanation: "The primary motivation for microservices is enabling independent deployment and scaling. Each service can be deployed, updated, and scaled independently without affecting others, which accelerates release cycles and allows teams to work autonomously. Reducing total lines of code is not a goal—microservices often increase overall code due to infrastructure overhead. Microservices still use databases (often one per service), and a key advantage is that teams can choose different programming languages (polyglot architecture)."
  },
  {
    question: "In Domain-Driven Design (DDD), what defines a Bounded Context?",
    options: [
      "A physical server boundary where code is deployed",
      "An explicit boundary within which a domain model is defined and applicable",
      "The maximum number of entities allowed in a single database",
      "A network firewall rule separating services"
    ],
    correctIndex: 1,
    explanation: "A Bounded Context in DDD is a logical boundary within which a particular domain model is consistent and meaningful. The same term (e.g., 'Order') can mean different things in different bounded contexts—in the Sales context it represents a purchase intent, while in Shipping it represents a package to deliver. This is not about physical server boundaries or network rules; it's a semantic boundary that helps teams avoid model confusion. Bounded Contexts are one of the most effective tools for identifying service boundaries in microservices architectures."
  },
  {
    question: "Which communication pattern introduces the tightest coupling between microservices?",
    options: [
      "Asynchronous messaging via a message broker",
      "Event-driven publish/subscribe",
      "Synchronous HTTP REST calls",
      "Event sourcing with an append-only log"
    ],
    correctIndex: 2,
    explanation: "Synchronous HTTP REST calls create the tightest coupling because the caller must wait for the callee to respond, creating temporal coupling—both services must be available simultaneously. If the downstream service is slow or down, the caller is directly affected. Asynchronous messaging and pub/sub decouple services in time; the sender doesn't wait for a response. Event sourcing further decouples by recording state changes as events. In practice, synchronous calls are sometimes necessary (e.g., user-facing queries), but overusing them in service-to-service communication recreates the coupling problems of a monolith."
  },
  {
    question: "What is the Circuit Breaker pattern used for in microservices?",
    options: [
      "Encrypting data in transit between services",
      "Preventing cascading failures by failing fast when a downstream service is unhealthy",
      "Load balancing traffic across multiple instances of a service",
      "Compressing request payloads to reduce bandwidth"
    ],
    correctIndex: 1,
    explanation: "The Circuit Breaker pattern prevents cascading failures by monitoring calls to a downstream service and 'opening' the circuit (failing fast) when failures exceed a threshold. This stops the calling service from wasting resources on requests likely to fail, and gives the downstream service time to recover. It has three states: Closed (normal operation), Open (requests fail immediately), and Half-Open (test requests to check recovery). Libraries like Resilience4j and Netflix Hystrix implement this pattern. Without it, a single slow service can exhaust thread pools and bring down the entire system."
  },
  {
    question: "What is the Sidecar pattern in a microservices architecture?",
    options: [
      "A secondary database replica running alongside the primary",
      "A helper container deployed alongside the main application container to handle cross-cutting concerns",
      "A backup service that takes over when the primary fails",
      "A secondary API endpoint for internal-only traffic"
    ],
    correctIndex: 1,
    explanation: "The Sidecar pattern deploys a helper process or container alongside the main application container within the same pod (in Kubernetes) or host. The sidecar handles cross-cutting concerns like logging, monitoring, TLS termination, and service mesh proxying without modifying the application code. Envoy proxy in Istio is a classic example—it intercepts all network traffic for observability and security. This pattern promotes separation of concerns and allows infrastructure teams to update sidecar functionality independently of the application. It's fundamental to service mesh architectures."
  },
  {
    question: "In the Saga pattern, what is a compensating transaction?",
    options: [
      "A transaction that runs in parallel to speed up processing",
      "An action that undoes the effect of a previously committed local transaction when a later step fails",
      "A transaction that automatically retries on failure",
      "A database rollback using ACID guarantees"
    ],
    correctIndex: 1,
    explanation: "A compensating transaction is an action that semantically reverses the effect of a previously committed step in a saga when a subsequent step fails. Unlike a database rollback, compensating transactions are application-level logic—for example, if payment was captured but shipping fails, the compensation would issue a refund. This is necessary because each service has its own database with local transactions; there's no distributed ACID transaction spanning services. Compensating transactions may not perfectly undo everything (e.g., a sent email can't be unsent), which is why saga design requires careful consideration of idempotency and ordering."
  },
  {
    question: "What problem does service discovery solve in a microservices environment?",
    options: [
      "How to encrypt traffic between services",
      "How clients and services locate the network addresses of dynamically changing service instances",
      "How to split a monolith into services",
      "How to store service source code in a repository"
    ],
    correctIndex: 1,
    explanation: "Service discovery solves the problem of locating service instances whose network addresses change dynamically due to auto-scaling, deployments, and failures. In a cloud-native environment, IP addresses are ephemeral—containers start and stop constantly. Service discovery mechanisms (like Consul, Eureka, or Kubernetes DNS) maintain a registry of available instances so that clients can find healthy endpoints. Without service discovery, you'd need to hardcode IP addresses, which is fragile and doesn't work with elastic scaling. There are two patterns: client-side discovery (client queries registry) and server-side discovery (load balancer queries registry)."
  },
  {
    question: "What is the Bulkhead pattern inspired by?",
    options: [
      "Electrical circuit breakers in buildings",
      "Watertight compartments in a ship's hull that contain flooding",
      "The human immune system's white blood cells",
      "Traffic lanes on a highway"
    ],
    correctIndex: 1,
    explanation: "The Bulkhead pattern is named after the watertight compartments (bulkheads) in a ship's hull. If one compartment is breached, the flooding is contained and doesn't sink the entire ship. In microservices, this translates to isolating resources (thread pools, connection pools, CPU) so that a failure in one component doesn't exhaust shared resources and bring down everything. For example, you might allocate separate thread pools for calls to different downstream services, so a slow Service A can't starve requests to Service B. Netflix famously used bulkheads in their architecture to prevent cascading failures across their streaming platform."
  },
  {
    question: "Which type of Saga execution uses a central coordinator to manage the workflow?",
    options: [
      "Choreography-based saga",
      "Orchestration-based saga",
      "Two-phase commit saga",
      "Peer-to-peer saga"
    ],
    correctIndex: 1,
    explanation: "An orchestration-based saga uses a central orchestrator (saga coordinator) that tells each participant what local transaction to execute and in what order. The orchestrator maintains the saga's state and handles compensations if a step fails. In contrast, choreography-based sagas have no central coordinator—each service listens for events and decides what to do next. Orchestration is easier to understand and debug for complex workflows but introduces a single point of coordination. Two-phase commit is a different distributed transaction protocol that blocks resources and isn't suitable for microservices. Real-world examples include order processing workflows in e-commerce systems using tools like Temporal or AWS Step Functions."
  },
  {
    question: "What does distributed tracing help you understand in a microservices system?",
    options: [
      "The database schema of each service",
      "The end-to-end path and latency of a request as it flows through multiple services",
      "The number of lines of code in each service",
      "The programming language used by each team"
    ],
    correctIndex: 1,
    explanation: "Distributed tracing tracks a request's journey across multiple services, recording timing data at each hop to create a trace. This allows engineers to visualize the complete request path, identify latency bottlenecks, and pinpoint which service is causing slowdowns. Tools like Jaeger, Zipkin, and AWS X-Ray implement the OpenTelemetry standard for this purpose. Each request gets a unique trace ID that propagates through all service calls, with each service adding a span. Without distributed tracing, debugging performance issues in a system with dozens of interconnected services would be nearly impossible—you'd be guessing which of many services is the culprit."
  },
  {
    question: "In Kubernetes, what is a Pod?",
    options: [
      "A virtual machine running multiple containers",
      "The smallest deployable unit, consisting of one or more tightly coupled containers sharing network and storage",
      "A cluster of physical servers",
      "A DNS entry for a service"
    ],
    correctIndex: 1,
    explanation: "A Pod is the smallest deployable unit in Kubernetes, consisting of one or more containers that share the same network namespace (same IP, can communicate via localhost) and storage volumes. Pods are not virtual machines—they're lightweight process groups. The most common pattern is a single application container per pod, but multi-container pods are used for sidecars (e.g., log collectors, service mesh proxies). Pods are ephemeral; they can be terminated and recreated at any time, which is why you use higher-level abstractions like Deployments to manage their lifecycle. Understanding pods is fundamental to running microservices on Kubernetes."
  },
  {
    question: "What is the primary disadvantage of a monolithic architecture as the team and codebase grow?",
    options: [
      "It's impossible to write unit tests",
      "Deployment of any change requires rebuilding and redeploying the entire application",
      "Monoliths cannot use relational databases",
      "Monoliths cannot handle more than 100 concurrent users"
    ],
    correctIndex: 1,
    explanation: "As a monolith grows, even a small change requires rebuilding and redeploying the entire application, which slows down release cycles and increases risk. A bug in one module can block deployment of unrelated features. This creates coordination overhead as teams grow—merge conflicts, long build times, and coupled release schedules. Monoliths absolutely support unit testing, relational databases, and can handle massive traffic (many successful companies run monoliths at scale). The key issue is organizational: Conway's Law suggests that as teams scale, independent deployability becomes critical for velocity."
  },
  {
    question: "Which service mesh implementation uses Envoy as its data plane proxy?",
    options: [
      "Netflix Zuul",
      "Istio",
      "Apache Kafka",
      "RabbitMQ"
    ],
    correctIndex: 1,
    explanation: "Istio is a service mesh that uses Envoy proxy as its data plane, deploying it as a sidecar container alongside each service. Envoy handles all inbound and outbound traffic, providing features like mutual TLS, load balancing, circuit breaking, and observability without application code changes. Netflix Zuul is an API gateway, not a service mesh. Kafka and RabbitMQ are message brokers for asynchronous communication, not service meshes. Other service meshes like Linkerd use their own lightweight proxy (linkerd2-proxy), but Istio's choice of Envoy has made Envoy the de facto standard for cloud-native proxy infrastructure."
  },
  {
    question: "What is the 'Database per Service' pattern?",
    options: [
      "All services share a single large database for consistency",
      "Each microservice owns its private database, and other services cannot access it directly",
      "Each service uses a different database vendor",
      "Services store data only in memory, never on disk"
    ],
    correctIndex: 1,
    explanation: "The Database per Service pattern means each microservice has its own private data store that no other service can access directly—only through the service's API. This ensures loose coupling: services can evolve their schemas independently, choose the most appropriate database technology, and scale their data stores independently. The trade-off is that cross-service queries become harder (no joins across service boundaries) and maintaining data consistency requires patterns like sagas or event-driven synchronization. Using different vendors is optional (polyglot persistence), not required. This pattern is considered foundational to achieving true microservice independence."
  },
  {
    question: "In the context of inter-service communication, what does 'temporal coupling' mean?",
    options: [
      "Services must be written in the same programming language",
      "Services must be available at the same time for communication to succeed",
      "Services must share the same database schema",
      "Services must be deployed in the same time zone"
    ],
    correctIndex: 1,
    explanation: "Temporal coupling means both the caller and callee must be running and available simultaneously for communication to succeed. This is inherent in synchronous communication (HTTP REST, gRPC) where the caller blocks waiting for a response. If the downstream service is down, the call fails immediately. Asynchronous messaging eliminates temporal coupling—the sender publishes a message to a broker, and the receiver processes it whenever it's available. Temporal coupling is one of the main reasons architects favor asynchronous communication for service-to-service interactions, especially for operations that don't need an immediate response."
  },
  {
    question: "What does a Kubernetes Deployment resource manage?",
    options: [
      "Network routing rules between pods",
      "The desired state of pod replicas, including rolling updates and rollbacks",
      "Persistent storage volumes for databases",
      "DNS resolution for external services"
    ],
    correctIndex: 1,
    explanation: "A Kubernetes Deployment is a higher-level abstraction that manages a ReplicaSet of pods, ensuring the desired number of identical pod replicas are running at all times. It handles rolling updates (gradually replacing old pods with new ones), rollbacks (reverting to a previous version), and self-healing (restarting failed pods). Network routing is handled by Services and Ingress resources. Persistent storage is managed by PersistentVolumes and PersistentVolumeClaims. Deployments are the standard way to run stateless microservices on Kubernetes, as they provide declarative updates and maintain availability during deployments."
  },
  {
    question: "What is the Strangler Fig pattern used for?",
    options: [
      "Rapidly building a greenfield microservices system",
      "Incrementally migrating a monolith to microservices by gradually replacing functionality",
      "Monitoring service health in production",
      "Encrypting all inter-service communication"
    ],
    correctIndex: 1,
    explanation: "The Strangler Fig pattern (named after a tropical vine that gradually envelops and replaces a tree) is a migration strategy where you incrementally replace monolith functionality with microservices. New features are built as microservices, and existing features are migrated one at a time while the monolith continues to serve unmodified functionality. A routing layer (often an API gateway) directs traffic to either the monolith or the new services. This avoids the risk of a big-bang rewrite, which historically has a high failure rate. Martin Fowler popularized this pattern, and companies like Amazon and Netflix famously used it to migrate from monoliths."
  },
  {
    question: "What is the key difference between choreography and orchestration in saga patterns?",
    options: [
      "Choreography uses REST while orchestration uses gRPC",
      "Choreography has no central coordinator—services react to events; orchestration has a central coordinator directing the flow",
      "Orchestration is always faster than choreography",
      "Choreography can only handle two services while orchestration handles unlimited"
    ],
    correctIndex: 1,
    explanation: "In choreography, there is no central coordinator—each service publishes events and other services subscribe and react independently, creating a decentralized flow. In orchestration, a central saga orchestrator explicitly tells each service what to do and when. Choreography is simpler for few steps but becomes hard to understand as complexity grows (the 'event spaghetti' problem). Orchestration provides a single place to see the entire workflow but adds a coordination dependency. The choice of protocol (REST vs gRPC) is orthogonal to the saga style. Both patterns can handle any number of services; the trade-off is about complexity management and coupling."
  },
  {
    question: "What is the primary purpose of a Service Mesh?",
    options: [
      "To provide a UI dashboard for developers",
      "To handle service-to-service communication concerns (security, observability, traffic management) transparently at the infrastructure layer",
      "To compile microservices code into containers",
      "To replace the need for a message broker"
    ],
    correctIndex: 1,
    explanation: "A service mesh handles cross-cutting communication concerns like mutual TLS, load balancing, circuit breaking, retries, and distributed tracing at the infrastructure layer, without requiring changes to application code. It consists of a data plane (sidecar proxies like Envoy) and a control plane (like Istio's istiod) that configures the proxies. This is valuable because these concerns would otherwise need to be implemented in every service using language-specific libraries. A service mesh doesn't replace message brokers (which handle async messaging) or compile code. It's particularly powerful in polyglot environments where services use different languages and frameworks."
  },
  {
    question: "Which Kubernetes resource provides a stable network endpoint for a set of pods?",
    options: [
      "ConfigMap",
      "Service",
      "PersistentVolume",
      "Namespace"
    ],
    correctIndex: 1,
    explanation: "A Kubernetes Service provides a stable virtual IP (ClusterIP) and DNS name that routes traffic to a set of pods selected by label selectors. Since pods are ephemeral and their IPs change when they restart, the Service abstraction gives clients a consistent endpoint. There are several types: ClusterIP (internal only), NodePort (exposes on each node's IP), LoadBalancer (provisions cloud load balancer), and ExternalName (DNS alias). ConfigMaps store configuration data, PersistentVolumes provide storage, and Namespaces provide logical isolation. Services are essential for service discovery within a Kubernetes cluster."
  },
  {
    question: "What is API versioning important for in microservices?",
    options: [
      "It allows services to evolve their contracts without breaking existing consumers",
      "It speeds up API response times",
      "It reduces the number of services needed",
      "It eliminates the need for documentation"
    ],
    correctIndex: 0,
    explanation: "API versioning allows services to evolve their APIs while maintaining backward compatibility with existing consumers. In a microservices ecosystem, services are developed and deployed independently by different teams, so breaking changes to an API can cascade and disrupt multiple consumers. Common versioning strategies include URL path versioning (/v1/users), header-based versioning, and content negotiation. Each approach has trade-offs—URL versioning is most visible but clutters routes, while header-based versioning keeps URLs clean but is less discoverable. Without versioning, every API change requires coordinated deployments across all consuming services, negating a key microservices benefit."
  },
  {
    question: "What does the term 'polyglot persistence' mean?",
    options: [
      "Using multiple programming languages in the same service",
      "Using different database technologies for different services based on their specific needs",
      "Persisting data in multiple geographic regions simultaneously",
      "Translating database queries into multiple languages"
    ],
    correctIndex: 1,
    explanation: "Polyglot persistence means choosing the most appropriate database technology for each service's specific data access patterns, rather than forcing all services to use the same database. For example, a product catalog might use Elasticsearch for full-text search, a social graph might use Neo4j, a session store might use Redis, and an order service might use PostgreSQL. This is a natural fit for microservices' database-per-service pattern. The trade-off is operational complexity—your team needs expertise in multiple database technologies. However, it allows each service to optimize for its unique read/write patterns, consistency requirements, and data model."
  },
  {
    question: "What is a key risk of synchronous request chains (Service A → B → C → D)?",
    options: [
      "It guarantees strong consistency, which is always undesirable",
      "The overall availability is the product of individual availabilities, creating a fragile chain",
      "It reduces network traffic to zero",
      "It forces all services to use the same database"
    ],
    correctIndex: 1,
    explanation: "When services form synchronous chains, the system's availability becomes the product of each service's availability. If each service has 99.5% uptime, a chain of four services has ~98% uptime (0.995^4). The deeper the chain, the worse the compound availability. Additionally, latency adds up—each hop adds network time plus processing time. A timeout in the last service cascades back through the entire chain, blocking threads at every level. This is why architects try to minimize synchronous call depth, prefer asynchronous communication for non-blocking operations, and use patterns like circuit breakers and bulkheads to contain failures when synchronous calls are necessary."
  },
  {
    question: "In Kubernetes, what is an Ingress?",
    options: [
      "A container runtime interface",
      "An API object that manages external HTTP/HTTPS access to services, typically providing routing, TLS termination, and virtual hosting",
      "A tool for building container images",
      "A secrets management system"
    ],
    correctIndex: 1,
    explanation: "A Kubernetes Ingress is an API object that defines rules for routing external HTTP/HTTPS traffic to internal services. It provides features like path-based routing (/api → service-a, /web → service-b), host-based virtual hosting, TLS termination, and basic load balancing. An Ingress Controller (like NGINX Ingress Controller, Traefik, or AWS ALB Ingress Controller) implements these rules. Without Ingress, you'd need to expose each service individually via LoadBalancer services, which is expensive and unmanageable. Ingress is essentially the entry point for external traffic into your Kubernetes cluster, similar to a reverse proxy or API gateway at the cluster edge."
  },
  {
    question: "What is the primary benefit of asynchronous messaging between microservices?",
    options: [
      "It guarantees messages are never lost",
      "It decouples services in time—the sender doesn't wait for the receiver to process the message",
      "It eliminates the need for serialization",
      "It makes debugging easier than synchronous calls"
    ],
    correctIndex: 1,
    explanation: "Asynchronous messaging decouples services temporally—the sender publishes a message and continues without waiting for the receiver. This means services don't need to be available simultaneously, improving resilience and allowing independent scaling. If a consumer is down, messages queue up and are processed when it recovers. Message durability (not losing messages) depends on broker configuration—it's not automatic. Serialization is still required (JSON, Avro, Protobuf). Debugging can actually be harder than synchronous calls because the flow is non-linear and distributed. Despite the debugging complexity, async messaging is preferred for most service-to-service communication because it significantly improves system resilience."
  },
  {
    question: "What is the 'smart endpoints, dumb pipes' principle in microservices?",
    options: [
      "Use intelligent network switches and simple service logic",
      "Put business logic in the services (endpoints) and use lightweight messaging infrastructure (pipes) for transport only",
      "Encrypt endpoints and leave pipes unencrypted",
      "Use smart DNS and simple HTTP"
    ],
    correctIndex: 1,
    explanation: "This principle, coined by Martin Fowler, means that business logic should reside in the microservices themselves (smart endpoints) while the communication infrastructure (pipes) should be simple and lightweight—just transporting messages without adding business logic. This contrasts with the ESB (Enterprise Service Bus) approach where the bus contained routing rules, transformations, and business logic. In microservices, you use simple protocols like HTTP/REST or lightweight message brokers (RabbitMQ, Kafka) for transport, keeping them 'dumb.' This prevents the communication layer from becoming a bottleneck and a tangled mess of routing rules, which was a common problem with SOA-era ESBs."
  },
  {
    question: "What is the difference between client-side and server-side service discovery?",
    options: [
      "Client-side uses JavaScript, server-side uses Java",
      "In client-side, the client queries the registry and selects an instance; in server-side, a load balancer queries the registry on behalf of the client",
      "Client-side is for mobile apps, server-side is for web apps",
      "Client-side uses UDP, server-side uses TCP"
    ],
    correctIndex: 1,
    explanation: "In client-side discovery, the client (calling service) directly queries the service registry to get available instances and uses a load-balancing algorithm to pick one. Netflix Eureka with Ribbon is a classic example. In server-side discovery, the client sends requests to a load balancer or router, which queries the registry and forwards the request to an appropriate instance. AWS ELB and Kubernetes Services use this approach. Client-side discovery gives the client more control over load-balancing strategy but couples it to the registry. Server-side discovery is simpler for clients but adds a network hop through the load balancer. Kubernetes DNS-based discovery is server-side and is the most common approach in cloud-native environments."
  },
  {
    question: "What is a common anti-pattern when designing microservice boundaries?",
    options: [
      "Aligning services with business capabilities",
      "Creating services that are too fine-grained (nano-services), leading to excessive inter-service communication",
      "Using bounded contexts from DDD to define service boundaries",
      "Having a single team own a single service"
    ],
    correctIndex: 1,
    explanation: "Creating nano-services—services that are too small and fine-grained—is a common anti-pattern. When services are too small, simple operations require many network calls, increasing latency and failure points. For example, having separate services for 'validate address,' 'format address,' and 'geocode address' creates unnecessary network overhead. A single 'Address Service' would be more appropriate. Good boundaries align with business capabilities or DDD bounded contexts, grouping related functionality that changes together. The goal is to minimize inter-service communication while maximizing independent deployability. Sam Newman's advice: start with a monolith and extract services as boundaries become clear."
  },
  {
    question: "What does the CAP theorem state?",
    options: [
      "A system can have Consistency, Availability, and Partition tolerance simultaneously",
      "A distributed system can provide at most two of three guarantees: Consistency, Availability, and Partition tolerance",
      "Caching Always Performs better than database queries",
      "Concurrent Access Patterns must be serialized"
    ],
    correctIndex: 1,
    explanation: "The CAP theorem (Brewer's theorem) states that in a distributed system experiencing a network partition, you must choose between Consistency (all nodes see the same data) and Availability (every request receives a response). Since network partitions are inevitable in distributed systems, the real choice is CP (consistent but may be unavailable during partitions, like ZooKeeper) or AP (available but may return stale data, like Cassandra). This is fundamental to microservices because the database-per-service pattern creates a distributed data system. Understanding CAP helps architects make informed trade-offs between consistency and availability for each service based on business requirements."
  },
  {
    question: "What is the purpose of health check endpoints in microservices?",
    options: [
      "To display the service's source code",
      "To allow orchestrators and load balancers to determine if a service instance is healthy and able to receive traffic",
      "To encrypt service communications",
      "To compress response payloads"
    ],
    correctIndex: 1,
    explanation: "Health check endpoints (e.g., /health or /ready) allow orchestrators like Kubernetes and load balancers to determine whether a service instance can handle traffic. Kubernetes uses liveness probes (is the process alive?) and readiness probes (is it ready to accept traffic?). If a liveness check fails, Kubernetes restarts the container; if readiness fails, it removes the pod from the service's endpoints. This enables self-healing—unhealthy instances are automatically replaced. Health checks should verify critical dependencies (database connectivity, cache availability) to provide an accurate picture. Without proper health checks, traffic may be routed to broken instances, causing errors for users."
  },
  {
    question: "What is a 'shared nothing' architecture in the context of microservices?",
    options: [
      "Services don't share any code, data stores, or infrastructure components",
      "All services run on a single shared server",
      "Services share a common message format",
      "Teams don't share knowledge between them"
    ],
    correctIndex: 0,
    explanation: "Shared nothing architecture means each microservice owns all its resources independently—its own database, its own data, its own dependencies—without sharing these with other services. This eliminates resource contention and coupling: one service's database maintenance doesn't affect others, and schema changes are local. The trade-off is data duplication and the complexity of keeping data synchronized across services. Sharing message formats (contracts) is actually expected for interoperability. In practice, some sharing is pragmatic (shared libraries for common utilities, shared infrastructure like Kubernetes), but the data layer should remain private to each service."
  },
  {
    question: "Which pattern helps maintain data consistency across multiple microservices without distributed transactions?",
    options: [
      "Two-phase commit (2PC)",
      "Saga pattern",
      "Singleton pattern",
      "Factory pattern"
    ],
    correctIndex: 1,
    explanation: "The Saga pattern maintains data consistency across services by executing a sequence of local transactions, each within a single service's database. If any step fails, compensating transactions undo the effects of prior steps. Unlike 2PC, sagas don't lock resources across services—each transaction commits locally immediately. Two-phase commit technically works for distributed transactions but is impractical for microservices due to resource locking, reduced availability, and tight coupling. Singleton and Factory are OOP design patterns unrelated to distributed data consistency. Sagas are the standard approach in microservices, implemented via either choreography (events) or orchestration (coordinator)."
  },
  {
    question: "What is the purpose of an API Gateway in a microservices architecture?",
    options: [
      "To store all service configurations",
      "To provide a single entry point for clients, handling routing, authentication, rate limiting, and request aggregation",
      "To compile microservices code",
      "To replace all inter-service communication"
    ],
    correctIndex: 1,
    explanation: "An API Gateway serves as a single entry point for external clients, abstracting the complexity of the microservices topology behind a unified API. It handles cross-cutting concerns like authentication, rate limiting, SSL termination, request routing, response caching, and request/response transformation. It can also aggregate responses from multiple backend services into a single response (reducing client round trips). Without a gateway, clients would need to know the addresses of individual services and handle authentication separately for each. Popular implementations include Kong, AWS API Gateway, and Netflix Zuul/Spring Cloud Gateway."
  },
  {
    question: "What is the 'data consistency' challenge specific to microservices?",
    options: [
      "Microservices cannot use SQL databases",
      "With each service owning its database, maintaining consistency across services requires careful coordination since you can't use ACID transactions across service boundaries",
      "All microservices must use eventual consistency",
      "Data consistency is not a concern in microservices"
    ],
    correctIndex: 1,
    explanation: "When each service owns its own database, you lose the ability to use ACID transactions that span multiple services. An operation like 'place order' might involve the Order Service, Inventory Service, and Payment Service—each with its own database. There's no single transaction to atomically update all three. This requires patterns like sagas for managing multi-service transactions and event-driven approaches for synchronizing data. Not all microservices must use eventual consistency—individual services can use strong consistency internally. The challenge is inter-service consistency, and the right consistency model depends on business requirements (e.g., payment needs strong guarantees, recommendation feeds can be eventually consistent)."
  },
  {
    question: "What does 'idempotency' mean in the context of microservices communication?",
    options: [
      "A request always returns the same response time",
      "Processing the same request multiple times produces the same result as processing it once",
      "All services must use the same programming language",
      "Messages are always delivered in order"
    ],
    correctIndex: 1,
    explanation: "Idempotency means that performing the same operation multiple times has the same effect as performing it once. This is critical in microservices because network failures, retries, and message broker redeliveries can cause the same request to be received multiple times. For example, a payment service must ensure that charging a customer twice for the same order doesn't actually debit their account twice. Common implementations include using idempotency keys (unique request IDs), checking if the operation was already performed before executing it, and designing operations to be naturally idempotent (like setting a value rather than incrementing). Without idempotency, retry mechanisms become dangerous."
  },
  {
    question: "What is the Backends for Frontends (BFF) pattern?",
    options: [
      "Running backend services in the frontend browser",
      "Creating separate backend services tailored for each type of frontend client (web, mobile, etc.)",
      "Using the same API for all frontend platforms",
      "A pattern where the frontend directly accesses the database"
    ],
    correctIndex: 1,
    explanation: "The BFF pattern creates dedicated backend services for each frontend platform—one for the web app, one for the mobile app, one for third-party APIs, etc. Each BFF aggregates and transforms data from downstream microservices in the way that's optimal for its specific client. A mobile app might need less data and different formatting than a web dashboard. Without BFF, a general-purpose API either over-fetches for mobile (wasting bandwidth) or under-fetches for web (requiring multiple calls). Sam Newman popularized this pattern. The trade-off is maintaining multiple BFF services, but it prevents a single API from becoming a compromise that serves no client well."
  },
  {
    question: "What is 'contract testing' in microservices?",
    options: [
      "Testing legal contracts between service teams",
      "Verifying that a service's API meets the expectations defined by its consumers",
      "Testing network contracts like TCP/UDP",
      "Testing that all services use the same deployment pipeline"
    ],
    correctIndex: 1,
    explanation: "Contract testing (often called Consumer-Driven Contract Testing) verifies that a service provider's API satisfies the contracts expected by its consumers. Tools like Pact allow consumers to define their expectations (what endpoints they call, what data they need), and these contracts are verified against the provider during CI. This prevents a provider from accidentally breaking its consumers when making changes. Unlike integration tests that require running all services, contract tests run independently and are faster. This is critical in microservices where services are deployed independently—without contract tests, you might deploy a provider change that breaks consumers you didn't know about."
  },
  {
    question: "What is the recommended team structure for microservices according to Conway's Law?",
    options: [
      "One large team manages all services",
      "Teams organized around business capabilities, where each team owns one or more services end-to-end",
      "Separate teams for frontend, backend, and database for each service",
      "Teams organized by programming language expertise"
    ],
    correctIndex: 1,
    explanation: "Conway's Law states that organizations design systems that mirror their communication structures. For microservices, this means organizing teams around business capabilities (e.g., a Payments team, an Inventory team) where each team owns their services end-to-end—from UI to database. Amazon's 'two-pizza teams' embody this principle. Horizontal teams (one team for all frontends, another for all backends) create handoffs and coordination overhead that slow delivery. When a team owns a service completely, they can deploy independently, make technology choices, and iterate quickly. This organizational alignment is often considered a prerequisite for successful microservices adoption."
  },
  {
    question: "What happens in the 'Half-Open' state of a Circuit Breaker?",
    options: [
      "All requests are blocked indefinitely",
      "A limited number of test requests are allowed through to check if the downstream service has recovered",
      "The circuit operates normally as if fully closed",
      "The circuit randomly accepts or rejects requests"
    ],
    correctIndex: 1,
    explanation: "In the Half-Open state, the circuit breaker allows a small number of trial requests through to the downstream service to test if it has recovered. If these test requests succeed, the circuit transitions back to Closed (normal operation). If they fail, the circuit returns to Open (fail fast). This state is crucial for automatic recovery—without it, the circuit would either stay open forever (requiring manual intervention) or immediately flood the recovering service with traffic. The number of test requests and the timeout before entering Half-Open are configurable parameters. This three-state model (Closed → Open → Half-Open → Closed) enables self-healing without human intervention."
  },
  {
    question: "What is a 'correlation ID' in microservices?",
    options: [
      "A database primary key shared across services",
      "A unique identifier attached to a request that is propagated through all service calls to enable end-to-end tracing",
      "An encryption key for inter-service communication",
      "A version number for API contracts"
    ],
    correctIndex: 1,
    explanation: "A correlation ID (or trace ID) is a unique identifier generated at the entry point of a request (usually the API gateway) and propagated through all subsequent service calls via HTTP headers or message metadata. This allows log aggregation tools to correlate all log entries belonging to the same business operation across multiple services. Without correlation IDs, matching logs from Service A with related logs from Service B and Service C would be virtually impossible in a system processing thousands of concurrent requests. This is the foundation of distributed tracing systems like Jaeger and Zipkin, and it's essential for debugging, auditing, and performance analysis in microservices."
  },
  {
    question: "What is the difference between horizontal and vertical scaling?",
    options: [
      "Horizontal scaling adds more machines; vertical scaling adds more resources to existing machines",
      "Horizontal scaling is for databases; vertical scaling is for applications",
      "Horizontal scaling is cheaper; vertical scaling is always more expensive",
      "There is no difference; they are synonymous"
    ],
    correctIndex: 0,
    explanation: "Horizontal scaling (scaling out) adds more instances/machines to distribute the load, while vertical scaling (scaling up) increases the resources (CPU, RAM, disk) of existing machines. Microservices inherently favor horizontal scaling because each service can be independently replicated. Vertical scaling has a ceiling—there's a maximum machine size—while horizontal scaling is theoretically unlimited. However, horizontal scaling requires the application to be stateless or handle distributed state. Kubernetes facilitates horizontal scaling through Horizontal Pod Autoscalers (HPA) that automatically adjust replica counts based on metrics. Both strategies have their place: stateless services scale horizontally, while some databases (like traditional RDBMS) initially benefit more from vertical scaling."
  },
  {
    question: "What is 'eventual consistency' in distributed microservices?",
    options: [
      "Data is never consistent across services",
      "Given enough time without new updates, all replicas of the data will converge to the same state",
      "Data is immediately consistent across all services at all times",
      "Only the latest write is stored; all previous versions are deleted"
    ],
    correctIndex: 1,
    explanation: "Eventual consistency means that if no new updates are made, all copies of the data across services will eventually converge to the same value—but there's a window where different services may see different values. This is common in microservices because data is replicated asynchronously via events or messages. For example, after an order is placed, the inventory service might take a few seconds to reflect the stock reduction. This trade-off is acceptable for many use cases (product catalogs, notifications, analytics) but not for others (financial transactions, inventory counts for limited stock). Understanding where eventual consistency is acceptable vs. where stronger guarantees are needed is a key architectural skill."
  },
  {
    question: "What tool is commonly used for container orchestration in microservices?",
    options: [
      "Jenkins",
      "Kubernetes",
      "Git",
      "Terraform"
    ],
    correctIndex: 1,
    explanation: "Kubernetes (K8s) is the industry-standard container orchestration platform for managing microservices. It automates deployment, scaling, self-healing, service discovery, load balancing, and rolling updates of containerized applications. Jenkins is a CI/CD tool for building and testing code, Git is version control, and Terraform is infrastructure-as-code for provisioning cloud resources—none of them orchestrate running containers. Kubernetes provides the runtime environment where microservices containers actually execute, managing their lifecycle, networking, and resource allocation. Alternatives like Docker Swarm and Apache Mesos exist but Kubernetes has become the dominant choice, supported by all major cloud providers."
  },
  {
    question: "What is the Outbox pattern used for in microservices?",
    options: [
      "Storing outgoing emails in a queue",
      "Ensuring atomic updates to a database and reliable event publishing by writing events to an outbox table in the same transaction",
      "A logging pattern for outbound API calls",
      "Managing outgoing network connections"
    ],
    correctIndex: 1,
    explanation: "The Outbox pattern solves the dual-write problem: when a service needs to update its database AND publish an event, but doing both atomically is impossible without distributed transactions. The solution writes both the data change and the event to the same database in a single ACID transaction (the event goes to an 'outbox' table). A separate process (like Debezium using CDC) reads the outbox table and publishes events to the message broker. This guarantees that if the data is updated, the event will eventually be published (and vice versa). Without this pattern, crashes between the database write and event publish could leave the system in an inconsistent state."
  },
  {
    question: "What is gRPC and why is it used in microservices?",
    options: [
      "A database query language",
      "A high-performance RPC framework using Protocol Buffers and HTTP/2 for efficient inter-service communication",
      "A container orchestration tool",
      "A service mesh implementation"
    ],
    correctIndex: 1,
    explanation: "gRPC is a high-performance Remote Procedure Call framework developed by Google that uses Protocol Buffers (protobuf) for serialization and HTTP/2 for transport. It offers significant advantages for inter-service communication: binary serialization is faster and smaller than JSON, HTTP/2 enables multiplexing and streaming, and strongly-typed service definitions (via .proto files) generate client/server code automatically. This makes it ideal for internal microservice-to-microservice communication where performance matters. The trade-off is that gRPC is less human-readable than REST/JSON and has limited browser support (though gRPC-Web exists). Many companies use REST for external APIs and gRPC for internal service communication."
  },
  {
    question: "What is the purpose of a Container Registry in microservices deployment?",
    options: [
      "To register domain names for services",
      "To store and distribute container images that services are packaged into",
      "To register services with a service discovery mechanism",
      "To store database connection strings"
    ],
    correctIndex: 1,
    explanation: "A Container Registry stores and distributes Docker/OCI container images. When you build a microservice, it's packaged as a container image and pushed to a registry (like Docker Hub, AWS ECR, Google GCR, or Harbor). During deployment, Kubernetes pulls the image from the registry to create container instances. This is the distribution mechanism for microservice artifacts—similar to how Maven repositories distribute JAR files, but for containers. Registries also support image versioning (tags), vulnerability scanning, access control, and image signing. Without a registry, there would be no standardized way to distribute and version microservice deployments across environments."
  },
  {
    question: "What is 'service decomposition' and what are common strategies for it?",
    options: [
      "Breaking down a monolith's codebase by file size",
      "Splitting a system into services based on business capabilities, subdomains, or use cases",
      "Distributing a service across multiple geographic regions",
      "Converting synchronous calls to asynchronous ones"
    ],
    correctIndex: 1,
    explanation: "Service decomposition is the process of dividing a system into microservices. Common strategies include: decomposing by business capability (payments, shipping, inventory), by DDD subdomain (each bounded context becomes a service), or by use case/user journey. The goal is to create services with high cohesion (related functionality together) and loose coupling (minimal dependencies between services). Anti-patterns include decomposing by technical layer (a 'data service' and 'logic service') which creates tight coupling, or making services too granular (nano-services). A practical approach is starting with a modular monolith, identifying natural seams, and extracting services incrementally as team and domain understanding matures."
  },
  {
    question: "What is a ConfigMap in Kubernetes?",
    options: [
      "A mapping of services to their IP addresses",
      "A Kubernetes object used to store non-confidential configuration data as key-value pairs that can be consumed by pods",
      "A visual map of the cluster topology",
      "A routing table for network traffic"
    ],
    correctIndex: 1,
    explanation: "A ConfigMap stores non-confidential configuration data (environment variables, configuration files, command-line arguments) as key-value pairs that pods can consume via environment variables or mounted volumes. This separates configuration from container images, following the twelve-factor app methodology. For example, you can change a service's log level or feature flags without rebuilding the image—just update the ConfigMap and restart the pods. For sensitive data like passwords and API keys, Kubernetes provides Secrets (which are base64-encoded, not encrypted by default). ConfigMaps are essential for managing microservice configuration across different environments (dev, staging, production) without baking environment-specific values into images."
  },
  {
    question: "What is the 'ambassador pattern' in microservices?",
    options: [
      "A diplomatic protocol for service-to-service negotiations",
      "A proxy that handles cross-cutting concerns on behalf of a service, similar to a sidecar but specifically for outbound traffic patterns",
      "A service that translates between different programming languages",
      "The first service deployed in a new cluster"
    ],
    correctIndex: 1,
    explanation: "The Ambassador pattern deploys a proxy alongside a service to handle outbound communication concerns like retries, circuit breaking, logging, and routing. It's conceptually similar to the sidecar pattern but specifically focuses on acting as an 'ambassador' for the service's outbound connections. For example, an ambassador container might handle connection pooling and retries to a legacy database, allowing the application to use a simple connection. This pattern offloads cross-cutting networking concerns from the application code, making it simpler and allowing infrastructure teams to manage these concerns independently. The pattern is particularly useful when you can't modify the application code."
  },
  {
    question: "What is 'blue-green deployment' in microservices?",
    options: [
      "Deploying services to two different cloud providers simultaneously",
      "Running two identical production environments (blue and green), switching traffic between them for zero-downtime deployments",
      "Color-coding services based on their team ownership",
      "Deploying test and production environments side by side"
    ],
    correctIndex: 1,
    explanation: "Blue-green deployment maintains two identical production environments. The 'blue' environment runs the current version while the 'green' environment is deployed with the new version. Once the green environment is verified, traffic is switched from blue to green (typically via DNS or load balancer change). If issues are detected, you instantly switch back to blue. This provides zero-downtime deployments and instant rollback. The trade-off is cost—you need double the infrastructure during deployment. In microservices, this can be applied per-service or for the entire system. Kubernetes supports this via service label selectors. An alternative is canary deployment, which gradually shifts traffic rather than switching all at once."
  },
  {
    question: "What is 'canary deployment' and how does it differ from blue-green?",
    options: [
      "Deploying to a canary island data center",
      "Gradually routing a small percentage of traffic to the new version and increasing it if metrics are healthy, unlike blue-green's all-at-once switch",
      "Deploying a lightweight monitoring service alongside the main service",
      "Testing in production using synthetic traffic only"
    ],
    correctIndex: 1,
    explanation: "Canary deployment rolls out a new version to a small percentage of users first (say 5%), monitoring error rates, latency, and business metrics. If the canary is healthy, traffic is gradually increased (25%, 50%, 100%). If problems are detected, only the small canary group is affected, and the deployment is rolled back. Unlike blue-green (which switches 100% of traffic at once), canary provides a gradual, metrics-driven rollout that catches issues before they affect all users. Istio and Flagger can automate canary deployments in Kubernetes by progressively shifting traffic weights between old and new deployments based on defined success criteria."
  },
  {
    question: "What are liveness and readiness probes in Kubernetes?",
    options: [
      "Probes that test network connectivity between pods",
      "Liveness checks if a container should be restarted; readiness checks if it should receive traffic",
      "Probes that monitor disk space and memory usage",
      "Probes that verify container image signatures"
    ],
    correctIndex: 1,
    explanation: "Liveness probes determine if a container is still running properly. If a liveness probe fails, Kubernetes kills the container and restarts it (assuming the restart policy allows it). This handles deadlocks, infinite loops, and corrupted state. Readiness probes determine if a container is ready to accept traffic. If readiness fails, the pod's IP is removed from Service endpoints—no traffic is sent to it, but the container isn't restarted. This is important during startup (when a service is loading data or warming caches) and during temporary issues (database connection lost). There's also a startup probe for slow-starting containers. Properly configuring these probes is critical for reliable microservice operation on Kubernetes."
  },
  {
    question: "What is the 'retry with exponential backoff' pattern?",
    options: [
      "Retrying a failed request immediately as many times as possible",
      "Retrying failed requests with progressively increasing delays between attempts to avoid overwhelming the failing service",
      "Sending the same request to exponentially more services",
      "Reducing the payload size exponentially with each retry"
    ],
    correctIndex: 1,
    explanation: "Retry with exponential backoff means that when a request fails, subsequent retries wait for progressively longer intervals (e.g., 1s, 2s, 4s, 8s). This prevents overwhelming a struggling service with a flood of immediate retries, giving it time to recover. Adding random jitter (small random variation to the delay) prevents the 'thundering herd' problem where many clients retry simultaneously. Without backoff, aggressive retries can create a feedback loop that makes outages worse. Most HTTP client libraries and messaging frameworks support configurable backoff. It's typically combined with a maximum retry count and circuit breakers to avoid infinite retries. AWS SDK and gRPC libraries implement this pattern by default."
  },
  {
    question: "What is the difference between a Kubernetes Deployment and a StatefulSet?",
    options: [
      "Deployments are for Java services; StatefulSets are for Python services",
      "Deployments manage stateless applications with interchangeable pods; StatefulSets manage stateful applications with stable identities, persistent storage, and ordered deployment",
      "StatefulSets are deprecated in favor of Deployments",
      "Deployments support rolling updates; StatefulSets do not"
    ],
    correctIndex: 1,
    explanation: "Deployments are designed for stateless applications where pods are interchangeable—any pod can be replaced without consequence. StatefulSets are for stateful applications (like databases, Kafka brokers, ZooKeeper) that need stable network identities (pod-0, pod-1), persistent storage that survives pod restarts, and ordered deployment/scaling. In a StatefulSet, pods are created sequentially (pod-0 before pod-1) and have predictable DNS names. Deployments create pods with random names and no ordering guarantees. For microservices, most application services use Deployments (stateless), while data infrastructure components use StatefulSets. Both support rolling updates, but StatefulSets update in reverse order."
  },
  {
    question: "What is 'feature flagging' and why is it important for microservices?",
    options: [
      "A security mechanism to flag suspicious features",
      "A technique to enable/disable features at runtime without redeploying, supporting progressive rollouts and A/B testing",
      "A code review process for flagging features that need attention",
      "A Kubernetes label used to mark services"
    ],
    correctIndex: 1,
    explanation: "Feature flags (toggles) allow teams to enable or disable features at runtime without deploying new code. This is powerful in microservices for several reasons: it enables trunk-based development (merge code early, activate features later), progressive rollouts (enable for 10% of users first), A/B testing, and instant kill switches for problematic features. Tools like LaunchDarkly, Unleash, and Flagsmith manage flags centrally. In microservices, where independent deployment is key, feature flags decouple deployment from release—you can deploy code anytime and activate features when ready. The trade-off is technical debt: old flags must be cleaned up, or the codebase becomes cluttered with conditional logic."
  },
  {
    question: "What is the 'log aggregation' pattern?",
    options: [
      "Writing all logs to a single monolithic log file",
      "Collecting logs from all service instances into a centralized system for searching, analysis, and alerting",
      "Aggregating log entries to reduce storage costs by removing duplicates",
      "Printing logs to the console during development only"
    ],
    correctIndex: 1,
    explanation: "Log aggregation collects logs from all microservice instances into a centralized platform for unified searching, analysis, and alerting. The ELK/EFK stack (Elasticsearch, Logstash/Fluentd, Kibana) and solutions like Datadog, Splunk, and Grafana Loki are common implementations. In microservices, logs are scattered across hundreds of container instances that are ephemeral—when a pod restarts, its local logs are lost. Centralized log aggregation with correlation IDs enables engineers to trace a request across all services it touched. This is not about writing to a single file or deduplication, but about making distributed system behavior observable and debuggable from a single pane of glass."
  },
  {
    question: "What does 'infrastructure as code' mean for microservices deployments?",
    options: [
      "Writing microservices in infrastructure-level languages like C",
      "Defining and managing infrastructure (servers, networks, deployments) through code files that can be versioned and automated",
      "Storing infrastructure passwords in source code",
      "Running infrastructure monitoring dashboards as microservices"
    ],
    correctIndex: 1,
    explanation: "Infrastructure as Code (IaC) means defining infrastructure (Kubernetes manifests, cloud resources, networking) in declarative code files that are version-controlled, reviewed, and automatically applied. Tools like Terraform, Pulumi, Helm, and Kustomize enable this. For microservices, IaC is critical because manually configuring hundreds of services, load balancers, databases, and networks is error-prone and unreproducible. With IaC, you can recreate an entire environment from scratch, track changes through Git history, and ensure consistency across development, staging, and production. GitOps tools like ArgoCD and Flux take this further by using Git as the single source of truth for cluster state."
  },
  {
    question: "What is the purpose of a Namespace in Kubernetes?",
    options: [
      "To define the programming language namespace for service code",
      "To provide logical isolation and resource scoping within a cluster, allowing multiple teams or environments to share it",
      "To create physical network partitions between nodes",
      "To define DNS domain names for external traffic"
    ],
    correctIndex: 1,
    explanation: "Kubernetes Namespaces provide logical isolation within a cluster, allowing you to partition resources into named groups. Different teams can use separate namespaces (team-a, team-b), or you can separate environments (dev, staging) within the same cluster. Namespaces scope resource names (avoiding conflicts), allow resource quotas (limiting CPU/memory per namespace), and enable network policies (restricting cross-namespace traffic). They don't create physical network isolation by default—pods in different namespaces can still communicate unless network policies restrict it. For microservices, namespaces help organize services by team or environment while sharing the same underlying cluster infrastructure."
  },
  {
    question: "What is 'observability' and how does it differ from 'monitoring'?",
    options: [
      "They are the same thing—different names for dashboards",
      "Monitoring checks known failure modes; observability lets you understand system behavior from its outputs, including investigating unknown unknowns",
      "Observability is for development; monitoring is for production",
      "Monitoring uses metrics; observability uses logs only"
    ],
    correctIndex: 1,
    explanation: "Monitoring tracks predefined metrics and alerts on known failure conditions (CPU > 90%, error rate > 5%). Observability goes further—it enables you to understand system behavior from its external outputs (metrics, logs, traces), including diagnosing novel, unforeseen issues. The three pillars of observability are metrics (numerical measurements), logs (detailed event records), and traces (request paths across services). In microservices, monitoring alone is insufficient because the failure modes are too varied and complex to predict. Observability tools like Grafana, Jaeger, and Datadog let engineers ask arbitrary questions about system behavior and drill down from symptoms to root causes without adding new instrumentation."
  },
  {
    question: "What is the 'timeout pattern' and why is it critical in microservices?",
    options: [
      "A pattern to limit how long developers spend on a feature",
      "Setting maximum wait times for service calls to prevent resource exhaustion when downstream services are slow",
      "A pattern for scheduling service shutdowns during maintenance",
      "Limiting the time a container can run before being replaced"
    ],
    correctIndex: 1,
    explanation: "The timeout pattern sets a maximum time a caller will wait for a response from a downstream service. Without timeouts, a slow service can cause the caller to hold resources (threads, connections) indefinitely, eventually exhausting them and cascading the failure. For example, if Service A calls Service B with no timeout and B hangs, A's thread pool fills up with waiting threads, making A unresponsive. Timeouts should be carefully tuned—too short causes false failures, too long wastes resources. Timeouts work best in combination with circuit breakers and retries. In microservices, every outbound call should have a timeout configured; the default 'infinite timeout' of most HTTP clients is dangerous in distributed systems."
  },
  {
    question: "What is 'event storming' in the context of microservices design?",
    options: [
      "A chaos engineering technique that floods services with events",
      "A collaborative workshop technique where domain experts and developers discover domain events, commands, and aggregates to identify service boundaries",
      "A load testing approach using event-driven traffic",
      "A monitoring technique for event-driven systems"
    ],
    correctIndex: 1,
    explanation: "Event Storming is a collaborative workshop method created by Alberto Brandolini where domain experts and developers use sticky notes on a wall to map out domain events (things that happen), commands (what triggers them), aggregates (entities that handle commands), and bounded contexts. This is one of the most effective techniques for discovering microservice boundaries because it focuses on business processes and domain events rather than data models. The workshop reveals natural boundaries where different teams or contexts handle different events. It produces a shared understanding of the domain that directly maps to service decomposition. It's rooted in DDD principles and typically precedes any architecture decisions."
  },
  {
    question: "What is a DaemonSet in Kubernetes?",
    options: [
      "A set of services that run only at night (daemon hours)",
      "A resource that ensures a copy of a pod runs on every node in the cluster, commonly used for logging agents and monitoring",
      "A deployment strategy for stateful services",
      "A security group for privileged containers"
    ],
    correctIndex: 1,
    explanation: "A DaemonSet ensures that a copy of a specific pod runs on every node (or a selected subset of nodes) in the cluster. When new nodes are added, the DaemonSet automatically deploys pods to them. Common use cases include log collectors (Fluentd, Filebeat), monitoring agents (Prometheus Node Exporter, Datadog Agent), network plugins (Calico, Weave), and storage daemons (GlusterFS). For microservices, DaemonSets are infrastructure-level—you typically don't deploy your business services as DaemonSets but rather use them for the cross-cutting infrastructure that all services depend on. Unlike Deployments that create a specified number of replicas, DaemonSets tie replica count to node count."
  },
  {
    question: "What is 'chaos engineering' and why is it relevant to microservices?",
    options: [
      "Writing code without a plan or design",
      "Intentionally injecting failures into a system to test its resilience and identify weaknesses before they cause real outages",
      "Using random data in unit tests",
      "Deploying services in random order"
    ],
    correctIndex: 1,
    explanation: "Chaos engineering is the discipline of experimenting on a production (or production-like) system to build confidence in its ability to withstand turbulent conditions. Tools like Chaos Monkey (Netflix), Gremlin, and LitmusChaos inject failures such as killing pods, introducing network latency, corrupting data, and exhausting CPU. For microservices, this is particularly important because the distributed nature creates countless failure modes that are impossible to predict through testing alone. By proactively discovering weaknesses (missing timeouts, inadequate circuit breakers, poor retry logic), teams can fix them before they cause real incidents. Netflix pioneered this approach, evolving it from killing random instances to sophisticated, hypothesis-driven experiments."
  },
  {
    question: "What is the 'Anti-Corruption Layer' pattern in DDD?",
    options: [
      "A firewall that prevents malicious data from entering the system",
      "A translation layer that prevents one bounded context's model from leaking into and corrupting another context's model",
      "A data validation layer that prevents database corruption",
      "An encryption layer that prevents data tampering"
    ],
    correctIndex: 1,
    explanation: "The Anti-Corruption Layer (ACL) is a DDD pattern that acts as a translation boundary between two bounded contexts, especially when integrating with a legacy system or external service. It translates between the external model and your internal domain model, preventing foreign concepts from 'corrupting' your domain. For example, if a legacy system represents a customer differently than your new microservice, the ACL transforms data at the boundary. Without it, external models gradually leak into your codebase, making it harder to evolve independently. In microservices, ACLs are commonly implemented at service boundaries where different teams have different domain models, preserving each service's model integrity."
  },
  {
    question: "What is 'trunk-based development' and how does it relate to microservices?",
    options: [
      "Developing all services in a single monorepo",
      "A branching strategy where developers commit to a single main branch frequently, using feature flags to manage incomplete work",
      "Storing code in tree-structured databases",
      "Developing services based on a tree-structured architecture"
    ],
    correctIndex: 1,
    explanation: "Trunk-based development is a source-control branching strategy where all developers commit to a single shared branch (main/trunk) at least daily, using short-lived feature branches (if any) that merge quickly. Combined with feature flags, this enables continuous integration—code is always in a deployable state. This complements microservices because each service needs rapid, independent deployments. Long-lived branches lead to merge hell and delayed integration, undermining the independence microservices promise. Google, Facebook, and Netflix practice trunk-based development. It requires strong CI/CD pipelines, comprehensive automated testing, and feature flags to manage unreleased functionality. Monorepo vs. polyrepo is a separate concern from branching strategy."
  },
  {
    question: "What is a Horizontal Pod Autoscaler (HPA) in Kubernetes?",
    options: [
      "A tool that horizontally splits pods across regions",
      "A Kubernetes resource that automatically adjusts the number of pod replicas based on observed metrics like CPU utilization or custom metrics",
      "A manual scaling command for Kubernetes administrators",
      "A network policy that controls horizontal traffic between pods"
    ],
    correctIndex: 1,
    explanation: "The Horizontal Pod Autoscaler automatically scales the number of pod replicas in a Deployment or StatefulSet based on observed metrics. By default, it uses CPU utilization, but it can also use memory, custom metrics (like request queue depth), or external metrics (like messages in a Kafka topic). For example, if average CPU exceeds 70%, HPA adds more replicas; if it drops below, it removes them. This is essential for microservices because traffic patterns vary—an order service might spike during sales events while other services remain steady. HPA enables each service to scale independently based on its own demand, optimizing both performance and cost. It works with Cluster Autoscaler, which adds/removes nodes."
  },
  {
    question: "Why should microservices avoid sharing a database?",
    options: [
      "Databases can only handle one service's queries",
      "Sharing a database creates tight coupling—schema changes, performance issues, and scaling decisions affect all services sharing it",
      "Modern databases don't support multiple connections",
      "It's a security requirement from cloud providers"
    ],
    correctIndex: 1,
    explanation: "When services share a database, they become tightly coupled in several ways: schema changes in one service can break others, a slow query from one service degrades performance for all, scaling the database means over-provisioning for all services, and teams can't independently choose the best data technology for their needs. It also creates hidden runtime coupling—services that appear independent at the code level are actually connected through shared tables. This undermines the core benefit of microservices: independent development and deployment. The migration path is gradual: start by separating schemas (separate tables/schemas per service), then move to separate database instances. Modern databases can absolutely handle multiple connections; that's not the issue."
  },
  {
    question: "What is the role of an 'event bus' or 'message broker' in microservices?",
    options: [
      "It stores the source code for all microservices",
      "It acts as an intermediary for asynchronous communication, decoupling producers from consumers and enabling event-driven interactions",
      "It compiles and deploys microservices automatically",
      "It manages database schemas across services"
    ],
    correctIndex: 1,
    explanation: "A message broker (like RabbitMQ, Apache Kafka, or AWS SNS/SQS) acts as an intermediary for asynchronous communication between services. Producers publish messages/events without knowing who will consume them, and consumers subscribe to the messages they're interested in. This decouples services in space (don't need to know each other's addresses) and time (don't need to be running simultaneously). Brokers also provide buffering (absorbing traffic spikes), guaranteed delivery (persisting messages until consumed), and fan-out (one message consumed by multiple services). In microservices, the message broker is often the backbone of the architecture, enabling event-driven patterns that are more resilient than synchronous call chains."
  },
  {
    question: "What is the difference between 'north-south' and 'east-west' traffic in microservices?",
    options: [
      "Traffic between different geographic regions",
      "North-south is traffic entering/leaving the system (client to services); east-west is traffic between services within the system",
      "North-south is upload traffic; east-west is download traffic",
      "They refer to different network protocols"
    ],
    correctIndex: 1,
    explanation: "North-south traffic flows between external clients and the system's edge (through the API gateway or load balancer). East-west traffic flows between microservices within the system. In microservices architectures, east-west traffic typically far exceeds north-south traffic—a single client request might trigger dozens of inter-service calls. This distinction matters for security (north-south goes through the gateway; east-west needs mutual TLS via service mesh), performance (east-west latency compounds across service chains), and monitoring (you need different tools for external vs. internal traffic). Service meshes like Istio primarily address east-west traffic concerns, while API gateways handle north-south."
  },
  {
    question: "What is 'domain event' in microservices?",
    options: [
      "A DNS change event for a domain name",
      "A significant occurrence within a bounded context that other contexts might need to know about",
      "An event triggered when a new service is deployed",
      "A scheduled cron job within a service"
    ],
    correctIndex: 1,
    explanation: "A domain event represents something meaningful that happened in the business domain—like 'OrderPlaced,' 'PaymentProcessed,' or 'InventoryReserved.' These events are first-class citizens in DDD and microservices, used to communicate state changes between bounded contexts without tight coupling. When the Order Service places an order, it publishes an 'OrderPlaced' event; the Inventory, Payment, and Notification services can independently react to this event. Domain events should be named in past tense (something that already happened) and contain the relevant data needed by consumers. They're the foundation of event-driven microservices and are distinct from infrastructure events (like deployment notifications)."
  },
  {
    question: "What is 'data replication' used for in microservices?",
    options: [
      "Copying source code between service repositories",
      "Maintaining copies of relevant data from other services to enable local queries and reduce runtime dependencies",
      "Creating backup tapes for disaster recovery",
      "Duplicating microservices in multiple programming languages"
    ],
    correctIndex: 1,
    explanation: "In microservices, data replication means maintaining a local copy of data owned by another service so you can query it without making synchronous calls. For example, the Shipping Service might maintain a local copy of customer addresses (owned by the Customer Service) by consuming address-changed events. This eliminates runtime dependency on the Customer Service for every shipment. The data is eventually consistent—there's a small delay between the original update and the replica. This pattern trades consistency for availability and autonomy. It's commonly implemented using events (CDC or domain events) and is essential for query-heavy services that need to join data from multiple domains."
  },
  {
    question: "What is the 'Twelve-Factor App' methodology?",
    options: [
      "A methodology requiring exactly twelve microservices",
      "A set of twelve best practices for building cloud-native applications that are portable, scalable, and suitable for continuous deployment",
      "A twelve-step process for migrating monoliths to microservices",
      "A security framework with twelve compliance checkpoints"
    ],
    correctIndex: 1,
    explanation: "The Twelve-Factor App methodology (by Heroku co-founder Adam Wiggins) defines twelve best practices for cloud-native applications: codebase (one repo per app), dependencies (explicitly declared), config (stored in environment), backing services (treated as attached resources), build/release/run (strict separation), processes (stateless), port binding (self-contained), concurrency (scale via processes), disposability (fast startup/shutdown), dev/prod parity, logs (event streams), and admin processes (one-off tasks). These principles align perfectly with microservices: stateless processes enable horizontal scaling, externalized config supports multiple environments, and disposability supports container orchestration. Most Kubernetes best practices derive from these principles."
  },
  {
    question: "What is 'mutual TLS (mTLS)' in microservices?",
    options: [
      "TLS encryption used only for database connections",
      "A security protocol where both the client and server authenticate each other using certificates, ensuring encrypted and verified communication",
      "A backup TLS certificate used when the primary expires",
      "A simplified TLS that skips certificate verification for performance"
    ],
    correctIndex: 1,
    explanation: "Mutual TLS (mTLS) extends standard TLS by requiring both parties to present and verify certificates. In standard TLS, only the server proves its identity; in mTLS, the client also proves its identity to the server. In microservices, mTLS ensures that service-to-service communication is both encrypted (confidentiality) and authenticated (you know who's calling). Service meshes like Istio automate mTLS—the sidecar proxies handle certificate generation, rotation, and verification without application changes. Without mTLS, any process in the network could impersonate a service and access internal APIs. Zero-trust security models require mTLS as a baseline for all east-west traffic."
  },
  {
    question: "What is 'rate limiting' at the microservice level used for?",
    options: [
      "Limiting how fast services can write code",
      "Protecting services from being overwhelmed by too many requests, whether from external clients or other services",
      "Limiting the amount of data stored in databases",
      "Controlling the rate of log file generation"
    ],
    correctIndex: 1,
    explanation: "Rate limiting restricts the number of requests a service accepts within a time window, protecting it from being overwhelmed. This is critical for several scenarios: preventing denial-of-service attacks, ensuring fair usage among clients, protecting downstream dependencies from cascading overload, and managing costs for pay-per-use resources. Rate limiting can be applied at the API gateway (for external traffic) and at individual services (for inter-service traffic). Common algorithms include token bucket, leaky bucket, and sliding window. When a limit is exceeded, the service returns HTTP 429 (Too Many Requests). Rate limiting is a form of load shedding—it's better to reject excess requests cleanly than to let the service degrade for everyone."
  },
  {
    question: "What is 'graceful degradation' in microservices?",
    options: [
      "Slowly shutting down all services during maintenance",
      "Continuing to provide reduced but functional service when some components fail, rather than completely failing",
      "Gradually migrating from microservices back to a monolith",
      "Reducing code quality over time to ship faster"
    ],
    correctIndex: 1,
    explanation: "Graceful degradation means the system continues to function in a reduced capacity when some components fail, rather than failing entirely. For example, if the Recommendation Service is down, an e-commerce site can still show products and process orders—just without personalized recommendations. This requires designing services to handle missing dependencies: using cached data, default responses, or disabling non-essential features. Circuit breakers and fallback mechanisms are key enablers. Netflix is a master of this—if their recommendation engine fails, they show popular titles instead. Graceful degradation is a design philosophy that accepts partial failure as inevitable in distributed systems and plans for it proactively."
  },
  {
    question: "What is the purpose of Kubernetes Secrets?",
    options: [
      "To hide services from external clients",
      "To store and manage sensitive data like passwords, tokens, and keys, providing a more secure mechanism than ConfigMaps",
      "To encrypt all network traffic in the cluster",
      "To store secret algorithms used by services"
    ],
    correctIndex: 1,
    explanation: "Kubernetes Secrets store sensitive data (passwords, API keys, TLS certificates) separately from pod specifications and container images. While similar to ConfigMaps, Secrets are intended for confidential data and offer additional protections: they're stored in tmpfs (not written to disk on nodes), can be encrypted at rest in etcd, and access can be restricted via RBAC. However, by default Secrets are only base64-encoded (not encrypted), so additional measures like sealed-secrets, external-secrets-operator, or HashiCorp Vault integration are recommended for production. For microservices, Secrets are essential for managing database credentials, API keys, and TLS certificates without embedding them in source code or container images."
  },
  {
    question: "What is the 'shared library' vs 'shared service' debate in microservices?",
    options: [
      "Whether to use open-source or proprietary libraries",
      "Whether common functionality should be distributed as a library linked into each service or centralized as a separate microservice",
      "Whether to share a library building or use remote offices",
      "Whether teams should share code review feedback publicly"
    ],
    correctIndex: 1,
    explanation: "When multiple services need the same functionality (e.g., validation logic, utility functions), you can either distribute it as a shared library (NuGet, npm, Maven package) that each service includes, or centralize it as a shared microservice that others call over the network. Shared libraries are simpler (no network call) but create coupling—updating the library requires redeploying all consumers. Shared services are independently deployable but add latency and a failure point. The general guidance: use libraries for truly stable, utility-level code (logging, serialization) and services for business logic that evolves independently. Over-sharing libraries can recreate monolith-like coupling; over-creating shared services can create dependency hell."
  },
  {
    question: "What is 'service mesh data plane' vs 'control plane'?",
    options: [
      "Data plane handles database operations; control plane handles user sessions",
      "Data plane consists of sidecar proxies handling actual traffic; control plane configures and manages the proxies",
      "Data plane is for testing; control plane is for production",
      "Data plane is east-west; control plane is north-south"
    ],
    correctIndex: 1,
    explanation: "In a service mesh, the data plane consists of lightweight proxy sidecars (typically Envoy) deployed alongside each service. These proxies intercept and handle all network traffic: load balancing, retries, TLS, observability, etc. The control plane (like Istio's istiod) is the management layer that configures all data plane proxies: distributing routing rules, security policies, and telemetry configuration. Think of it like air traffic control: the data plane is the actual aircraft carrying traffic, while the control plane is the ATC system telling them where to go. This separation allows the data plane to operate even if the control plane is temporarily unavailable (using the last known configuration), improving resilience."
  },
  {
    question: "What is a 'monorepo' vs 'polyrepo' approach for microservices?",
    options: [
      "Monorepo stores all services in one repository; polyrepo uses a separate repository per service",
      "Monorepo is for monoliths only; polyrepo is for microservices only",
      "Monorepo uses one programming language; polyrepo uses multiple",
      "There is no practical difference between them"
    ],
    correctIndex: 0,
    explanation: "A monorepo stores all microservice codebases in a single repository, while a polyrepo uses a separate repository for each service. Monorepos (used by Google, Meta) simplify atomic cross-service changes, code sharing, and consistent tooling but require sophisticated build tools (Bazel, Nx) to manage scale. Polyrepos (more common in smaller organizations) give each team complete autonomy over their repo, simpler CI/CD per service, and clear ownership boundaries but make cross-service changes harder and can lead to tool/dependency fragmentation. Neither is inherently better—the choice depends on team size, organizational structure, and tooling maturity. Many organizations use a hybrid approach."
  },
  {
    question: "What is the purpose of 'distributed locking' in microservices?",
    options: [
      "Locking down services during deployments",
      "Coordinating access to shared resources across multiple service instances to prevent race conditions",
      "Encrypting data at rest in distributed databases",
      "Restricting which services can communicate with each other"
    ],
    correctIndex: 1,
    explanation: "Distributed locking ensures that only one service instance at a time can perform a specific operation on a shared resource, preventing race conditions. For example, two instances of a Payment Service processing the same order simultaneously could charge the customer twice. Distributed locks (implemented using Redis with Redlock, ZooKeeper, or etcd) provide mutual exclusion across instances. However, distributed locks are fragile—network partitions, clock skew, and GC pauses can cause issues. Martin Kleppmann's critique of Redlock highlights these dangers. Whenever possible, prefer idempotent operations and optimistic concurrency control over distributed locks. When locks are necessary, use fencing tokens to prevent stale lock holders from causing harm."
  },
  {
    question: "What is 'service-level objective (SLO)' in microservices?",
    options: [
      "The minimum number of services that must be running",
      "A target value for a service's reliability metric, like '99.9% of requests complete in under 200ms'",
      "The maximum number of developers assigned to a service",
      "A standard for service naming conventions"
    ],
    correctIndex: 1,
    explanation: "A Service-Level Objective (SLO) is a target for a specific reliability metric that a service aims to meet—for example, '99.9% of requests succeed' or 'p99 latency under 200ms.' SLOs are part of the SRE framework: SLIs (indicators) measure the actual metrics, SLOs set the targets, and SLAs (agreements) are contractual obligations with consequences. In microservices, SLOs help teams make informed trade-offs between reliability and velocity. Error budgets (the acceptable amount of unreliability, e.g., 0.1%) determine how aggressively teams can deploy changes. If the error budget is exhausted, teams focus on reliability instead of new features. Google's SRE book popularized this approach for managing complex distributed systems."
  },
  {
    question: "What is the 'scatter-gather' pattern in microservices?",
    options: [
      "A pattern for distributing databases across regions",
      "Broadcasting a request to multiple services concurrently and aggregating their responses into a single result",
      "A garbage collection algorithm for containers",
      "A logging pattern that scatters log entries across multiple files"
    ],
    correctIndex: 1,
    explanation: "The scatter-gather pattern sends a request to multiple services in parallel (scatter) and then collects and aggregates their responses (gather). For example, a price comparison service might query multiple supplier services simultaneously and return the best price. Or a search service might scatter queries across multiple index shards and merge the results. This pattern reduces latency compared to sequential calls but requires handling partial failures—what if one service times out? Strategies include returning partial results with a warning, using cached data for the missing service, or waiting with a timeout. The aggregation logic can live in an API gateway, a BFF, or a dedicated orchestration service."
  },
  {
    question: "What is the difference between 'orchestration' and 'choreography' for microservice integration?",
    options: [
      "Orchestration uses containers; choreography uses virtual machines",
      "Orchestration has a central controller directing the workflow; choreography has services reacting to events independently with no central control",
      "Orchestration is synchronous; choreography is always faster",
      "They are the same pattern with different names"
    ],
    correctIndex: 1,
    explanation: "Orchestration uses a central controller (orchestrator) that explicitly directs the sequence of service interactions—it knows the full workflow and tells each service what to do and when. Choreography is decentralized—each service listens for events and independently decides how to react, with no single entity knowing the full picture. Orchestration is easier to understand and modify for complex workflows but creates a central point that must be maintained. Choreography is more loosely coupled and resilient but can become hard to reason about as the number of event chains grows ('event spaghetti'). Real systems often combine both: choreography between bounded contexts and orchestration within complex processes. Neither is inherently better; the choice depends on workflow complexity and coupling requirements."
  },
  {
    question: "What is 'consumer-driven contract testing' and why is it valuable?",
    options: [
      "Testing that consumers pay for API usage",
      "A testing approach where API consumers define their expectations, which are then verified against the provider to catch breaking changes early",
      "Testing that all consumers use the same client library",
      "A legal testing process for service agreements"
    ],
    correctIndex: 1,
    explanation: "Consumer-driven contract testing (CDCT) lets consumers of an API specify exactly what they expect (which endpoints, what data format, what status codes). These expectations become 'contracts' that are tested against the provider in the provider's CI pipeline. If a provider change breaks any consumer's contract, the build fails before deployment. Pact is the most popular CDCT framework. This is crucial for microservices because services are deployed independently—without contract tests, a provider might unknowingly break consumers discovered only in production. It's faster and more reliable than end-to-end integration tests because it runs without deploying all services. It inverts the testing relationship: providers are held accountable to their consumers' actual needs."
  },
  {
    question: "What is the 'database migration' challenge when splitting a monolith?",
    options: [
      "Choosing which cloud provider to host databases on",
      "Extracting each service's data from the shared database into independent stores while maintaining referential integrity and data consistency during the transition",
      "Learning new database query languages",
      "Converting all data to JSON format"
    ],
    correctIndex: 1,
    explanation: "When splitting a monolith, one of the hardest challenges is decomposing the shared database. Tables often have foreign keys, joins, and stored procedures that cross service boundaries. You must identify which tables belong to which service, replace cross-boundary joins with API calls or data replication, handle the transition period where both the monolith and new services need access to data, and migrate without downtime. Strategies include: starting with separate schemas in the same database, using database views to maintain backward compatibility, and employing CDC (Change Data Capture) to synchronize data during the transition. This is often the most technically challenging aspect of monolith decomposition and is why the Strangler Fig pattern recommends a gradual approach."
  },
  {
    question: "What is a Kubernetes Job and CronJob?",
    options: [
      "Tools for hiring Kubernetes administrators",
      "Job runs a pod to completion for batch tasks; CronJob schedules Jobs to run periodically on a cron schedule",
      "Job monitors service health; CronJob rotates log files",
      "Job deploys new services; CronJob rolls back failed deployments"
    ],
    correctIndex: 1,
    explanation: "A Kubernetes Job creates one or more pods and ensures they run to successful completion—unlike Deployments that maintain long-running services. Jobs are ideal for batch processing, data migrations, and one-off tasks. A CronJob creates Jobs on a recurring schedule (using cron syntax), useful for periodic tasks like database backups, report generation, and cleanup operations. For microservices, Jobs handle batch processing that doesn't fit the always-running service model, and CronJobs replace traditional cron daemons in a cloud-native way. Jobs support parallelism (running multiple pods simultaneously), completion counts, and configurable retry policies for failed pods."
  },
  {
    question: "What is the 'death star' architecture anti-pattern?",
    options: [
      "A highly centralized architecture with a single point of failure",
      "An architecture where every service calls every other service, creating a tangled web of dependencies that's impossible to understand or manage",
      "An architecture designed to destroy legacy systems",
      "A top-secret internal codename for classified architectures"
    ],
    correctIndex: 1,
    explanation: "The 'death star' anti-pattern (named for the visualization that looks like the Star Wars Death Star) occurs when microservices are so interconnected that every service depends on multiple others with no clear layering or boundaries. Visualizing service dependencies produces a dense, tangled web. This typically results from poor service boundary design, excessive synchronous calls, and lack of domain-driven design. The symptoms include: a change in one service cascading unpredictably, difficulty understanding request flows, and system-wide outages from a single service failure. The solution involves introducing event-driven communication, defining clear service layers, establishing API contracts, and potentially re-evaluating service boundaries using DDD bounded contexts."
  },
  {
    question: "What is the role of a 'sidecar proxy' in implementing observability?",
    options: [
      "It replaces the application's logging framework",
      "It transparently captures metrics, traces, and access logs from all service traffic without modifying application code",
      "It stores observability data in a local database",
      "It sends alerts directly to developers' phones"
    ],
    correctIndex: 1,
    explanation: "A sidecar proxy (like Envoy in Istio) intercepts all inbound and outbound traffic for a service, automatically capturing observability data: request/response metrics (latency, status codes, throughput), distributed traces (propagating trace context between services), and access logs. This provides consistent observability across all services regardless of programming language or framework, without requiring application code changes. The sidecar emits data to observability backends (Prometheus for metrics, Jaeger for traces, Elasticsearch for logs). This is one of the most compelling features of service meshes—polyglot environments get uniform observability. The application can still add custom business metrics, but infrastructure-level observability comes 'for free' from the sidecar."
  },
  {
    question: "What is 'semantic versioning' and how does it apply to microservice APIs?",
    options: [
      "Versioning based on the meaning of code changes",
      "A versioning scheme (MAJOR.MINOR.PATCH) where MAJOR indicates breaking changes, MINOR adds backward-compatible features, and PATCH fixes bugs",
      "Using descriptive names instead of numbers for versions",
      "Automatically versioning APIs based on deployment date"
    ],
    correctIndex: 1,
    explanation: "Semantic versioning (semver) uses MAJOR.MINOR.PATCH where: MAJOR increments for breaking (incompatible) changes, MINOR for backward-compatible new features, and PATCH for backward-compatible bug fixes. For microservice APIs, this communicates the impact of changes to consumers: a PATCH or MINOR update is safe to adopt without changes, but a MAJOR update requires consumer modifications. This is critical because services are independently deployed—consumers need to understand whether a provider update will break them. In practice, microservices often use simpler versioning (v1, v2) for API endpoints and semver for shared libraries. The key principle: never make breaking changes without communicating them through the version number."
  },
  {
    question: "What is 'load shedding' in microservices?",
    options: [
      "Distributing load evenly across all service instances",
      "Intentionally rejecting excess requests when a service is at capacity to maintain performance for accepted requests",
      "Moving workloads from one cloud region to another",
      "Reducing the service's codebase to improve performance"
    ],
    correctIndex: 1,
    explanation: "Load shedding is the practice of deliberately dropping excess requests when a service is at or near capacity, rather than attempting to process everything and degrading performance for all requests. For example, when a service detects it's handling more than its healthy capacity, it returns HTTP 503 (Service Unavailable) for additional requests while maintaining good latency for the requests it's processing. This is different from rate limiting (which limits per-client rates) and load balancing (which distributes requests). Load shedding is a last-resort defense that keeps the service responsive under extreme load. Google's approach prioritizes important requests (like user-facing traffic over batch jobs) during shedding."
  },
  {
    question: "What is 'zero-trust networking' in a microservices context?",
    options: [
      "Not trusting any code that wasn't written in-house",
      "A security model that verifies every request regardless of origin, assuming the network is always hostile—no implicit trust based on network location",
      "Using zero-configuration networking between services",
      "A network that requires zero maintenance"
    ],
    correctIndex: 1,
    explanation: "Zero-trust networking abandons the traditional perimeter-based security model (trusted inside the firewall, untrusted outside) in favor of verifying every request regardless of where it originates. In microservices, this means: every service-to-service call is authenticated (mutual TLS), authorized (fine-grained policies checking if Service A is allowed to call Service B's specific endpoint), and encrypted. Service meshes like Istio enable zero-trust by handling mTLS and authorization policies transparently via sidecar proxies. This is essential in containerized environments where services share network infrastructure and lateral movement by attackers must be prevented. Google's BeyondCorp is a pioneering implementation of zero-trust principles."
  },
  {
    question: "What are 'init containers' in Kubernetes?",
    options: [
      "The first containers deployed in a new cluster",
      "Specialized containers that run and complete before the main application containers start, used for setup tasks",
      "Containers that initialize the Kubernetes control plane",
      "Default containers provided by Kubernetes for monitoring"
    ],
    correctIndex: 1,
    explanation: "Init containers are specialized containers in a pod that run to completion before the main application containers start. They're used for initialization tasks like: waiting for a dependent service to be ready, downloading configuration files, running database migrations, or setting up file permissions. Init containers run sequentially—each must succeed before the next starts, and all must complete before the main containers launch. This is useful in microservices for ensuring prerequisites are met: for example, an init container can wait for a database migration to complete or for a config service to be available. Unlike main containers, init containers don't support liveness/readiness probes since they run to completion."
  },
  {
    question: "What is the 'ambassador' deployment model in Kubernetes?",
    options: [
      "Deploying services to a special 'ambassador' namespace",
      "Running a proxy container in the same pod that handles routing, TLS termination, and protocol translation for the main container",
      "Designating one pod as the spokesperson for a group of pods",
      "A diplomatic protocol for cross-cluster communication"
    ],
    correctIndex: 1,
    explanation: "The ambassador pattern in Kubernetes deploys a proxy container within the same pod as the main application container. The ambassador handles complex outbound connectivity: routing requests to the right backend, TLS termination, protocol translation, or connection pooling. The main container communicates with the ambassador via localhost, simplifying its network logic. For example, an ambassador might handle connecting to a sharded database, routing requests to the correct shard—the application just connects to localhost:5432. This is closely related to the sidecar pattern but specifically addresses outbound communication complexity. In service mesh architectures, the Envoy sidecar serves a similar ambassador role."
  },
  {
    question: "What is 'graceful shutdown' and why is it important for microservices in Kubernetes?",
    options: [
      "Shutting down the entire Kubernetes cluster gracefully",
      "Allowing a service to finish processing in-flight requests before terminating, preventing data loss and request failures during deployments",
      "A polite way to notify users that a service is going offline",
      "Gradually reducing traffic to zero before maintenance"
    ],
    correctIndex: 1,
    explanation: "Graceful shutdown means that when a pod receives a termination signal (SIGTERM), it stops accepting new requests, finishes processing in-flight requests, cleans up resources (closes connections, flushes buffers), and then exits. In Kubernetes, this happens during rolling updates, scaling down, and node draining. Kubernetes sends SIGTERM, waits for the terminationGracePeriodSeconds (default 30s), then sends SIGKILL. Without graceful shutdown, in-flight requests are abruptly terminated, causing errors for clients. Applications must handle SIGTERM properly: stop the HTTP server from accepting new connections, wait for current requests to complete, and exit cleanly. This is especially critical for microservices with constant rolling updates."
  },
  {
    question: "What does 'polyglot architecture' mean?",
    options: [
      "An architecture that supports multiple human languages in the UI",
      "An architecture where different services are built using different programming languages, frameworks, and data stores based on what's optimal for each",
      "Using a single programming language across all microservices",
      "Translating APIs between different format standards"
    ],
    correctIndex: 1,
    explanation: "Polyglot architecture allows each microservice team to choose the best programming language, framework, and data store for their specific needs. A compute-heavy service might use Go or Rust for performance, a data science service might use Python, a web-facing service might use Node.js, and each might use the most appropriate database (PostgreSQL, MongoDB, Redis, etc.). This is a key benefit of microservices: the contract between services is the API, not the implementation. The trade-off is operational complexity—your platform team must support multiple runtimes, build pipelines, and data stores. Organizations often allow choice within guardrails (e.g., 'choose from these three approved languages')."
  },
  {
    question: "What is 'topology-aware routing' in Kubernetes?",
    options: [
      "Routing based on the shape of the network diagram",
      "Preferring to route traffic to service instances in the same zone or region to reduce latency and cross-zone costs",
      "Using geographic maps to visualize service locations",
      "Routing based on the physical topology of server racks"
    ],
    correctIndex: 1,
    explanation: "Topology-aware routing (formerly known as topology hints or service topology) in Kubernetes prefers to route traffic to endpoints that are 'closer' in the network topology—typically in the same availability zone before crossing to other zones. Cross-zone traffic in cloud environments incurs both latency (a few extra milliseconds) and cost (cloud providers charge for cross-AZ data transfer). In microservices with high inter-service call volumes, these costs add up significantly. Kubernetes topology-aware routing annotates endpoints with zone information and the kube-proxy routes traffic accordingly. This optimization is transparent to services and can reduce both latency and cloud costs substantially for east-west traffic."
  },
  {
    question: "What is the 'strangler fig' approach to handling the frontend during monolith decomposition?",
    options: [
      "Rewriting the entire frontend from scratch",
      "Using a reverse proxy or API gateway to route requests—new functionality goes to microservices, legacy functionality stays in the monolith until migrated",
      "Keeping the frontend as a monolith forever",
      "Converting the frontend to a CLI tool"
    ],
    correctIndex: 1,
    explanation: "In the Strangler Fig pattern, a reverse proxy or API gateway sits in front of both the monolith and new microservices, routing each request to the appropriate backend. New features are built as microservices, and existing features are migrated one by one. The frontend doesn't need to know about this split—it talks to the gateway, which handles routing transparently. Over time, more routes point to microservices and fewer to the monolith, until the monolith is completely replaced (or shrunk to a manageable size). This approach minimizes risk, allows incremental validation, and avoids the dangerous big-bang rewrite that has historically led to project failures at companies like Netscape."
  },
  {
    question: "What is the 'saga execution coordinator' (SEC)?",
    options: [
      "The Securities and Exchange Commission's role in microservices",
      "A component in orchestration-based sagas that manages the saga's state machine, deciding what step to execute next or what to compensate",
      "A team lead who coordinates deployment schedules",
      "A Kubernetes controller for managing persistent volumes"
    ],
    correctIndex: 1,
    explanation: "The Saga Execution Coordinator (SEC) is the central component in orchestration-based sagas that maintains the saga's state (which steps have completed, which are pending) and determines the next action. When a step succeeds, the SEC invokes the next step; when a step fails, it triggers compensating transactions for previously completed steps in reverse order. The SEC itself must be reliable—it persists its state so it can recover from crashes. Tools like Temporal, Camunda, and AWS Step Functions serve as SEC implementations. The SEC's state machine defines the entire workflow, making it easy to visualize and modify. The trade-off is that the SEC becomes a critical component that must be highly available."
  },
  {
    question: "What is 'request collapsing' or 'request coalescing'?",
    options: [
      "Compressing multiple fields into a single field",
      "Merging multiple identical or similar concurrent requests into a single backend call and sharing the result among all callers",
      "Collapsing a microservice back into the monolith",
      "Combining request and response into a single message"
    ],
    correctIndex: 1,
    explanation: "Request collapsing (or coalescing) detects multiple concurrent requests for the same data and groups them into a single backend call, sharing the result among all waiting callers. For example, if 50 threads simultaneously request user profile #123, instead of making 50 database queries, a single query is made and the result is distributed to all 50 callers. Netflix Hystrix (now Resilience4j) popularized this pattern. This is particularly effective for microservices with high concurrency and overlapping requests. It reduces load on downstream services and databases, decreasing latency and resource usage. The trade-off is that all collapsed requests share the same result, including errors, and it adds a small windowing delay to batch requests."
  },
  {
    question: "What is 'GitOps' in the context of microservices deployment?",
    options: [
      "Using GitHub for all service repositories",
      "An operational model where Git is the single source of truth for infrastructure and deployment configuration, with automated reconciliation",
      "A Git branching strategy for operations teams",
      "Using Git hooks to trigger alerts"
    ],
    correctIndex: 1,
    explanation: "GitOps uses Git as the single source of truth for both application code and infrastructure/deployment configuration. A GitOps operator (like ArgoCD or Flux) continuously monitors the Git repository and automatically reconciles the cluster state to match the desired state declared in Git. When you want to deploy a new version, you update the Kubernetes manifest in Git (via pull request), and the operator detects the change and applies it to the cluster. This provides audit trails (Git history), rollback (revert a commit), consistency (cluster always matches Git), and security (no direct kubectl access needed). For microservices with dozens of services, GitOps brings order to deployment chaos."
  },
  {
    question: "What is 'service-level agreement (SLA)' vs 'service-level objective (SLO)'?",
    options: [
      "They are the same thing",
      "SLA is a contractual agreement with consequences for breaching; SLO is an internal target the team aims to meet",
      "SLA is for internal services; SLO is for external customers",
      "SLO is stricter than SLA"
    ],
    correctIndex: 1,
    explanation: "An SLA (Service-Level Agreement) is a formal contract between a service provider and its customers that specifies performance guarantees and consequences (usually financial penalties or credits) if those guarantees are not met. An SLO (Service-Level Objective) is an internal target set by the team—it's what the team actually aims for and is typically stricter than the SLA to provide a buffer. For example, the SLA might guarantee 99.9% uptime, but the team's SLO might be 99.95%. The gap between SLO and SLA is the team's safety margin. SLIs (Service-Level Indicators) are the actual measured metrics. In microservices, each service should have SLOs that account for dependencies—if Service A depends on Service B, A's SLO can't be higher than B's."
  },
  {
    question: "What is a 'Network Policy' in Kubernetes?",
    options: [
      "A company policy about network usage",
      "A Kubernetes resource that defines rules controlling which pods can communicate with each other, implementing microsegmentation",
      "A DNS configuration for external domains",
      "A bandwidth throttling mechanism"
    ],
    correctIndex: 1,
    explanation: "Network Policies in Kubernetes are resources that specify rules for pod-to-pod communication, essentially acting as a firewall at the pod level. By default, all pods can communicate with all other pods in a Kubernetes cluster. Network Policies restrict this by defining ingress (inbound) and egress (outbound) rules based on pod labels, namespace labels, or IP blocks. For example, you might restrict a database pod to only accept traffic from the application pods that need it. This implements microsegmentation—a zero-trust principle where only explicitly allowed communication is permitted. Network Policies require a CNI plugin that supports them (Calico, Cilium, Weave Net). They're essential for securing microservices by limiting blast radius if a service is compromised."
  },
  {
    question: "What is the 'saga log' in a saga pattern?",
    options: [
      "A log file recording all API calls made during development",
      "A persistent record of a saga's progress that enables recovery if the saga coordinator crashes during execution",
      "The logging output of the saga framework",
      "A changelog of saga pattern modifications"
    ],
    correctIndex: 1,
    explanation: "The saga log is a durable record of a saga instance's execution state—which steps have completed, which are in progress, and any compensation results. If the saga coordinator crashes mid-execution, it uses the saga log to determine where to resume when it restarts. Without a saga log, a crash could leave the system in an inconsistent state with some services having committed their transactions and others not. The saga log is typically stored in the coordinator's database or a dedicated event store. This is analogous to a database transaction log that enables recovery after crashes. Tools like Temporal persist workflow state automatically, effectively managing the saga log for you."
  },
  {
    question: "What is 'multi-tenancy' in microservices architecture?",
    options: [
      "Running services in multiple data centers",
      "A single service instance serving multiple customers (tenants) with logical data isolation between them",
      "Having multiple development teams work on the same service",
      "Running multiple versions of a service simultaneously"
    ],
    correctIndex: 1,
    explanation: "Multi-tenancy means a single deployment of a microservice serves multiple customers (tenants), with each tenant's data logically isolated from others. This is more resource-efficient than deploying separate instances per tenant (single-tenancy). Implementation approaches range from shared database with tenant ID columns (simplest but least isolated), separate schemas per tenant (moderate isolation), to separate databases per tenant (strongest isolation). For microservices, multi-tenancy adds complexity: every query must be scoped to the current tenant, cross-tenant data leaks are a critical security concern, and noisy neighbor effects (one tenant's heavy usage affecting others) must be managed through resource limits and rate limiting."
  },
  {
    question: "What is the 'backend for frontend' pattern's main benefit over a general-purpose API?",
    options: [
      "It reduces the number of microservices needed",
      "It tailors the API to each client's specific needs, avoiding over-fetching or under-fetching of data",
      "It eliminates the need for an API gateway",
      "It makes all clients use the same data format"
    ],
    correctIndex: 1,
    explanation: "The BFF pattern creates a dedicated API layer for each type of client (web, mobile, third-party), each optimized for that client's specific needs. A mobile app might need smaller payloads with fewer fields, while a web dashboard might need aggregated data from multiple services. A general-purpose API serving all clients becomes a compromise that serves none optimally—it either includes too much data (mobile wastes bandwidth) or too little (web needs multiple calls). The BFF handles aggregation, transformation, and filtering specific to its client. It can also implement client-specific authentication flows. The trade-off is maintaining multiple BFF services, but the improved client experience and independent evolution usually justify the cost."
  },
  {
    question: "What is 'distributed saga' vs 'two-phase commit' for cross-service transactions?",
    options: [
      "They are the same concept with different names",
      "Sagas use compensating transactions and local ACID; 2PC uses a global coordinator that locks resources across all participants until all vote to commit",
      "2PC is simpler and always preferred over sagas",
      "Sagas require a specialized database; 2PC works with any database"
    ],
    correctIndex: 1,
    explanation: "Two-phase commit (2PC) uses a transaction coordinator that first asks all participants to prepare (vote to commit), then either commits or aborts all participants atomically. This provides strong consistency but blocks resources during the vote phase, reducing availability and throughput. Sagas break the transaction into local steps with compensating actions, each committing independently. Sagas provide better availability and performance but only guarantee eventual consistency. In microservices, 2PC is generally avoided because it creates tight coupling, blocks resources, and becomes a bottleneck. Sagas are the standard approach despite their complexity. Some databases support 2PC for sharded writes, but across independently owned microservices, sagas are the pragmatic choice."
  },
  {
    question: "What is the purpose of 'pod disruption budgets' (PDB) in Kubernetes?",
    options: [
      "Setting financial budgets for pod resource usage",
      "Ensuring a minimum number of pods remain available during voluntary disruptions like upgrades and node draining",
      "Limiting the number of pods a team can create",
      "Tracking pod creation and deletion costs"
    ],
    correctIndex: 1,
    explanation: "Pod Disruption Budgets (PDBs) define the minimum number of pods (or maximum unavailable) that must remain available during voluntary disruptions like node drains, cluster upgrades, or maintenance. For example, a PDB might specify 'at least 2 out of 3 replicas must be available at all times.' Without a PDB, a node drain could simultaneously terminate all pods of a service, causing downtime. With a PDB, Kubernetes respects the budget and waits for new pods to be ready before terminating additional ones. PDBs don't protect against involuntary disruptions (hardware failures), only voluntary ones. They're essential for microservices running on clusters with regular maintenance activities."
  },
  {
    question: "What is 'event-carried state transfer' in microservices?",
    options: [
      "Transferring state via HTTP GET requests",
      "Events that carry enough data for consumers to update their local state without needing to call back to the source service",
      "Moving event processing logic between services",
      "Using events to trigger state machine transitions"
    ],
    correctIndex: 1,
    explanation: "Event-carried state transfer is a pattern where events contain sufficient data for consumers to maintain a local replica of the source data, eliminating the need for synchronous callbacks. For example, when a Customer Service publishes a 'CustomerUpdated' event, it includes the full customer data (name, address, email), so consuming services can update their local copies without querying the Customer Service. This reduces coupling and improves resilience—consumers don't need the source service to be available for reads. The trade-off is larger event payloads and data duplication across services. Martin Fowler described this pattern as one of four event-driven patterns. It's the foundation of data replication in event-driven microservices."
  },
  {
    question: "What is 'contract-first design' for microservice APIs?",
    options: [
      "Writing the legal contract between teams before coding",
      "Designing and agreeing on the API specification (e.g., OpenAPI/Swagger) before implementing the service",
      "Implementing the service first and generating the contract from the code",
      "Having the consumer write the provider's code"
    ],
    correctIndex: 1,
    explanation: "Contract-first design means defining the API specification (using OpenAPI/Swagger, protobuf, or AsyncAPI for events) before writing any implementation code. This allows consumer and provider teams to agree on the interface upfront, work in parallel (consumers mock the API while the provider implements it), and catch design issues early. It's the opposite of code-first, where the API spec is generated from the implementation. For microservices, contract-first is particularly valuable because it forces explicit boundary design, enables parallel development, and produces high-quality API documentation automatically. The contract becomes a shared artifact that both teams reference, reducing miscommunication and integration surprises."
  },
  {
    question: "What is 'Kubernetes Operator' pattern?",
    options: [
      "A human operator who manages Kubernetes clusters",
      "A custom controller that extends Kubernetes to automate the management of complex applications using domain-specific knowledge",
      "The default controller manager in Kubernetes",
      "A command-line tool for operating Kubernetes clusters"
    ],
    correctIndex: 1,
    explanation: "A Kubernetes Operator is a custom controller that encodes operational knowledge (human operator expertise) into software. It uses Custom Resource Definitions (CRDs) to extend the Kubernetes API with domain-specific resources and a controller that watches these resources and takes action. For example, a PostgreSQL Operator can automatically handle database provisioning, backups, failover, and scaling—tasks that would otherwise require a DBA. Operators follow the Kubernetes control loop pattern: observe current state, compare to desired state, take action. For microservices, operators manage complex stateful infrastructure (databases, message brokers, monitoring systems) declaratively. The Operator Framework and Kubebuilder are popular tools for building operators."
  },
  {
    question: "What is 'data mesh' and how does it relate to microservices?",
    options: [
      "A mesh network for database replication",
      "A decentralized approach to data architecture where domain teams own and serve their data as products, analogous to microservices principles applied to data",
      "A service mesh specifically for database traffic",
      "A grid computing framework for data processing"
    ],
    correctIndex: 1,
    explanation: "Data mesh, proposed by Zhamak Dehghani, applies microservices principles (domain ownership, decentralization, self-serve platform) to analytical data. Instead of centralizing all data in a single data warehouse/lake owned by a central team, domain teams own their analytical data as 'data products' with defined contracts, SLOs, and discoverability. This addresses the bottleneck of central data teams that can't keep up with demand. The four principles are: domain-oriented data ownership, data as a product, self-serve data infrastructure platform, and federated computational governance. For microservices teams, data mesh means they're responsible not only for their operational data but also for serving their domain's analytical data to the organization."
  },
  {
    question: "What is 'traffic mirroring' (shadowing) in microservices?",
    options: [
      "Duplicating traffic to a backup data center for disaster recovery",
      "Sending a copy of production traffic to a new version of a service for testing without affecting the live response",
      "Encrypting traffic to hide it from monitoring",
      "Reflecting DDoS attack traffic back to the attacker"
    ],
    correctIndex: 1,
    explanation: "Traffic mirroring (or shadowing) copies production traffic to a new version of a service running alongside the current version. The mirrored service processes real requests but its responses are discarded—only the current version's responses are sent to clients. This allows testing a new version with real production traffic patterns and data, catching issues that synthetic tests might miss, without any risk to users. Istio's VirtualService supports traffic mirroring natively. It's particularly valuable for microservices because it validates behavior under realistic load conditions. The trade-off is resource cost (you're running two versions) and potential side effects (the mirrored version might write to databases or call other services, so safeguards are needed)."
  },
  {
    question: "What is the difference between 'push' and 'pull' models for service communication?",
    options: [
      "Push uses TCP; pull uses UDP",
      "In push, the producer sends data to consumers when available; in pull, consumers request data from the producer when they need it",
      "Push is faster than pull in all scenarios",
      "Push works within a cluster; pull works across clusters"
    ],
    correctIndex: 1,
    explanation: "In the push model, the producer actively sends data to consumers as soon as it's available (e.g., webhooks, pub/sub messaging, server-sent events). In the pull model, consumers request data when they need it (e.g., HTTP polling, Kafka consumer pulling from partitions). Push provides lower latency (consumers get data immediately) but can overwhelm slow consumers. Pull lets consumers control their consumption rate but may introduce latency. Kafka uses a pull model where consumers pull messages at their own pace, which provides excellent backpressure handling. Many systems combine both: Kafka pushes to consumer groups but consumers pull from partitions. The choice depends on latency requirements, consumer processing speed, and scalability needs."
  },
  {
    question: "What is the 'strangler fig' pattern's relationship with feature flags?",
    options: [
      "They are unrelated concepts",
      "Feature flags can control which implementation (monolith or microservice) handles specific requests, enabling gradual migration with instant rollback",
      "Feature flags replace the strangler fig pattern entirely",
      "The strangler fig pattern is a type of feature flag"
    ],
    correctIndex: 1,
    explanation: "Feature flags and the Strangler Fig pattern are complementary. During monolith decomposition, feature flags can control whether a specific request is routed to the legacy monolith or the new microservice implementation. This provides fine-grained control: you can enable the new service for 10% of users, specific user segments, or specific tenants. If the new service has issues, you instantly toggle the flag to route all traffic back to the monolith. This is much safer than hard-cutting traffic at the proxy level. Combined with canary analysis (comparing error rates and latency between old and new), feature flags turn the strangler fig migration into a measured, data-driven process with minimal risk."
  },
  {
    question: "What is 'domain-driven design strategic patterns' and how do they guide microservice decomposition?",
    options: [
      "Patterns for choosing domain name registrars",
      "High-level DDD patterns (bounded contexts, context maps, shared kernels, anti-corruption layers) that help identify service boundaries and inter-service relationships",
      "Strategies for database schema design within a service",
      "Game theory patterns for team coordination"
    ],
    correctIndex: 1,
    explanation: "DDD strategic patterns operate at the system level, guiding how bounded contexts (and thus microservices) relate to each other. Context Maps visualize these relationships using patterns like: Shared Kernel (two contexts share a subset of the domain model), Customer-Supplier (one context's output feeds another), Conformist (downstream accepts upstream's model as-is), Anti-Corruption Layer (downstream translates upstream's model), and Published Language (shared communication format). These patterns directly map to microservice integration strategies—an ACL becomes an adapter service, a shared kernel becomes a shared library, and customer-supplier relationships define API ownership. Understanding these patterns prevents ad-hoc service boundaries and helps teams design sustainable inter-service relationships."
  },
  {
    question: "What is the 'resource limits' concept in Kubernetes and why is it critical for microservices?",
    options: [
      "Limiting the number of Kubernetes resources (pods, services) in the cluster",
      "Setting CPU and memory bounds on containers to prevent a single service from consuming all node resources and affecting other services",
      "Limiting how many API resources a service can create",
      "Restricting which resources a service can access in the cloud"
    ],
    correctIndex: 1,
    explanation: "Kubernetes resource limits set maximum CPU and memory a container can use. Resource requests specify the guaranteed minimum resources for scheduling, while limits cap the maximum. Without limits, a memory-leaking service could consume all node memory, triggering the OOM killer and crashing other services on the same node. Similarly, a CPU-intensive service could starve its neighbors. For microservices sharing cluster resources, proper limits are essential: they ensure fair resource sharing, enable accurate capacity planning, and prevent noisy-neighbor problems. Setting requests too high wastes resources (pods can't be efficiently packed), while setting them too low causes throttling. Getting this right requires monitoring actual usage and iterating."
  },
  {
    question: "What is 'event notification' pattern vs 'event-carried state transfer'?",
    options: [
      "They are identical patterns",
      "Event notification contains minimal data (just the event type and ID, requiring callback for details); event-carried state transfer includes the full data in the event",
      "Event notification is for errors; event-carried state transfer is for success",
      "Event notification is synchronous; event-carried state transfer is asynchronous"
    ],
    correctIndex: 1,
    explanation: "Event notification publishes lightweight events (e.g., 'OrderCreated: orderId=123') that tell consumers something happened but don't include the full data. Consumers must call back to the source service's API to get details. Event-carried state transfer includes the full data (e.g., 'OrderCreated: {orderId: 123, items: [...], total: 99.99}') so consumers can update their local state without callbacks. Notification is simpler (smaller events, single source of truth for data) but creates runtime coupling (consumer depends on producer being available for queries). State transfer is more decoupled but creates larger events and data duplication. Martin Fowler describes these as two of four event-driven interaction patterns, each appropriate for different coupling and consistency requirements."
  },
  {
    question: "What is the 'ambassador' vs 'sidecar' vs 'adapter' container pattern in Kubernetes?",
    options: [
      "They are three names for the same pattern",
      "Ambassador handles outbound traffic proxying, sidecar adds functionality (logging, monitoring), adapter standardizes output format—all are multi-container pod patterns",
      "Ambassador is for HTTP, sidecar for gRPC, adapter for WebSocket",
      "They differ only in the container image used"
    ],
    correctIndex: 1,
    explanation: "These are three distinct multi-container pod patterns. The Sidecar extends the main container with additional functionality (log shipping, configuration reloading, service mesh proxy) without modifying the application. The Ambassador proxies outbound network connections, handling complexity like connection pooling, routing, and TLS termination for the main container. The Adapter standardizes the main container's output—for example, converting application-specific metrics into a Prometheus-compatible format or transforming log formats. All three patterns deploy helper containers alongside the main container in the same pod, sharing network and storage. In practice, the Envoy sidecar in service meshes performs all three roles: proxying (ambassador), adding observability (sidecar), and standardizing metrics (adapter)."
  },
  {
    question: "What is 'distributed transaction' and why is it problematic in microservices?",
    options: [
      "A transaction that takes a long time to complete",
      "A transaction spanning multiple services/databases that's problematic because it requires all participants to be available and locks resources, reducing system availability and scalability",
      "A transaction distributed across multiple time zones",
      "A transaction that is processed by multiple CPUs"
    ],
    correctIndex: 1,
    explanation: "A distributed transaction spans multiple services or databases and aims to maintain ACID properties across all of them. The most common protocol is two-phase commit (2PC), where a coordinator first asks all participants to prepare, then instructs them to commit or abort. This is problematic in microservices because: it requires all services to be available simultaneously (reducing availability), it locks resources during the prepare phase (reducing throughput), it couples services at the database level, and it becomes a single point of failure if the coordinator crashes. The CAP theorem shows that strong consistency and high availability can't coexist during partitions. That's why microservices use sagas (eventual consistency with compensations) instead of distributed transactions."
  },
  {
    question: "What is 'shard-nothing architecture' in microservices databases?",
    options: [
      "A database that never shards its data",
      "An architecture where each database shard operates independently without sharing memory, disk, or CPU with other shards",
      "Sharing database shards between multiple services",
      "An architecture where sharding is handled by the application code"
    ],
    correctIndex: 1,
    explanation: "Shared-nothing architecture means each database node (shard) has its own dedicated CPU, memory, and storage, with no shared resources between nodes. This allows linear scalability—adding more shards adds more capacity without contention. Each microservice's database can be independently sharded based on its access patterns (e.g., sharding orders by customer ID, products by category). This contrasts with shared-disk architectures (like Oracle RAC) where multiple nodes share storage. Shared-nothing is the foundation of distributed databases like Cassandra, CockroachDB, and Citus. For microservices, this aligns with the independent scaling principle: each service can scale its data tier based on its own growth, without affecting other services."
  },
  {
    question: "What is the role of 'Helm' in Kubernetes microservices deployment?",
    options: [
      "A monitoring tool for Kubernetes",
      "A package manager for Kubernetes that uses charts (templated manifests) to define, install, and manage application deployments",
      "A network plugin for inter-pod communication",
      "A security scanner for container images"
    ],
    correctIndex: 1,
    explanation: "Helm is the Kubernetes package manager that uses 'charts' (collections of templated YAML manifests) to define complete application deployments. A chart might include a Deployment, Service, ConfigMap, and Ingress, all parameterized with a values.yaml file for customization across environments. For microservices, Helm simplifies deploying complex applications with many interconnected resources: instead of managing dozens of individual YAML files, you install a chart with environment-specific values. Helm supports versioning, rollbacks, and dependency management between charts. Popular alternatives include Kustomize (overlay-based, no templating) and Jsonnet. Many organizations create a base Helm chart template that all microservices extend, ensuring consistent deployment standards."
  },
  {
    question: "What is 'cell-based architecture' in microservices?",
    options: [
      "Organizing microservices by cellular network standards",
      "Grouping related services into isolated cells (units of deployment and failure isolation) that can be independently deployed and scaled",
      "Running microservices on cell phone hardware",
      "A biology-inspired pattern where services divide like cells"
    ],
    correctIndex: 1,
    explanation: "Cell-based architecture groups related microservices into isolated cells, where each cell is a complete, independently deployable unit with its own data store, compute, and routing. Traffic is routed to a specific cell based on a partition key (like customer ID or region). If a cell fails, only its users are affected—other cells continue operating. This limits the blast radius of failures: instead of a service-wide outage affecting all users, only users in the failed cell are impacted. AWS and other hyperscalers use cell-based architectures extensively. It combines microservices principles with infrastructure isolation, providing stronger fault isolation than services alone. The trade-off is increased operational complexity and resource overhead from running multiple independent cells."
  }
];
