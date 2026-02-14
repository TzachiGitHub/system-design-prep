import type { QuizQuestion } from '../../types';

export const loadBalancersQuiz: QuizQuestion[] = [
  {
    question: "What OSI layer does an L4 load balancer operate at?",
    options: ["Layer 2 (Data Link)", "Layer 4 (Transport)", "Layer 7 (Application)", "Layer 3 (Network)"],
    correctIndex: 1,
    explanation: "An L4 load balancer operates at the Transport layer (Layer 4), making routing decisions based on TCP/UDP information such as IP addresses and port numbers. It does not inspect the actual content of packets like an L7 load balancer would. This makes L4 balancers faster since they don't need to parse HTTP headers, cookies, or other application-level data. AWS Network Load Balancer (NLB) is a real-world example of an L4 load balancer that can handle millions of requests per second with ultra-low latency."
  },
  {
    question: "Which load balancing algorithm distributes requests sequentially across servers in order?",
    options: ["Least connections", "IP hash", "Round-robin", "Weighted random"],
    correctIndex: 2,
    explanation: "Round-robin distributes incoming requests sequentially across the pool of servers — first request to server 1, second to server 2, and so on, cycling back to the start. It's the simplest algorithm and works well when all servers have similar capacity and requests have similar processing costs. However, it doesn't account for current server load, so a server handling a long-running request still gets new ones. Nginx uses round-robin as its default load balancing method."
  },
  {
    question: "What is the main advantage of the 'least connections' algorithm over round-robin?",
    options: ["It's faster to compute", "It considers current server load", "It preserves session affinity", "It uses less memory"],
    correctIndex: 1,
    explanation: "Least connections routes new requests to the server with the fewest active connections, effectively considering current server load. Unlike round-robin which blindly cycles through servers, least connections adapts to situations where some requests take longer than others. For example, if one server is handling several long-running database queries, new requests will be directed to less-busy servers. This makes it ideal for applications with variable request processing times, such as WebSocket connections or API endpoints with mixed query complexity."
  },
  {
    question: "What does SSL termination at the load balancer mean?",
    options: ["The load balancer blocks all SSL traffic", "The load balancer decrypts SSL and forwards plain HTTP to backends", "The load balancer re-encrypts traffic with a different certificate", "The load balancer only accepts non-SSL traffic"],
    correctIndex: 1,
    explanation: "SSL termination means the load balancer handles the SSL/TLS decryption, removing the encryption overhead from backend servers. The load balancer decrypts incoming HTTPS requests and forwards plain HTTP to the backend servers over the internal network. This offloads the CPU-intensive cryptographic operations from application servers, allowing them to focus on business logic. It's widely used in production — for example, AWS ALB can terminate SSL and even handle certificate rotation via ACM, while backend EC2 instances communicate in plaintext within the VPC."
  },
  {
    question: "Which load balancer type can route based on URL path or HTTP headers?",
    options: ["L3 load balancer", "L4 load balancer", "L7 load balancer", "DNS load balancer"],
    correctIndex: 2,
    explanation: "L7 (Application layer) load balancers can inspect HTTP/HTTPS content including URL paths, headers, cookies, and even request bodies to make routing decisions. This enables content-based routing — for example, sending /api/* requests to API servers and /static/* to file servers. L4 load balancers cannot do this because they only see TCP/UDP packet information without parsing the application protocol. AWS Application Load Balancer (ALB) is a classic L7 load balancer that supports path-based and host-based routing rules."
  },
  {
    question: "What is sticky session (session affinity) in load balancing?",
    options: ["Sessions that cannot be terminated", "Routing all requests from the same client to the same server", "Sharing session data across all servers", "Encrypting session data at the load balancer"],
    correctIndex: 1,
    explanation: "Sticky sessions ensure that all requests from a particular client are directed to the same backend server for the duration of the session. This is typically implemented using cookies — the load balancer sets a cookie on the first response indicating which server to use. While this solves session state problems (e.g., shopping carts stored in server memory), it can lead to uneven load distribution if some users generate more traffic. Modern architectures prefer externalized session stores like Redis instead of sticky sessions, as they don't create single points of failure."
  },
  {
    question: "What happens when a health check fails for a backend server?",
    options: ["The load balancer restarts the server", "The load balancer stops sending traffic to that server", "The load balancer sends more traffic to test recovery", "The load balancer shuts down completely"],
    correctIndex: 1,
    explanation: "When a health check fails, the load balancer marks that server as unhealthy and stops routing new requests to it. Existing connections may be drained gracefully depending on the configuration. The load balancer continues to periodically check the unhealthy server, and once it passes health checks again, it's returned to the active pool. For example, an ALB health check might ping /health every 30 seconds, requiring 3 consecutive failures to mark a target unhealthy and 3 successes to mark it healthy again."
  },
  {
    question: "IP hash load balancing is most useful when you need:",
    options: ["Maximum throughput", "Client-server affinity without cookies", "Equal distribution regardless of client", "Minimum latency"],
    correctIndex: 1,
    explanation: "IP hash computes a hash of the client's IP address to determine which server should handle the request, ensuring the same client always reaches the same server. This provides session affinity without relying on cookies or application-layer information, making it work at L4 where cookies aren't visible. However, it can cause uneven distribution when many clients share an IP (like behind a corporate NAT), as all those clients would hit the same server. It's commonly used in scenarios where stateful connections are needed but cookie-based affinity isn't feasible, such as TCP-based protocols."
  },
  {
    question: "Which software is primarily known as a high-performance L4/L7 load balancer and proxy?",
    options: ["Apache Tomcat", "HAProxy", "MySQL Proxy", "Varnish"],
    correctIndex: 1,
    explanation: "HAProxy (High Availability Proxy) is one of the most widely-used open-source load balancers, supporting both L4 (TCP) and L7 (HTTP) load balancing. It's known for extremely high performance, handling millions of concurrent connections with low resource usage. HAProxy powers major sites like GitHub, Reddit, and Stack Overflow. While Nginx also functions as a load balancer, HAProxy was purpose-built for load balancing and proxying, offering more advanced health checking, connection draining, and traffic management features out of the box."
  },
  {
    question: "What is the primary difference between AWS ALB and NLB?",
    options: ["ALB is cheaper than NLB", "ALB operates at L7 while NLB operates at L4", "NLB supports HTTP while ALB does not", "ALB is faster than NLB"],
    correctIndex: 1,
    explanation: "AWS Application Load Balancer (ALB) operates at Layer 7, understanding HTTP/HTTPS and supporting features like path-based routing, host-based routing, and WebSocket support. AWS Network Load Balancer (NLB) operates at Layer 4, routing based on TCP/UDP and offering ultra-low latency with millions of requests per second. NLB is actually faster than ALB because it doesn't need to parse HTTP content. Choose ALB when you need content-based routing, and NLB when you need raw performance, static IPs, or non-HTTP protocols like gRPC or custom TCP."
  },
  {
    question: "What is Global Server Load Balancing (GSLB)?",
    options: ["Load balancing within a single data center", "DNS-based load balancing across geographically distributed data centers", "A single load balancer handling global traffic", "Round-robin within a server cluster"],
    correctIndex: 1,
    explanation: "GSLB distributes traffic across multiple geographically distributed data centers, typically using DNS to direct users to the nearest or healthiest data center. When a client resolves a domain name, the GSLB-aware DNS returns the IP of the optimal data center based on factors like geographic proximity, health status, and current load. This is different from local load balancing which distributes within a single data center. Services like AWS Route 53 with latency-based routing, Cloudflare Load Balancing, and F5 BIG-IP DNS are real-world GSLB implementations."
  },
  {
    question: "In weighted round-robin, what does the 'weight' represent?",
    options: ["The physical size of the server", "The proportion of traffic a server should receive", "The priority in case of failover", "The maximum number of connections"],
    correctIndex: 1,
    explanation: "In weighted round-robin, each server is assigned a weight that determines the proportion of requests it receives relative to other servers. A server with weight 3 receives three times as many requests as a server with weight 1. This is useful when servers have different capacities — a powerful machine with 16 CPU cores should handle more traffic than a smaller 4-core machine. For example, in Nginx you'd configure 'server backend1 weight=3; server backend2 weight=1;' to send 75% of traffic to backend1 and 25% to backend2."
  },
  {
    question: "What problem does connection draining solve during server removal?",
    options: ["It prevents new servers from being added", "It allows in-flight requests to complete before removing a server", "It speeds up the removal process", "It caches responses for offline servers"],
    correctIndex: 1,
    explanation: "Connection draining (also called deregistration delay) ensures that when a server is being removed from the pool, existing in-flight requests are allowed to complete rather than being abruptly terminated. The load balancer stops sending new requests to the server but maintains existing connections until they finish or a timeout is reached. Without connection draining, users might see 502 errors or dropped connections during deployments. AWS ALB has a configurable deregistration delay (default 300 seconds) that defines how long to wait before forcefully closing remaining connections."
  },
  {
    question: "Which health check type actually makes an HTTP request to verify application health?",
    options: ["TCP health check", "ICMP ping check", "HTTP health check", "Port check"],
    correctIndex: 2,
    explanation: "HTTP health checks send an actual HTTP request (usually GET) to a specific endpoint like /health and verify the response status code (typically expecting 200 OK). This is more thorough than TCP checks (which only verify the port is open) or ICMP pings (which only verify network reachability). An HTTP health check can detect application-level failures — for instance, a server where the web process is running but the database connection is broken would pass TCP checks but fail an HTTP health check that queries the DB. This is why production systems almost always use HTTP health checks for web applications."
  },
  {
    question: "What is the 'thundering herd' problem in load balancing?",
    options: ["Too many load balancers competing for traffic", "All backend servers failing simultaneously", "Many clients reconnecting simultaneously after a failure, overwhelming the system", "Servers processing requests too quickly"],
    correctIndex: 2,
    explanation: "The thundering herd problem occurs when many clients simultaneously attempt to reconnect or retry after a failure or during a recovery event, potentially overwhelming the system. For example, if a load balancer goes down for 30 seconds, thousands of clients will retry simultaneously when it comes back, creating a massive spike. Solutions include exponential backoff with jitter on client retries, gradual ramp-up (slow start) for recovered servers, and connection rate limiting. AWS ALB's slow start feature addresses this by gradually increasing the proportion of requests sent to a newly healthy target."
  },
  {
    question: "What does Nginx use as its default load balancing algorithm?",
    options: ["Least connections", "IP hash", "Round-robin", "Random"],
    correctIndex: 2,
    explanation: "Nginx uses round-robin as its default load balancing algorithm when you define an upstream block without specifying a method. Requests are distributed sequentially across the defined servers in order. You can change this by adding directives like 'least_conn;' for least connections or 'ip_hash;' for IP-based hashing inside the upstream block. Round-robin is a sensible default because it's simple, fast, and works reasonably well when servers have similar capacities. For heterogeneous server pools, you'd typically switch to weighted round-robin or least connections."
  },
  {
    question: "What is a reverse proxy, and how does it relate to load balancing?",
    options: ["A proxy that clients use to access the internet anonymously", "A server that sits in front of backend servers, forwarding client requests — load balancers are a type of reverse proxy", "A proxy that reverses the direction of network traffic", "A backup load balancer"],
    correctIndex: 1,
    explanation: "A reverse proxy sits between clients and backend servers, receiving client requests and forwarding them to appropriate backends. Load balancers are essentially reverse proxies with the added intelligence of distributing requests across multiple servers. Beyond load distribution, reverse proxies provide benefits like SSL termination, caching, compression, and security (hiding backend server details). Nginx and HAProxy are commonly used as both reverse proxies and load balancers. The 'reverse' distinguishes it from a forward proxy, which sits in front of clients to access external resources."
  },
  {
    question: "In a Blue-Green deployment, how does the load balancer facilitate zero-downtime releases?",
    options: ["It runs both versions simultaneously on the same servers", "It switches all traffic from the old (blue) environment to the new (green) environment at once", "It gradually increases traffic to the new version", "It pauses all traffic during deployment"],
    correctIndex: 1,
    explanation: "In Blue-Green deployment, you maintain two identical production environments. The load balancer points all traffic to the current (blue) environment while the new version is deployed to the green environment. Once the green environment is verified, the load balancer switches all traffic from blue to green instantly. If problems are found, you can immediately switch back to blue. This differs from canary deployments where traffic is gradually shifted. The load balancer is the key component that makes the instant cutover possible, and tools like AWS ALB with target group switching make this straightforward."
  },
  {
    question: "What is the purpose of the X-Forwarded-For HTTP header in load balancing?",
    options: ["To specify which server should handle the request", "To preserve the original client IP address when traffic passes through a proxy/load balancer", "To indicate the load balancing algorithm being used", "To forward authentication tokens"],
    correctIndex: 1,
    explanation: "When a load balancer forwards a request to a backend server, the backend sees the load balancer's IP as the source, not the original client's IP. The X-Forwarded-For header preserves the original client IP by appending it as the request passes through each proxy. This is critical for logging, rate limiting, geolocation, and security — you need to know the real client IP, not the load balancer's. For example, a request passing through two proxies might have 'X-Forwarded-For: client-ip, proxy1-ip'. Backend applications must be configured to trust and parse this header from known load balancer IPs."
  },
  {
    question: "What is the 'slow start' feature in load balancing?",
    options: ["Delaying the load balancer startup", "Gradually increasing traffic to a newly added or recovered server", "Slowing down request processing for better reliability", "Starting health checks at a slower rate"],
    correctIndex: 1,
    explanation: "Slow start gradually increases the proportion of requests sent to a newly added or recently recovered server over a configured time period, rather than immediately sending it a full share of traffic. This prevents overwhelming a cold server that may need to warm up caches, establish database connections, or JIT-compile code. Without slow start, a freshly started Java application server might receive thousands of requests before its JVM has warmed up, leading to high latency or failures. AWS ALB supports slow start mode where you can configure the ramp-up duration (e.g., 30-900 seconds)."
  },
  {
    question: "Which protocol does an L4 load balancer primarily use to make routing decisions?",
    options: ["HTTP", "TCP/UDP", "FTP", "SMTP"],
    correctIndex: 1,
    explanation: "An L4 load balancer makes routing decisions based on TCP and UDP protocol information — specifically source/destination IP addresses and port numbers. It operates on network packets without understanding the application protocol carried within them. This means it can load balance any TCP or UDP-based protocol (HTTP, FTP, SMTP, custom protocols) without needing protocol-specific knowledge. The tradeoff is that it can't make smart routing decisions based on content, but it's significantly faster than L7 balancing because it doesn't need to parse application-level data. AWS NLB is a prime example of an L4 load balancer."
  },
  {
    question: "What is an active-passive (failover) load balancer configuration?",
    options: ["Both load balancers handle traffic simultaneously", "One load balancer handles all traffic while the other stands by as backup", "One handles read traffic, the other handles write traffic", "Both are passive until traffic spikes"],
    correctIndex: 1,
    explanation: "In active-passive configuration, one load balancer (active) handles all incoming traffic while another (passive) monitors the active one and stands ready to take over if it fails. The passive load balancer uses heartbeat mechanisms to detect when the active one goes down. When failover occurs, the passive takes over the active's virtual IP address (VIP), making the switch transparent to clients. This is simpler than active-active but wastes the passive node's capacity during normal operation. Tools like keepalived with VRRP protocol are commonly used to implement this pattern with HAProxy."
  },
  {
    question: "What is an active-active load balancer configuration?",
    options: ["Only one load balancer is active at a time", "Multiple load balancers handle traffic simultaneously", "Load balancers alternate between active and passive states", "Load balancers are active only during peak hours"],
    correctIndex: 1,
    explanation: "In active-active configuration, multiple load balancers simultaneously handle traffic, distributing the load among themselves. This provides both high availability and increased capacity compared to active-passive where one node sits idle. DNS round-robin or an upstream GSLB typically distributes traffic across the active load balancers. If one fails, the others absorb its traffic. The challenge is synchronizing state (like session persistence tables) across active instances. Active-active is preferred in high-traffic environments because it utilizes all available hardware, and services like AWS ALB are inherently active-active across multiple availability zones."
  },
  {
    question: "What is the primary disadvantage of DNS-based load balancing?",
    options: ["It's too expensive", "DNS TTL causes slow failover because clients cache old DNS records", "It can only balance HTTP traffic", "It requires special client software"],
    correctIndex: 1,
    explanation: "DNS-based load balancing has a fundamental limitation: DNS responses are cached by clients, ISPs, and resolvers for the duration of the TTL (Time To Live). Even with short TTLs, many resolvers and operating systems ignore low TTL values, meaning clients may continue connecting to a failed server for minutes or hours. This makes DNS-based failover slow and unreliable compared to hardware or software load balancers that can detect failures in seconds. Additionally, DNS doesn't perform health checks, so it can resolve to unhealthy servers. Services like AWS Route 53 mitigate this with health check integration, but TTL caching remains a fundamental limitation."
  },
  {
    question: "What is consistent hashing used for in the context of load balancing?",
    options: ["Encrypting traffic between load balancer and backends", "Minimizing redistribution of requests when servers are added or removed", "Ensuring all servers get exactly equal traffic", "Hashing passwords for authentication"],
    correctIndex: 1,
    explanation: "Consistent hashing maps both servers and request keys onto a hash ring, so each request is routed to the nearest server clockwise on the ring. When a server is added or removed, only the requests that map to that segment of the ring are redistributed — typically 1/N of all requests, where N is the number of servers. This is far better than traditional hash-mod-N approaches where adding a server remaps almost all requests. It's especially important for stateful or cached backends where you want the same client or request key to usually hit the same server. Memcached and many distributed caches use consistent hashing for this reason."
  },
  {
    question: "What does 'SSL passthrough' mean in load balancing?",
    options: ["The load balancer generates new SSL certificates", "The load balancer forwards encrypted traffic directly to backends without decryption", "The load balancer converts SSL to a different encryption", "The load balancer caches SSL sessions"],
    correctIndex: 1,
    explanation: "SSL passthrough means the load balancer forwards the encrypted TLS traffic directly to the backend server without decrypting it. The backend server handles the SSL/TLS termination itself. This is the opposite of SSL termination where the load balancer decrypts traffic. SSL passthrough is used when end-to-end encryption is required (e.g., for compliance reasons like PCI-DSS) or when the backend needs to see the client certificate for mutual TLS authentication. The downside is the load balancer can't inspect HTTP content, so L7 features like path-based routing or header manipulation are unavailable. HAProxy supports this via 'mode tcp' configuration."
  },
  {
    question: "What is a Virtual IP (VIP) in the context of load balancing?",
    options: ["An IP address only accessible to admin users", "A shared IP address that floats between load balancers for high availability", "A private IP address used within the data center", "An IP address reserved for future use"],
    correctIndex: 1,
    explanation: "A Virtual IP (VIP) is an IP address that is not tied to a specific physical server but can float between multiple load balancer instances. In an active-passive setup, the active load balancer owns the VIP, and if it fails, the passive takes over the VIP using protocols like VRRP (Virtual Router Redundancy Protocol). Clients always connect to the VIP, so failover is transparent — they don't need to know which physical load balancer is active. This is a cornerstone of high-availability configurations. Keepalived is the most common open-source tool used to manage VIPs in Linux-based load balancer setups with HAProxy or Nginx."
  },
  {
    question: "How does a load balancer handle WebSocket connections differently from regular HTTP?",
    options: ["It blocks WebSocket connections", "It must maintain persistent connections and use connection-aware balancing", "It converts WebSocket to HTTP", "It treats them exactly the same as HTTP"],
    correctIndex: 1,
    explanation: "WebSocket connections are long-lived, bidirectional, and persistent — unlike typical HTTP request-response cycles that are short-lived. A load balancer must be aware that once a WebSocket connection is established (after the HTTP upgrade handshake), it should maintain that connection to the same backend server for its entire lifetime. Using round-robin per-request would break WebSocket since each message isn't a new connection. L7 load balancers like ALB and Nginx support WebSocket by recognizing the Upgrade header and maintaining connection affinity. This is why least-connections is often preferred for WebSocket workloads, as it accounts for long-held connections."
  },
  {
    question: "What is the 'hot spot' problem in load balancing?",
    options: ["Servers overheating physically", "One server receiving disproportionately more traffic than others", "The load balancer itself becoming a bottleneck", "Network switches becoming saturated"],
    correctIndex: 1,
    explanation: "A hot spot occurs when one backend server receives significantly more traffic than others, often due to uneven distribution from the load balancing algorithm. This can happen with IP hash when many clients share a single IP (e.g., behind corporate NAT), with round-robin when request processing times vary greatly, or with consistent hashing when the hash space isn't evenly distributed. The hot server may become overloaded while others sit idle. Solutions include weighted balancing, virtual nodes in consistent hashing, and least-connections algorithms. Celebrity Twitter accounts causing hot spots on specific cache servers is a classic real-world example."
  },
  {
    question: "What is Direct Server Return (DSR) in load balancing?",
    options: ["The server directly returns error messages to clients", "Response traffic goes directly from the backend to the client, bypassing the load balancer", "The server returns the request back to the load balancer", "A debugging mode for load balancers"],
    correctIndex: 1,
    explanation: "In Direct Server Return (DSR), the load balancer only handles incoming requests — the response traffic from the backend server goes directly back to the client, bypassing the load balancer entirely. This dramatically reduces the load on the load balancer since response data (which is typically much larger than requests) doesn't pass through it. DSR is commonly used for video streaming or large file downloads where response payloads are orders of magnitude larger than requests. The backend server must be configured to accept traffic for the VIP address, typically using a loopback interface. L4 load balancers like LVS (Linux Virtual Server) commonly implement DSR."
  },
  {
    question: "In canary deployment, how does the load balancer route traffic?",
    options: ["All traffic goes to the new version immediately", "A small percentage of traffic is sent to the new version, gradually increasing", "Traffic alternates between old and new versions", "Only test traffic goes to the new version"],
    correctIndex: 1,
    explanation: "In canary deployment, the load balancer initially routes a small percentage (e.g., 1-5%) of real production traffic to the new version while the majority continues to the stable version. If metrics (error rates, latency, etc.) look good, the percentage is gradually increased until 100% reaches the new version. This is named after canaries used in coal mines to detect danger early. The load balancer implements this via weighted routing rules — for example, AWS ALB supports weighted target groups where you can assign 95% weight to the old version and 5% to the new. This provides a safer rollout compared to blue-green's all-at-once switch."
  },
  {
    question: "What is the purpose of a load balancer's 'idle timeout'?",
    options: ["To shut down the load balancer when not in use", "To close inactive connections after a specified period to free resources", "To delay starting up after a reboot", "To slow down traffic during off-peak hours"],
    correctIndex: 1,
    explanation: "The idle timeout defines how long a load balancer keeps an inactive connection open before closing it. If no data is sent over a connection within this period, it's terminated to free up resources (memory, file descriptors, port numbers). This prevents resource exhaustion from abandoned connections. For example, AWS ALB has a default idle timeout of 60 seconds. For WebSocket or long-polling applications, you need to increase this timeout, while for typical REST APIs the default is usually sufficient. It's important to ensure the backend server's timeout is longer than the load balancer's to avoid the LB sending traffic to a connection the backend has already closed."
  },
  {
    question: "Which header does an L7 load balancer use for host-based routing?",
    options: ["X-Forwarded-For", "Host", "Content-Type", "Accept-Encoding"],
    correctIndex: 1,
    explanation: "The Host header in HTTP requests specifies the domain name the client is trying to reach, and L7 load balancers use this for host-based routing. This allows a single load balancer to route traffic for multiple domains — for example, api.example.com to API servers and www.example.com to web servers. This is essentially virtual hosting at the load balancer level. AWS ALB supports host-based routing rules where you define conditions like 'if Host header matches api.example.com, forward to target group A.' Without the Host header, you'd need separate load balancers (or IP addresses) for each domain."
  },
  {
    question: "What is the advantage of using multiple availability zones with a load balancer?",
    options: ["Lower cost", "Fault tolerance — if one AZ fails, traffic is routed to healthy AZs", "Faster response times for all users", "Simplified configuration"],
    correctIndex: 1,
    explanation: "Deploying across multiple availability zones (AZs) with a load balancer provides fault tolerance against entire data center failures. If one AZ experiences an outage (power failure, network issues), the load balancer automatically routes traffic to healthy instances in other AZs. Each AZ is an isolated data center with independent power, cooling, and networking. AWS ALB, for example, is inherently multi-AZ — it deploys nodes in each enabled AZ and performs cross-zone load balancing. This is a fundamental best practice for production workloads, as it protects against the most common cause of large-scale outages: AZ-level failures."
  },
  {
    question: "What is cross-zone load balancing?",
    options: ["Load balancing between different cloud providers", "Distributing traffic evenly across all targets in all enabled availability zones", "Balancing traffic between development and production zones", "Load balancing between different geographic regions"],
    correctIndex: 1,
    explanation: "Cross-zone load balancing ensures that traffic is distributed evenly across all registered targets in all enabled availability zones, regardless of which AZ the load balancer node received the traffic. Without cross-zone balancing, each LB node only distributes to targets in its own AZ, which can cause uneven distribution if AZs have different numbers of targets. For example, if AZ-A has 2 instances and AZ-B has 8, without cross-zone balancing each AZ gets 50% of traffic, meaning AZ-A's 2 instances each handle 25% while AZ-B's 8 each handle only 6.25%. AWS ALB has cross-zone enabled by default, while NLB has it disabled by default."
  },
  {
    question: "What is a load balancer sandwich architecture?",
    options: ["A load balancer placed between two firewalls", "Multiple tiers of load balancers for different layers of an application", "A load balancer between two identical server groups", "A redundant pair of load balancers"],
    correctIndex: 1,
    explanation: "A load balancer sandwich (or multi-tier load balancing) uses load balancers at multiple levels in the application architecture. For example, an external L7 ALB routes to web servers, which then connect through an internal L4 NLB to application servers, which connect through another internal NLB to database read replicas. This provides granular scaling and health checking at each tier. It's common in microservices architectures where each service layer needs independent scaling and traffic management. AWS recommends this pattern for three-tier architectures, using public ALBs for the web tier and private NLBs for internal service-to-service communication."
  },
  {
    question: "How does HAProxy differ from Nginx in terms of primary design philosophy?",
    options: ["HAProxy is only L4, Nginx is only L7", "HAProxy was purpose-built for proxying/load balancing; Nginx was originally a web server", "Nginx is faster than HAProxy in all scenarios", "HAProxy doesn't support HTTP"],
    correctIndex: 1,
    explanation: "HAProxy was designed from the ground up as a high-performance TCP/HTTP load balancer and proxy, while Nginx was originally created as a web server that later gained load balancing capabilities. This means HAProxy has more sophisticated load balancing features out of the box: advanced health checking, detailed connection statistics, hitless reloads, and fine-grained traffic management. Nginx excels as a combined web server, reverse proxy, and load balancer, making it a great all-in-one solution. In practice, many architectures use both: Nginx serving static content and HAProxy handling load balancing for dynamic traffic. Both can handle millions of concurrent connections."
  },
  {
    question: "What is the 'least response time' load balancing algorithm?",
    options: ["Routes to the server that started most recently", "Routes to the server with the fastest response time and fewest active connections", "Routes to the server closest geographically", "Routes to the server with the most memory available"],
    correctIndex: 1,
    explanation: "The least response time algorithm considers both the number of active connections and the server's recent response time to choose the best backend. It routes requests to the server that can respond fastest, combining the benefits of least connections with actual performance data. This is more sophisticated than pure least connections because a server with few connections might still be slow due to hardware issues or heavy background processing. Nginx Plus offers this as 'least_time' where you can optimize for header response time or full response time. It's particularly useful for heterogeneous server pools where machines have different performance characteristics."
  },
  {
    question: "What is preconnection (TCP connection pooling) in load balancers?",
    options: ["Connecting to servers before any client requests arrive", "Maintaining a pool of pre-established connections to backend servers", "Pre-allocating IP addresses for new servers", "Connecting multiple load balancers together"],
    correctIndex: 1,
    explanation: "Connection pooling (or multiplexing) means the load balancer maintains a pool of pre-established, persistent TCP connections to backend servers. Instead of creating a new TCP connection (with its 3-way handshake overhead) for every client request, the load balancer reuses existing connections from the pool. This dramatically reduces latency and server load, especially under high traffic. AWS ALB uses connection multiplexing by default — it may send multiple client requests over a single backend connection. This is particularly impactful for HTTPS backends where each new connection would require a full TLS handshake, which can take 2-3 round trips."
  },
  {
    question: "What is the purpose of the X-Forwarded-Proto header?",
    options: ["To specify the protocol version", "To indicate the original protocol (HTTP/HTTPS) used by the client before the load balancer", "To specify which backend protocol to use", "To forward the prototype of the request object"],
    correctIndex: 1,
    explanation: "X-Forwarded-Proto tells the backend server whether the original client connection used HTTP or HTTPS. When SSL termination occurs at the load balancer, the backend receives plain HTTP, so it can't tell if the original request was secure. This header is crucial for applications that need to enforce HTTPS redirects, generate correct absolute URLs, or set secure cookie flags. Without it, an app might generate 'http://' links even though the user accessed it via HTTPS. For example, Django uses the SECURE_PROXY_SSL_HEADER setting to check X-Forwarded-Proto, and Rails uses it to determine if a request was made over SSL."
  },
  {
    question: "What happens when all backend servers fail health checks?",
    options: ["The load balancer shuts down", "Behavior varies: some return 503, others fall back to sending traffic to all servers", "All traffic is dropped silently", "The load balancer creates new server instances"],
    correctIndex: 1,
    explanation: "When all backends are unhealthy, load balancer behavior depends on configuration. Some load balancers return 503 Service Unavailable to all clients. Others implement a 'panic mode' or 'all backends down' fallback where they send traffic to all servers anyway — the reasoning being that health checks might be too strict and some servers might still be partially functional. HAProxy supports 'option allbackups' and backup server configurations for this scenario. AWS ALB returns 503 when no healthy targets exist. Nginx can be configured with 'backup' servers that only receive traffic when all primary servers are down. It's critical to plan for this scenario in your architecture."
  },
  {
    question: "What is a 'least bandwidth' load balancing algorithm?",
    options: ["Routes to the server using the least network bandwidth currently", "Routes to the server with the smallest bandwidth capacity", "Routes to reduce overall bandwidth usage", "Routes to the server with the most available bandwidth"],
    correctIndex: 0,
    explanation: "The least bandwidth algorithm routes new requests to the server currently consuming the least amount of network bandwidth (measured in Mbps). This is useful for workloads with varying response sizes — for example, a file download service where some requests return 10MB files and others return 100KB files. Unlike least connections which treats all connections equally, least bandwidth accounts for the actual data transfer happening on each server. This prevents scenarios where one server is handling fewer but larger transfers while others handle many small ones. It's available in enterprise load balancers like F5 BIG-IP and Citrix ADC."
  },
  {
    question: "What is rate limiting at the load balancer level?",
    options: ["Limiting the speed of the load balancer itself", "Restricting the number of requests a client can make within a time period", "Limiting the number of backend servers", "Slowing down all traffic equally"],
    correctIndex: 1,
    explanation: "Rate limiting at the load balancer restricts how many requests a particular client (identified by IP, API key, or other attributes) can make within a defined time window. This protects backend servers from abuse, DDoS attacks, and runaway clients. For example, you might limit an IP to 100 requests per minute. Requests exceeding the limit receive a 429 Too Many Requests response. Implementing rate limiting at the load balancer is more efficient than at the application level because rejected requests never reach backend servers. Nginx supports rate limiting with the 'limit_req' module, and AWS ALB integrates with AWS WAF for advanced rate limiting rules."
  },
  {
    question: "What is the difference between Layer 4 NAT mode and Layer 4 DR (Direct Return) mode?",
    options: ["NAT modifies both request and response packets; DR only modifies request packets since responses go directly to clients", "They are identical", "NAT is faster than DR", "DR requires L7 inspection"],
    correctIndex: 0,
    explanation: "In NAT mode, the load balancer rewrites packet headers for both incoming requests (changing destination to the backend) and outgoing responses (changing source back to the VIP). All traffic flows through the load balancer, making it a potential bottleneck. In Direct Return (DR) mode, the load balancer only modifies incoming request packets, and the backend server sends responses directly to the client, bypassing the load balancer. DR is much more scalable because response traffic (typically 10x larger than request traffic) doesn't burden the load balancer. However, DR requires backends to be on the same L2 network and accept traffic for the VIP address. LVS (Linux Virtual Server) supports both modes."
  },
  {
    question: "What is a 'target group' in AWS load balancer terminology?",
    options: ["A group of users targeted by the application", "A logical grouping of backend targets (instances, IPs, or lambdas) that receive traffic from a load balancer", "A group of load balancers", "A security group for targets"],
    correctIndex: 1,
    explanation: "A target group is an AWS concept that defines a set of backend targets (EC2 instances, IP addresses, Lambda functions, or other ALBs) along with health check settings and routing configuration. The load balancer routes requests to targets within a target group based on the listener rules. You can have multiple target groups attached to a single ALB with different routing rules — for example, one target group for /api/* and another for /web/*. Target groups also enable blue-green and canary deployments by adjusting weights between two target groups. This abstraction decouples the load balancer configuration from the specific backend instances."
  },
  {
    question: "How does a load balancer handle gRPC traffic?",
    options: ["gRPC cannot be load balanced", "Using L7 load balancing with HTTP/2 support", "Only L4 load balancing works for gRPC", "By converting gRPC to REST"],
    correctIndex: 1,
    explanation: "gRPC uses HTTP/2 as its transport protocol, so a load balancer needs HTTP/2 support for effective gRPC load balancing. L7 load balancers that understand HTTP/2 can route individual gRPC requests within a single HTTP/2 connection to different backends — this is crucial because HTTP/2 multiplexes many requests over one connection, so L4 balancing would send all requests on a connection to the same backend. AWS ALB supports gRPC natively since 2020, and Envoy proxy is widely used for gRPC load balancing in service meshes. Without proper HTTP/2-aware L7 balancing, you'd lose the benefits of distributing gRPC calls across backends."
  },
  {
    question: "What is the 'power of two choices' load balancing algorithm?",
    options: ["Choosing between only two backend servers", "Randomly selecting two servers and routing to the one with fewer connections", "Alternating between two algorithms", "Using two load balancers simultaneously"],
    correctIndex: 1,
    explanation: "The 'power of two choices' (P2C) algorithm randomly selects two backend servers and routes the request to whichever has fewer active connections. Despite its simplicity, it provides near-optimal load distribution — mathematically proven to reduce maximum load from O(log n / log log n) with random to O(log log n) with P2C. It's much cheaper to compute than full least-connections (which must check all servers) while providing similar benefits. Nginx Plus uses this as its 'random two least_conn' method. It's particularly effective in large clusters where checking every server's status on every request would be too expensive, and it avoids the herd behavior where multiple load balancers simultaneously route to the same 'least loaded' server."
  },
  {
    question: "What is a 'listener' in load balancer configuration?",
    options: ["A monitoring tool", "A process that checks for incoming connections on a specific port and protocol", "A logging component", "A backend server waiting for connections"],
    correctIndex: 1,
    explanation: "A listener is a configuration component that defines a port and protocol that the load balancer listens on for incoming client connections. For example, you might have one listener on port 80 (HTTP) that redirects to HTTPS, and another on port 443 (HTTPS) that forwards to your target group. Each listener has rules that determine how to route requests to backend targets. AWS ALB supports multiple listeners on a single load balancer, each with its own set of routing rules. Listeners are where you configure SSL certificates, default actions, and the initial entry point for all client traffic hitting the load balancer."
  },
  {
    question: "Why might you choose an L4 load balancer over an L7 for a database cluster?",
    options: ["L4 is cheaper", "Databases use TCP protocols that don't need HTTP inspection, and L4 offers lower latency", "L7 doesn't support TCP", "L4 provides better security"],
    correctIndex: 1,
    explanation: "Database protocols like MySQL (port 3306) and PostgreSQL (port 5432) use raw TCP connections, not HTTP. An L7 load balancer that inspects HTTP would be useless and add unnecessary overhead for database traffic. An L4 load balancer simply forwards TCP connections based on IP and port, which is exactly what's needed. It adds minimal latency since there's no packet inspection or protocol parsing. AWS NLB is commonly used to load balance database read replicas or to provide a single endpoint for a database cluster. The lower latency of L4 is particularly important for databases where every millisecond counts for query response times."
  },
  {
    question: "What is 'session persistence' and how is it different from 'sticky sessions'?",
    options: ["They are the same concept — both ensure requests from one client go to the same backend", "Session persistence stores data; sticky sessions route traffic", "Session persistence is for databases; sticky sessions for web servers", "Sticky sessions are permanent; session persistence is temporary"],
    correctIndex: 0,
    explanation: "Session persistence and sticky sessions are two names for the same concept — ensuring that all requests from a particular client are routed to the same backend server during a session. The terms are used interchangeably across different load balancer vendors: F5 calls it 'persistence,' AWS calls it 'stickiness,' and HAProxy calls it 'stick-tables.' Implementation methods include cookie-based (load balancer sets a cookie identifying the backend), source IP-based (hash of client IP), and SSL session ID-based persistence. The choice of method depends on whether you're doing L4 or L7 balancing and whether clients support cookies."
  },
  {
    question: "What is the risk of having a single load balancer in your architecture?",
    options: ["Higher cost", "It becomes a single point of failure (SPOF)", "Slower performance", "More complex configuration"],
    correctIndex: 1,
    explanation: "A single load balancer creates a single point of failure — if it goes down, all traffic stops regardless of how many healthy backend servers exist. This defeats the purpose of using a load balancer for high availability. The solution is to deploy load balancers in pairs (active-passive or active-active) with failover mechanisms. In cloud environments, managed load balancers like AWS ALB are inherently redundant across multiple availability zones, eliminating this concern. For on-premise deployments, tools like keepalived implement VRRP to manage VIP failover between HAProxy or Nginx instances, ensuring continuous availability even if one load balancer node fails."
  },
  {
    question: "What is Maglev hashing in the context of load balancing?",
    options: ["A hashing algorithm for SSL certificates", "Google's consistent hashing algorithm designed for software load balancers with fast lookup", "A magnetic storage-based caching algorithm", "A hash algorithm for compressing HTTP headers"],
    correctIndex: 1,
    explanation: "Maglev hashing is a consistent hashing algorithm developed by Google for their Maglev network load balancer. It provides O(1) lookup time using a precomputed lookup table, making it significantly faster than ring-based consistent hashing which requires O(log n) lookups. Maglev hashing generates a permutation table for each backend, creating a fixed-size lookup table where each entry maps to a backend. When a backend is added or removed, minimal disruption occurs (similar to consistent hashing). It also provides excellent load uniformity across backends. Google's Maglev handles over a million requests per second per machine, and the algorithm was published in their 2016 NSDI paper."
  },
  {
    question: "What is the purpose of HTTP keep-alive in the context of load balancing?",
    options: ["To keep the load balancer running", "To reuse TCP connections for multiple HTTP requests, reducing connection overhead", "To monitor server health", "To maintain session state"],
    correctIndex: 1,
    explanation: "HTTP keep-alive (persistent connections) allows multiple HTTP requests to be sent over a single TCP connection instead of opening a new connection for each request. In the context of load balancing, this reduces the overhead of TCP handshakes and TLS negotiations between clients and the load balancer, and between the load balancer and backends. However, it creates a tension with load balancing: if a client's keep-alive connection always goes to the same backend, new requests won't be distributed. L7 load balancers like ALB solve this by multiplexing — they can maintain keep-alive connections on both sides but route individual requests within those connections to different backends."
  },
  {
    question: "How does Envoy proxy differ from traditional load balancers like HAProxy?",
    options: ["Envoy doesn't support load balancing", "Envoy was designed as a sidecar proxy for microservices with advanced observability features", "Envoy only supports L4 balancing", "Envoy is faster than HAProxy in all cases"],
    correctIndex: 1,
    explanation: "Envoy was designed by Lyft specifically for modern microservices architectures, functioning as a sidecar proxy deployed alongside each service instance. Unlike HAProxy which is typically deployed as a centralized load balancer, Envoy is the data plane in service meshes like Istio. Envoy provides advanced features like automatic retries, circuit breaking, zone-aware routing, and rich L7 observability with distributed tracing integration. It supports dynamic configuration via xDS APIs, allowing configuration changes without restarts. While HAProxy excels as a high-performance edge proxy, Envoy shines in service-to-service communication within distributed systems where observability and dynamic configuration are crucial."
  },
  {
    question: "What is a 'backend' vs 'frontend' in HAProxy terminology?",
    options: ["Frontend is the UI, backend is the database", "Frontend defines how requests are received; backend defines where they are forwarded", "Frontend is external facing; backend is internal only", "They are interchangeable terms"],
    correctIndex: 1,
    explanation: "In HAProxy, a 'frontend' section defines how incoming connections are received — it specifies the bind address/port, protocol mode (HTTP or TCP), timeouts, and ACL rules for routing decisions. A 'backend' section defines the pool of servers that will handle forwarded requests, including the server list, load balancing algorithm, and health check configuration. A frontend can route to multiple backends based on ACL rules. For example, a frontend listening on port 443 might route /api/* to an api-backend and /static/* to a static-backend. This separation of concerns makes HAProxy configurations clean and modular."
  },
  {
    question: "What is circuit breaking in load balancing?",
    options: ["Physically disconnecting network cables", "Automatically stopping traffic to a failing backend to prevent cascade failures", "Breaking long-running connections", "A backup power system for load balancers"],
    correctIndex: 1,
    explanation: "Circuit breaking is a pattern where the load balancer (or proxy) monitors error rates for each backend and automatically stops sending traffic when failures exceed a threshold, preventing cascade failures. Like an electrical circuit breaker, it 'trips open' when too many errors occur, returning immediate errors to clients instead of waiting for timeouts. After a cooldown period, it enters a 'half-open' state and allows a few test requests through. If they succeed, the circuit closes and normal traffic resumes. Envoy and Istio implement sophisticated circuit breaking with configurable thresholds for maximum connections, pending requests, and retries. This is essential in microservices to prevent one failing service from taking down the entire system."
  },
  {
    question: "What is the 'source' load balancing algorithm in HAProxy?",
    options: ["Routes based on the source code of the application", "Hashes the source IP to always route the same client to the same server", "Selects the source server with the most resources", "Routes based on the country of origin"],
    correctIndex: 1,
    explanation: "The 'source' algorithm in HAProxy hashes the client's source IP address to select a backend server, ensuring the same client consistently reaches the same server. It's essentially IP hash load balancing. This provides session affinity at L4 without requiring cookies or application changes. The formula is typically hash(source_ip) mod num_servers. The main disadvantage is that if a server is added or removed, the hash changes for many clients, disrupting existing sessions. You can mitigate this with 'hash-type consistent' which uses consistent hashing to minimize remapping. It's commonly used for TCP load balancing where cookie-based affinity isn't available."
  },
  {
    question: "What is 'request queuing' in a load balancer?",
    options: ["Queuing requests for later processing when all backends are busy", "Sorting requests by priority", "Buffering requests to batch them", "Caching requests for replay"],
    correctIndex: 0,
    explanation: "Request queuing occurs when the load balancer holds incoming requests in a queue when all backend servers have reached their maximum connection limits, rather than immediately rejecting them. The queue releases requests as backends become available. This smooths out traffic spikes and prevents immediate 503 errors during brief overload periods. HAProxy implements this with 'maxconn' on server definitions (limiting per-server connections) combined with the 'queue' timeout. However, queuing increases latency and can mask capacity problems — if the queue grows too long, it's better to shed load with 503 responses than to keep clients waiting. Setting appropriate queue timeouts is critical."
  },
  {
    question: "How does a load balancer handle HTTP/2 server push?",
    options: ["It blocks server push entirely", "It must support HTTP/2 end-to-end to proxy push frames correctly", "It converts push to regular requests", "Server push doesn't work with load balancers"],
    correctIndex: 1,
    explanation: "HTTP/2 server push allows servers to proactively send resources to clients before they're requested. For a load balancer to correctly handle this, it must support HTTP/2 on both the client-facing side and the backend connections, properly proxying PUSH_PROMISE frames. If the load balancer terminates HTTP/2 and connects to backends via HTTP/1.1, server push won't work because HTTP/1.1 doesn't support it. AWS ALB supports HTTP/2 on the frontend but communicates with backends using HTTP/1.1, so server push doesn't work through ALB. Nginx supports HTTP/2 end-to-end (with 'grpc_pass' or HTTP/2 upstream) enabling server push passthrough."
  },
  {
    question: "What is the 'agent check' feature in HAProxy?",
    options: ["A security scanning tool", "An auxiliary health check where the backend server reports its own status and weight", "Checking if the HAProxy agent is running", "A monitoring agent installed on each server"],
    correctIndex: 1,
    explanation: "HAProxy's agent check is a supplementary health check mechanism where the backend server runs a small agent (listening on a configured port) that reports its status and desired weight. The agent can respond with values like 'up', 'down', 'ready', a percentage to set weight (e.g., '75%'), or 'drain' to stop new connections. This allows application-aware load management — for example, a server under heavy CPU load can tell HAProxy to reduce its weight to 25%, and a server during maintenance can report 'drain' to stop receiving new traffic. Agent checks work alongside regular health checks, giving backend servers active participation in traffic management."
  },
  {
    question: "What is Anycast and how is it used with load balancing?",
    options: ["Broadcasting to all servers simultaneously", "Multiple servers share the same IP address; the network routes clients to the nearest one", "Sending requests to any available server randomly", "A multicast protocol for load balancers"],
    correctIndex: 1,
    explanation: "Anycast is a network addressing method where the same IP address is announced by multiple servers in different geographic locations. The internet's BGP routing automatically directs clients to the nearest (in terms of network hops) server advertising that IP. This provides natural geographic load balancing without any application-level load balancer. Cloudflare uses anycast extensively — their IP addresses are announced from 300+ data centers worldwide, so a user in Tokyo reaches a Tokyo server while a user in London reaches a London server. Anycast also provides built-in DDoS resilience since attack traffic is distributed across all locations. It's commonly combined with traditional load balancing within each location."
  },
  {
    question: "What is 'connection multiplexing' in an L7 load balancer?",
    options: ["Using multiple network interfaces", "Sending requests from multiple clients over a single backend connection", "Connecting to multiple load balancers simultaneously", "Multiplying the number of available connections"],
    correctIndex: 1,
    explanation: "Connection multiplexing means the L7 load balancer can take HTTP requests from many different client connections and send them over fewer backend connections. For example, 1000 client connections might be served by just 10 backend connections, with the load balancer interleaving requests. This dramatically reduces the connection overhead on backend servers, which is especially valuable for servers with high connection setup costs. AWS ALB does this by default — it maintains a small pool of connections to each backend and multiplexes client requests over them. This is one reason why backend servers see far fewer connections than expected when behind an ALB."
  },
  {
    question: "When would you use a TCP (L4) proxy mode in HAProxy instead of HTTP (L7)?",
    options: ["When serving web pages", "When load balancing non-HTTP protocols like databases, SMTP, or custom TCP protocols", "When you need URL-based routing", "When you need cookie-based persistence"],
    correctIndex: 1,
    explanation: "TCP mode (mode tcp) in HAProxy is used when you need to load balance non-HTTP protocols. Databases (MySQL, PostgreSQL, Redis), mail servers (SMTP), LDAP, custom binary protocols, and any other TCP-based service requires L4 proxy mode because HAProxy wouldn't understand the application protocol for L7 inspection. TCP mode is also used for SSL passthrough where you don't want HAProxy to decrypt traffic. It's faster than HTTP mode since there's no header parsing. For example, to load balance MySQL read replicas, you'd use 'mode tcp' with 'option mysql-check' for health checking. The tradeoff is losing L7 features like path routing and header manipulation."
  },
  {
    question: "What is the role of a load balancer in a microservices architecture?",
    options: ["Only external traffic management", "Both external traffic routing and internal service-to-service discovery and routing", "Database connection pooling only", "Log aggregation"],
    correctIndex: 1,
    explanation: "In microservices, load balancers serve dual roles: external-facing load balancers (edge proxies) route client traffic, while internal load balancers handle service-to-service communication. An API gateway (L7 LB) at the edge routes requests to appropriate microservices, while internal LBs or service meshes (like Envoy sidecar proxies) balance traffic between service instances. For example, an order service calling the inventory service needs load balancing across inventory instances. Kubernetes Services with kube-proxy provide built-in L4 load balancing, while Istio adds sophisticated L7 balancing. This multi-layer load balancing is essential because microservices create many more internal network hops than monolithic architectures."
  },
  {
    question: "What is 'graceful degradation' in the context of load balancing?",
    options: ["Gradually shutting down the load balancer", "Maintaining partial service when backends fail rather than total outage", "Slowing down request processing during peak times", "Downgrading to a simpler load balancing algorithm"],
    correctIndex: 1,
    explanation: "Graceful degradation means the system continues to provide reduced but functional service when some components fail, rather than failing completely. In load balancing, this might mean returning cached or static content when backend servers are down, directing overflow traffic to a 'sorry' page, or serving a read-only version when write servers fail. For example, Netflix uses graceful degradation extensively — if their recommendation service is down, they show generic popular content instead of personalized recommendations. Load balancers implement this through fallback backends, custom error pages, and integration with circuit breakers that redirect to fallback services when primary backends are failing."
  },
  {
    question: "What is the difference between 'health check' and 'liveness probe'?",
    options: ["They are identical concepts", "Health checks are performed by load balancers; liveness probes are used by container orchestrators like Kubernetes", "Health checks are manual; liveness probes are automatic", "Health checks are for hardware; liveness probes are for software"],
    correctIndex: 1,
    explanation: "While both verify if a service is running, health checks are performed by load balancers to decide whether to route traffic to a backend, while liveness probes are Kubernetes concepts used to determine whether to restart a container. A load balancer health check failure removes the target from the routing pool but doesn't restart it. A Kubernetes liveness probe failure causes kubelet to restart the container. They can even use different endpoints — a liveness probe might check basic process health while a health check verifies the service can handle requests. In practice, you often have both: a /livez endpoint for Kubernetes and a /readyz endpoint for the load balancer's health check."
  },
  {
    question: "What problem does 'least outstanding requests' solve compared to 'least connections'?",
    options: ["It handles more protocols", "It accounts for requests in the load balancer's queue, not just established connections", "It's faster to compute", "It uses less memory"],
    correctIndex: 1,
    explanation: "Least outstanding requests considers all pending requests including those queued at the load balancer, not just established TCP connections to backends. A server might show few active connections if it's fast at accepting them but slow at processing them. Least outstanding requests tracks the total number of in-flight requests (queued + being processed) per backend. This gives a more accurate picture of actual server load. AWS ALB uses 'least outstanding requests' as an alternative to round-robin for target group routing. It's especially effective when request processing times vary significantly and you want to ensure faster servers naturally receive more traffic."
  },
  {
    question: "What is 'traffic mirroring' (shadowing) in load balancing?",
    options: ["Creating backup copies of network traffic for storage", "Duplicating live traffic to a test environment for testing without impacting production", "Redirecting all traffic to a mirror server", "Encrypting traffic twice for security"],
    correctIndex: 1,
    explanation: "Traffic mirroring copies live production requests and sends them to a separate test/staging environment simultaneously, allowing you to test new service versions with real traffic patterns without affecting the production response. The client only receives the response from the primary backend; the mirror's response is discarded. This is invaluable for validating new deployments — you can compare the mirror's behavior against production to catch bugs before they impact users. Envoy, Istio, and AWS ALB all support traffic mirroring. For example, before launching a new recommendation engine, you'd mirror production traffic to it and compare results against the existing system."
  },
  {
    question: "What is 'retry budgets' in the context of load balancer retries?",
    options: ["A financial budget for retry infrastructure", "Limiting the total percentage of requests that can be retries to prevent retry storms", "The number of times a request can be retried", "A budget allocated for timeout extensions"],
    correctIndex: 1,
    explanation: "A retry budget limits the ratio of retry requests to total requests (e.g., retries should not exceed 20% of original traffic). Without a budget, retries can cascade catastrophically: if a backend is overloaded and failing, retries add even more load, causing more failures and more retries — a 'retry storm.' The budget ensures retries are helpful during transient errors but are automatically throttled during systematic failures. Envoy implements retry budgets with the 'retry_budget' configuration, setting max_retries as a percentage of active requests. This is a critical safety mechanism in microservices where multiple services retrying simultaneously can amplify a minor issue into a complete outage."
  },
  {
    question: "How does AWS ALB handle 'slow loris' attacks?",
    options: ["It cannot handle them", "It sets idle timeouts and manages connections independently from backend servers", "It blocks all slow connections", "It requires a separate WAF"],
    correctIndex: 1,
    explanation: "Slow loris attacks work by opening many connections and sending data very slowly, tying up server resources. AWS ALB mitigates this because it acts as a full proxy — it buffers the entire client request before forwarding it to the backend, so the backend server isn't held up by slow clients. ALB also has idle connection timeouts that close stale connections. Since ALB is a managed service with massive capacity, it can absorb the connection overhead that would overwhelm a single server. Additionally, combining ALB with AWS WAF provides rate-limiting rules that can further protect against such attacks. This proxy-based buffering is a fundamental advantage of L7 load balancers over L4."
  },
  {
    question: "What does 'least pending requests' mean in the context of Envoy proxy?",
    options: ["Requests waiting to be processed at the proxy", "Requests that haven't been retried yet", "Requests pending cancellation", "Requests pending authentication"],
    correctIndex: 0,
    explanation: "In Envoy, 'least pending requests' (also called 'least request') routes new requests to the backend with the fewest outstanding (pending) requests. This includes requests currently being processed by the backend and those queued at the proxy level. It's Envoy's equivalent of least connections but operates at the request level rather than connection level — this distinction matters with HTTP/2 where multiple requests share a single connection. Envoy's implementation uses the 'power of two choices' optimization by default: it randomly picks two backends and selects the one with fewer pending requests, providing near-optimal distribution with minimal overhead. This is the recommended algorithm for most HTTP workloads in Envoy and Istio service meshes."
  },
  {
    question: "What is 'priority-based routing' in load balancing?",
    options: ["Routing VIP customers first", "Routing to primary backends first, falling back to secondary when primaries are unhealthy", "Processing high-priority requests faster", "Assigning higher network priority to certain packets"],
    correctIndex: 1,
    explanation: "Priority-based routing assigns priority levels to different groups of backend servers. Traffic is first routed to the highest-priority group; only when that group becomes unhealthy (below a minimum healthy threshold) does traffic overflow to the next priority level. This is useful for preferring local servers over remote ones, or primary servers over backup servers. For example, you might assign priority 1 to servers in the same AZ and priority 2 to servers in other AZs, routing cross-AZ only when local capacity is insufficient. AWS ALB doesn't natively support this, but Envoy implements it through priority levels in clusters, and HAProxy achieves it with 'backup' server directives."
  },
  {
    question: "What is 'locality-aware routing' in service mesh load balancing?",
    options: ["Routing based on language locale", "Preferring backends in the same zone/region to reduce latency and cross-zone costs", "Routing to locally installed software", "Routing based on local time"],
    correctIndex: 1,
    explanation: "Locality-aware routing preferentially routes requests to backends in the same zone, availability zone, or region as the client to minimize latency and avoid cross-zone data transfer costs. In cloud environments, cross-AZ traffic incurs charges and adds 1-2ms of latency. Istio and Envoy implement locality-aware routing by considering zone, region, and sub-zone labels. When enough healthy local endpoints exist, traffic stays local; when local capacity is insufficient, it overflows to other zones proportionally. For example, in a Kubernetes cluster spanning 3 AZs, a pod in us-east-1a preferentially communicates with other pods in us-east-1a. This can save significant costs on high-traffic internal services."
  },
  {
    question: "What is a 'service mesh' and how does it relate to load balancing?",
    options: ["A physical network topology", "An infrastructure layer that handles service-to-service communication including load balancing, with sidecar proxies", "A type of load balancer hardware", "A mesh of interconnected load balancers"],
    correctIndex: 1,
    explanation: "A service mesh is a dedicated infrastructure layer for managing service-to-service communication in microservices architectures. It deploys sidecar proxies (like Envoy) alongside each service instance, handling load balancing, retries, circuit breaking, mutual TLS, and observability transparently. Instead of each service implementing its own load balancing logic, the sidecar handles it uniformly. Istio (using Envoy sidecars) is the most popular service mesh. The mesh provides consistent, centrally-managed traffic policies across all services without modifying application code. This decouples networking concerns from business logic, but adds complexity and resource overhead — each sidecar consumes CPU and memory."
  },
  {
    question: "What is 'outlier detection' in Envoy/Istio load balancing?",
    options: ["Detecting unusual user behavior", "Automatically ejecting backends that show abnormal error rates or latency", "Finding misconfigured servers", "Detecting DDoS attacks"],
    correctIndex: 1,
    explanation: "Outlier detection is Envoy's mechanism for automatically identifying and ejecting misbehaving backends from the load balancing pool. It monitors metrics like consecutive errors (5xx responses) or gateway errors, and temporarily removes backends that exceed thresholds. For example, if a backend returns 5 consecutive 503 errors, it's ejected for 30 seconds. This is similar to circuit breaking but operates per-backend rather than on the overall cluster. Ejected hosts are periodically allowed back in to test if they've recovered. It's configured in Istio via DestinationRule resources. Outlier detection is critical in microservices where a single failing instance can slow down the entire system if traffic keeps being sent to it."
  },
  {
    question: "What is the purpose of 'retry policies' in load balancing?",
    options: ["Retrying the load balancer configuration", "Automatically retrying failed requests on different backends to handle transient failures", "Retrying health checks more frequently", "Retrying DNS resolution"],
    correctIndex: 1,
    explanation: "Retry policies allow the load balancer to automatically retry failed requests on different backend servers, recovering from transient failures without client involvement. When a request to backend A fails with a 503, the load balancer can transparently retry it on backend B. This is especially valuable for handling single-server failures, transient network issues, and server restarts during deployments. However, retries must be configured carefully — they should only apply to idempotent requests (GET, not POST) to avoid duplicate side effects, and must include retry budgets to prevent retry storms. Envoy supports sophisticated retry policies including per-try timeouts, retry conditions (5xx, connection failure), and maximum retry attempts."
  },
  {
    question: "What is 'header-based routing' in an L7 load balancer?",
    options: ["Routing based on packet headers", "Routing decisions based on specific HTTP header values like API version or user agent", "Adding headers to every request", "Removing headers from responses"],
    correctIndex: 1,
    explanation: "Header-based routing allows an L7 load balancer to examine specific HTTP headers and route requests to different backend groups based on their values. For example, routing requests with 'X-API-Version: v2' to a new API backend while 'X-API-Version: v1' goes to the legacy backend. This enables sophisticated traffic management like A/B testing (routing based on experiment headers), canary releases (routing based on beta-user headers), and multi-tenant routing. AWS ALB supports header-based routing in its listener rules, and Envoy provides extremely flexible header matching including regex, prefix, and exact matching. This is a powerful L7 capability that's impossible with L4 load balancers."
  },
  {
    question: "What is 'TLS re-encryption' (SSL bridging) at the load balancer?",
    options: ["Using two different SSL certificates", "Decrypting client TLS at the LB and re-encrypting with a different certificate to backends", "Encrypting already encrypted traffic", "Converting TLS to a newer version"],
    correctIndex: 1,
    explanation: "TLS re-encryption (SSL bridging) means the load balancer terminates the client's TLS connection, inspects/routes the HTTP request at L7, and then establishes a new TLS connection to the backend server. This provides the benefits of both worlds: L7 inspection capabilities (content routing, header manipulation) AND encrypted backend communication. The backend TLS certificate is typically an internal CA certificate different from the public-facing certificate. This is required in environments where regulations mandate encryption of data in transit even within the internal network. AWS ALB supports this — you can configure HTTPS listeners with HTTPS target groups, achieving end-to-end encryption while still getting L7 features."
  },
  {
    question: "What is the difference between 'active' and 'passive' health checks?",
    options: ["Active checks are faster; passive are slower", "Active checks proactively send requests; passive checks monitor actual traffic for failures", "Active checks run during the day; passive checks run at night", "Active checks require agents; passive checks don't"],
    correctIndex: 1,
    explanation: "Active health checks proactively send periodic test requests (HTTP GET, TCP connect) to backend servers to verify their health, regardless of whether real traffic is flowing. Passive health checks (also called 'real traffic' checks) monitor the responses from actual client requests to detect failures — if a backend returns too many errors, it's marked unhealthy. Active checks detect issues even on idle backends but add extra traffic. Passive checks detect issues based on real behavior but can't identify problems on backends that aren't receiving traffic. The best practice is to use both together — Envoy and Nginx Plus support combining active and passive health checking for robust failure detection."
  },
  {
    question: "How do load balancers handle HTTP/3 (QUIC)?",
    options: ["They don't support it", "They terminate QUIC at the edge and typically proxy to backends over HTTP/2 or HTTP/1.1", "They pass QUIC through unchanged", "They convert QUIC to TCP"],
    correctIndex: 1,
    explanation: "HTTP/3 uses QUIC (a UDP-based transport protocol) instead of TCP, which presents challenges for load balancers. Most L7 load balancers terminate QUIC at the edge, benefiting from QUIC's faster connection establishment (0-RTT) and better handling of packet loss for end users, then proxy requests to backends over HTTP/2 or HTTP/1.1 over TCP. This is practical because the internal network typically has low latency and packet loss, making QUIC's benefits less relevant for backend connections. Cloudflare, Google Cloud, and AWS CloudFront support HTTP/3 termination. L4 load balancers face challenges because QUIC's connection IDs don't map to traditional IP:port tuples, requiring QUIC-aware load balancing."
  },
  {
    question: "What is the 'hash ring' approach to load balancing?",
    options: ["Hashing requests in a circular sequence", "Using consistent hashing where servers and keys are mapped to positions on a virtual ring", "Arranging servers in a physical ring topology", "A hardware ring buffer in the load balancer"],
    correctIndex: 1,
    explanation: "The hash ring is the data structure underlying consistent hashing for load balancing. Servers are assigned positions on a circular hash space (0 to 2^32-1), and each request key is hashed to a position on the same ring. The request is routed to the nearest server clockwise on the ring. When a server is removed, only its portion of the ring is remapped to the next server; other mappings stay intact. Virtual nodes (multiple hash positions per physical server) improve uniformity. This approach is particularly valuable for caching proxies where you want the same content to consistently hit the same server to maximize cache hit rates. Nginx supports this with the 'hash' directive and 'consistent' parameter."
  },
  {
    question: "What is 'request hedging' in load balancing?",
    options: ["Protecting requests with encryption", "Sending the same request to multiple backends simultaneously and using the first response", "Queuing requests as insurance against failure", "Prioritizing certain requests over others"],
    correctIndex: 1,
    explanation: "Request hedging sends redundant copies of a request to multiple backends simultaneously, returning whichever response arrives first and discarding the rest. This reduces tail latency — if one backend is slow, the duplicate on another backend may respond faster. Google uses hedging extensively to reduce p99 latency. The tradeoff is increased resource usage since you're doing N times the work for one response. A common optimization is 'delayed hedging' — send the first request normally and only hedge if no response arrives within a timeout (e.g., the p50 latency). gRPC and Envoy support hedging policies. It's most effective for read-only, idempotent operations where the extra backend load is acceptable."
  },
  {
    question: "What is 'load shedding' at the load balancer?",
    options: ["Reducing the physical weight of the load balancer hardware", "Deliberately dropping excess traffic to protect the system from overload", "Shedding responsibility to backend servers", "Reducing the number of backend servers"],
    correctIndex: 1,
    explanation: "Load shedding is the practice of intentionally dropping or rejecting excess requests when the system is approaching or at capacity, preventing total system failure. It's better to reject 10% of requests cleanly with 503 responses than to accept everything and have 100% of requests fail due to overload. Load balancers implement this via connection limits, request rate limits, and queue depth limits. For example, Envoy's circuit breaker can limit maximum concurrent connections and pending requests per backend. Netflix and Google implement adaptive load shedding that adjusts thresholds based on current system health. Think of it like a nightclub with a maximum capacity — turning people away at the door keeps the experience good for everyone inside."
  },
  {
    question: "What is the 'proxy protocol' used by some load balancers?",
    options: ["A protocol for communication between multiple load balancers", "A protocol that prepends client connection info (IP, port) to the TCP connection for backends", "A protocol for proxy server authentication", "A protocol for load balancer health checks"],
    correctIndex: 1,
    explanation: "The Proxy Protocol (developed by HAProxy's creator) is a simple protocol that prepends a small header to TCP connections containing the original client's IP address and port. This solves the problem of preserving client information when using L4 (TCP) load balancing, where HTTP headers like X-Forwarded-For aren't available because the load balancer doesn't inspect HTTP content. The header is added at the start of the TCP connection and contains: protocol version, source/destination IPs, and source/destination ports. AWS NLB supports Proxy Protocol v2, allowing backend applications to see the real client IP even through an L4 load balancer. The backend application must be configured to parse and strip this header."
  },
  {
    question: "What is an ingress controller in Kubernetes, and how does it relate to load balancing?",
    options: ["A firewall for incoming traffic", "A Kubernetes component that manages external access to services, typically implementing L7 load balancing", "A controller that manages server ingress ports", "A monitoring tool for incoming connections"],
    correctIndex: 1,
    explanation: "A Kubernetes Ingress Controller is a component that implements the Kubernetes Ingress resource, providing L7 load balancing, SSL termination, and path/host-based routing for external traffic entering the cluster. Popular implementations include Nginx Ingress Controller, Traefik, HAProxy Ingress, and AWS ALB Ingress Controller. The Ingress resource defines routing rules (e.g., host: api.example.com, path: /v1 → service-a), and the Ingress Controller translates these into actual load balancer configuration. This is different from Kubernetes Services (which provide basic L4 load balancing via kube-proxy). In production, the Ingress Controller is typically the entry point for all HTTP traffic into a Kubernetes cluster."
  },
  {
    question: "What is the 'random' load balancing algorithm best suited for?",
    options: ["Production environments with strict SLAs", "Simple scenarios or as a baseline; also forms the basis of 'power of two choices'", "Databases requiring consistency", "Financial trading systems"],
    correctIndex: 1,
    explanation: "The random algorithm selects a backend server at random for each request. While seemingly primitive, it provides surprisingly good distribution due to the law of large numbers — over many requests, each server gets approximately equal traffic. It's stateless (no need to track connections or positions), making it the simplest algorithm to implement in distributed load balancers where state sharing is difficult. More importantly, random selection forms the basis of the 'power of two choices' algorithm (pick two random servers, choose the less loaded one), which is used in production by systems like Nginx Plus. Pure random is suitable for homogeneous servers with uniform request costs, but least-connections or P2C generally perform better in practice."
  },
  {
    question: "What is 'zone-aware routing' in AWS ALB?",
    options: ["Routing based on DNS zones", "Preferentially routing to targets in the same AZ as the LB node to reduce cross-zone traffic", "Routing based on timezone", "Routing between different AWS regions"],
    correctIndex: 1,
    explanation: "Zone-aware routing in AWS means the ALB node in a particular availability zone preferentially routes to targets in the same AZ, reducing cross-zone data transfer (which costs money and adds latency). If the local AZ doesn't have enough healthy targets, traffic overflows to other AZs. This is related to the cross-zone load balancing setting — when cross-zone is disabled, each ALB node only routes to targets in its own AZ. For NLB, cross-zone is disabled by default to save costs, meaning zone-aware routing is the default behavior. Understanding this is important because it affects both cost optimization and latency, especially for high-traffic internal services communicating across AZs."
  },
  {
    question: "What are 'connection limits' on a load balancer and why are they important?",
    options: ["Marketing limits on the number of customers", "Maximum concurrent connections the LB or backends can handle, preventing resource exhaustion", "Limits on physical network cables", "Restrictions on who can connect"],
    correctIndex: 1,
    explanation: "Connection limits define the maximum number of concurrent connections at both the load balancer level and per-backend level. Without limits, a traffic spike or DDoS attack could exhaust the load balancer's resources (memory, file descriptors) or overwhelm backend servers. HAProxy's 'maxconn' setting limits per-server connections — excess requests are queued. AWS ALB has built-in connection limits per target. When a backend hits its connection limit, the LB routes new requests to other backends or returns 503. These limits are essential for protecting both the load balancer and backends from cascade failures. The key is setting limits based on actual server capacity testing, not arbitrary numbers."
  },
  {
    question: "How does a load balancer support A/B testing?",
    options: ["By running two separate load balancers", "By routing a defined percentage or subset of users to different backend versions based on headers, cookies, or weights", "By alternating between two server pools every day", "By serving different content from the same servers"],
    correctIndex: 1,
    explanation: "Load balancers enable A/B testing by splitting traffic between different backend versions based on rules. You can route based on cookies (users in experiment group A get version 1), headers (specific header values trigger routing to version 2), or weighted distribution (70% to version A, 30% to version B). AWS ALB supports weighted target groups for percentage-based splitting, and header/cookie conditions for rule-based routing. Envoy and Istio provide even more granular control through traffic splitting policies. This is crucial for data-driven product development — companies like Netflix, Google, and Amazon run thousands of simultaneous A/B tests by routing different user segments to different service versions through their load balancer configurations."
  },
  {
    question: "What is a 'sidecar proxy' pattern in load balancing?",
    options: ["A backup load balancer", "A proxy deployed alongside each application instance to handle its network communication", "A secondary monitoring proxy", "A proxy for offline processing"],
    correctIndex: 1,
    explanation: "In the sidecar proxy pattern, a lightweight proxy (like Envoy) is deployed as a companion to each application instance, handling all inbound and outbound network communication. Instead of the application directly connecting to other services, it sends requests to its local sidecar, which handles load balancing, retries, circuit breaking, mutual TLS, and observability. This is the fundamental building block of service meshes like Istio. The sidecar intercepts traffic transparently using iptables rules, requiring no application code changes. The advantage is that complex networking logic is centralized in the proxy; the disadvantage is the added latency (typically <1ms) and resource overhead of running a proxy alongside every service instance."
  },
  {
    question: "What is the 'least time' algorithm in Nginx Plus?",
    options: ["Routes to the most recently started server", "Routes based on a combination of fewest active connections and lowest average response time", "Routes to minimize total request time", "Routes requests at specific time intervals"],
    correctIndex: 1,
    explanation: "Nginx Plus's 'least_time' algorithm selects the backend with the best combination of fewest active connections and lowest average response time. You can configure it to optimize for either 'header' time (time to receive the first byte from the backend) or 'last_byte' (time to receive the complete response). This is more intelligent than pure least connections because it accounts for actual backend performance — a server with few connections might still be slow due to hardware issues or heavy processing. It's particularly effective for heterogeneous server pools where machines have different performance characteristics, automatically sending more traffic to faster servers without manual weight tuning."
  },
  {
    question: "What is 'request routing' vs 'connection routing' in load balancing?",
    options: ["They are the same thing", "Connection routing assigns a connection to a backend once; request routing can send each request within a connection to a different backend", "Request routing is for HTTP; connection routing is for HTTPS", "Connection routing is faster"],
    correctIndex: 1,
    explanation: "Connection routing (L4) assigns an entire TCP connection to a backend server — all data on that connection goes to the same server. Request routing (L7) can inspect individual HTTP requests within a connection and route each one to potentially different backends. This distinction is critical with HTTP keep-alive and HTTP/2, where a single connection carries multiple requests. With connection routing, all requests on a keep-alive connection hit the same backend. With request routing, the load balancer can distribute individual requests from the same connection across multiple backends, achieving much better load distribution. This is why L7 load balancers generally provide better balance for HTTP workloads."
  },
  {
    question: "What is 'server warming' in the context of load balancing?",
    options: ["Physically heating servers", "Gradually increasing traffic to a new server so it can initialize caches and JIT compilations", "Pre-installing software on servers", "Running diagnostic tests before deployment"],
    correctIndex: 1,
    explanation: "Server warming refers to the process of allowing a newly started or restarted server to gradually build up its operational state before receiving full production traffic. Cold JVM servers need time for JIT compilation to optimize hot paths, application caches need to be populated, database connection pools need to be established, and DNS caches need to fill. Sending full traffic to a cold server can cause high latency or failures. Load balancers support this through 'slow start' features that ramp up traffic over a configurable period. For example, ALB's slow start ramps traffic to a new target from 0% to full share over 30-900 seconds. This is especially critical for Java applications where JIT warmup can take several minutes."
  },
  {
    question: "What is 'upstream hashing' in Nginx?",
    options: ["Hashing the Nginx configuration", "Using a hash of a specified key (like URI or client IP) to consistently route requests to the same backend", "Hashing passwords for upstream authentication", "Encrypting data sent upstream"],
    correctIndex: 1,
    explanation: "Nginx's 'hash' directive in upstream blocks computes a hash of a specified variable to determine which backend receives each request. For example, 'hash $request_uri consistent;' routes all requests for the same URI to the same backend, which is excellent for caching scenarios. You can hash on $remote_addr for IP-based affinity, $request_uri for cache optimization, or even custom variables. The 'consistent' parameter uses ketama consistent hashing (a hash ring approach), which minimizes remapping when servers are added or removed. Without 'consistent', adding a server remaps most requests. This is commonly used in front of caching servers where you want the same content to always hit the same cache node for maximum cache hit rates."
  },
  {
    question: "What is the 'keepalive' directive in Nginx upstream configuration?",
    options: ["Enabling HTTP keep-alive for clients", "Setting the maximum number of idle keep-alive connections to upstream servers per worker", "Keeping upstream servers alive", "A health check interval setting"],
    correctIndex: 1,
    explanation: "The 'keepalive' directive in Nginx upstream blocks sets the maximum number of idle persistent connections to upstream servers that are cached per Nginx worker process. For example, 'keepalive 32;' means each worker can maintain up to 32 idle connections to the upstream group. These pre-established connections are reused for new requests, eliminating TCP handshake and TLS negotiation overhead. Without keepalive, Nginx opens a new connection for every request to the backend. This is critical for performance — establishing a new TLS connection can take 2-5 round trips. You must also set 'proxy_http_version 1.1;' and 'proxy_set_header Connection \"\";' in the location block for HTTP keep-alive to work with the upstream."
  },
  {
    question: "What is 'horizontal scaling' and how does a load balancer enable it?",
    options: ["Adding more CPU to existing servers", "Adding more server instances and using a load balancer to distribute traffic across them", "Scaling the load balancer itself", "Adding more disk storage to servers"],
    correctIndex: 1,
    explanation: "Horizontal scaling means adding more server instances to handle increased load, as opposed to vertical scaling which increases the resources of existing servers. The load balancer is the key enabler — it distributes incoming requests across all instances, making the group appear as a single endpoint to clients. Without a load balancer, you'd need to manually assign clients to specific servers. Horizontal scaling is preferred in modern architectures because it has no theoretical limit (just add more servers), provides fault tolerance (losing one server doesn't mean downtime), and is cost-effective (use many cheap commodity servers). Cloud auto-scaling groups work with load balancers to automatically add/remove instances based on demand."
  },
  {
    question: "What is the difference between 'proxy_pass' in Nginx and 'use_backend' in HAProxy?",
    options: ["They serve completely different purposes", "Both route requests to backends, but proxy_pass is a location-level directive while use_backend is a frontend-level conditional routing rule", "proxy_pass is for TCP; use_backend is for HTTP", "proxy_pass is deprecated"],
    correctIndex: 1,
    explanation: "Both directives route traffic to backend servers, but they work within their respective architectures differently. Nginx's 'proxy_pass' is used in 'location' blocks within 'server' blocks — routing is determined by URL path matching in the server configuration. HAProxy's 'use_backend' is used in 'frontend' sections with ACL conditions — routing is determined by evaluating conditional rules against request attributes. HAProxy's ACL system is generally more flexible for complex routing logic (combining multiple conditions), while Nginx's location-based routing is more intuitive for path-based routing. For example, HAProxy can easily route based on a combination of path, header, and source IP in a single rule, which requires more configuration in Nginx."
  },
  {
    question: "What is 'TCP multiplexing' in the context of load balancing?",
    options: ["Using multiple TCP ports", "Combining multiple client TCP connections into fewer backend connections", "Running multiple protocols over one TCP connection", "Using TCP and UDP simultaneously"],
    correctIndex: 1,
    explanation: "TCP multiplexing at the load balancer level means combining requests from many client connections into fewer backend connections. An L7 load balancer can accept thousands of client connections and forward their HTTP requests over a much smaller pool of persistent backend connections. This is possible because the load balancer buffers complete requests and multiplexes them over available backend connections. The benefit is massive: backend servers only need to manage a fraction of the total client connections, reducing memory usage and context switching overhead. AWS ALB performs TCP multiplexing by default. For a backend serving 100,000 clients through an ALB, it might only see 100 connections from the ALB."
  },
  {
    question: "What monitoring metrics are most important for a load balancer?",
    options: ["Only request count", "Request rate, error rate, latency percentiles, active connections, and backend health", "Only CPU usage", "Only bandwidth usage"],
    correctIndex: 1,
    explanation: "Comprehensive load balancer monitoring requires several key metrics: request rate (throughput), HTTP error rates (4xx/5xx), latency percentiles (p50, p95, p99), active/new connections, backend health status, spillover count (rejected requests), and connection queue depth. Latency percentiles are particularly important — p99 latency reveals tail latency issues that averages would hide. Error rate spikes indicate backend problems. Connection metrics help with capacity planning. AWS ALB emits these as CloudWatch metrics: RequestCount, HTTPCode_Target_5XX_Count, TargetResponseTime, ActiveConnectionCount, and UnHealthyHostCount. Setting up alerts on these metrics (e.g., alert when 5xx rate exceeds 1% or p99 latency exceeds 2 seconds) is essential for maintaining reliability."
  },
  {
    question: "What is 'surge queue' in AWS Classic Load Balancer?",
    options: ["A queue for surge pricing", "A queue that holds requests when all backend instances are at capacity", "A queue for handling traffic surges", "A priority queue for important requests"],
    correctIndex: 1,
    explanation: "The surge queue in AWS Classic Load Balancer (CLB) holds pending requests when all registered backend instances have reached their maximum connection capacity. The CLB can queue up to 1,024 requests. If the queue is full, additional requests receive 503 Service Unavailable errors (counted as 'SpilloverCount' metric). This was a significant limitation of CLB. AWS ALB replaced this with a more sophisticated approach — it doesn't have a fixed surge queue but uses its own connection pooling and request queuing internally with higher limits. Monitoring SpilloverCount was critical for CLB operators; a non-zero value indicated capacity problems requiring immediate attention. This was one of the reasons AWS recommended migrating from CLB to ALB."
  },
  {
    question: "What is a 'virtual server' in F5 BIG-IP load balancer terminology?",
    options: ["A VM running behind the load balancer", "A listener that represents the combination of IP address and port that clients connect to", "A simulated test server", "A server in the cloud"],
    correctIndex: 1,
    explanation: "In F5 BIG-IP, a 'virtual server' is the front-end configuration object that defines the IP address and port combination where the load balancer accepts client connections. It's conceptually equivalent to HAProxy's 'frontend' or AWS ALB's 'listener.' A virtual server ties together the listening address, traffic processing profiles (SSL, HTTP compression, caching), and the pool of backend servers. For example, a virtual server at 10.0.0.1:443 with an SSL profile and HTTP profile would accept HTTPS connections and load balance them across a pool of web servers. F5 virtual servers support iRules, which are custom scripts that can perform complex traffic manipulation beyond standard load balancing."
  },
  {
    question: "What is the 'server_name' directive in Nginx used for in load balancing?",
    options: ["Setting the hostname of the Nginx server", "Matching the incoming Host header to select the appropriate server block for virtual hosting", "Naming the backend servers", "Setting DNS names for health checks"],
    correctIndex: 1,
    explanation: "The 'server_name' directive in Nginx matches the Host header in incoming HTTP requests to determine which server block should process the request. This enables name-based virtual hosting — a single Nginx instance can serve multiple domains. Combined with upstream blocks, this becomes host-based load balancing: 'server_name api.example.com;' with 'proxy_pass http://api-backend;' routes API traffic to API servers, while 'server_name www.example.com;' routes to web servers. Without server_name matching, all traffic would hit the default server block regardless of the requested domain. This is equivalent to AWS ALB's host-based routing rules."
  },
  {
    question: "What is 'SSL session caching' and why is it important for load balancers?",
    options: ["Caching web pages served over SSL", "Storing TLS session parameters so subsequent connections skip the full handshake, reducing latency", "Caching SSL certificates", "Storing encrypted data"],
    correctIndex: 1,
    explanation: "SSL session caching stores the negotiated TLS session parameters (session tickets or session IDs) so that when a client reconnects, it can resume the previous session instead of performing a full TLS handshake. A full handshake requires 2 round trips (TLS 1.2) of CPU-intensive key exchange. Session resumption reduces this to 1 round trip with minimal CPU usage. For a load balancer handling thousands of TLS connections per second, this dramatically reduces CPU usage and connection latency. The challenge with multiple load balancers is ensuring session data is shared — either using shared memory, memcached backends for session tickets, or sticky sessions. Nginx supports ssl_session_cache with shared memory zones."
  },
  {
    question: "What is 'ECMP' (Equal-Cost Multi-Path) routing and its relation to load balancing?",
    options: ["An encryption protocol", "A network-layer technique that distributes traffic across multiple equal-cost routes, enabling L3 load balancing", "A load balancing algorithm for HTTP", "A monitoring protocol"],
    correctIndex: 1,
    explanation: "ECMP is a routing technique where network switches/routers distribute packets across multiple paths that have the same routing cost to a destination. This provides L3 (network layer) load balancing without any dedicated load balancer hardware. For example, if there are 4 equal-cost paths to a server subnet, the router distributes traffic across all 4 using a hash of the packet's 5-tuple (source/dest IP, source/dest port, protocol). ECMP is commonly used in data center leaf-spine architectures and in front of L4 load balancers to distribute traffic across multiple LB nodes. Maglev, Google's load balancer, uses ECMP with consistent hashing to ensure connection affinity even as paths change."
  },
  {
    question: "What happens when you configure too short a health check interval?",
    options: ["Better reliability", "Increased network overhead and potential for false positives, especially during minor GC pauses", "No effect", "Faster failover with no drawbacks"],
    correctIndex: 1,
    explanation: "Setting health check intervals too short (e.g., 1 second with 2-failure threshold) creates several problems. First, it generates significant network overhead — checking 100 backends every second is 100 health check requests per second. Second, it increases false positives: a server experiencing a brief JVM garbage collection pause (200ms stop-the-world) or momentary CPU spike might fail consecutive checks and be incorrectly marked unhealthy. This causes unnecessary traffic shifting and potential cascading issues. AWS recommends health check intervals of 10-30 seconds with 2-3 failure thresholds for a good balance between detection speed and stability. The total detection time equals interval × failure threshold, so 10s interval × 3 failures = 30 seconds to detect a real failure."
  },
  {
    question: "What is 'backend server weight auto-tuning'?",
    options: ["Manually adjusting server weights daily", "Automatically adjusting backend weights based on real-time performance metrics", "Tuning the physical weight of servers", "Automatic firmware updates"],
    correctIndex: 1,
    explanation: "Backend server weight auto-tuning dynamically adjusts the load balancing weight of each backend server based on real-time performance metrics like response time, error rate, or CPU usage. Instead of static weights, the load balancer continuously adapts to actual server performance. If a server starts responding slowly (perhaps due to noisy neighbors in a cloud environment), its weight is automatically reduced. HAProxy's agent checks enable this — the backend agent reports a percentage weight based on local conditions. Envoy's adaptive load balancing and Netflix's gradient-based load balancing are more sophisticated implementations. This approach handles heterogeneous and dynamic environments better than static configuration."
  },
  {
    question: "What is 'traffic splitting' and how is it different from load balancing?",
    options: ["They are identical", "Load balancing distributes across identical servers; traffic splitting routes percentages to different service versions for deployment strategies", "Traffic splitting is faster", "Load balancing is more advanced"],
    correctIndex: 1,
    explanation: "Traditional load balancing distributes traffic across identical servers for scalability and reliability. Traffic splitting directs specific percentages of traffic to different versions of a service for deployment strategies like canary releases, A/B testing, or traffic migration. For example, 95% to version 1.0 and 5% to version 2.0. While both involve distributing traffic, the intent is different — load balancing maximizes utilization and availability, while traffic splitting validates changes safely. Istio's VirtualService supports traffic splitting with exact percentages. AWS ALB implements it via weighted target groups. Traffic splitting is a deployment and experimentation tool that happens to use load balancer infrastructure."
  },
  {
    question: "What is 'headless service' in Kubernetes and when would you use it instead of a load balancer?",
    options: ["A service without a UI", "A service that returns all pod IPs directly via DNS instead of load balancing through a virtual IP", "A service that runs without a controller", "A temporary service"],
    correctIndex: 1,
    explanation: "A headless Service in Kubernetes (clusterIP: None) doesn't allocate a virtual IP or use kube-proxy for load balancing. Instead, DNS resolution returns the IP addresses of all backing pods directly. This is useful when the client needs to know all endpoints and do its own load balancing or connection management — for example, databases like Cassandra or Elasticsearch that use their own cluster discovery. StatefulSets typically use headless services because each pod needs a stable, unique DNS name (pod-0.service, pod-1.service). Regular Services provide built-in L4 load balancing via kube-proxy, but headless services are necessary when the application layer needs direct control over which pod it connects to."
  },
  {
    question: "What is the impact of load balancer placement on SSL/TLS certificate management?",
    options: ["No impact", "Certificates only need to be managed on the load balancer (with SSL termination), simplifying certificate lifecycle management", "Certificates become more complex with load balancers", "Each backend needs its own unique certificate"],
    correctIndex: 1,
    explanation: "With SSL termination at the load balancer, TLS certificates only need to be installed and renewed on the load balancer, not on every backend server. This dramatically simplifies certificate management — instead of updating certificates on 50 servers during renewal, you update one place. AWS ALB integrates with ACM (AWS Certificate Manager) for free, auto-renewing certificates. Without SSL termination, every backend server needs a valid certificate, and rotating them across a fleet is operationally complex. This centralization also makes it easier to enforce TLS policies (minimum version, cipher suites) consistently. The only downside is that if you need end-to-end encryption, you'll also need internal certificates on backends, though these can be self-signed from an internal CA."
  },
  {
    question: "What is the 'max_fails' directive in Nginx upstream configuration?",
    options: ["Maximum number of backend servers that can fail", "Number of failed requests to a backend before Nginx considers it unavailable", "Maximum number of retries", "Maximum number of 4xx errors allowed"],
    correctIndex: 1,
    explanation: "The 'max_fails' directive in Nginx defines how many consecutive failed requests (timeouts or errors) to a backend server are needed before Nginx marks it as unavailable. Combined with 'fail_timeout' (the period during which failures are counted and the duration the server is marked down), it forms Nginx's passive health check mechanism. For example, 'server backend1 max_fails=3 fail_timeout=30s;' means after 3 failures within 30 seconds, the server is marked down for 30 seconds. After the timeout, Nginx tries the server again. This is simpler than active health checks (which require Nginx Plus) but has the drawback that real user requests are used to detect failures."
  },
  {
    question: "What is 'load balancer affinity' at the kernel level (IPVS)?",
    options: ["CPU affinity for load balancer processes", "Linux kernel-level load balancing using IP Virtual Server for high-performance L4 balancing", "Affinity between load balancers in a cluster", "Memory affinity for connection tables"],
    correctIndex: 1,
    explanation: "IPVS (IP Virtual Server) is a Linux kernel module that provides L4 load balancing at the kernel level, offering much higher performance than userspace load balancers. Because IPVS operates in kernel space, it avoids the overhead of copying packets between kernel and user space. It supports multiple algorithms (round-robin, least connections, weighted, etc.) and modes (NAT, DR, IP tunneling). Kubernetes uses IPVS as an alternative to iptables for kube-proxy, providing better performance with large numbers of services. IPVS can handle millions of concurrent connections with O(1) complexity for connection scheduling, compared to iptables' O(n) chain traversal. It's the technology behind LVS (Linux Virtual Server) used by many large-scale deployments."
  },
  {
    question: "What is the difference between 'passive' and 'active' SSL/TLS termination?",
    options: ["Active terminates SSL; passive just monitors", "Active termination decrypts at the LB; passive termination uses SSL passthrough with traffic copying for inspection", "Active is for production; passive is for testing", "They are the same"],
    correctIndex: 1,
    explanation: "Active SSL termination fully decrypts TLS at the load balancer, forwarding plain HTTP to backends — this is the standard SSL termination approach. Passive SSL termination (or SSL inspection/tap) copies the encrypted traffic stream for analysis (like intrusion detection) while letting the original encrypted traffic pass through to the backend. The passive approach requires access to the private key to decrypt the copy. Active termination is by far more common in load balancing. Passive inspection is primarily used in security appliances (IDS/IPS) deployed alongside load balancers. Some enterprise load balancers like F5 BIG-IP can perform both simultaneously — terminating SSL for load balancing while also sending decrypted copies to security analysis tools."
  },
  {
    question: "What is 'adaptive load balancing'?",
    options: ["Adapting to new server hardware automatically", "Dynamically adjusting the load balancing algorithm based on real-time system conditions and performance", "A specific load balancing algorithm", "Adapting to different network protocols"],
    correctIndex: 1,
    explanation: "Adaptive load balancing goes beyond static algorithms by continuously monitoring backend health, response times, and resource utilization to dynamically adjust routing decisions. Rather than using a fixed algorithm like round-robin, it might shift more traffic to faster backends, reduce traffic to backends showing latency increases, and react to changing conditions in real time. Netflix's implementation uses gradient-based signals: if a backend's latency increases, it receives proportionally less traffic. Envoy's adaptive concurrency limits and AWS ALB's 'least outstanding requests' are related concepts. Adaptive load balancing is particularly valuable in cloud environments where server performance can vary due to noisy neighbors, thermal throttling, or background maintenance."
  },
  {
    question: "What is 'request collapsing' (coalescing) at the load balancer?",
    options: ["Combining multiple small requests into one large request", "Deduplicating identical concurrent requests and serving all clients from a single backend response", "Collapsing failed requests into retries", "Compressing requests to reduce size"],
    correctIndex: 1,
    explanation: "Request collapsing (or coalescing) detects when multiple clients simultaneously request the same resource and sends only one request to the backend, serving all waiting clients with the same response. This is particularly valuable for cache-miss scenarios in CDNs and caching proxies — without collapsing, 1000 simultaneous requests for the same uncached resource would generate 1000 backend requests. Varnish and Nginx both implement this pattern. Nginx does it naturally for proxy_cache when proxy_cache_lock is enabled — concurrent requests for the same cache key are held while the first request populates the cache. This prevents the 'thundering herd' problem where cache misses amplify backend load."
  },
  {
    question: "What is the difference between ELB, ALB, and NLB in AWS?",
    options: ["They are different names for the same service", "ELB (Classic) is legacy L4/L7; ALB is modern L7; NLB is modern L4 — each optimized for different use cases", "ELB is for EC2, ALB is for ECS, NLB is for Lambda", "They differ only in pricing"],
    correctIndex: 1,
    explanation: "AWS has three load balancer types: Classic Load Balancer (CLB/ELB) is the legacy option supporting basic L4 and L7 features; Application Load Balancer (ALB) is the modern L7 load balancer with advanced features like path-based routing, WebSocket support, and Lambda targets; Network Load Balancer (NLB) is a high-performance L4 load balancer handling millions of requests per second with static IPs and TLS passthrough. AWS recommends ALB for HTTP/HTTPS workloads and NLB for TCP/UDP workloads or when you need extreme performance, static IPs, or preservation of source IP. CLB is effectively deprecated — AWS encourages migration to ALB or NLB for all new deployments."
  },
  {
    question: "How does a load balancer handle 'long-polling' requests?",
    options: ["It rejects them", "It must have sufficiently long idle timeouts to maintain the held connections without prematurely closing them", "It converts them to WebSocket", "It doesn't need any special handling"],
    correctIndex: 1,
    explanation: "Long-polling involves clients sending a request that the server holds open until new data is available or a timeout occurs (typically 30-60 seconds). The load balancer must have idle timeout values higher than the long-poll timeout to avoid prematurely closing these intentionally held connections. For example, if your long-poll timeout is 60 seconds, the load balancer's idle timeout should be at least 65 seconds. Additionally, the load balancer should use least-connections rather than round-robin, since long-poll connections tie up server resources longer. AWS ALB's default idle timeout of 60 seconds may need to be increased for long-polling applications. Connection count per backend also matters more with long-polling since connections are held much longer."
  },
  {
    question: "What is 'consistent hashing with bounded loads'?",
    options: ["Hashing with a maximum file size", "A variant of consistent hashing that caps the maximum load on any single server to ensure even distribution", "Hashing with bandwidth limits", "Consistent hashing for large-scale systems only"],
    correctIndex: 1,
    explanation: "Consistent hashing with bounded loads (proposed by Mirrokni et al.) adds a load-balancing constraint to consistent hashing: no server can receive more than (1 + ε) times the average load. When a server reaches its bound, requests that would normally hash to it are redirected to the next available server on the ring. This solves the hot-spot problem that standard consistent hashing can suffer from (where unlucky hash distributions overload some servers) while maintaining the minimal-disruption property when servers are added or removed. Google Vimeo uses this algorithm for their load balancers. The ε parameter (typically small, like 0.25) provides a tuning knob between strict load balance and hash consistency."
  },
  {
    question: "What is the role of 'back-end connection pooling' in load balancers?",
    options: ["Pooling hardware resources", "Maintaining reusable connections to backends to avoid per-request TCP/TLS handshake overhead", "Pooling multiple backends into one", "Creating backup connection paths"],
    correctIndex: 1,
    explanation: "Backend connection pooling means the load balancer maintains a pool of pre-established TCP connections to each backend server, reusing them for multiple client requests rather than creating new connections each time. This eliminates the per-request overhead of TCP 3-way handshake (1 RTT) and TLS handshake (2-3 RTTs for TLS 1.2). For a load balancer handling 10,000 requests/second, this saves 10,000 handshakes per second. The pool typically has configurable minimum and maximum sizes, with idle connections kept alive using TCP keepalive packets. HAProxy's 'http-reuse' directive controls connection reuse strategies. This is one of the most impactful performance optimizations in any load balancer configuration."
  }
];
