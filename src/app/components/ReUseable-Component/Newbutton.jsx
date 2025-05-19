import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

const Newbutton = ({ 
  children,
  text,
  variant = "default",
  size = "default", 
  className = "",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  type = "button",
  onClick,
  ...props 
}) => {
  // Define custom variants
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
    link: "bg-transparent underline-offset-4 hover:underline text-blue-600",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
    info: "bg-cyan-600 hover:bg-cyan-700 text-white"
  };

  // Define custom sizes
  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
    xl: "h-14 px-10 text-xl",
    icon: "h-10 w-10"
  };

  const buttonContent = (
    <>
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === "left" && !loading && <span className="mr-2">{icon}</span>}
      {children || text}
      {icon && iconPosition === "right" && !loading && <span className="ml-2">{icon}</span>}
    </>
  );

  return (
    <Button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        loading && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {buttonContent}
    </Button>
  );
};

export default Newbutton;