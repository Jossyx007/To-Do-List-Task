import type { AppData, Task, Note, Priority } from './types'

const STORAGE_KEY_V2 = 'todo_notes_app_data_v2'
const STORAGE_KEY_V1 = 'todo-notes-app.v1'

export const defaultInitialData: AppData = { tasks: [], notes: [] }

export function loadData(): AppData {
  try {
    // 1. Try loading V2 data
    const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2)
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<AppData>
      const tasks: Task[] = Array.isArray(parsed.tasks)
        ? parsed.tasks.map((t: any) => ({
            id: t.id || crypto.randomUUID(),
            title: t.title || 'Untitled task',
            description: t.description ?? t.notes ?? '',
            priority: (['low', 'medium', 'high'].includes(t.priority) ? t.priority : 'medium') as Priority,
            dueDate: t.dueDate || undefined,
            completed: Boolean(t.completed),
            createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
            completedAt: t.completedAt,
          }))
        : []

      const notes: Note[] = Array.isArray(parsed.notes)
        ? parsed.notes.map((n: any) => ({
            id: n.id || crypto.randomUUID(),
            title: n.title || '',
            content: n.content ?? n.body ?? '',
            createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
            updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
          }))
        : []

      return { tasks, notes }
    }

    // 2. Try migrating legacy V1 data
    const rawV1 = window.localStorage.getItem(STORAGE_KEY_V1)
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1) as any
      const migratedTasks: Task[] = Array.isArray(parsedV1.tasks)
        ? parsedV1.tasks.map((t: any) => ({
            id: t.id || crypto.randomUUID(),
            title: t.title || 'Untitled task',
            description: t.notes || '',
            priority: 'medium',
            dueDate: t.dueDate || undefined,
            completed: Boolean(t.completed),
            createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
          }))
        : []

      const migratedNotes: Note[] = Array.isArray(parsedV1.notes)
        ? parsedV1.notes.map((n: any) => ({
            id: n.id || crypto.randomUUID(),
            title: n.title || '',
            content: n.body || '',
            createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
            updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
          }))
        : []

      const migratedData: AppData = { tasks: migratedTasks, notes: migratedNotes }
      // Save migrated data to v2
      saveData(migratedData)
      return migratedData
    }

    // 3. First time user: initialize with welcome sample data
    saveData(defaultInitialData)
    return defaultInitialData
  } catch (err) {
    console.error('Failed to load saved data, starting fresh:', err)
    return defaultInitialData
  }
}

export function saveData(data: AppData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save data to localStorage:', err)
  }
}
