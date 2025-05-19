"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from '@/lib/supabase'; // Import Supabase

// Define all the components inline instead of importing them
// AuthCard component for wrapping auth forms
const AuthCard = ({ children, title, description }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800">{title}</h2>
            {description && (
              <p className="text-center text-gray-500 mt-1">{description}</p>
            )}
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// FormInput component with validation
const FormInput = ({ 
  id, 
  name, 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rightElement = null,
  error = null,
  success = null,
  onBlur = null
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name || id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' :
            success ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
            'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        {rightElement}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600 flex items-center mt-1">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {success}
        </p>
      )}
    </div>
  );
};

// PasswordInput component for password fields with toggle and validation
const PasswordInput = ({ 
  id, 
  name, 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  showPassword,
  toggleShowPassword,
  error = null,
  success = null,
  onBlur = null
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name || id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' :
            success ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
            'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={toggleShowPassword}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600 flex items-center mt-1">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {success}
        </p>
      )}
    </div>
  );
};

// Password Strength Indicator component
const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setMessage("");
      return;
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 10) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;  // Has uppercase
    if (/[a-z]/.test(password)) score += 1;  // Has lowercase
    if (/[0-9]/.test(password)) score += 1;  // Has numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1;  // Has special chars
    
    setStrength(score);
    
    // Set appropriate message
    if (score <= 2) {
      setMessage("Weak");
    } else if (score <= 4) {
      setMessage("Medium");
    } else {
      setMessage("Strong");
    }
  }, [password]);
  
  if (!password) return null;
  
  const getColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-600">Password strength</span>
        <span className={`text-xs font-medium ${
          strength <= 2 ? 'text-red-600' : 
          strength <= 4 ? 'text-yellow-600' : 
          'text-green-600'
        }`}>{message}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()}`} 
          style={{ width: `${Math.min((strength / 6) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

// AuthButton component for form submission buttons
const AuthButton = ({ children, isLoading, loadingText, disabled = false, ...props }) => {
  return (
    <button
      {...props}
      className={`w-full px-4 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isLoading || disabled
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      }`}
      disabled={isLoading || disabled}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

// AuthError component for displaying form errors
const AuthError = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
      <AlertCircle className="h-4 w-4 mr-2" />
      <p>{error}</p>
    </div>
  );
};

// AuthFooter component for links at bottom of forms
const AuthFooter = ({ text, linkText, linkHref }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="text-sm text-center text-gray-500">
        {text}{" "}
        <Link href={linkHref} className="font-medium text-blue-600 hover:underline">
          {linkText}
        </Link>
      </div>
    </div>
  );
};

// CheckboxInput component for checkboxes
const CheckboxInput = ({ id, label, checked, onChange, required = false, error = null }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${error ? 'border-red-300' : ''}`}
        />
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Reusable authentication form component with validation and Supabase integration
 */
export default function AuthForm({
  formType = "login", // login or signup
  title = formType === "login" ? "Welcome back" : "Create an account",
  description = formType === "login" 
    ? "Enter your credentials to sign in to your account" 
    : "Enter your information to create your account",
  submitButtonText = formType === "login" ? "Sign in" : "Create account",
  loadingText = formType === "login" ? "Signing in..." : "Creating account...",
  footerText = formType === "login" ? "Don't have an account?" : "Already have an account?",
  footerLinkText = formType === "login" ? "Sign up" : "Sign in",
  footerLinkHref = formType === "login" ? "/auth/signup" : "/auth/login", // Updated links
  redirectPath = formType === "login" ? "/home" : "/auth/login",
  onSubmit,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Additional signup form state
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: ""
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  
  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) {
      return "Name is required";
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      return "Name should only contain alphabets";
    }
    if (value.trim().length < 2) {
      return "Name is too short";
    }
    return "";
  };
  
  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };
  
  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must contain at least one special character";
    }
    return "";
  };
  
  const validateConfirmPassword = (value) => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== password) {
      return "Passwords do not match";
    }
    return "";
  };
  
  // Handle blur events for real-time validation
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    let errorMessage = "";
    switch (field) {
      case "name":
        errorMessage = validateName(name);
        break;
      case "email":
        errorMessage = validateEmail(email);
        break;
      case "password":
        errorMessage = validatePassword(password);
        break;
      case "confirmPassword":
        errorMessage = validateConfirmPassword(confirmPassword);
        break;
      default:
        break;
    }
    
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };
  
  // Update validation on input change
  useEffect(() => {
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(name) }));
    }
  }, [name, touched.name]);
  
  useEffect(() => {
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
  }, [email, touched.email]);
  
  useEffect(() => {
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
    if (touched.confirmPassword && confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
    }
  }, [password, confirmPassword, touched.password, touched.confirmPassword]);
  
  // Check if form is valid
  const isFormValid = () => {
    if (formType === "login") {
      return !errors.email && !errors.password && email && password;
    } else {
      return (
        !errors.name &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword &&
        agreedToTerms &&
        name &&
        email &&
        password &&
        confirmPassword
      );
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Mark all fields as touched for validation
    const allFields = formType === "login" 
      ? ["email", "password"] 
      : ["name", "email", "password", "confirmPassword"];
    
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validate all fields
    let newErrors = {};
    if (formType === "login") {
      newErrors = {
        email: validateEmail(email),
        password: password ? "" : "Password is required"
      };
    } else {
      newErrors = {
        name: validateName(name),
        email: validateEmail(email),
        password: validatePassword(password),
        confirmPassword: validateConfirmPassword(confirmPassword),
        terms: !agreedToTerms ? "You must agree to the terms and conditions" : ""
      };
    }
    
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error);
    if (hasErrors) {
      return;
    }
    
    // If custom submit handler is provided, use it
    if (onSubmit) {
      const formData = formType === "login" 
        ? { email, password } 
        : { name, email, password, confirmPassword, agreedToTerms };
      onSubmit(formData, setFormError, setIsLoading);
      return;
    }
    
    // Supabase authentication
    try {
      setIsLoading(true);
      
      if (formType === "login") {
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        
        if (error) {
          throw error;
        }
        
        // Success - redirect to home
        router.push(redirectPath);
        
      } else {
        // Signup with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: name,
            }
          }
        });
        
        if (error) {
          throw error;
        }
        
        // Success - show message and redirect
        setFormError("Please check your email for verification link!");
        setTimeout(() => {
          router.push(redirectPath);
        }, 3000);
      }
      
    } catch (err) {
      console.error('Auth error:', err);
      setFormError(err.message || (formType === "login" 
        ? "Invalid credentials. Please try again." 
        : "Registration failed. Please try again."
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title={title} description={description}>
      <AuthError error={formError} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field (signup only) */}
        {formType === "signup" && (
          <FormInput
            id="name"
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur("name")}
            required
            error={touched.name ? errors.name : ""}
            success={touched.name && name && !errors.name ? "Valid name" : ""}
          />
        )}
        
        {/* Email field */}
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          required
          error={touched.email ? errors.email : ""}
          success={touched.email && email && !errors.email ? "Valid email address" : ""}
        />
        
        {/* Password field */}
        <div className="space-y-2">
          {formType === "login" && (
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          )}
          
          {formType !== "login" && (
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
          )}
          
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            required
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            error={touched.password ? errors.password : ""}
            success={touched.password && password && !errors.password && formType === "signup" ? "Strong password" : ""}
          />
          
          {/* Password strength indicator (signup only) */}
          {formType === "signup" && password && (
            <PasswordStrength password={password} />
          )}
        </div>
        
        {/* Confirm Password field (signup only) */}
        {formType === "signup" && (
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            required
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            error={touched.confirmPassword ? errors.confirmPassword : ""}
            success={touched.confirmPassword && confirmPassword && !errors.confirmPassword ? "Passwords match" : ""}
          />
        )}
        
        {/* Terms checkbox (signup only) */}
        {formType === "signup" && (
          <CheckboxInput
            id="terms"
            label={
              <>
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  terms and conditions
                </a>
              </>
            }
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              setErrors(prev => ({ ...prev, terms: e.target.checked ? "" : "You must agree to the terms and conditions" }));
            }}
            error={errors.terms}
          />
        )}
        
        <AuthButton 
          type="submit" 
          isLoading={isLoading}
          loadingText={loadingText}
          disabled={!isFormValid()}
        >
          {submitButtonText}
        </AuthButton>
      </form>
      
      <AuthFooter
        text={footerText}
        linkText={footerLinkText}
        linkHref={footerLinkHref}
      />
    </AuthCard>
  );
}