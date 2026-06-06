export default function AdSense({ slot = 'auto', format = 'horizontal', className = '' }) {
  // Define size based on format
  const sizeClasses = {
    horizontal: 'h-24 w-full', // Horizontal banner (728x90 or responsive)
    vertical: 'h-64 w-40', // Vertical skyscraper (160x600)
    square: 'h-64 w-64', // Square (250x250)
    large: 'h-72 w-full', // Large horizontal (970x250)
  };

  const defaultSize = sizeClasses[format] || sizeClasses.horizontal;
  
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${defaultSize} ${className}`}>
      <div className="text-center p-4">
        <p className="text-gray-500 font-medium text-sm">Google AdSense</p>
        <p className="text-xs text-gray-400 mt-1">{format}</p>
        <p className="text-xs text-gray-300 mt-1">{slot}</p>
      </div>
    </div>
  );
}
