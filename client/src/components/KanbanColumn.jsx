import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import StatusBadge from './StatusBadge'

function KanbanCard({ app, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: app.id })

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  } : {}

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-3 mb-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition"
    >
      <p className="font-medium text-gray-800 text-sm">{app.company}</p>
      <p className="text-xs text-gray-500 mt-0.5">{app.role}</p>
      {app.notes && (
        <p className="text-xs text-gray-400 mt-1">{app.notes}</p>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(app.id) }}
        className="text-xs text-red-400 hover:text-red-600 mt-2"
      >
        Delete
      </button>
    </div>
  )
}

function KanbanColumn({ status, applications, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  const COLUMN_COLORS = {
    saved:     'border-gray-300',
    applied:   'border-blue-300',
    interview: 'border-yellow-300',
    offer:     'border-green-300',
    rejected:  'border-red-300',
  }

  return (
    <div className="flex-1 min-w-48">
      <div className="flex items-center justify-between mb-3">
        <StatusBadge status={status} />
        <span className="text-xs text-gray-400 font-medium">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-64 rounded-xl border-2 border-dashed p-2 transition ${
          isOver
            ? 'bg-blue-50 border-blue-400'
            : `bg-gray-50 ${COLUMN_COLORS[status]}`
        }`}
      >
        {applications.map(app => (
          <KanbanCard key={app.id} app={app} onDelete={onDelete} />
        ))}

        {applications.length === 0 && (
          <div className="flex items-center justify-center h-24">
            <p className="text-xs text-gray-300">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default KanbanColumn