'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Alert, AlertDescription } from '../../components/ui/alert.jsx';
import { Loader2, ChefHat } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


const userLoginSchema = z.object({
  rollNo: z.string().min(6, 'Roll number must be at least 6 characters').max(12, 'Roll number must be at most 12 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const adminLoginSchema = z.object({
  hallNo: z.string().min(3, 'Hall number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('user');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(activeTab === 'user' ? userLoginSchema : adminLoginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('https://mess-management-system-opsl.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        if (result.user.role === 'manager') {
          router.push('/manager/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your MessEase account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 rounded-t-md font-semibold ${activeTab === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => { setActiveTab('user'); reset(); setError(''); }}
              type="button"
            >
              User
            </button>
            <button
              className={`px-4 py-2 rounded-t-md font-semibold ml-2 ${activeTab === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => { setActiveTab('admin'); reset(); setError(''); }}
              type="button"
            >
              Admin
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {activeTab === 'user' ? (
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  type="text"
                  placeholder="Enter your roll number"
                  {...register('rollNo')}
                  className="uppercase"
                />
                {errors.rollNo && (
                  <p className="text-sm text-red-600">{errors.rollNo.message}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="hallNo">Hall Number</Label>
                <Input
                  id="hallNo"
                  type="text"
                  placeholder="Enter your hall number (e.g., Hall 1)"
                  {...register('hallNo')}
                />
                {errors.hallNo && (
                  <p className="text-sm text-red-600">{errors.hallNo.message}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          {activeTab === 'user' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}