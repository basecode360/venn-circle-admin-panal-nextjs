import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Upload, X, Calendar, Clock } from "lucide-react";

const Newinput = forwardRef(({ 
  type = "text",
  variant = "default",
  size = "default",
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  required = false,
  disabled = false,
  className = "",
  inputClassName = "",
  labelClassName = "",
  icon,
  iconPosition = "left",
  clearable = false,
  onClear,
  // File upload specific props
  accept,
  multiple = false,
  maxFiles = 1,
  maxSize = 5, // MB
  onFileSelect,
  showPreview = true,
  // Textarea specific props
  rows = 3,
  resize = true,
  // Select specific props
  options = [],
  // Date/Time specific props
  min,
  max,
  step,
  ...props 
}, ref) => {
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Define variants
  const variants = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    success: "border-green-400 focus:border-green-500 focus:ring-green-500",
    error: "border-red-400 focus:border-red-500 focus:ring-red-500",
    warning: "border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500"
  };

  // Define sizes
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
    xl: "h-14 px-5 text-lg"
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
        return false;
      }
      return true;
    });

    let newFiles = multiple ? [...files, ...validFiles] : validFiles;
    if (maxFiles && newFiles.length > maxFiles) {
      newFiles = newFiles.slice(0, maxFiles);
    }

    setFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : (newFiles[0] || null));
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : (newFiles.length > 0 ? newFiles[0] : null));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  const baseInputClasses = cn(
    "w-full rounded-md border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    variants[error ? "error" : variant],
    sizes[size],
    icon && iconPosition === "left" && "pl-10",
    icon && iconPosition === "right" && "pr-10",
    (clearable || type === "password") && "pr-10",
    inputClassName
  );

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            className={cn(
              baseInputClasses,
              resize ? "resize-y" : "resize-none",
              "min-h-[80px]"
            )}
            {...props}
          />
        );

      case "select":
        return (
          <select
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            className={baseInputClasses}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value || option} 
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case "file":
        return (
          <div className="space-y-3">
            <div
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors",
                isDragOver 
                  ? "border-blue-400 bg-blue-50" 
                  : "border-gray-300 hover:border-gray-400",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!disabled) {
                  const fileInput = document.getElementById(`file-input-${props.id || 'default'}`);
                  if (fileInput) {
                    fileInput.click();
                  }
                }
              }}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  {isDragOver ? "Drop files here" : "Upload files"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {multiple ? `Select up to ${maxFiles} files` : "Select a file"} 
                  {maxSize && ` (max ${maxSize}MB each)`}
                </p>
              </div>
              <input
                ref={ref}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
                id={`file-input-${props.id || 'default'}`}
              />
            </div>

            {/* File Preview */}
            {showPreview && files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      {file.type?.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Upload size={16} className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "password":
        return (
          <div className="relative">
            <input
              ref={ref}
              type={show ? "text" : "password"}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className={baseInputClasses}
              {...props}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        );

      default:
        return (
          <div className="relative">
            <input
              ref={ref}
              type={type}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              min={min}
              max={max}
              step={step}
              className={baseInputClasses}
              {...props}
            />
            {icon && (
              <div className={cn(
                "absolute inset-y-0 flex items-center pointer-events-none",
                iconPosition === "left" ? "left-0 pl-3" : "right-0 pr-3"
              )}>
                {React.isValidElement(icon) ? icon : (
                  <span className="text-gray-400">{icon}</span>
                )}
              </div>
            )}
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className={cn(
          "block text-sm font-medium text-gray-700",
          disabled && "text-gray-400",
          labelClassName
        )}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {(error || helperText) && (
        <p className={cn(
          "text-xs",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Newinput.displayName = "Newinput";

export default Newinput;