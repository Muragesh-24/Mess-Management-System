import React, { useState } from 'react';
import { User, Lock, LogIn, Building, UserPlus, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (rollNo: string, password: string) => void;
  onSignup: (rollNo: string, password: string, name: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password validation
  const validatePassword = (pwd: string) => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    return requirements;
  };

  // Roll number validation (6 digits)
  const validateRollNo = (rollNo: string) => {
    return /^\d{6}$/.test(rollNo);
  };

  const passwordRequirements = validatePassword(password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const isRollNoValid = validateRollNo(rollNo);

  const handleRollNoChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setRollNo(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo || !password || (isSignup && !name)) return;
    
    if (isSignup && (!isPasswordValid || !isRollNoValid)) {
      setMessage('Please ensure all requirements are met.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    // Simulate API call
    setTimeout(() => {
      if (isSignup) {
        onSignup(rollNo, password, name);
        setMessage('Profile created successfully! You can now login.');
        setIsSignup(false);
        setRollNo('');
        setPassword('');
        setName('');
      } else {
        onLogin(rollNo, password);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">MessBook</h1>
          <p className="text-orange-100">Hostel Mess Booking System</p>
        </div>

        <div className="p-8">
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="rollNo"
                  value={rollNo}
                  onChange={(e) => handleRollNoChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    isSignup && rollNo && !isRollNoValid 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter 6-digit roll number (e.g., 240670)"
                  maxLength={6}
                  required
                />
              </div>
              {isSignup && rollNo && !isRollNoValid && (
                <p className="mt-1 text-sm text-red-600">Roll number must be exactly 6 digits</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {isSignup && password && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center space-x-2 text-sm ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordRequirements.length ? 'bg-green-100' : 'bg-red-100'}`}>
                        {passwordRequirements.length ? '✓' : '✗'}
                      </span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center space-x-2 text-sm ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordRequirements.uppercase ? 'bg-green-100' : 'bg-red-100'}`}>
                        {passwordRequirements.uppercase ? '✓' : '✗'}
                      </span>
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 text-sm ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordRequirements.lowercase ? 'bg-green-100' : 'bg-red-100'}`}>
                        {passwordRequirements.lowercase ? '✓' : '✗'}
                      </span>
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 text-sm ${passwordRequirements.number ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordRequirements.number ? 'bg-green-100' : 'bg-red-100'}`}>
                        {passwordRequirements.number ? '✓' : '✗'}
                      </span>
                      <span>One number</span>
                    </div>
                    <div className={`flex items-center space-x-2 text-sm ${passwordRequirements.special ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${passwordRequirements.special ? 'bg-green-100' : 'bg-red-100'}`}>
                        {passwordRequirements.special ? '✓' : '✗'}
                      </span>
                      <span>One special character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isLoading || 
                !rollNo || 
                !password || 
                (isSignup && (!name || !isPasswordValid || !isRollNoValid))
              }
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage('');
                setRollNo('');
                setPassword('');
                setName('');
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignup && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo credentials: <br />
                Roll No: <span className="font-medium">240670</span> <br />
                Password: <span className="font-medium">Password123!</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};