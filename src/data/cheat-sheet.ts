// System Design Cheat Sheet — Quick Reference Data

export interface LatencyNumber {
  operation: string;
  time: string;
  nanoseconds: number;
  notes: string;
}

export interface PowerOf2 {
  power: number;
  exactValue: string;
  approx: string;
  bytes: string;
}

export interface EstimationShortcut {
  label: string;
  value: string;
  context: string;
}

export interface ThroughputNumber {
  system: string;
  metric: string;
  value: string;
  notes: string;
}

export interface TimeConversion {
  unit: string;
  seconds: number;
  readable: string;
}

export interface AvailabilityLevel {
  nines: string;
  percentage: string;
  downtimePerYear: string;
  downtimePerMonth: string;
  downtimePerWeek: string;
}

export const latencyNumbers: LatencyNumber[] = [
  { operation: "L1 cache reference", time: "0.5 ns", nanoseconds: 0.5, notes: "Fastest memory access" },
  { operation: "Branch mispredict", time: "5 ns", nanoseconds: 5, notes: "CPU pipeline flush" },
  { operation: "L2 cache reference", time: "7 ns", nanoseconds: 7, notes: "14x L1 cache" },
  { operation: "Mutex lock/unlock", time: "25 ns", nanoseconds: 25, notes: "Synchronization cost" },
  { operation: "Main memory reference (RAM)", time: "100 ns", nanoseconds: 100, notes: "20x L2, 200x L1" },
  { operation: "Compress 1KB with Zippy", time: "3,000 ns (3 µs)", nanoseconds: 3000, notes: "Light compression" },
  { operation: "Send 1KB over 1 Gbps network", time: "10,000 ns (10 µs)", nanoseconds: 10000, notes: "Network I/O" },
  { operation: "Read 4KB randomly from SSD", time: "150,000 ns (150 µs)", nanoseconds: 150000, notes: "~1 GB/sec SSD" },
  { operation: "Read 1MB sequentially from memory", time: "250,000 ns (250 µs)", nanoseconds: 250000, notes: "~4 GB/sec" },
  { operation: "Round trip within same datacenter", time: "500,000 ns (500 µs)", nanoseconds: 500000, notes: "0.5 ms" },
  { operation: "Read 1MB sequentially from SSD", time: "1,000,000 ns (1 ms)", nanoseconds: 1000000, notes: "~1 GB/sec, 4x memory" },
  { operation: "HDD seek", time: "10,000,000 ns (10 ms)", nanoseconds: 10000000, notes: "Mechanical latency" },
  { operation: "Read 1MB sequentially from HDD", time: "20,000,000 ns (20 ms)", nanoseconds: 20000000, notes: "~80x memory, 20x SSD" },
  { operation: "Send packet CA → Netherlands → CA", time: "150,000,000 ns (150 ms)", nanoseconds: 150000000, notes: "Transatlantic round trip" },
];

export const powersOf2: PowerOf2[] = [
  { power: 7, exactValue: "128", approx: "128", bytes: "128 B" },
  { power: 8, exactValue: "256", approx: "256", bytes: "256 B" },
  { power: 10, exactValue: "1,024", approx: "~1 Thousand", bytes: "1 KB" },
  { power: 16, exactValue: "65,536", approx: "~65 Thousand", bytes: "64 KB" },
  { power: 20, exactValue: "1,048,576", approx: "~1 Million", bytes: "1 MB" },
  { power: 30, exactValue: "1,073,741,824", approx: "~1 Billion", bytes: "1 GB" },
  { power: 32, exactValue: "4,294,967,296", approx: "~4 Billion", bytes: "4 GB" },
  { power: 40, exactValue: "1,099,511,627,776", approx: "~1 Trillion", bytes: "1 TB" },
  { power: 50, exactValue: "1,125,899,906,842,624", approx: "~1 Quadrillion", bytes: "1 PB" },
];

export const estimationShortcuts: EstimationShortcut[] = [
  { label: "Seconds in a day", value: "~86,400 ≈ 10^5", context: "Quick time math" },
  { label: "Seconds in a year", value: "~31.5 million ≈ π × 10^7", context: "Annualized calculations" },
  { label: "Requests/day → QPS", value: "Divide by 10^5 (86,400)", context: "100M req/day ≈ 1,000 QPS" },
  { label: "Peak QPS", value: "2x–5x average QPS", context: "Common rule of thumb" },
  { label: "80/20 rule", value: "80% traffic from 20% of data", context: "Cache sizing: cache the hot 20%" },
  { label: "Char size (ASCII)", value: "1 byte", context: "Text storage estimation" },
  { label: "Char size (Unicode/UTF-8 avg)", value: "2-4 bytes", context: "Multilingual text" },
  { label: "UUID/GUID size", value: "128 bits = 16 bytes", context: "ID storage" },
  { label: "Average tweet/message", value: "~200 bytes", context: "Short text storage" },
  { label: "Average image (compressed)", value: "~200 KB–1 MB", context: "Photo storage" },
  { label: "Average video minute (720p)", value: "~50 MB", context: "Video storage" },
  { label: "Average web page", value: "~2 MB", context: "Crawling estimation" },
  { label: "Number of daily active users (DAU)", value: "~30% of total users", context: "Engagement estimation" },
  { label: "Monthly active users (MAU)", value: "~50% of total users", context: "Engagement estimation" },
  { label: "Average read:write ratio (social)", value: "100:1 to 1000:1", context: "Read-heavy systems" },
  { label: "Average read:write ratio (chat)", value: "1:1 to 10:1", context: "Write-heavy systems" },
  { label: "1 million users × 1 KB", value: "1 GB", context: "Quick storage math" },
  { label: "1 billion users × 1 KB", value: "1 TB", context: "Quick storage math" },
  { label: "5 years of storage", value: "×1,800 days ≈ multiply daily by 2000", context: "Long-term storage planning" },
];

