const StockLevelIndicator = ({ current, min, max = 100 }) => {
  const percentage = (current / max) * 100
  let color = 'bg-green-500'
  
  if (percentage <= 20) {
    color = 'bg-red-500'
  } else if (percentage <= 50) {
    color = 'bg-yellow-500'
  }

  const isLowStock = current <= min

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Stock Level</span>
        <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
          {current} / {max}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
      
      {isLowStock && (
        <div className="text-xs text-red-600 font-medium">
          ⚠️ Stock level is below minimum
        </div>
      )}
    </div>
  )
}

export default StockLevelIndicator