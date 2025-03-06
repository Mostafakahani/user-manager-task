interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            block w-full rounded-md border-gray-300 
            ${icon ? "pl-10" : "pl-3"} pr-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? "border-red-300" : "border-gray-300"}
            ${className}
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
