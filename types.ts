export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  dueDate?: string // ISO date string: YYYY-MM-DD
  completed: boolean
  createdAt: number
  completedAt?: number
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface AppData {
  tasks: Task[]
  notes: Note[]
}

export type ActiveView = 'dashboard' | 'tasks' | 'notes' | 'completed'
export type TaskFilter = 'all' | 'pending' | 'completed'
export type TaskSort = 'dueDate' | 'createdAt' | 'priority'

export interface ToastMessage {
  id: string
  message: string
  type?: 'success' | 'info' | 'warning'
}
