const STATUS_STYLES = {
  saved:     'bg-gray-100 text-gray-600',
  applied:   'bg-blue-100 text-blue-600',
  interview: 'bg-yellow-100 text-yellow-700',
  offer:     'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-600'
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.saved
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default StatusBadge