export const throughputNumbers: ThroughputNumber[] = [
  { system: "Single MySQL server", metric: "QPS (reads)", value: "~10,000", notes: "Simple queries, indexed" },
  { system: "Single MySQL server", metric: "QPS (writes)", value: "~5,000", notes: "With indexing overhead" },
  { system: "Single PostgreSQL server", metric: "QPS (reads)", value: "~10,000–15,000", notes: "Depends on query complexity" },
  { system: "Single Redis instance", metric: "QPS", value: "~100,000+", notes: "In-memory, single-threaded" },
  { system: "Single Memcached instance", metric: "QPS", value: "~100,000+", notes: "In-memory, multi-threaded" },
  { system: "Cassandra node", metric: "QPS (writes)", value: "~10,000–50,000", notes: "Write-optimized" },
  { system: "MongoDB node", metric: "QPS", value: "~10,000–50,000", notes: "Depends on working set" },
  { system: "Elasticsearch node", metric: "QPS (search)", value: "~1,000–10,000", notes: "Full-text search" },
  { system: "Kafka broker", metric: "Messages/sec", value: "~100,000–1,000,000", notes: "Per partition throughput" },
  { system: "Single web server", metric: "Concurrent connections", value: "~10,000–50,000", notes: "Event-driven (Node/Nginx)" },
  { system: "Single web server", metric: "Requests/sec", value: "~1,000–10,000", notes: "Depends on processing" },
  { system: "Load balancer (L4)", metric: "Connections/sec", value: "~1,000,000+", notes: "Hardware LB" },
  { system: "CDN edge node", metric: "Requests/sec", value: "~100,000+", notes: "Static content" },
  { system: "DNS server", metric: "QPS", value: "~50,000–100,000", notes: "Lightweight lookups" },
  { system: "1 Gbps network link", metric: "Throughput", value: "~125 MB/s", notes: "Max theoretical" },
  { system: "10 Gbps network link", metric: "Throughput", value: "~1.25 GB/s", notes: "Datacenter internal" },
  { system: "SSD", metric: "IOPS (random read)", value: "~10,000–100,000", notes: "NVMe can be higher" },
  { system: "HDD", metric: "IOPS (random read)", value: "~100–200", notes: "Mechanical seek" },
  { system: "SSD", metric: "Sequential read", value: "~500 MB/s – 3 GB/s", notes: "NVMe vs SATA" },
  { system: "HDD", metric: "Sequential read", value: "~100–200 MB/s", notes: "Spinning disk" },
];

export const timeConversions: TimeConversion[] = [
  { unit: "1 minute", seconds: 60, readable: "60 seconds" },
  { unit: "1 hour", seconds: 3600, readable: "3,600 seconds" },
  { unit: "1 day", seconds: 86400, readable: "86,400 seconds ≈ 10^5" },
  { unit: "1 week", seconds: 604800, readable: "604,800 seconds ≈ 6 × 10^5" },
  { unit: "1 month (30 days)", seconds: 2592000, readable: "2,592,000 seconds ≈ 2.5 × 10^6" },
  { unit: "1 year", seconds: 31536000, readable: "31,536,000 seconds ≈ π × 10^7" },
];

export const availabilityLevels: AvailabilityLevel[] = [
  { nines: "Two 9s", percentage: "99%", downtimePerYear: "3.65 days", downtimePerMonth: "7.31 hours", downtimePerWeek: "1.68 hours" },
  { nines: "Three 9s", percentage: "99.9%", downtimePerYear: "8.77 hours", downtimePerMonth: "43.83 minutes", downtimePerWeek: "10.08 minutes" },
  { nines: "Four 9s", percentage: "99.99%", downtimePerYear: "52.6 minutes", downtimePerMonth: "4.38 minutes", downtimePerWeek: "1.01 minutes" },
  { nines: "Five 9s", percentage: "99.999%", downtimePerYear: "5.26 minutes", downtimePerMonth: "26.3 seconds", downtimePerWeek: "6.05 seconds" },
  { nines: "Six 9s", percentage: "99.9999%", downtimePerYear: "31.56 seconds", downtimePerMonth: "2.63 seconds", downtimePerWeek: "0.6 seconds" },
];

export const backOfEnvelopeFormulas = [
  {
    name: "Storage Estimation",
    formula: "Daily data × 365 × years × replication factor",
    example: "500M tweets/day × 200B = 100GB/day → 100GB × 365 × 5 × 3 = 547.5 TB",
  },
  {
    name: "Bandwidth Estimation",
    formula: "QPS × average request/response size",
    example: "10,000 QPS × 10KB = 100 MB/s incoming bandwidth",
  },
  {
    name: "Cache Sizing (80/20)",
    formula: "Daily read requests × avg response size × 0.2",
    example: "10M reads/day × 1KB × 0.2 = 2 GB cache",
  },
  {
    name: "Number of Servers",
    formula: "Peak QPS / single server QPS capacity",
    example: "50,000 peak QPS / 10,000 per server = 5 servers (add buffer → 8)",
  },
  {
    name: "Database Shards",
    formula: "Total data size / max per shard (typically 1-2 TB)",
    example: "10 TB / 1 TB per shard = 10 shards (add growth → 15)",
  },
  {
    name: "QPS from DAU",
    formula: "DAU × actions per user per day / seconds in day",
    example: "100M DAU × 10 reads/day / 86,400 ≈ 11,574 QPS",
  },
];
