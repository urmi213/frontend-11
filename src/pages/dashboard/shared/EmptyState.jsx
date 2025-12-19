import { FaHeartbeat, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { Link } from 'react-router'

const EmptyState = ({ 
  icon = 'heart', 
  title, 
  message, 
  actionText, 
  actionLink 
}) => {
  const icons = {
    heart: <FaHeartbeat className="w-16 h-16 text-gray-300" />,
    search: <FaSearch className="w-16 h-16 text-gray-300" />,
    add: <FaPlusCircle className="w-16 h-16 text-gray-300" />
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-6">
        {icons[icon]}
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  )
}

export default EmptyState