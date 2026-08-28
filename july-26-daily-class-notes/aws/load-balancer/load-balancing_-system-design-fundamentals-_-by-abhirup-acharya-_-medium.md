# Load Balancing\_ System Design Fundamentals \_ by Abhirup Acharya \_ Medium

## Understanding the concept of Load Balancing in depth

[**https://middleware.io/blog/cloud-load-balancing/**](https://middleware.io/blog/cloud-load-balancing/)

The vast majority of web users go about their online activities without a second thought regarding the intricate and massive process that operates behind the scenes to bring them the content they desire.

The challenges don’t stop there. As websites grow in popularity, they inevitably face the daunting task of handling a constant surge in monthly traffic. This surge can lead to frustratingly slow loading times, impacting the overall user experience for both new and loyal visitors. It’s not uncommon for some websites to attract more visitors in a single month than their competitors do in an entire year. The sheer volume of traffic places immense pressure on the servers, often necessitating frequent and costly upgrades to maintain acceptable page speed and ensure a seamless browsing experience.

In this article, we’re going to dive into the world of load balancing and see how it works its magic to keep everything running smoothly. No more “404 not found” errors or endlessly spinning wheels of doom! So buckle up, because load balancing is about to take you on a ride through the tech wizardry that keeps the internet chugging along without a hitch. Let’s get started! 🚀

## What is Load Balancing?

Imagine you have a favorite restaurant that’s always packed with hungry customers. Now, this place has only one chef, and as much as they love cooking, it’s tough for them to handle all the orders alone. As a result, some customers end up waiting forever for their food, while others get served quickly.

Load balancing is like having a team of chefs in the kitchen. When the restaurant gets busy, the orders are evenly distributed among the chefs. This way, each chef can focus on a manageable number of orders, ensuring that everyone gets their food promptly.

**How Load Balancing works**

In the world of computers and the internet, load balancing works similarly. When a website or online service becomes super popular, it starts receiving a flood of requests from users all over the place. Instead of relying on a single server to handle all these requests (like the one chef scenario), load balancing spreads the workload across multiple servers.

By doing this, no single server gets overwhelmed with too much traffic, and every server gets to share the load. This prevents crashes, slowdowns, and annoying error messages, making sure that users like you and me have a smooth and enjoyable experience while browsing websites or using online applications.

Load balancing algorithms decide which server should handle each request, making sure they’re divvied up fairly. Think of it as a smart traffic cop redirecting cars during rush hour, ensuring that everyone gets where they need to be without a traffic jam.

## Practical Example of where a Load Balancer would be necessary

Let’s say you’re running a popular online store that sells trendy clothing and accessories. Your website has been getting a ton of traffic lately, especially during peak shopping seasons like Black Friday and Cyber Monday.

**After running a website that popular**

With so many customers browsing your website, adding items to their carts, and checking out, your servers are working overtime to handle all the requests.

Without a load balancer in place, this surge in traffic could overwhelm your servers, leading to slow loading times, unresponsive pages, and maybe even crashes. As a result, frustrated customers might abandon their shopping carts and take their business elsewhere.

**Crashing down after being abandoned**

But fear not! This is where the load balancer swoops in to save the day. You set up a load balancer that sits between your website’s users (the shoppers) and your servers. Now, when a customer visits your website and clicks on a link or adds something to their cart, their request goes to the load balancer first.

The load balancer, being the smart cookie it is, checks which of your servers is the least busy at that moment. It’s like having a traffic cop who directs the incoming shoppers to the checkout lines with the shortest wait times. The load balancer then sends the customer’s request to that particular server.

As more and more shoppers come in, the load balancer continues to evenly distribute the incoming traffic across all your servers. Each server gets a fair share of customers to serve, preventing any one server from getting overwhelmed.

[**https://hackernoon.com/load-balancer-and-when-to-use-it-5n1032b4**](https://hackernoon.com/load-balancer-and-when-to-use-it-5n1032b4)

With the load balancer at work, your website can handle the surge in traffic like a champ. Customers enjoy speedy page loading times, a smooth shopping experience, and no frustrating delays. Even if one of your servers decides to take a coffee break (i.e., goes down), the load balancer can reroute the traffic to the remaining healthy servers, ensuring continuous service and minimal disruption.

Thanks to the load balancer, your online store can keep up with the high demand, retain happy customers, and make the most of those peak shopping seasons without breaking a sweat!

## Types of Load Balancers based on the OSI Model

**OSI Model of the Network Stack**

Load balancers are categorized based on the layer of the OSI (Open Systems Interconnection) model at which they operate.

### Network Load Balancer (Load Balancer 4)

Layer 4 Load Balancer operates at the transport layer (Layer 4) of the OSI model. It makes decisions based on information such as the source and destination IP addresses, as well as the port numbers of incoming requests. The main focus of Layer 4 load balancers is to distribute network traffic efficiently across multiple servers.

🔑 **How it works:** When a user sends a request to access a website or application, the Layer 4 Load Balancer receives the request. It then looks at the transport layer data (IP addresses and ports) to determine which server should handle the request. The load balancer uses various algorithms (e.g., round-robin, least connections) to decide the best server to forward the request to. This ensures that traffic is evenly spread among the servers, improving performance and avoiding overloading any single server.

✅ **Advantages:**

* High performance and low latency due to its network-level decisions.
* Suitable for distributing TCP and UDP traffic efficiently.
* Ideal for scenarios where content-based decisions are not necessary.

❌ **Disadvantages:**

* Limited in making application-specific decisions.

### Application Load Balancer (Load Balancer 7)

Layer 7 Load Balancer operates at the application layer (Layer 7) of the OSI model. It can make more intelligent decisions based on application-specific data, such as HTTP headers, cookies, and URLs. Layer 7 Load Balancers understand application protocols, enabling them to optimize traffic distribution for specific applications or services.

🔑 **How it works:** When a user sends a request, the Layer 7 Load Balancer analyzes the content of the request to gain insights into the application being accessed. For example, it can identify the type of service (e.g., HTTP, HTTPS, FTP) or the specific URL being requested. Using this information, the load balancer can make intelligent decisions about which server is best suited to handle the request. This allows for more advanced load balancing strategies, such as sending certain requests to specialized servers that can handle specific application tasks.

✅ **Advantages:**

* Application-aware and can optimize traffic based on specific application requirements.
* Allows for content-based routing and advanced load balancing algorithms.
* Suitable for complex applications that require different server responses based on the type of request.

❌ **Disadvantages:**

* Higher processing overhead compared to Layer 4 Load Balancer due to content analysis.

## Load Balancing Algorithms

### Round Robin

The Round Robin load balancing algorithm is one of the simplest and most straightforward methods used to distribute incoming network traffic across multiple servers. It operates at the transport layer (Layer 4) of the OSI model and is commonly used in various load balancers.

🔑 **How it works:**

{% stepper %}
{% step %}
#### Server Pool

To begin, the load balancer maintains a pool of available servers that are ready to handle incoming requests. These servers could be physical machines, virtual instances, or containers.
{% endstep %}

{% step %}
#### Request Distribution

When a new request comes in, the load balancer starts at the first server in the pool and forwards the request to that server. For the next request, it moves to the next server in line and forwards the request to that server, continuing this sequential pattern.
{% endstep %}

{% step %}
#### Circular Pattern

The load balancer cycles through the list of servers in a circular fashion. Once it reaches the last server in the pool, it goes back to the first server and starts the cycle again. This ensures an even distribution of requests across all servers.
{% endstep %}
{% endstepper %}

Each server receives an equal number of requests in the long run. If there are N servers in the pool, then each server will handle approximately 1/N of the total incoming requests.

The Round Robin algorithm is stateless, meaning it doesn’t consider the current load or responsiveness of servers when making the distribution decision. All servers are treated equally, regardless of their current workload.

**📔 Understanding through an example**

Let’s say you have three servers in your server pool: Server A, Server B, and Server C. The load balancer receives six incoming requests:

1. Request 1: Forwarded to Server A (First server in the pool).
2. Request 2: Forwarded to Server B (Next server in line).
3. Request 3: Forwarded to Server C (Next server in line).
4. Request 4: Forwarded to Server A (Cycle back to the first server).
5. Request 5: Forwarded to Server B (Continuing the circular pattern).
6. Request 6: Forwarded to Server C (Continuing the circular pattern).

And so on…

✅ **Advantages:**

1. **Simplicity:** Round Robin is one of the simplest load balancing algorithms to implement. It doesn’t require complex calculations or in-depth server monitoring.
2. **Equal Workload:** The algorithm ensures an even distribution of incoming requests among all servers in the pool. Each server gets an equal share of the load, promoting fair resource utilization.
3. **No Session Affinity:** Round Robin is stateless, meaning it doesn’t rely on session information or maintain any state about previous requests. This makes it suitable for stateless applications or scenarios where session affinity is not required.
4. **Low Overhead:** Round Robin has low computational overhead since it only involves basic tracking of the last server used. This makes it efficient and scalable for large server pools.
5. **No External Dependencies:** The algorithm doesn’t require external data, such as server health information or response times. It can work without any additional monitoring systems.

❌ **Disadvantages:**

1. **Unequal Server Capacities:** Round Robin treats all servers equally, regardless of their capacities or performance capabilities. This can lead to some servers being overburdened if they are less powerful than others in the pool.
2. **No Health Monitoring:** The algorithm lacks intelligence to monitor server health or responsiveness. If a server becomes unavailable or experiences performance issues, Round Robin continues to forward requests to that server.
3. **Load Imbalance:** In practice, the actual workload of requests can vary, even with Round Robin. Certain requests may be more resource-intensive, leading to imbalances in server loads.
4. **Inefficient for Dynamic Environments:** In dynamic environments where servers are frequently added or removed from the pool, Round Robin may not adapt quickly to changes. New servers might not immediately receive an equal share of the load.
5. **No Geo-location Awareness:** Round Robin doesn’t consider the geographic location of users or servers. In global applications, this might result in suboptimal user experiences due to requests being sent to distant servers.
6. **Persistent Connections:** If clients use persistent connections (keep-alive), Round Robin can cause all requests from a single client to be sent to the same server, leading to potential load imbalances.

### Weighted Round Robin

The Weighted Round Robin load balancing algorithm is an extension of the basic Round Robin algorithm. It aims to address the issue of unequal server capacities by assigning different weights to each server in the pool. These weights represent the relative capacity or performance of each server. Servers with higher weights get a larger share of the incoming traffic, while servers with lower weights receive a smaller share.

🔑 **How it works:**

{% stepper %}
{% step %}
#### Assigning Weights

Each server in the pool is assigned a weight, which represents its capacity or processing power. Servers with higher capacities are given higher weights, and those with lower capacities receive lower weights.
{% endstep %}

{% step %}
#### Weight-Based Distribution

When a new request comes in, the load balancer uses the weights to determine which server should handle the request. It cycles through the servers in a circular manner, as in the basic Round Robin algorithm, but with a slight modification. Instead of equal distribution, it takes into account the weights of the servers.
{% endstep %}

{% step %}
#### Proportional Allocation

The load balancer forwards incoming requests to servers based on their weights. Servers with higher weights receive a larger proportion of the traffic, while servers with lower weights handle fewer requests.
{% endstep %}

{% step %}
#### Equal Load per Weight

Within the subset of servers with the same weight, the load is distributed equally using basic Round Robin. This ensures that all servers with the same weight share the traffic evenly.
{% endstep %}
{% endstepper %}

**📔 Understanding through an example**

Let’s consider a scenario where you have three servers in your pool with the following weights:

* Server A: Weight 4
* Server B: Weight 2
* Server C: Weight 1

The load balancer receives six incoming requests:

1. Request 1: Forwarded to Server A (Weight 4).
2. Request 2: Forwarded to Server B (Weight 2).
3. Request 3: Forwarded to Server C (Weight 1).
4. Request 4: Forwarded to Server A (Weight 4).
5. Request 5: Forwarded to Server B (Weight 2).
6. Request 6: Forwarded to Server A (Weight 4).

As you can see, Server A, with a weight of 4, handles more requests compared to Server B (weight 2) and Server C (weight 1). The load balancer ensures that the ratio of requests served by each server matches the ratio of their weights.

✅ **Advantages:**

1. **Capacity-Based Distribution:** Weighted Round Robin accounts for the different capacities of servers, ensuring that more powerful servers handle a higher proportion of the traffic.
2. **Fine-Tuned Balancing:** The ability to set specific weights allows for precise tuning of the load distribution, accommodating servers with varying capabilities.

❌ **Disadvantages:**

1. **Static Configuration:** Weighted Round Robin requires manual configuration of server weights. It may not adapt dynamically to changes in server performance or capacity.
2. **Complexity:** The algorithm introduces some complexity compared to basic Round Robin, as administrators need to assign and manage the weights appropriately.

### IP Hash

The IP Hash load balancing algorithm is a method used to distribute incoming network traffic across multiple servers based on the source IP address of the client. This algorithm operates at the application layer (Layer 7) of the OSI model and is commonly used in environments where session persistence or sticky sessions are required.

🔑 **How it works:**

{% stepper %}
{% step %}
#### Client IP Address

When a client (usually a user’s device) sends a request to access a website or application, the load balancer extracts the source IP address from the incoming request.
{% endstep %}

{% step %}
#### Hashing the IP Address

The IP address is then hashed, meaning it is converted into a unique numerical value using a hash function. The hash function ensures that the same IP address will always produce the same hash value.
{% endstep %}

{% step %}
#### Determining the Server

The load balancer uses the hashed value to map the client’s IP address to a specific server in the pool. This mapping is typically done by dividing the hash value by the total number of servers and selecting the corresponding server.
{% endstep %}
{% endstepper %}

The key feature of IP Hash is that for a given client IP address, it will consistently map to the same server. This ensures session persistence, meaning subsequent requests from the same client are always directed to the same server.

**📔 Understanding through an example**

Let’s say you have three servers in your pool and the IP addresses of two clients are as follows:

* Client 1 IP Address: 203.0.113.12
* Client 2 IP Address: 198.51.100.35

The load balancer uses a hash function to convert these IP addresses into numerical values:

* Client 1 IP Hash: 2895
* Client 2 IP Hash: 1578

If the pool has three servers (Server A, Server B, and Server C), the load balancer could map the clients to servers based on the hash values:

* Client 1 (IP Hash 2895) → Server B
* Client 2 (IP Hash 1578) → Server A

Since the mapping is consistent, subsequent requests from Client 1 will always be directed to Server B, and requests from Client 2 will always go to Server A.

✅ **Advantages:**

1. **Session Persistence:** IP Hash provides session affinity, ensuring that subsequent requests from the same client are always directed to the same server. This is crucial for applications that rely on maintaining user sessions or state.
2. **Equal Load per Client:** Each client’s requests are consistently sent to the same server, achieving balanced load distribution for individual clients.

❌ **Disadvantages:**

1. **Uneven Workload:** If a few clients generate a disproportionately large amount of traffic, the corresponding servers may experience a higher workload, potentially causing imbalances.
2. **Client Dependency:** IP Hash relies heavily on the client’s IP address for mapping, making it less effective when clients are behind NAT (Network Address Translation) or use multiple IP addresses.

### Least Connection Algorithm

The Least Connection load balancing algorithm is designed to distribute incoming network traffic across multiple servers based on the number of active connections each server currently has. The main objective of this algorithm is to direct new requests to the server with the least number of connections, ensuring a more balanced distribution of the workload.

🔑 **How it works:**

{% stepper %}
{% step %}
#### Tracking Connections

The load balancer continuously monitors the number of active connections on each server in the pool. It keeps track of how many clients are currently connected to each server.
{% endstep %}

{% step %}
#### Choosing the Least Connection

When a new request comes in, the load balancer evaluates the current connection count for each server and selects the server with the fewest active connections.
{% endstep %}

{% step %}
#### Load Distribution

The new request is then forwarded to the chosen server, which has the least burden of active connections.
{% endstep %}

{% step %}
#### Equalizing Connections

By directing new requests to servers with fewer connections, the Least Connection algorithm attempts to balance the number of connections across all servers in the pool.
{% endstep %}
{% endstepper %}

**📔 Understanding through an example**

Let’s consider a scenario with four servers in the pool and their respective connection counts:

* Server A: 10 active connections
* Server B: 7 active connections
* Server C: 5 active connections
* Server D: 8 active connections

If a new request comes in, the load balancer will choose Server C, as it currently has the fewest active connections (5) among all servers. The new request will be forwarded to Server C, helping to distribute the workload more evenly.

✅ **Advantages:**

1. **Dynamic Load Distribution:** The Least Connection algorithm adapts in real-time to the actual workload on each server, ensuring that new requests are directed to the least busy server at that moment.
2. **Balanced Resource Utilization:** By spreading the connections evenly across servers, Least Connection helps prevent any single server from becoming overloaded, thus optimizing resource usage.

❌ **Disadvantages:**

1. **Connection Fluctuations:** The Least Connection algorithm may cause frequent fluctuations in connections for some servers, especially when the workload is volatile.
2. **Spike Handling:** During sudden spikes in traffic, servers that initially had fewer connections may receive a surge of new requests, potentially causing temporary performance issues.
3. **No Consideration of Server Capacity:** Least Connection doesn’t consider server capacity or performance; it only looks at the number of connections. Thus, a powerful server may handle more connections than a less powerful one, leading to potential inefficiencies.

### Least Response Time Algorithm

The Least Response Time load balancing algorithm is a method used to distribute incoming network traffic across multiple servers based on their response times to previous requests. The main objective of this algorithm is to direct new requests to the server with the shortest response time, ensuring that clients are served by the most responsive server available.

🔑 **How it works:**

{% stepper %}
{% step %}
#### Monitoring Response Times

The load balancer continuously measures the response times of each server in the pool to previous requests. It keeps track of how quickly each server responds to client requests.
{% endstep %}

{% step %}
#### Choosing the Fastest Server

When a new request comes in, the load balancer evaluates the response times of each server and selects the server with the shortest response time.
{% endstep %}

{% step %}
#### Load Distribution

The new request is then forwarded to the chosen server, which has demonstrated the fastest response time in the recent past.
{% endstep %}
{% endstepper %}

As response times change, the load balancer updates its evaluations and may switch to a different server if its response time becomes faster than the current one.

**Time to First Byte (TTFB)** is the time taken by a server to send the first byte of data in response to a client’s request. It includes the time spent on processing the request, database queries, and any other backend operations before the server starts sending the response data.

The Least Response Time load balancing algorithm implicitly takes into account the Time to First Byte as it evaluates the overall response time of each server. The response time includes the TTFB along with the time taken to transmit the complete response data.

So, when the load balancer chooses the server with the shortest response time, it inherently considers the server’s efficiency in processing the request and delivering the first byte of data. A server with a shorter TTFB is likely to have a quicker response time overall, making it more attractive to the load balancer.

**📔 Understanding through an example**

Let’s consider a scenario with four servers in the pool and their respective response times to previous requests:

* Server A: 50 ms
* Server B: 40 ms
* Server C: 35 ms
* Server D: 60 ms

If a new request comes in, the load balancer will choose Server C, as it has the shortest response time (35 ms) among all servers. The new request will be forwarded to Server C, ensuring that the client is served by the most responsive server available.

✅ **Advantages:**

1. **Optimal User Experience:** The Least Response Time algorithm ensures that clients are directed to the server that can respond the fastest, leading to a more responsive and smoother user experience.
2. **Dynamic Adaptation:** The load balancer continuously evaluates server response times and adjusts its routing decisions accordingly, making it suitable for dynamic environments with varying server performance.

❌ **Disadvantages:**

1. **Response Time Fluctuations:** If server response times fluctuate frequently, the load balancer may switch clients between servers often, potentially causing inconsistency in the user experience.
2. **Vulnerable to Outliers:** A sudden spike in response time on one server may lead to temporarily routing more traffic to a slower server, impacting the overall performance.
3. **Dependence on Monitoring:** The Least Response Time algorithm requires ongoing monitoring of server response times, which may introduce additional overhead.

Finishing off with the article here. I really hope, I made the article worth your while and you learned a great deal from it.

Do consider giving this a clap since this encourages me to write more such content and share it with the world.

More than happy to address any improvements and suggestions. Please feel free to drop a comment.

Let’s connect on [**LinkedIn**](https://www.linkedin.com/in/abhirup-acharya-906a79168/)\*\* |\*\*[**Twitter**](https://twitter.com/AcharyaAbhirup)
