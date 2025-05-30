const Label = ({ children, htmlFor, required = false, error = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium mb-1 ${
        error ? "text-red-400" : "text-gray-300"
      }`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
