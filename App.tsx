import { useState, useMemo } from 'react'
import { useAppData } from './hooks/useAppData'
import type { Task, Note, ActiveView, TaskFilter, ToastMessage } from './types'
import { AppLayout } from './components/AppLayout'
import { Dashboard } from './components/Dashboard'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { NotesGrid } from './components/NotesGrid'
import { TaskEditModal } from './components/TaskEditModal'
import { NoteEditorModal } from './components/NoteEditorModal'
import { ConfirmationModal } from './components/ConfirmationModal'
import { Toast } from './components/Toast'

export default function App() {
  const {
    data,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
    addNote,
    editNote,
    deleteNote,
  } = useAppData()

  // Navigation & Filtering
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Toast feedback
  const [toast, setToast] = useState<ToastMessage | null>(null)
  function showToast(message: string, type: 'success' | 'info' | 'warning' = 'success') {
    setToast({ id: crypto.randomUUID(), message, type })
  }

  // Modals state
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null)
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false)

  // Confirmation modal state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'task' | 'note' | 'clearCompleted'
    id?: string
    title?: string
    message?: string
  }>({
    isOpen: false,
    type: 'task',
  })

  // Search counts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { taskMatches: 0, noteMatches: 0 }
    }
    const q = searchQuery.toLowerCase().trim()
    const taskMatches = data.tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)),
    ).length
    const noteMatches = data.notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
    ).length
    return { taskMatches, noteMatches }
  }, [data.tasks, data.notes, searchQuery])

  // --- Handlers ---

  function handleAddTask(
    title: string,
    description?: string,
    priority?: any,
    dueDate?: string,
  ) {
    addTask(title, description, priority, dueDate)
    showToast(`Task "${title}" created`, 'success')
  }

  function handleToggleTask(id: string) {
    const task = data.tasks.find((t) => t.id === id)
    toggleTask(id)
    if (task) {
      const willBeCompleted = !task.completed
      showToast(
        willBeCompleted ? `Completed "${task.title}"` : `Reopened "${task.title}"`,
        willBeCompleted ? 'success' : 'info',
      )
    }
  }

  function handleSaveTaskEdit(
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>,
  ) {
    editTask(id, updates)
    showToast('Task updated successfully', 'success')
  }

  function requestDeleteTask(id: string) {
    const task = data.tasks.find((t) => t.id === id)
    setConfirmDialog({
      isOpen: true,
      type: 'task',
      id,
      title: 'Delete Task?',
      message: `Are you sure you want to delete "${task?.title || 'this task'}"? This cannot be undone.`,
    })
  }

  function requestDeleteNote(id: string) {
    const note = data.notes.find((n) => n.id === id)
    setConfirmDialog({
      isOpen: true,
      type: 'note',
      id,
      title: 'Delete Note?',
      message: `Are you sure you want to delete "${note?.title || 'this note'}"? This cannot be undone.`,
    })
  }

  function requestClearCompleted() {
    const count = data.tasks.filter((t) => t.completed).length
    setConfirmDialog({
      isOpen: true,
      type: 'clearCompleted',
      title: 'Clear Completed Tasks?',
      message: `Permanently delete all ${count} completed tasks? This cannot be undone.`,
    })
  }

  function handleConfirmAction() {
    if (confirmDialog.type === 'task' && confirmDialog.id) {
      deleteTask(confirmDialog.id)
      showToast('Task deleted', 'info')
    } else if (confirmDialog.type === 'note' && confirmDialog.id) {
      deleteNote(confirmDialog.id)
      showToast('Note deleted', 'info')
    } else if (confirmDialog.type === 'clearCompleted') {
      clearCompletedTasks()
      showToast('Completed tasks cleared', 'info')
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
  }

  function handleSaveNote(title: string, content: string) {
    if (noteToEdit) {
      editNote(noteToEdit.id, title, content)
      showToast('Note updated', 'success')
    } else {
      addNote(title, content)
      showToast('Note created', 'success')
    }
  }

  function openCreateNote() {
    setNoteToEdit(null)
    setIsNoteEditorOpen(true)
  }

  function openEditNote(note: Note) {
    setNoteToEdit(note)
    setIsNoteEditorOpen(true)
  }

  const pendingCount = data.tasks.filter((t) => !t.completed).length
  const completedCount = data.tasks.filter((t) => t.completed).length

  return (
    <AppLayout
      activeView={activeView}
      onNavigate={(view) => {
        setActiveView(view)
        if (view === 'completed') {
          setTaskFilter('completed')
        } else if (view === 'tasks' && taskFilter === 'completed') {
          setTaskFilter('all')
        }
      }}
      pendingTaskCount={pendingCount}
      totalNotesCount={data.notes.length}
      completedTaskCount={completedCount}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      taskMatchCount={searchQuery.trim() ? searchResults.taskMatches : undefined}
      noteMatchCount={searchQuery.trim() ? searchResults.noteMatches : undefined}
      onQuickNewTask={() => {
        setActiveView('tasks')
        // Focus first input
        document.querySelector<HTMLInputElement>('input[placeholder*="Add a task"]')?.focus()
      }}
      onQuickNewNote={openCreateNote}
    >
      {/* Global search includes both tasks and notes from every section. */}
      {searchQuery.trim() ? (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h2 className="text-base font-semibold text-slate-800">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-xs text-slate-500">
              Showing matching tasks and notes from your workspace.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 pl-1">
              Matching Tasks ({searchResults.taskMatches})
            </h3>
            <TaskList
              tasks={data.tasks}
              filter="all"
              onFilterChange={setTaskFilter}
              onToggle={handleToggleTask}
              onEdit={setTaskToEdit}
              onDelete={requestDeleteTask}
              searchQuery={searchQuery}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 pl-1">
              Matching Notes ({searchResults.noteMatches})
            </h3>
            <NotesGrid
              notes={data.notes}
              onNewNote={openCreateNote}
              onEditNote={openEditNote}
              onDeleteNote={requestDeleteNote}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Main Views */}
          {activeView === 'dashboard' && (
            <Dashboard
              tasks={data.tasks}
              notes={data.notes}
              onNavigate={(view) => {
                setActiveView(view)
                if (view === 'completed') setTaskFilter('completed')
              }}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onEditTask={setTaskToEdit}
              onDeleteTask={requestDeleteTask}
              onEditNote={openEditNote}
              onDeleteNote={requestDeleteNote}
            />
          )}

          {activeView === 'tasks' && (
            <div className="space-y-5">
              <TaskForm onAdd={handleAddTask} />
              <TaskList
                tasks={data.tasks}
                filter={taskFilter}
                onFilterChange={setTaskFilter}
                onToggle={handleToggleTask}
                onEdit={setTaskToEdit}
                onDelete={requestDeleteTask}
                onClearCompleted={requestClearCompleted}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {activeView === 'notes' && (
            <NotesGrid
              notes={data.notes}
              onNewNote={openCreateNote}
              onEditNote={openEditNote}
              onDeleteNote={requestDeleteNote}
              searchQuery={searchQuery}
            />
          )}

          {activeView === 'completed' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                  Completed Tasks History ({completedCount})
                </h2>
                <p className="text-xs text-slate-500">
                  Celebrate your accomplishments. You can restore tasks or clear completed items.
                </p>
              </div>

              <TaskList
                tasks={data.tasks}
                filter="completed"
                onFilterChange={setTaskFilter}
                onToggle={handleToggleTask}
                onEdit={setTaskToEdit}
                onDelete={requestDeleteTask}
                onClearCompleted={requestClearCompleted}
                searchQuery={searchQuery}
              />
            </div>
          )}
        </>
      )}

      {/* Modals & Dialogs */}
      <TaskEditModal
        task={taskToEdit}
        isOpen={Boolean(taskToEdit)}
        onClose={() => setTaskToEdit(null)}
        onSave={handleSaveTaskEdit}
      />

      <NoteEditorModal
        note={noteToEdit}
        isOpen={isNoteEditorOpen}
        onClose={() => {
          setIsNoteEditorOpen(false)
          setNoteToEdit(null)
        }}
        onSave={handleSaveNote}
      />

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title || 'Confirm Action'}
        message={confirmDialog.message || 'Are you sure you want to proceed?'}
        confirmLabel={confirmDialog.type === 'clearCompleted' ? 'Clear All' : 'Delete'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Action Feedback Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </AppLayout>
  )
}
