const BASE = 'https://jsonplaceholder.typicode.com'

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export const api = {
  getPosts: (page = 1, limit = 10): Promise<Post[]> =>
    fetch(`${BASE}/posts?_page=${page}&_limit=${limit}`).then(r => r.json()),

  getPost: (id: number): Promise<Post> =>
    fetch(`${BASE}/posts/${id}`).then(r => r.json()),

  getUsers: (): Promise<User[]> =>
    fetch(`${BASE}/users`).then(r => r.json()),

  getUser: (id: number): Promise<User> =>
    fetch(`${BASE}/users/${id}`).then(r => r.json()),

  getPostsByUser: (userId: number): Promise<Post[]> =>
    fetch(`${BASE}/posts?userId=${userId}`).then(r => r.json()),

  getTodos: (): Promise<Todo[]> =>
    fetch(`${BASE}/todos?_limit=10`).then(r => r.json()),

  createTodo: (todo: Omit<Todo, 'id'>): Promise<Todo> =>
    fetch(`${BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    }).then(r => r.json()),

  updateTodo: (id: number, patch: Partial<Todo>): Promise<Todo> =>
    fetch(`${BASE}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).then(r => r.json()),

  deleteTodo: (id: number): Promise<void> =>
    fetch(`${BASE}/todos/${id}`, { method: 'DELETE' }).then(() => undefined),

  getComments: (postId: number): Promise<Comment[]> =>
    fetch(`${BASE}/posts/${postId}/comments`).then(r => r.json()),
}
