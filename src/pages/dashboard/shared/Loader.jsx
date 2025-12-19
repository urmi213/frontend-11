const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <span className={`loading loading-spinner ${sizes[size]} text-primary`}></span>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  )
}

export default Loader