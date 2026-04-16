const Input = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder,
    required = false,
    error,
    icon: Icon
  }) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-gray-700 font-semibold mb-2">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`input-field ${Icon ? 'pl-10' : ''} ${
              error ? 'border-danger focus:ring-danger' : ''
            }`}
          />
        </div>
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  };
  
  export default Input;