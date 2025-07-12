import { User, Question, Answer, Notification, Tag } from "@shared/schema";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "jane_smith",
    email: "jane@example.com",
    password: "hashed_password",
    reputation: 1234,
    role: "user",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: 2,
    username: "mike_johnson",
    email: "mike@example.com",
    password: "hashed_password",
    reputation: 856,
    role: "user",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    createdAt: new Date("2023-02-01"),
  },
  {
    id: 3,
    username: "sarah_wilson",
    email: "sarah@example.com",
    password: "hashed_password",
    reputation: 1234,
    role: "user",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    createdAt: new Date("2023-03-01"),
  },
];

export const mockTags: Tag[] = [
  { id: 1, name: "react", description: "A JavaScript library for building user interfaces", questionCount: 1234, createdAt: new Date() },
  { id: 2, name: "javascript", description: "High-level, interpreted programming language", questionCount: 2567, createdAt: new Date() },
  { id: 3, name: "nodejs", description: "JavaScript runtime built on Chrome's V8 JavaScript engine", questionCount: 892, createdAt: new Date() },
  { id: 4, name: "python", description: "High-level, general-purpose programming language", questionCount: 1456, createdAt: new Date() },
  { id: 5, name: "hooks", description: "React feature for state management in functional components", questionCount: 567, createdAt: new Date() },
  { id: 6, name: "async-await", description: "JavaScript feature for handling asynchronous operations", questionCount: 234, createdAt: new Date() },
  { id: 7, name: "jwt", description: "JSON Web Token for authentication", questionCount: 345, createdAt: new Date() },
  { id: 8, name: "authentication", description: "Process of verifying user identity", questionCount: 456, createdAt: new Date() },
  { id: 9, name: "security", description: "Practices and measures to protect applications", questionCount: 678, createdAt: new Date() },
  { id: 10, name: "performance", description: "Application optimization and speed", questionCount: 789, createdAt: new Date() },
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    title: "How to implement useEffect hook with async functions in React?",
    content: `I'm trying to use async/await inside useEffect but getting warnings about cleanup functions. Here's my current code:

\`\`\`javascript
useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('/api/data');
        const data = await response.json();
        setData(data);
    };
    
    fetchData();
}, []);
\`\`\`

This works, but I'm getting warnings about cleanup functions. What's the proper way to handle async operations in useEffect?`,
    authorId: 2,
    votes: 15,
    views: 124,
    answerCount: 3,
    acceptedAnswerId: 1,
    tags: ["react", "hooks", "async-await"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: 2,
    title: "Best practices for JWT authentication in Node.js applications",
    content: `I'm building a REST API with Node.js and Express. What are the security best practices for implementing JWT authentication?

Should I store the JWT in localStorage, sessionStorage, or cookies? What about refresh tokens?`,
    authorId: 3,
    votes: 8,
    views: 67,
    answerCount: 1,
    acceptedAnswerId: null,
    tags: ["nodejs", "jwt", "authentication", "security"],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: 3,
    title: "Python list comprehension vs traditional loops performance",
    content: `I'm wondering about the performance differences between using list comprehensions and traditional for loops in Python. Which is faster and why?

\`\`\`python
# List comprehension
squares = [x**2 for x in range(1000)]

# Traditional loop
squares = []
for x in range(1000):
    squares.append(x**2)
\`\`\`

Are there any scenarios where one is significantly better than the other?`,
    authorId: 1,
    votes: 23,
    views: 342,
    answerCount: 5,
    acceptedAnswerId: 2,
    tags: ["python", "performance"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: 4,
    title: "How to center a div in CSS?",
    content: `I've been struggling to center a div both horizontally and vertically. I've tried several methods but none seem to work consistently across different browsers.

What's the most reliable way to center a div in 2024?`,
    authorId: 1,
    votes: 42,
    views: 1205,
    answerCount: 8,
    acceptedAnswerId: null,
    tags: ["css", "flexbox", "grid"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 5,
    title: "Database connection pooling in Node.js with PostgreSQL",
    content: `I'm building a Node.js application that needs to handle many concurrent database connections. What's the best way to implement connection pooling with PostgreSQL?

Should I use pg-pool or is there a better alternative?`,
    authorId: 2,
    votes: 18,
    views: 234,
    answerCount: 4,
    acceptedAnswerId: null,
    tags: ["nodejs", "postgresql", "database", "performance"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: 6,
    title: "React state management: Redux vs Context API",
    content: `I'm working on a medium-sized React application and trying to decide between Redux and Context API for state management. 

What are the pros and cons of each approach? When should I use one over the other?`,
    authorId: 3,
    votes: 31,
    views: 567,
    answerCount: 6,
    acceptedAnswerId: null,
    tags: ["react", "redux", "state-management"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
  {
    id: 7,
    title: "How to optimize SQL queries for better performance?",
    content: `My application is running slow due to inefficient SQL queries. I have a table with millions of records and some queries are taking several seconds to execute.

What are the best practices for optimizing SQL query performance?`,
    authorId: 1,
    votes: 25,
    views: 389,
    answerCount: 7,
    acceptedAnswerId: null,
    tags: ["sql", "performance", "optimization", "database"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
  },
  {
    id: 8,
    title: "TypeScript generic constraints explained",
    content: `I'm trying to understand TypeScript generic constraints but the documentation is confusing. Can someone explain with practical examples?

\`\`\`typescript
function getValue<T extends keyof U, U>(obj: U, key: T): U[T] {
    return obj[key];
}
\`\`\`

How does this constraint work?`,
    authorId: 2,
    votes: 19,
    views: 156,
    answerCount: 3,
    acceptedAnswerId: null,
    tags: ["typescript", "generics", "constraints"],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
  },
  {
    id: 9,
    title: "Docker multi-stage builds best practices",
    content: `I'm trying to optimize my Docker images using multi-stage builds. What are the best practices for creating efficient Docker images?

My current Dockerfile is quite large and the resulting image is over 1GB.`,
    authorId: 3,
    votes: 14,
    views: 203,
    answerCount: 2,
    acceptedAnswerId: null,
    tags: ["docker", "devops", "optimization"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    id: 10,
    title: "Handling file uploads in Express.js",
    content: `I need to implement file upload functionality in my Express.js application. What's the best middleware to use for handling multipart/form-data?

Should I use multer or is there a better alternative?`,
    authorId: 1,
    votes: 22,
    views: 445,
    answerCount: 5,
    acceptedAnswerId: null,
    tags: ["nodejs", "express", "file-upload"],
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    updatedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000), // 17 days ago
  },
  {
    id: 11,
    title: "WebSocket vs Server-Sent Events for real-time updates",
    content: `I'm building a real-time dashboard and need to decide between WebSockets and Server-Sent Events (SSE). 

What are the trade-offs between these two approaches?`,
    authorId: 2,
    votes: 16,
    views: 278,
    answerCount: 4,
    acceptedAnswerId: null,
    tags: ["websockets", "sse", "real-time"],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    updatedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000), // 19 days ago
  },
  {
    id: 12,
    title: "Git workflow for team collaboration",
    content: `Our team is growing and we need to establish a proper Git workflow. We currently all push to master but it's becoming chaotic.

What's the best Git workflow for a team of 5-10 developers?`,
    authorId: 3,
    votes: 38,
    views: 892,
    answerCount: 9,
    acceptedAnswerId: null,
    tags: ["git", "workflow", "collaboration"],
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), // 22 days ago
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
  },
  {
    id: 13,
    title: "React Hook Form vs Formik comparison",
    content: `I'm starting a new React project and need to choose a form library. I'm torn between React Hook Form and Formik.

Which one has better performance and developer experience?`,
    authorId: 1,
    votes: 27,
    views: 523,
    answerCount: 6,
    acceptedAnswerId: null,
    tags: ["react", "forms", "hooks"],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    updatedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000), // 24 days ago
  },
  {
    id: 14,
    title: "MongoDB vs PostgreSQL for a new project",
    content: `I'm starting a new web application and can't decide between MongoDB and PostgreSQL. The application will handle user profiles, posts, and comments.

What factors should I consider when choosing between these databases?`,
    authorId: 2,
    votes: 33,
    views: 756,
    answerCount: 8,
    acceptedAnswerId: null,
    tags: ["mongodb", "postgresql", "database"],
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
    updatedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000), // 27 days ago
  },
  {
    id: 15,
    title: "Implementing caching strategies in web applications",
    content: `My web application is getting slower as the user base grows. I need to implement caching to improve performance.

What are the different types of caching and when should I use each?`,
    authorId: 3,
    votes: 21,
    views: 334,
    answerCount: 5,
    acceptedAnswerId: null,
    tags: ["caching", "performance", "web-development"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 29 days ago
  },
  {
    id: 16,
    title: "CSS Grid vs Flexbox: When to use which?",
    content: `I'm often confused about when to use CSS Grid and when to use Flexbox. They seem to overlap in functionality.

Can someone explain the key differences and use cases for each?`,
    authorId: 1,
    votes: 45,
    views: 1123,
    answerCount: 11,
    acceptedAnswerId: null,
    tags: ["css", "grid", "flexbox"],
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000), // 32 days ago
    updatedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // 31 days ago
  },
  {
    id: 17,
    title: "API rate limiting implementation strategies",
    content: `I need to implement rate limiting for my REST API to prevent abuse. What are the different algorithms and how do I choose the right one?

Should I use token bucket, sliding window, or fixed window?`,
    authorId: 2,
    votes: 17,
    views: 267,
    answerCount: 4,
    acceptedAnswerId: null,
    tags: ["api", "rate-limiting", "security"],
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
    updatedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000), // 34 days ago
  },
  {
    id: 18,
    title: "Testing strategies for React applications",
    content: `I want to improve the test coverage of my React application. What are the different types of tests I should write?

Should I focus on unit tests, integration tests, or end-to-end tests?`,
    authorId: 3,
    votes: 29,
    views: 478,
    answerCount: 7,
    acceptedAnswerId: null,
    tags: ["react", "testing", "jest"],
    createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000), // 38 days ago
    updatedAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000), // 37 days ago
  },
  {
    id: 19,
    title: "Microservices vs Monolith architecture",
    content: `Our application is growing and we're considering moving from a monolithic architecture to microservices. 

What are the pros and cons of each approach? When does it make sense to switch?`,
    authorId: 1,
    votes: 52,
    views: 1456,
    answerCount: 12,
    acceptedAnswerId: null,
    tags: ["architecture", "microservices", "monolith"],
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
    updatedAt: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000), // 39 days ago
  },
  {
    id: 20,
    title: "Securing Node.js applications: Best practices",
    content: `I'm about to deploy my Node.js application to production. What are the essential security measures I should implement?

I'm particularly concerned about common vulnerabilities like SQL injection and XSS.`,
    authorId: 2,
    votes: 36,
    views: 689,
    answerCount: 8,
    acceptedAnswerId: null,
    tags: ["nodejs", "security", "best-practices"],
    createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), // 42 days ago
    updatedAt: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000), // 41 days ago
  },
];

export const mockAnswers: Answer[] = [
  {
    id: 1,
    content: `The proper way to handle async operations in useEffect is to define the async function inside the effect and call it immediately. Here's the corrected approach:

\`\`\`javascript
useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            if (isMounted) {
                setData(data);
            }
        } catch (error) {
            if (isMounted) {
                setError(error.message);
            }
        }
    };
    
    fetchData();
    
    return () => {
        isMounted = false;
    };
}, []);
\`\`\`

This approach prevents memory leaks by checking if the component is still mounted before setting state.`,
    questionId: 1,
    authorId: 1,
    votes: 12,
    isAccepted: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 2,
    content: `List comprehensions are generally faster than traditional loops in Python because they're implemented in C and optimized at the language level. Here's why:

1. **Reduced function call overhead**: List comprehensions minimize the number of function calls
2. **Optimized memory allocation**: Python can pre-allocate memory for the entire list
3. **Faster iteration**: The iteration is handled at the C level

However, readability should be your primary concern. Use list comprehensions for simple operations and traditional loops for complex logic.`,
    questionId: 3,
    authorId: 2,
    votes: 18,
    isAccepted: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    type: "answer",
    message: "John Doe answered your question about React hooks",
    isRead: false,
    relatedId: 1,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    userId: 1,
    type: "comment",
    message: "Sarah Wilson commented on your answer",
    isRead: false,
    relatedId: 2,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: 3,
    userId: 1,
    type: "mention",
    message: "Mike Johnson mentioned you in a comment",
    isRead: false,
    relatedId: 3,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export const getCurrentUser = () => mockUsers[0]; // Jane Smith as current user

export const getQuestionById = (id: number) => mockQuestions.find(q => q.id === id);
export const getAnswersByQuestionId = (questionId: number) => mockAnswers.filter(a => a.questionId === questionId);
export const getUserById = (id: number) => mockUsers.find(u => u.id === id);
export const getNotificationsByUserId = (userId: number) => mockNotifications.filter(n => n.userId === userId);
